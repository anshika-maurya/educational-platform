import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import { MdEdit } from "react-icons/md"
import { AiOutlineEye } from "react-icons/ai"

import { fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI"
import { getInstructorData } from "../../../../services/operations/profileAPI"
import InstructorChart from "./InstructorChart"

const Instructor = () => {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState([])
  const [instructorData, setInstructorData] = useState([])

  useEffect(() => {
    // Single loading state for both API calls
    const fetchData = async () => {
      setLoading(true)
      
      try {
        // First API call
        const instructorApiData = await getInstructorData(token)
        if (instructorApiData) {
          setInstructorData(instructorApiData)
        }
        
        // Second API call
        const courseData = await fetchInstructorCourses(token)
        if (courseData) {
          setCourses(courseData)
        }
        
      } catch (error) {
        console.log("Error fetching instructor data:", error)
        toast.error("Error fetching dashboard data")
      } finally {
        // Always set loading to false
        setLoading(false)
      }
    }
    
    fetchData()
  }, [token])
  
  const totalAmount = instructorData?.reduce(
    (acc, curr) => acc + (curr?.totalRevenue || 0),
    0
  ) || 0
  
  const totalStudents = instructorData?.reduce(
    (acc, curr) => acc + (curr?.totalStudents || 0),
    0
  ) || 0

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="w-full px-4 md:px-6 lg:px-8">
      <div className="space-y-2">
        <h1 className="text-xl md:text-2xl font-bold text-richblack-5">
          Hi {user?.firstName} 👋
        </h1>
        <p className="font-medium text-sm md:text-base text-richblack-200">
          Let's start something new
        </p>
      </div>
      {courses.length > 0 ? (
        <div>
          <div className="my-4 flex flex-col md:flex-row h-auto md:h-[450px] gap-4">
            {/* Render chart / graph */}
            {totalAmount > 0 || totalStudents > 0 ? (
              <div className="w-full md:w-2/3 lg:w-3/4 bg-richblack-800 rounded-md">
                <InstructorChart courses={instructorData} />
              </div>
            ) : (
              <div className="w-full md:w-2/3 lg:w-3/4 rounded-md bg-richblack-800 p-4 md:p-6">
                <p className="text-lg font-bold text-richblack-5">Visualize</p>
                <p className="mt-4 text-lg md:text-xl font-medium text-richblack-50">
                  Not Enough Data To Visualize
                </p>
              </div>
            )}
            {/* Total Statistics */}
            <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col rounded-md bg-richblack-800 p-4 md:p-6">
              <p className="text-base md:text-lg font-bold text-richblack-5">Statistics</p>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-base md:text-lg text-richblack-200">Total Courses</p>
                  <p className="text-2xl md:text-3xl font-semibold text-richblack-50">
                    {courses.length}
                  </p>
                </div>
                <div>
                  <p className="text-base md:text-lg text-richblack-200">Total Students</p>
                  <p className="text-2xl md:text-3xl font-semibold text-richblack-50">
                    {totalStudents}
                  </p>
                </div>
                <div>
                  <p className="text-base md:text-lg text-richblack-200">Total Income</p>
                  <p className="text-2xl md:text-3xl font-semibold text-richblack-50">
                    Rs. {totalAmount}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-md bg-richblack-800 p-4 md:p-6">
            {/* Render 3 courses */}
            <div className="flex items-center justify-between">
              <p className="text-base md:text-lg font-bold text-richblack-5">Your Courses</p>
              <Link to="/dashboard/my-courses">
                <p className="text-xs md:text-sm font-semibold text-yellow-50">View All</p>
              </Link>
            </div>
            <div className="my-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {courses.slice(0, 3).map((course) => (
                <div key={course._id} className="w-full">
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="h-[180px] sm:h-[201px] w-full rounded-md object-cover"
                  />
                  <div className="mt-3 w-full">
                    <p className="text-sm font-medium text-richblack-50 line-clamp-1">
                      {course.courseName}
                    </p>
                    <div className="mt-1 flex items-center space-x-2">
                      <p className="text-xs font-medium text-richblack-300">
                        {course.studentsEnrolled?.length || 0} students
                      </p>
                      <p className="text-xs font-medium text-richblack-300">
                        |
                      </p>
                      <p className="text-xs font-medium text-richblack-300">
                        Rs. {course.price}
                      </p>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => navigate(`/dashboard/edit-course/${course._id}`)}
                        className="flex items-center gap-1 rounded-md bg-yellow-50 bg-opacity-10 px-2 py-1 text-xs font-medium text-yellow-50 transition-all duration-200 hover:scale-95"
                      >
                        <MdEdit size={12} /> Edit
                      </button>
                      <button
                        onClick={() => navigate(`/courses/${course._id}`)}
                        className="flex items-center gap-1 rounded-md bg-richblack-700 px-2 py-1 text-xs font-medium text-white transition-all duration-200 hover:scale-95"
                      >
                        <AiOutlineEye size={12} /> View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8 md:mt-20 rounded-md bg-richblack-800 p-4 py-8 md:p-6 md:py-20">
          <p className="text-center text-xl md:text-2xl font-bold text-richblack-5">
            You have not created any courses yet
          </p>
          <Link to="/dashboard/add-course">
            <p className="mt-4 text-center text-base md:text-lg font-semibold text-yellow-50">
              Create a course
            </p>
          </Link>
        </div>
      )}
    </div>
  )
}

export default Instructor