import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { RxCross2 } from "react-icons/rx"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"

import {
  createSubSection,
  updateSubSection,
} from "../../../../../services/operations/courseDetailsAPI"
import { setCourse } from "../../../../../slices/courseSlice"
import IconBtn from "../../../../Common/IconBtn"
import Upload from "./Upload"
import { courseEndpoints } from "../../../../../services/apis"

export default function SubSectionModal({
  modalData,
  setModalData,
  add = false,
  view = false,
  edit = false,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm()

  // console.log("view", view)
  // console.log("edit", edit)
  // console.log("add", add)

  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const { token } = useSelector((state) => state.auth)
  const { course } = useSelector((state) => state.course)

  // Function to fetch the full course data as a fallback
  const fetchUpdatedCourse = async () => {
    if (!course || !course._id) {
      console.error("Cannot fetch course: course ID is missing")
      return false
    }
    
    try {
      console.log("Fetching full course details with ID:", course._id)
      
      // Try explicitly using the full endpoint path
      const fullEndpointPath = "/course/getFullCourseDetails"
      
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}${fullEndpointPath}`,
        { courseId: course._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      
      console.log("Full course details response:", response)
      
      if (response.data && response.data.success) {
        const courseData = response.data.data
        
        if (!courseData) {
          console.error("Received success response but no course data")
          return false
        }
        
        console.log("Successfully fetched full course data:", courseData)
        
        // Validate the data has the expected structure
        if (!courseData._id || !Array.isArray(courseData.courseContent)) {
          console.error("Received course data has invalid structure:", courseData)
          return false
        }
        
        // Update Redux state with the fresh course data
        dispatch(setCourse(courseData))
        return true
      } else {
        console.warn("Could not fetch updated course data:", response.data)
        return false
      }
    } catch (error) {
      console.error("Error fetching updated course data:", error)
      
      if (error.response) {
        console.log("Fetch error response data:", error.response.data)
      }
      
      return false
    }
  }

  useEffect(() => {
    if (view || edit) {
      // console.log("modalData", modalData)
      setValue("lectureTitle", modalData.title)
      setValue("lectureDesc", modalData.description)
      setValue("lectureVideo", modalData.videoUrl)
    }
  }, [])

  // detect whether form is updated or not
  const isFormUpdated = () => {
    const currentValues = getValues()
    // console.log("changes after editing form values:", currentValues)
    if (
      currentValues.lectureTitle !== modalData.title ||
      currentValues.lectureDesc !== modalData.description ||
      currentValues.lectureVideo !== modalData.videoUrl
    ) {
      return true
    }
    return false
  }

  // handle the editing of subsection
  const handleEditSubsection = async () => {
    const currentValues = getValues()
    // console.log("changes after editing form values:", currentValues)
    const formData = new FormData()
    // console.log("Values After Editing form values:", currentValues)
    formData.append("sectionId", modalData.sectionId)
    formData.append("subSectionId", modalData._id)
    if (currentValues.lectureTitle !== modalData.title) {
      formData.append("title", currentValues.lectureTitle)
    }
    if (currentValues.lectureDesc !== modalData.description) {
      formData.append("description", currentValues.lectureDesc)
    }
    if (currentValues.lectureVideo !== modalData.videoUrl) {
      formData.append("video", currentValues.lectureVideo)
    }
    setLoading(true)
    const result = await updateSubSection(formData, token)
    if (result) {
      // console.log("result", result)
      // update the structure of course
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData.sectionId ? result : section
      )
      const updatedCourse = { ...course, courseContent: updatedCourseContent }
      dispatch(setCourse(updatedCourse))
    }
    setModalData(null)
    setLoading(false)
  }

  const onSubmit = async (data) => {
    if (view) return

    if (edit) {
      if (!isFormUpdated()) {
        toast.error("No changes made to the form")
      } else {
        handleEditSubsection()
      }
      return
    }

    // Add Subsection
    setLoading(true)
    
    try {
      // Validate the modalData (should be a section ID)
      if (!modalData) {
        throw new Error("Section ID is missing")
      }
      
      // Create FormData
      const formData = new FormData()
      formData.append("sectionId", modalData)
      formData.append("title", data.lectureTitle)
      formData.append("description", data.lectureDesc)
      formData.append("video", data.lectureVideo)
      
      // Direct API call using axios with full error logs
      console.log("Sending request to add lecture with section ID:", modalData)
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}${courseEndpoints.CREATE_SUBSECTION_API}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      
      console.log("Full API response:", response)
      
      // Handle any possible response structure
      if (response.data) {
        console.log("Response data:", response.data)
        
        // Try to find the updated section data in any possible location
        let updatedSection = null
        
        if (response.data.updatedSection) {
          updatedSection = response.data.updatedSection
        } else if (response.data.data) {
          updatedSection = response.data.data
        } else if (response.data.section) {
          updatedSection = response.data.section
        } else if (Array.isArray(response.data) && response.data.length > 0) {
          // Maybe the API returns an array of sections
          const possibleSection = response.data.find(item => 
            item._id === modalData || (item.sectionId === modalData)
          )
          if (possibleSection) {
            updatedSection = possibleSection
          }
        }
        
        // If we found updated section data, use it
        if (updatedSection && typeof updatedSection === 'object') {
          console.log("Found updated section:", updatedSection)
          
          try {
            // Create a safe copy of the current course content
            const currentContent = Array.isArray(course.courseContent) 
              ? [...course.courseContent] 
              : []
            
            // Find the section index to update
            const sectionIndex = currentContent.findIndex(
              section => section._id === modalData
            )
            
            // If section exists, update it, otherwise add the new section
            if (sectionIndex >= 0) {
              currentContent[sectionIndex] = updatedSection
            } else {
              console.log("Section not found in current content, adding new section")
              currentContent.push(updatedSection)
            }
            
            // Create updated course with the new content
            const updatedCourse = {
              ...course,
              courseContent: currentContent
            }
            
            // Update Redux state
            dispatch(setCourse(updatedCourse))
            toast.success("Lecture added successfully")
            
            // Close modal after a short delay
            setTimeout(() => {
              setModalData(null)
            }, 1000)
          } catch (stateError) {
            console.error("Failed to update state:", stateError)
            toast.error("Lecture was added but UI failed to update. Please refresh the page.")
          }
        } else {
          // If we couldn't find the updated section in the response, try fetching the full course
          console.warn("Could not find updated section in response. Fetching full course data...")
          
          const fetchSuccess = await fetchUpdatedCourse()
          
          if (fetchSuccess) {
            toast.success("Lecture added successfully")
          } else {
            toast.success("Lecture may have been added. Please refresh to see changes.")
          }
          
          // Close the modal in any case
          setModalData(null)
        }
      } else {
        console.error("Received empty response from server")
        toast.error("Server returned empty response. Please try again.")
      }
    } catch (error) {
      console.error("Error adding lecture:", error)
      
      // Show detailed error information in console for debugging
      if (error.response) {
        console.log("Error status:", error.response.status)
        console.log("Error headers:", error.response.headers)
        console.log("Error data:", error.response.data)
        
        // If the error was 500 (server error) but the lecture might have been created,
        // try to fetch the updated course data as a fallback
        if (error.response.status === 500) {
          console.log("Server error occurred, but lecture might have been added. Attempting to fetch updated course data...")
          
          const fetchSuccess = await fetchUpdatedCourse()
          
          if (fetchSuccess) {
            toast.success("Lecture was likely added despite server error. Please check if it appears.")
            setModalData(null)
            return
          }
        }
        
        toast.error(error.response.data?.message || `Server error: ${error.response.status}`)
      } else if (error.request) {
        console.log("Error request:", error.request)
        toast.error("No response received from server. Please check your connection.")
      } else {
        console.log("Error message:", error.message)
        toast.error(error.message || "Unknown error occurred")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
        {/* Modal Header */}
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">
            {view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture
          </p>
          <button onClick={() => (!loading ? setModalData(null) : {})}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>
        {/* Modal Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 px-8 py-10"
        >
          {/* Lecture Video Upload */}
          <Upload
            name="lectureVideo"
            label="Lecture Video"
            register={register}
            setValue={setValue}
            errors={errors}
            video={true}
            viewData={view ? modalData.videoUrl : null}
            editData={edit ? modalData.videoUrl : null}
          />
          {/* Lecture Title */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureTitle">
              Lecture Title {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <input
              disabled={view || loading}
              id="lectureTitle"
              placeholder="Enter Lecture Title"
              {...register("lectureTitle", { required: true })}
              className="form-style w-full"
            />
            {errors.lectureTitle && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Lecture title is required
              </span>
            )}
          </div>
          {/* Lecture Description */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureDesc">
              Lecture Description{" "}
              {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <textarea
              disabled={view || loading}
              id="lectureDesc"
              placeholder="Enter Lecture Description"
              {...register("lectureDesc", { required: true })}
              className="form-style resize-x-none min-h-[130px] w-full"
            />
            {errors.lectureDesc && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Lecture Description is required
              </span>
            )}
          </div>
          {!view && (
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-x-2 bg-yellow-50 py-2 px-4 rounded-md font-semibold text-richblack-900"
              >
                {loading ? "Loading..." : edit ? "Save Changes" : "Save"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
