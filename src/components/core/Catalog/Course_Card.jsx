import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import GetAvgRating from "../../../utils/avgRating"
import RatingStars from "../../Common/RatingStars"

const Course_Card = ({course, Height}) => {
  const [avgReviewCount, setAvgReviewCount] = useState(0);
  
  useEffect(() => {
    const count = GetAvgRating(course.ratingAndReviews)
    setAvgReviewCount(count)
  }, [course])
  // console.log("count............", avgReviewCount)

  return (
    <div className=' mb-4 hover:scale-[1.03] transition-all duration-200 z-50 '>
      <Link to={`/courses/${course._id}`}>
        <div>
          <div className="rounded-lg">
            <img
              src={course?.thumbnail}
              alt="course thumbnail"
              className={`${Height} w-full rounded-xl object-cover `}
            />
          </div>
          <div className="flex flex-col gap-2 px-1 py-3">
            <p className="text-sm md:text-xl text-richblack-5">{course?.courseName}</p>
            <p className="text-[12px] md:text-xl text-richblack-50">By 
            {course?.instructor?.firstName}{" "} {course?.instructor?.lastName}
              
            </p>
            <div className="flex items-center gap-2">
              <span className="text-yellow-5">{avgReviewCount || 0}</span>
              {/* <ReactStars
                count={5}
                value={avgReviewCount || 0}
                size={20}
                edit={false}
                activeColor="#ffd700"
                emptyIcon={<FaRegStar />}
                fullIcon={<FaStar />}
              /> */}
              <RatingStars Review_Count={avgReviewCount} />
              <span className="text-richblack-400 md:block hidden md:text-xl">
                {course?.ratingAndReviews?.length} Ratings
              </span>
            </div>
            <p className="text-sm md:text-xl text-richblack-5">Rs. {course?.price}</p>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default Course_Card
