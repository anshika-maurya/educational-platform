import { useState } from "react"
import { AiFillCaretDown } from "react-icons/ai"
import { FaPlus } from "react-icons/fa"
import { MdEdit } from "react-icons/md"
import { RiDeleteBin6Line } from "react-icons/ri"
import { RxDropdownMenu } from "react-icons/rx"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-hot-toast"

import {
  deleteSection,
  deleteSubSection,
} from "../../../../../services/operations/courseDetailsAPI"
import { setCourse } from "../../../../../slices/courseSlice"
import ConfirmationModal from "../../../../Common/ConfirmationModal"
import SubSectionModal from "./SubSectionModal"

export default function NestedView({ handleChangeEditSectionName }) {
  const { course } = useSelector((state) => state.course)
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  // States to keep track of mode of modal [add, view, edit]
  const [addSubSection, setAddSubsection] = useState(null)
  const [viewSubSection, setViewSubSection] = useState(null)
  const [editSubSection, setEditSubSection] = useState(null)
  // to keep track of confirmation modal
  const [confirmationModal, setConfirmationModal] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleDeleleSection = async (sectionId) => {
    setLoading(true)
    try {
      const result = await deleteSection({
        sectionId,
        courseId: course._id,
        token,
      })
      
      if (result) {
        // Update the course in Redux with the new structure
        dispatch(setCourse(result))
        toast.success("Section deleted successfully")
      }
    } catch (error) {
      
      toast.error("Error deleting section. Please try again.")
    } finally {
      setLoading(false)
      setConfirmationModal(null)
    }
  }

  const handleDeleteSubSection = async (subSectionId, sectionId) => {
    setLoading(true)
    try {
      
      const result = await deleteSubSection({ subSectionId, sectionId, token })
    
      if (result) {
        // update the structure of course
        const updatedCourseContent = course.courseContent.map((section) =>
          section._id === sectionId ? result : section
        )
        const updatedCourse = { ...course, courseContent: updatedCourseContent }
        dispatch(setCourse(updatedCourse))
        toast.success("Lecture deleted successfully")
      } else {
        toast.error("Failed to delete lecture")
      }
    } catch (error) {
      console.error("Error deleting lecture:", error)
      toast.error("Error deleting lecture. Please try again.")
    } finally {
      setLoading(false)
      setConfirmationModal(null)
    }
  }

  return (
    <>
      <div
        className="rounded-lg bg-richblack-700 p-6 px-8"
        id="nestedViewContainer"
      >
        {course?.courseContent?.map((section) => {
          // Skip rendering this section if it's undefined or doesn't have required properties
          if (!section || typeof section !== 'object') {
            console.warn("Invalid section found in courseContent:", section)
            return null
          }
          
          return (
            // Section Dropdown
            <details key={section._id || "temp-id"} open>
              {/* Section Dropdown Content */}
              <summary className="flex cursor-pointer items-center justify-between border-b-2 border-b-richblack-600 py-2">
                <div className="flex items-center gap-x-3">
                  <RxDropdownMenu className="text-2xl text-richblack-50" />
                  <p className="font-semibold text-richblack-50">
                    {section.sectionName || "Unnamed Section"}
                  </p>
                </div>
                <div className="flex items-center gap-x-3">
                  <button
                    onClick={() =>
                      handleChangeEditSectionName(
                        section._id,
                        section.sectionName || ""
                      )
                    }
                  >
                    <MdEdit className="text-xl text-richblack-300" />
                  </button>
                  <button
                    onClick={() =>
                      setConfirmationModal({
                        text1: "Delete this Section?",
                        text2: "All the lectures in this section will be deleted",
                        btn1Text: "Delete",
                        btn2Text: "Cancel",
                        btn1Handler: () => handleDeleleSection(section._id),
                        btn2Handler: () => setConfirmationModal(null),
                      })
                    }
                  >
                    <RiDeleteBin6Line className="text-xl text-richblack-300" />
                  </button>
                  <span className="font-medium text-richblack-300">|</span>
                  <AiFillCaretDown className={`text-xl text-richblack-300`} />
                </div>
              </summary>
              <div className="px-6 pb-4">
                {/* Render All Sub Sections Within a Section */}
                {Array.isArray(section.subSection) ? (
                  section.subSection.map((data) => {
                    if (!data || !data._id) return null
                    
                    return (
                      <div
                        key={data._id}
                        onClick={() => setViewSubSection(data)}
                        className="flex cursor-pointer items-center justify-between gap-x-3 border-b-2 border-b-richblack-600 py-2"
                      >
                        <div className="flex items-center gap-x-3 py-2 ">
                          <RxDropdownMenu className="text-2xl text-richblack-50" />
                          <p className="font-semibold text-richblack-50">
                            {data.title || "Unnamed Lecture"}
                          </p>
                        </div>
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-x-3"
                        >
                          <button
                            onClick={() =>
                              setEditSubSection({ ...data, sectionId: section._id })
                            }
                          >
                            <MdEdit className="text-xl text-richblack-300" />
                          </button>
                          <button
                            onClick={() =>
                              setConfirmationModal({
                                text1: "Delete this Sub-Section?",
                                text2: "This lecture will be deleted",
                                btn1Text: "Delete",
                                btn2Text: "Cancel",
                                btn1Handler: () =>
                                  handleDeleteSubSection(data._id, section._id),
                                btn2Handler: () => setConfirmationModal(null),
                              })
                            }
                          >
                            <RiDeleteBin6Line className="text-xl text-richblack-300" />
                          </button>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-richblack-300 py-2">No lectures in this section yet</p>
                )}
                {/* Add New Lecture to Section */}
                <button
                  onClick={() => setAddSubsection(section._id)}
                  className="mt-3 flex items-center gap-x-1 text-yellow-50"
                >
                  <FaPlus className="text-lg" />
                  <p>Add Lecture</p>
                </button>
              </div>
            </details>
          )
        })}
      </div>
      {/* Modal Display */}
      {addSubSection ? (
        <SubSectionModal
          modalData={addSubSection}
          setModalData={setAddSubsection}
          add={true}
        />
      ) : viewSubSection ? (
        <SubSectionModal
          modalData={viewSubSection}
          setModalData={setViewSubSection}
          view={true}
        />
      ) : editSubSection ? (
        <SubSectionModal
          modalData={editSubSection}
          setModalData={setEditSubSection}
          edit={true}
        />
      ) : (
        <></>
      )}
      {/* Confirmation Modal */}
      {confirmationModal ? (
        <ConfirmationModal modalData={confirmationModal} />
      ) : (
        <></>
      )}
    </>
  )
}
