import { useEffect, useState } from "react"
import { VscAdd } from "react-icons/vsc"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI"
import IconBtn from "../../Common/IconBtn"
import CoursesTable from "./InstructorCourses/CoursesTable"

export default function MyCourses() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [dataFetched, setDataFetched] = useState(false)

  useEffect(() => {
    // Only fetch data if we haven't already fetched it
    if (!dataFetched) {
      const fetchCourses = async () => {
        setLoading(true)
        try {
          const result = await fetchInstructorCourses(token)
          if (result) {
            setCourses(result)
          }
        } catch (error) {
          console.error("Error fetching courses:", error)
        } finally {
          setLoading(false)
          setDataFetched(true)
        }
      }
      fetchCourses()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataFetched])

  return (
    <div className="bg-richblack-900 min-h-[calc(100vh-3.5rem)] p-4 md:p-6">
      <div className="mb-8 md:mb-14 flex flex-col md:flex-row gap-4 md:gap-0 items-start md:items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-medium text-richblack-5">My Courses</h1>
        <IconBtn
          text="Add Course"
          onclick={() => navigate("/dashboard/add-course")}
          customClasses="w-fit"
        >
          <VscAdd />
        </IconBtn>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="spinner"></div>
        </div>
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-60 gap-4 text-richblack-100 bg-richblack-800 rounded-lg p-6">
          <p className="text-xl text-center">You haven't created any courses yet</p>
          <IconBtn
            text="Create Your First Course"
            onclick={() => navigate("/dashboard/add-course")}
          >
            <VscAdd />
          </IconBtn>
        </div>
      ) : (
        <div className="bg-transparent rounded-lg overflow-hidden shadow-md">
          <CoursesTable courses={courses} setCourses={setCourses} />
        </div>
      )}
    </div>
  )
}
