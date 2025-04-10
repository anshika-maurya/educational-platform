import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Outlet, useParams } from "react-router-dom"

import CourseReviewModal from "../components/core/ViewCourse/CourseReviewModal"
import VideoDetailsSidebar from "../components/core/ViewCourse/VideoDetailsSidebar"
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI"
import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../slices/viewCourseSlice"

export default function ViewCourse() {
  const { courseId } = useParams()
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const [reviewModal, setReviewModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const courseData = await getFullDetailsOfCourse(courseId, token)

        const courseDetails = courseData?.courseDetails
        const courseContent = courseDetails?.courseContent

        if (!courseDetails || !courseContent) {
          console.error("Invalid course data received:", courseData)
          return
        }

        dispatch(setCourseSectionData(courseContent))
        dispatch(setEntireCourseData(courseDetails))
        dispatch(setCompletedLectures(courseData.completedVideos || []))

        let lectures = 0
        courseContent.forEach((sec) => {
          lectures += sec?.subSection?.length || 0
        })
        dispatch(setTotalNoOfLectures(lectures))
      } catch (error) {
        console.error("Error fetching course details:", error)
      } finally {
        setLoading(false)
      }
    })()
  }, [courseId, token, dispatch])

  if (loading) {
    return (
      <div className="text-white text-center mt-10 text-lg font-semibold">
        Loading Course...
      </div>
    )
  }

  return (
    <>
      <div className="relative flex min-h-[calc(100vh-3.5rem)]">
        <VideoDetailsSidebar setReviewModal={setReviewModal} />
        <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
          <div className="mx-6">
            <Outlet />
          </div>
        </div>
      </div>
      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </>
  )
}
