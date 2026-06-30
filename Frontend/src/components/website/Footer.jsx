import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { MdKeyboardArrowRight } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { FaYoutube } from "react-icons/fa";

const services = [
  { label: "Shop", to: "/shop" },
  { label: "Track Order", to: "/track" },
  { label: "FAQs", to: "/faq" },
  { label: "Contact", to: "/contact" },
];

const company = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Shop", to: "/shop" },
  { label: "Videos", to: "/videos" },
  { label: "Contact Us", to: "/contact" },
];

const socials = [
  { Icon: FaFacebookF, label: "Facebook", href: "https://www.facebook.com/share/18dgmfQ39U/" },
  { Icon: FaYoutube , label: "YouTube", href: "https://www.youtube.com/results?search_query=mohanmaya" },
  { Icon: FaInstagram, label: "Instagram", href: "https://instagram.com/mohanmaya_" },
];

const LinkColumn = ({ title, links }) => (
  <div>
    <h3 className="text-2xl font-semibold mb-8 ml-[18px]">{title}</h3>
    <ul className="space-y-3">
      {links.map((item) => (
        <li key={item.label}>
          <Link to={item.to} className="group flex items-center cursor-pointer">
            <MdKeyboardArrowRight className="opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-white text-[20px]" />
            <span className="text-gray-400 group-hover:text-white group-hover:translate-x-2 transition-all duration-300">
              {item.label}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default function Footer() {
  return (
    <footer className="bg-[#0f1115] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14">
          {/* Logo */}
          <div>
            <div className="flex justify-start items-center gap-3 mb-3">
             <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-[#fe4462]/30 group-hover:ring-[#fe4462] transition-all duration-300">
              <img src="/header/logo.png" alt="Mohan Maya logo" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="hidden sm:block">
              <span className="block text-2xl font-black text-gradient leading-none">M&amp;M</span>
              <p className="text-[10px] tracking-widest text-gray-500 dark:text-gray-400 uppercase">Mohan Maya</p>
            </div>
            </div>
            <p className="text-gray-400 leading-6 mb-8">
              Handcrafted miniature art that captures extraordinary detail and timeless
              craftsmanship - created with love in Vrindavan.
            </p>
            <div className="flex gap-4">
              {socials.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow Mohan Maya on ${label}`}
                  className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center cursor-pointer hover:bg-[#fe4462] hover:text-white transition-all duration-300"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <LinkColumn title="Services" links={services} />
          <LinkColumn title="Company" links={company} />

          {/* Contact */}
          <div>
            <h3 className="text-2xl font-semibold mb-8">Contact</h3>
            <div className="flex gap-4 mb-6 items-start">
              <div className="w-10 h-10 rounded-full bg-[#fe4462] flex items-center justify-center shrink-0">
                <FaMapMarkerAlt />
              </div>
              <p className="text-gray-400 leading-6">
                Roorkee,
                <br/>
                 Uttarakhand 247667
              </p>
            </div>
            <div className="flex gap-4 mb-6 items-center">
              <div className="w-10 h-10 rounded-full bg-[#fe4462] flex items-center justify-center shrink-0">
                <MdEmail />
              </div>
              <div>
                <h4 className="font-semibold">support@mohanmaya.in</h4>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-[#fe4462] flex items-center justify-center shrink-0">
                <FaPhoneAlt />
              </div>
              <div>
                <h4 className="font-semibold">+91 99567 48903</h4>
                <p className="text-gray-500">Mon - Sat: 9 AM - 6 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col lg:flex-row justify-between items-center gap-6">
          <p className="text-gray-400">© {new Date().getFullYear()} Mohan-Maya. All rights reserved.</p>
          <div className="flex gap-4 text-gray-400">
            <Link to="/terms" className="hover:text-white transition">Terms &amp; Conditions</Link>
            <span>|</span>
            <Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
