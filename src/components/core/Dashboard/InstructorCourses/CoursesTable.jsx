import { useDispatch, useSelector } from "react-redux"
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table"

import { setCourse, setEditCourse } from "../../../../slices/courseSlice"
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"
import { useState } from "react"
import { FaCheck } from "react-icons/fa"
import { FiEdit2 } from "react-icons/fi"
import { HiClock } from "react-icons/hi"
import { RiDeleteBin6Line } from "react-icons/ri"
import { useNavigate } from "react-router-dom"

import { formatDate } from "../../../../services/formatDate"
import {
  deleteCourse,
  fetchInstructorCourses,
} from "../../../../services/operations/courseDetailsAPI"
import { COURSE_STATUS } from "../../../../utils/constants"
import ConfirmationModal from "../../../common/ConfirmationModal"

export default function CoursesTable({ courses, setCourses }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)
  const [confirmationModal, setConfirmationModal] = useState(null)
  const TRUNCATE_LENGTH = 30

  const handleCourseDelete = async (courseId) => {
    setLoading(true)
    await deleteCourse({ courseId: courseId }, token)
    const result = await fetchInstructorCourses(token)
    if (result) {
      setCourses(result)
    }
    setConfirmationModal(null)
    setLoading(false)
  }

  // console.log("All Course ", courses)

  return (
    <>
      <Table className="rounded-xl border border-richblack-800">
        <Thead>
          <Tr className="flex gap-x-10 rounded-t-md border-b border-b-richblack-800 px-6 py-2">
            <Th className="flex-1 text-left text-sm font-medium uppercase text-richblack-100">
              Courses
            </Th>
            <Th className="hidden md:block text-left text-sm font-medium uppercase text-richblack-100">
              Duration
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              Price
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              Actions
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {courses?.length === 0 ? (
            <Tr>
              <Td className="py-10 text-center text-2xl font-medium text-richblack-100">
                No courses found
                {/* TO DO: Need to change this state */}
              </Td>
            </Tr>
          ) : (
            courses?.map((course) => (
              <Tr
                key={course._id}
                className="flex flex-col md:flex-row gap-y-4 md:gap-x-10 border-b border-richblack-800 px-4 md:px-6 py-4 md:py-8"
              >
                <Td className="flex flex-col md:flex-row flex-1 gap-y-4 md:gap-x-4">
                  <div className="w-full md:w-auto relative">
                    <img
                      src={course?.thumbnail}
                      alt={course?.courseName}
                      className="w-full h-[180px] md:h-[148px] md:w-[220px] rounded-xl object-cover shadow-md border border-richblack-700"
                    />
                    {course.status === COURSE_STATUS.DRAFT ? (
                      <div className="absolute top-2 right-2 bg-pink-100 text-richblack-800 rounded-full px-2 py-1 text-xs font-medium flex items-center gap-1">
                        <HiClock size={12} />
                        Draft
                      </div>
                    ) : (
                      <div className="absolute top-2 right-2 bg-yellow-100 text-richblack-800 rounded-full px-2 py-1 text-xs font-medium flex items-center gap-1">
                        <FaCheck size={10} />
                        Published
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <p className="text-lg md:text-xl font-semibold text-richblack-5">
                        {course.courseName}
                      </p>
                      <p className="text-xs text-richblack-300 line-clamp-2 md:line-clamp-none mt-1">
                        {course.courseDescription.split(" ").length >
                        TRUNCATE_LENGTH
                          ? course.courseDescription
                              .split(" ")
                              .slice(0, TRUNCATE_LENGTH)
                              .join(" ") + "..."
                          : course.courseDescription}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 mt-3">
                      <p className="text-[12px] text-richblack-300 flex items-center gap-1">
                        <span className="text-yellow-50">Created:</span> {formatDate(course.createdAt)}
                      </p>
                      
                      <div className="md:hidden flex items-center gap-2 bg-richblack-700 rounded-full px-3 py-1">
                        <span className="text-sm font-semibold text-yellow-50">₹{course.price}</span>
                      </div>
                    </div>
                  </div>
                </Td>
                <Td className="hidden md:table-cell text-sm font-medium text-richblack-100">
                  2hr 30min
                </Td>
                <Td className="hidden md:table-cell text-sm font-medium text-richblack-100">
                  ₹{course.price}
                </Td>
                <Td className="text-sm font-medium text-richblack-100">
                  <div className="flex gap-x-3 items-center justify-center md:justify-start">
                    <button
                      disabled={loading}
                      onClick={() => {
                        navigate(`/dashboard/edit-course/${course._id}`)
                      }}
                      title="Edit"
                      className="p-2 rounded-md bg-richblack-700 transition-all duration-200 hover:scale-110 hover:text-caribbeangreen-300"
                    >
                      <FiEdit2 size={20} />
                    </button>
                    <button
                      disabled={loading}
                      onClick={() => {
                        setConfirmationModal({
                          text1: "Do you want to delete this course?",
                          text2:
                            "All the data related to this course will be deleted",
                          btn1Text: !loading ? "Delete" : "Loading...  ",
                          btn2Text: "Cancel",
                          btn1Handler: !loading
                            ? () => handleCourseDelete(course._id)
                            : () => {},
                          btn2Handler: !loading
                            ? () => setConfirmationModal(null)
                            : () => {},
                        })
                      }}
                      title="Delete"
                      className="p-2 rounded-md bg-richblack-700 transition-all duration-200 hover:scale-110 hover:text-[#ff0000]"
                    >
                      <RiDeleteBin6Line size={20} />
                    </button>
                  </div>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}