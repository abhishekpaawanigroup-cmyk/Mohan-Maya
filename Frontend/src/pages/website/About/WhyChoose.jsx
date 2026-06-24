import {
  FaPaintBrush,
  FaGem,
  FaGift,
  FaHandsHelping,
} from "react-icons/fa";

const WhyChooseUs = () => {
  return (
  <section className="py-20 bg-[#f4edee] dark:bg-[#0d0508] relative overflow-hidden">
 
      {/* Background */}
      {/* <div className="absolute w-[500px] h-[500px] rounded-full bg-[#ffecef] opacity-1 -left-40 top-20"></div>
      <div className="absolute w-[400px] h-[400px] rounded-full bg-[#ffecef] opacity-1 -right-32 bottom-10"></div> */}
 
      <div className="max-w-7xl mx-auto px-5 relative z-10">
 
        {/* Heading */}

        <div className="text-center mb-16">

          <span className="bg-transparent text-[#fe4462] border border-[#fe4462] px-4 py-1 rounded-full text-sm font-semibold">
            WHY CHOOSE US
          </span>

          <h2 className="text-5xl font-bold text-[#2b2626] dark:text-white mt-5">
            Discover the Art Behind
            <span className="text-[#fe4462]"> Every Miniature</span>
          </h2>

          <p className="max-w-2xl mx-auto mt-4 text-gray-500">
            We create handcrafted miniature masterpieces with exceptional
            precision, premium quality, and timeless artistry that collectors
            cherish forever.
          </p>

        </div>
 
        <div className="grid lg:grid-cols-3 gap-10 items-center">
 
          {/* Left */}
 
          <div className="space-y-12">
 
            <div className="text-center">
 
              <div className="w-16 h-16 rounded-full bg-[#ffd8df] flex justify-center items-center mx-auto text-[#fe4462] text-2xl">
                <FaPaintBrush />
              </div>
 
              <h3 className="font-bold text-2xl mt-4 text-[#2b2626] dark:text-white">
                Exceptional Craftsmanship
              </h3>
 
              <p className="text-gray-500 mt-3 leading-7">
                Every miniature is handcrafted with remarkable attention to
                detail, creating a masterpiece that reflects true artistic
                excellence.
              </p>
 
            </div>
 
            <div className="text-center">
 
              <div className="w-16 h-16 rounded-full bg-[#ffd8df] flex justify-center items-center mx-auto text-[#fe4462] text-2xl">
                <FaGem />
              </div>
 
              <h3 className="font-bold text-2xl mt-4 text-[#2b2626] dark:text-white">
                Exclusive Designs
              </h3>
 
              <p className="text-gray-500 mt-3 leading-7">
                Unique and limited-edition creations inspired by culture,
                mythology, and imagination for collectors worldwide.
              </p>
 
            </div>
 
          </div>
 
          {/* Center */}
 
          <div className="flex flex-col items-center">
 
            <div className="relative">
 
              <div className="absolute w-full h-full bg-[#d2cccc] rounded-3xl top-3 left-3"></div>
 
              <img
                src="/Shop/Product1.jpeg"
                alt=""
                loading="lazy"
                decoding="async"
                className="relative w-full h-[500px] object-cover rounded-3xl shadow-2xl"
              />
 
            </div>
 
            <button className="mt-10 px-8 py-4 bg-[#fe4462] border border-[#fe4462] rounded-full text-white font-semibold shadow-lg hover:bg-transparent hover:text-[#fe4462] hover:border-[#fe4462] duration-300 cursor-pointer">
              Explore Collection
            </button>
 
          </div>
 
          {/* Right */}
 
          <div className="space-y-12">
 
            <div className="text-center">
 
              <div className="w-16 h-16 rounded-full bg-[#ffd8df] flex justify-center items-center mx-auto text-[#fe4462] text-2xl">
                <FaGift />
              </div>
 
              <h3 className="font-bold text-2xl mt-4 text-[#2b2626] dark:text-white">
                Perfect for Gifting
              </h3>
 
              <p className="text-gray-500 mt-3 leading-7">
                Thoughtfully designed keepsakes that make unforgettable gifts
                for birthdays, festivals, weddings, and special occasions.
              </p>
 
            </div>
 
            <div className="text-center">
 
              <div className="w-16 h-16 rounded-full bg-[#ffd8df] flex justify-center items-center mx-auto text-[#fe4462] text-2xl">
                <FaHandsHelping />
              </div>
 
              <h3 className="font-bold text-2xl mt-4 text-[#2b2626] dark:text-white">
                Crafted with Passion
              </h3>
 
              <p className="text-gray-500 mt-3 leading-7">
                Our skilled artisans combine creativity and dedication to bring
                imagination to life through timeless miniature art.
              </p>
 
            </div>
 
          </div>
 
        </div>
 
      </div>
 
    </section>
  );
};
 
export default WhyChooseUs;