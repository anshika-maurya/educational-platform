import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import "swiper/css/effect-coverflow";
import "../../../App.css";
import Course_Card from "./Course_Card";

const FrequentlyBoughtSlider = ({ courses }) => {
  // Get only top 4 courses
  const topCourses = courses?.length > 0 ? courses.slice(0, 4) : [];

  return (
    <div className="relative w-full">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={true}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        loop={true}
        loopedSlides={4}
        slidesPerView={3}
        spaceBetween={20}
        className="frequentlyBoughtSlider"
        breakpoints={{
          0: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 15,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
        }}
      >
        {topCourses.map((course, index) => (
          <SwiperSlide key={index}>
            <div className="course-card-container h-full">
              <Course_Card course={course} height={"h-[250px]"} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FrequentlyBoughtSlider; 