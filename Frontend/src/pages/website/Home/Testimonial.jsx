import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import { FaStar, FaRegStar } from "react-icons/fa";



import { FaArrowRightLong } from "react-icons/fa6";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaQuoteRight } from "react-icons/fa";
import SectionHeading from "../../../components/common/SectionHeading";

const testimonials = [
  {
    name: "Rohit Sharma",
    role: "Cricketer",
    image: "/testimonials-images/pic4.png",
    review:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit vestibulum viverra eget felis interdum.",
  },
  {
    name: "Abhishek Sharma",
    role: "Cricketer",
    image: "/testimonials-images/pic2.png",
    review:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit vestibulum viverra eget felis interdum.",
  },
  {
    name: "Virat Kohli",
    role: "Cricketer",
    image: "/testimonials-images/pic4.png",
    review:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit vestibulum viverra eget felis interdum.",
  },
  {
    name: "Hardik Pandya",
    role: "Cricketer",
    image: "/testimonials-images/pic2.png",
    review:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit vestibulum viverra eget felis interdum.",
  },
];

function Testimonials() {
  return (
    <section
      className="relative py-24 bg-[url('/testimonials-images/bg.png')] bg-cover bg-center"
     
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/75"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-5">
        {/* Heading */}
        <SectionHeading badge="Testimonials" title="Client Feedback" className="mb-16" />

        {/* Slider */}
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={30}
          loop={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
        >
          {testimonials.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white p-8 min-h-[280px] relative rounded-[12px]">
                {/* Stars */}
                <div className="flex gap-1 text-yellow-500 mb-4">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaRegStar />
                </div>

               <div className="flex items-center gap-4 mb-6">
  <img
    src={item.image}
    alt={item.name}
    loading="lazy"
    decoding="async"
    className="w-14 h-14 rounded-full object-cover border-2 border-[#fe4462]"
  />

  <div>
    <h3 className="text-xl font-semibold text-left">
      {item.name}
    </h3>

    <p className="text-gray-500 text-sm text-left">
      {item.role}
    </p>
  </div>
</div>

                <p className="text-gray-600 leading-6">
                  {item.review}
                </p>

                <span className="absolute top-6 right-6 text-4xl text-[#fe4462]">
                  <FaQuoteRight />
                </span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-5 mt-14">
          <button className="custom-prev w-14 h-14 rounded-full border border-[#fe4462] text-[#fe4462] hover:bg-[#fe4462] hover:text-white transition">
            <FaArrowLeftLong className="mx-auto"/>
          </button>

          <button className="custom-next w-14 h-14 rounded-full border border-[#fe4462] text-[#fe4462] hover:bg-[#fe4462] hover:text-white transition">
           <FaArrowRightLong className="mx-auto"/>
          </button>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;