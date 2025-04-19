import React, { useEffect, useState } from "react";
import ReactStars from "react-rating-stars-component";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-cards";
import "../../App.css";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import { Autoplay, FreeMode, Pagination, Navigation, EffectCoverflow } from "swiper/modules";
import { apiConnector } from "../../services/apiConnector";
import { ratingsEndpoints } from "../../services/apis";

function ReviewSlider() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const truncateWords = 20;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await apiConnector(
          "GET",
          ratingsEndpoints.REVIEWS_DETAILS_API
        );
        if (data?.success) {
          setReviews(data?.data);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="text-white w-full max-w-maxContent mx-auto px-4">
      <div className="my-8 md:my-12">
        {loading ? (
          <div className="h-[300px] flex justify-center items-center">
            <div className="spinner"></div>
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-center text-richblack-300 h-[200px] flex items-center justify-center">No reviews available</p>
        ) : (
          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2.5,
              slideShadows: true,
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={true}
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 20 },
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 25 },
              1280: { slidesPerView: 3, spaceBetween: 30 },
            }}
            modules={[EffectCoverflow, FreeMode, Pagination, Navigation, Autoplay]}
            className="w-full reviewSlider py-10"
          >
            {reviews.slice(0, 20).map((review, i) => {
              const avatarUrl =
                review?.user?.image ||
                `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName || "User"} ${review?.user?.lastName || "Name"}`;
              return (
                <SwiperSlide key={review.id || i} className="swiper-slide-review">
                  <div className="flex flex-col gap-4 bg-richblack-800 p-6 rounded-lg text-[14px] text-richblack-25 h-full border border-richblack-700 shadow-md hover:shadow-lg transition-all duration-200 hover:border-richblack-600">
                    <div className="absolute top-4 left-4 text-yellow-100 opacity-20">
                      <FaQuoteLeft size={24} />
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <img
                        src={avatarUrl}
                        alt={`${review?.user?.firstName || "User"}'s profile`}
                        className="h-14 w-14 rounded-full object-cover border-2 border-yellow-100"
                      />
                      <div className="flex flex-col">
                        <h1 className="font-semibold text-richblack-5 text-lg">
                          {`${review?.user?.firstName || ""} ${review?.user?.lastName || ""}`}
                        </h1>
                        <h2 className="text-[12px] font-medium text-richblack-400">
                          {review?.course?.courseName || "Course"}
                        </h2>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <ReactStars
                        count={5}
                        value={review.rating}
                        size={18}
                        edit={false}
                        activeColor="#ffd700"
                        emptyIcon={<FaStar />}
                        fullIcon={<FaStar />}
                      />
                      <h3 className="font-semibold text-yellow-100 ml-1">
                        {review.rating.toFixed(1)}
                      </h3>
                    </div>
                    
                    <p className="font-medium text-richblack-25 mt-2 flex-grow">
                      {review?.review.split(" ").length > truncateWords
                        ? `${review?.review
                            .split(" ")
                            .slice(0, truncateWords)
                            .join(" ")} ...`
                        : `${review?.review}`}
                    </p>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </div>
    </div>
  );
}

export default ReviewSlider;
