import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { IoAddCircleOutline } from "react-icons/io5"
import { MdNavigateNext } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"

import {
  createSection,
  updateSection,
} from "../../../../../services/operations/courseDetailsAPI"
import {
  setCourse,
  setEditCourse,
  setStep,
} from "../../../../../slices/courseSlice"
import IconBtn from "../../../../Common/IconBtn"
import NestedView from "./NestedView"

export default function CourseBuilderForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  const { course } = useSelector((state) => state.course)
  const { token } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)
  const [editSectionName, setEditSectionName] = useState(null)
  const dispatch = useDispatch()

  useEffect(() => {
    // Validate course structure when component mounts or course changes
    if (course && course.courseContent) {
      // Log course structure for debugging
      console.log("Current course structure:", course.courseContent);
      
      // Check for any invalid sections
      const hasInvalidSections = course.courseContent.some(
        section => !section || typeof section !== 'object' || !section.sectionName
      );
      
      if (hasInvalidSections) {
        console.warn("Course contains invalid sections:", course.courseContent);
      }
    }
  }, [course]);

  // handle form submission
  const onSubmit = async (data) => {
    // console.log(data)
    setLoading(true)

    let result

    if (editSectionName) {
      result = await updateSection(
        {
          sectionName: data.sectionName,
          sectionId: editSectionName,
          courseId: course._id,
        },
        token
      )
      // console.log("edit", result)
    } else {
      result = await createSection(
        {
          sectionName: data.sectionName,
          courseId: course._id,
        },
        token
      )
    }
    if (result) {
      // console.log("section result", result)
      dispatch(setCourse(result))
      setEditSectionName(null)
      setValue("sectionName", "")
    }
    setLoading(false)
  }

  const cancelEdit = () => {
    setEditSectionName(null)
    setValue("sectionName", "")
  }

  const handleChangeEditSectionName = (sectionId, sectionName) => {
    if (editSectionName === sectionId) {
      cancelEdit()
      return
    }
    setEditSectionName(sectionId)
    setValue("sectionName", sectionName)
  }

  const goToNext = () => {
    if (course.courseContent.length === 0) {
      toast.error("Please add atleast one section")
      return
    }
    if (
      course.courseContent.some((section) => section.subSection.length === 0)
    ) {
      toast.error("Please add atleast one lecture in each section")
      return
    }
    
    // Success toast notification
    toast.success("Moving to the Publish page")
    
    // Directly set the step in Redux
    dispatch(setStep(3))
  }

  const goBack = () => {
    // Success toast notification
    toast.success("Moving back to Course Information")
    
    // Directly set the step in Redux
    dispatch(setStep(1))
    dispatch(setEditCourse(true))
  }

  return (
    <div className="space-y-6 sm:space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-4 sm:p-6 form-container">
      <p className="text-xl sm:text-2xl font-semibold text-richblack-5 form-heading">Course Builder</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col space-y-2 form-group">
          <label className="text-sm text-richblack-5 form-label" htmlFor="sectionName">
            Section Name <sup className="text-pink-200">*</sup>
          </label>
          <input
            id="sectionName"
            disabled={loading}
            placeholder="Add a section to build your course"
            {...register("sectionName", { required: true })}
            className="form-style w-full form-input"
          />
          {errors.sectionName && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Section name is required
            </span>
          )}
        </div>
        <div className="flex items-end gap-x-4">
          <IconBtn
            type="submit"
            disabled={loading}
            text={editSectionName ? "Edit Section Name" : "Create Section"}
            outline={true}
            customClasses="action-btn"
          >
            <IoAddCircleOutline size={20} className="text-yellow-50" />
          </IconBtn>
          {editSectionName && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-sm text-richblack-300 underline"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
      {course.courseContent.length > 0 && (
        <div className="nested-section">
          <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />
        </div>
      )}
      {/* Next Prev Button */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-y-4 sm:gap-y-0 gap-x-3 button-group">
        <button
          onClick={goBack}
          className="flex cursor-pointer items-center justify-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900 action-btn"
        >
          Back
        </button>
        <button
          disabled={loading}
          onClick={goToNext}
          className="flex cursor-pointer items-center gap-x-2 rounded-md bg-yellow-50 py-[8px] px-[20px] font-semibold text-richblack-900 action-btn"
        >
          Next
          <MdNavigateNext className="text-xl" />
        </button>
      </div>
    </div>
  )
}
