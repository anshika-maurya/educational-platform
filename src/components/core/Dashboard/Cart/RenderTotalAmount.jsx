import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"

import { BuyCourse } from "../../../../services/operations/studentFeaturesAPI"
import IconBtn from "../../../common/IconBtn"

export default function RenderTotalAmount() {
  const { total, cart } = useSelector((state) => state.cart)
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleBuyCourse = async () => {
    if (isProcessing) return
    
    if (!token) {
      toast.error("Please log in to purchase the course")
      navigate("/login")
      return
    }
    
    setIsProcessing(true)
    try {
      const courses = cart.map((course) => course._id)
      await BuyCourse(token, courses, user, navigate, dispatch)
    } catch (error) {
      console.log("Error buying course:", error)
      toast.error("Error processing payment. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-w-[280px] rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="mb-1 text-sm font-medium text-richblack-300">Total:</p>
      <p className="mb-6 text-3xl font-medium text-yellow-100">₹ {total}</p>
      <IconBtn
        text={isProcessing ? "Processing..." : "Buy Now"}
        onclick={handleBuyCourse}
        customClasses={`w-full justify-center ${isProcessing ? 'cursor-not-allowed opacity-75' : ''}`}
        disabled={isProcessing}
      />
    </div>
  )
}
