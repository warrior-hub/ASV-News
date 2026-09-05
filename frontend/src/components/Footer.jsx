import { Link } from "react-router-dom";
import { useState } from "react";

import logo from "../assets/logo.png";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";

import {
  FiArrowUpRight,
  FiMail,
  FiPhone,
  FiMapPin,
  FiChevronUp,
  FiSend,
} from "react-icons/fi";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const categories = [
    { name: "भारत", slug: "india" },
    { name: "दुनिया", slug: "world" },
    { name: "राजनीति", slug: "politics" },
    { name: "बिजनेस", slug: "business" },
    { name: "टेक्नोलॉजी", slug: "technology" },
  
  ];

  const quickLinks = [
    { name: "हमारे बारे में", slug: "about" },
    { name: "संपर्क करें", slug: "contact" },
  
  ];

  const socialLinks = [
    {
      icon: <FaFacebookF size={14} />,
      label: "Facebook",
      href: "https://www.facebook.com/profile.php?id=61576768812323",
      color: "hover:bg-blue-600 hover:border-blue-600",
    },
    {
      icon: <FaInstagram size={15} />,
      label: "Instagram",
      href: "https://www.instagram.com/avsnews9000?igsh=MTltMHN5aWF4YnI2NA==",
      color: "hover:bg-pink-600 hover:border-pink-600",
    },
    {
      icon: <FaYoutube size={16} />,
      label: "YouTube",
      href: "https://youtube.com/@avsnews-b5b?si=80v1_MdAHdfVMeZy",
      color: "hover:bg-red-600 hover:border-red-600",
    },
    {
      icon: <FaWhatsapp size={15} />,
      label: "WhatsApp",
      href: "https://wa.me/917084159000",
      color: "hover:bg-green-600 hover:border-green-600",
    },
    
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#0b1220] text-white">
      {/* Top Border Gradient */}
      <div className="h-1 bg-gradient-to-r from-red-600 via-orange-500 to-red-600" />

      {/* Main Footer */}
      <div className="mx-auto max-w-[1400px] px-5 py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          {/* Brand Section */}
     <div>
  <Link
    to="/"
    className="group inline-flex items-center gap-3"
  >
    {/* LOGO */}
    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-lg shadow-black/20 transition-transform duration-300 group-hover:scale-105">
      <img
        src={logo}
        alt="AVS News Digital"
        className="h-full w-full object-contain"
      />
    </div>

    {/* BRAND */}
    <div className="min-w-0">
      {/* AVS NEWS DIGITAL - ONE LINE */}
      <div className="flex items-baseline whitespace-nowrap leading-none">
        <span className="text-2xl font-black tracking-tight text-white sm:text-3xl">
          AVS NEWS
        </span>

        <span className="ml-2 text-sm font-black tracking-[0.16em] text-red-500 sm:text-base">
          DIGITAL
        </span>
      </div>

      {/* TAGLINE - RIGHT SIDE UNDER DIGITAL */}
      <div className="mt-1.5 flex justify-end">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />

          <span className="whitespace-nowrap text-[9px] font-bold tracking-[0.18em] text-gray-500">
            सच की आवाज़
          </span>
        </div>
      </div>
    </div>
  </Link>

  <p className="mt-6 max-w-md text-sm leading-7 text-gray-400">
    AVS News Digital का उद्देश्य देश और दुनिया की महत्वपूर्ण खबरें,
    घटनाक्रम और खबरों के पीछे की पूरी कहानी आपको सरल, स्पष्ट और
    भरोसेमंद तरीके से पहुंचाना है।
  </p>

  {/* SOCIAL LINKS */}
  <div className="mt-6 flex items-center gap-2">
    {socialLinks.map((social) => (
      <a
        key={social.label}
        href={social.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={social.label}
        title={social.label}
        className={`flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 transition-all duration-300 hover:-translate-y-1 hover:text-white hover:shadow-lg ${social.color}`}
      >
        {social.icon}
      </a>
    ))}
  </div>
</div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-sm font-black uppercase tracking-wider text-white">
              क्विक लिंक्स
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.slug}>
                  <Link
                    to={`/${link.slug}`}
                    className="group flex items-center gap-1 text-sm text-gray-400 transition hover:text-white"
                  >
                    <span className="relative">
                      {link.name}
                      <span className="absolute bottom-0 left-0 h-px w-0 bg-red-500 transition-all duration-300 group-hover:w-full" />
                    </span>
                    <FiArrowUpRight
                      size={12}
                      className="opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-6 text-sm font-black uppercase tracking-wider text-white">
              श्रेणियां
            </h3>
            <ul className="grid grid-cols-1 gap-3">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    to={`/category/${category.slug}`}
                    className="group flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-600 transition group-hover:bg-red-500" />
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-6 text-sm font-black uppercase tracking-wider text-white">
              संपर्क करें
            </h3>
            <div className="space-y-4">
              <a
                href="mailto:contact@news24.com"
                className="group flex items-start gap-3 text-sm text-gray-400 transition hover:text-white"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 transition group-hover:bg-red-600 group-hover:text-white">
                  <FiMail size={16} />
                </span>
                <span className="pt-2">
                  <span className="block text-xs text-gray-500">ईमेल</span>
                  avsnews9000@gmail.com
                </span>
              </a>

              <a
                href="tel:+917084159000"
                className="group flex items-start gap-3 text-sm text-gray-400 transition hover:text-white"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 transition group-hover:bg-blue-600 group-hover:text-white">
                  <FiPhone size={16} />
                </span>
                <span className="pt-2">
                  <span className="block text-xs text-gray-500">फोन</span>
                  +91 70841 59000
                </span>
              </a>

            

              <div className="flex items-start gap-3 text-sm text-gray-400">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5">
                  <FiMapPin size={16} />
                </span>
                <span className="pt-2">
                  <span className="block text-xs text-gray-500">पता</span>
                   117/221, Ramleela Park, O Block, Geeta Nagar, Kakadeo, Kanpur, Uttar Pradesh 208025
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-white/10 pt-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <p className="text-xs text-gray-500">
              © 2026 News24. सर्वाधिकार सुरक्षित।
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                लाइव अपडेट
              </span>
              <span className="h-1 w-1 rounded-full bg-gray-700" />
              <span>स्वतंत्र पत्रकारिता</span>
              <span className="h-1 w-1 rounded-full bg-gray-700" />
              <span>भरोसेमंद खबरें</span>
            </div>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-xs text-gray-500 transition hover:text-white"
              aria-label="Back to top"
            >
              ऊपर जाएं
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 transition hover:bg-red-600">
                <FiChevronUp size={16} />
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;