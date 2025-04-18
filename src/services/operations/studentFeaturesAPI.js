import { toast } from "react-hot-toast"

import rzpLogo from "../../assets/Logo/rzp_logo.png"
import { resetCart } from "../../slices/cartSlice"
import { setPaymentLoading } from "../../slices/courseSlice"
import { apiConnector } from "../apiConnector"
import { studentEndpoints } from "../apis"

const {
  COURSE_PAYMENT_API,
  COURSE_VERIFY_API,
  SEND_PAYMENT_SUCCESS_EMAIL_API,
} = studentEndpoints

// Load the Razorpay SDK from the CDN
function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script")
    script.src = src
    script.onload = () => {
      resolve(true)
    }
    script.onerror = () => {
      resolve(false)
    }
    document.body.appendChild(script)
  })
}

// Buy the Course
export async function BuyCourse(
  token,
  courses,
  user_details,
  navigate,
  dispatch
) {
  // Use a single loading toast
  const toastId = toast.loading("Processing your purchase...")
  try {
    // Loading the script of Razorpay SDK
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")

    if (!res) {
      toast.error(
        "Razorpay SDK failed to load. Check your Internet Connection."
      )
      toast.dismiss(toastId)
      return
    }

    // Initiating the Order in Backend
    const orderResponse = await apiConnector(
      "POST",
      COURSE_PAYMENT_API,
      {
        courses
      },
      {
        Authorization: `Bearer ${token}`,
      }
    )

    console.log("Payment API Response:", orderResponse);

    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.message)
    }
    
    // Dismiss the loading toast before opening Razorpay
    toast.dismiss(toastId)

    // Get the Razorpay key from environment or use directly
    const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY || "rzp_test_PcyE8Vo9soG4RB";
    
    // Opening the Razorpay SDK
    const options = {
      key: razorpayKey,
      currency: orderResponse.data.data.currency,
      amount: `${orderResponse.data.data.amount}`,
      order_id: orderResponse.data.data.id,
      name: "StudyNotion",
      description: "Thank you for Purchasing the Course.",
      image: rzpLogo,
      prefill: {
        name: `${user_details.firstName}`,
        email: user_details.email,
      },
      handler: function(response) {
        // Handle successful payment
        toast.success("Payment successful!");
        sendPaymentSuccessEmail(response, orderResponse.data.data.amount, token)
        verifyPayment({ ...response, courses }, token, navigate, dispatch)
      },
      modal: {
        ondismiss: function() {
          toast.error("Payment cancelled. Please try again.");
        }
      },
      theme: {
        color: "#FFD60A"
      }
    }
    
    console.log("Razorpay Options:", options);
    
    const paymentObject = new window.Razorpay(options)

    paymentObject.open()
    paymentObject.on("payment.failed", function (response) {
      toast.error("Payment failed. Please try again.")
      console.log("Payment failed:", response.error)
    })
  } catch (error) {
    console.log("PAYMENT API ERROR:", error)
    console.log("Error details:", error.response?.data || "No response data")
    
    // Show a meaningful error message
    if (error.response?.data?.message) {
      toast.error(error.response.data.message)
    } else {
      toast.error("Unable to process payment. Please try again later.")
    }
    
    toast.dismiss(toastId)
  }
}

// Send the Payment Success Email
async function sendPaymentSuccessEmail(response, amount, token) {
  try {
    await apiConnector(
      "POST",
      SEND_PAYMENT_SUCCESS_EMAIL_API,
      {
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        amount,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    )
  } catch (error) {
    console.log("PAYMENT SUCCESS EMAIL ERROR............", error)
  }
}


// Verify the Payment
async function verifyPayment(bodyData, token, navigate, dispatch) {
  // Single loading toast
  const toastId = toast.loading("Finalizing your enrollment...")
  dispatch(setPaymentLoading(true))
  
  try {
    console.log("Verifying payment with data:", bodyData);
    
    const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
      Authorization: `Bearer ${token}`,
    })

    console.log("Payment verification response:", response);

    if (!response.data.success) {
      throw new Error(response.data.message)
    }

    toast.success("Success! You are now enrolled in the course.")
    
    // Dismiss loading toast after success message
    toast.dismiss(toastId)
    
    // Clear cart and redirect after successful payment
    dispatch(resetCart())
    navigate("/dashboard/enrolled-courses")
  } catch (error) {
    console.log("PAYMENT VERIFY ERROR:", error)
    console.log("Error response:", error.response?.data || "No response data")
    
    // Show a more detailed error message if available
    if (error.response?.data?.message) {
      toast.error(error.response.data.message)
    } else if (error.message) {
      toast.error(error.message)
    } else {
      toast.error("Could not verify payment. Please contact support if payment was deducted.")
    }
    
    toast.dismiss(toastId)
  } finally {
    dispatch(setPaymentLoading(false))
  }
}

