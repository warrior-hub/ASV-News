import { Link } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";

import {
  FiArrowUpRight,
  FiCheckCircle,
  FiMail,
  FiTarget,
  FiUsers,
} from "react-icons/fi";

import { FaNewspaper, FaRegLightbulb } from "react-icons/fa6";

const About = () => {
  const coverage = [
    "भारत",
    "दुनिया",
    "राजनीति",
    "बिजनेस",
    "टेक्नोलॉजी",
    "खेल",
    "मनोरंजन",
    "स्वास्थ्य",
    "शिक्षा",
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />

      <main>
        {/* =================================================
            HERO
        ================================================= */}

        <section className="relative overflow-hidden border-b border-gray-200 bg-gray-50">
          {/* Background Decoration */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-red-100/70 blur-3xl" />

            <div className="absolute -bottom-32 -left-28 h-80 w-80 rounded-full bg-gray-200/70 blur-3xl" />

            <div className="absolute right-[30%] top-1/2 h-40 w-40 rounded-full bg-red-50/80 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-[1200px] px-5 py-14 md:py-20 lg:px-8 lg:py-24">
            <div className="max-w-4xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-white px-4 py-2 shadow-sm">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-50 text-[#b91c1c]">
                  <FaNewspaper size={10} />
                </span>

                <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#b91c1c]">
                  हमारे बारे में
                </span>
              </div>

              {/* Heading */}
              <h1 className="mt-6 text-4xl font-black leading-[1.1] tracking-tight text-gray-950 sm:text-5xl md:text-6xl lg:text-[64px]">
                खबरें सिर्फ बताना नहीं,
                <span className="block text-[#b91c1c]">
                  सही तरीके से बताना
                </span>
                हमारा उद्देश्य है।
              </h1>

              {/* Description */}
              <p className="mt-6 max-w-3xl text-sm leading-7 text-gray-600 sm:text-base md:text-lg md:leading-8">
                AVS News एक डिजिटल न्यूज़ प्लेटफॉर्म है, जहां हमारा
                उद्देश्य पाठकों तक महत्वपूर्ण, उपयोगी और विश्वसनीय खबरें
                सरल भाषा में पहुंचाना है।
              </p>

              {/* Buttons */}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#b91c1c] px-6 py-3.5 text-sm font-bold text-white shadow-sm transition duration-300 hover:bg-[#991b1b] hover:shadow-lg"
                >
                  खबरें पढ़ें
                  <FiArrowUpRight size={17} />
                </Link>

                <Link
                  to="/search"
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-bold text-gray-700 shadow-sm transition duration-300 hover:border-red-200 hover:bg-red-50 hover:text-[#b91c1c]"
                >
                  खबर खोजें
                </Link>
              </div>

              {/* Bottom Line */}
              <div className="mt-10 flex items-center gap-3">
                <div className="h-1 w-16 rounded-full bg-[#b91c1c]" />
                <div className="h-1 w-6 rounded-full bg-red-200" />
                <div className="h-1 w-2 rounded-full bg-red-100" />
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            INTRO
        ================================================= */}

        <section className="bg-white">
          <div className="mx-auto max-w-[1200px] px-5 py-14 md:py-16 lg:px-8 lg:py-20">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14">
              {/* LEFT */}

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#b91c1c]">
                  AVS News
                </p>

                <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-gray-950 md:text-4xl">
                  आपके लिए खबरों को
                  <span className="block text-[#b91c1c]">
                    आसान और बेहतर बनाना
                  </span>
                </h2>

                <div className="mt-6 space-y-5 text-[15px] leading-8 text-gray-600 md:text-base">
                  <p>
                    आज के समय में खबरों की कमी नहीं है, लेकिन सही जानकारी
                    को समझना और भरोसेमंद तरीके से पढ़ना पहले से ज्यादा
                    जरूरी हो गया है।
                  </p>

                  <p>
                    AVS News का प्रयास है कि देश-दुनिया, राजनीति, बिजनेस,
                    टेक्नोलॉजी, खेल, मनोरंजन, शिक्षा और अन्य महत्वपूर्ण
                    विषयों की खबरें पाठकों तक साफ और सरल तरीके से पहुंचें।
                  </p>

                  <p>
                    हमारा फोकस ऐसा न्यूज़ एक्सपीरियंस बनाने पर है जहां
                    पाठक जरूरी खबर जल्दी ढूंढ सके और उसे बिना किसी
                    अनावश्यक जटिलता के पढ़ सके।
                  </p>
                </div>
              </div>

              {/* RIGHT INFO CARD */}

              <div className="relative overflow-hidden rounded-3xl bg-gray-950 p-7 shadow-xl md:p-9">
                {/* Card Decoration */}
                <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-red-700/20 blur-3xl" />

                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#b91c1c] text-white shadow-lg">
                    <FaRegLightbulb size={24} />
                  </div>

                  <h3 className="mt-7 text-2xl font-black text-white">
                    हमारा विचार
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-gray-300 md:text-base">
                    हर पाठक को ऐसी खबर मिलनी चाहिए जो उसे जानकारी दे,
                    सोचने पर मजबूर करे और उसके आसपास की दुनिया को बेहतर
                    तरीके से समझने में मदद करे।
                  </p>

                  <div className="mt-7 h-px bg-white/10" />

                  <div className="mt-6 flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-[#b91c1c]" />

                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                      News • Information • Trust
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            FOUNDER / OWNER
        ================================================= */}

        <section className="border-y border-gray-200 bg-gray-50">
          <div className="mx-auto max-w-[1200px] px-5 py-14 md:py-16 lg:px-8 lg:py-20">
            {/* Section Heading */}

            <div className="mb-10 max-w-2xl">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#b91c1c]">
                हमारे संस्थापक
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-950 md:text-4xl">
                AVS News के पीछे की सोच
              </h2>

              <p className="mt-4 text-sm leading-7 text-gray-600 md:text-base">
                AVS News की शुरुआत एक ऐसे न्यूज़ प्लेटफॉर्म के उद्देश्य
                से की गई, जहां पाठकों तक महत्वपूर्ण और विश्वसनीय जानकारी
                सरल भाषा में पहुंच सके।
              </p>
            </div>

            {/* Founder Card */}

            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
              <div className="grid md:grid-cols-[0.8fr_1.2fr]">
                {/* OWNER PHOTO */}

                <div className="relative min-h-[320px] overflow-hidden bg-gray-200 md:min-h-[440px]">
                  <img
                    src="/images/owner.jpg"
                    alt="AVS News Founder"
                    className="absolute inset-0 h-full w-full object-cover"
                  />

                  {/* Image Overlay */}

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6">
                    <p className="text-sm font-bold text-white">
                      AVS News
                    </p>

                    <p className="mt-1 text-xs text-gray-200">
                      Founder & Owner
                    </p>
                  </div>
                </div>

                {/* OWNER INFORMATION */}

                <div className="flex flex-col justify-center p-7 md:p-10 lg:p-12">
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#b91c1c]">
                    Founder & Owner
                  </p>

                  <h3 className="mt-3 text-3xl font-black tracking-tight text-gray-950 md:text-4xl">
                    आपका नाम
                  </h3>

                  <p className="mt-5 text-sm leading-7 text-gray-600 md:text-base">
                    AVS News के संस्थापक के रूप में हमारा उद्देश्य एक ऐसा
                    डिजिटल न्यूज़ प्लेटफॉर्म तैयार करना है, जहां पाठकों
                    को देश-दुनिया की महत्वपूर्ण खबरें स्पष्ट, सरल और
                    जिम्मेदार तरीके से मिल सकें।
                  </p>

                  <p className="mt-4 text-sm leading-7 text-gray-600 md:text-base">
                    हमारा मानना है कि पत्रकारिता का उद्देश्य केवल खबर
                    पहुंचाना नहीं है, बल्कि पाठकों को सही जानकारी देकर
                    उन्हें अपने आसपास की दुनिया को बेहतर ढंग से समझने
                    में मदद करना भी है।
                  </p>

                  {/* QUOTE */}

                  <div className="mt-7 border-l-4 border-[#b91c1c] pl-5">
                    <p className="text-base font-bold leading-7 text-gray-900">
                      “सही खबर, सरल भाषा और पाठकों का भरोसा — यही AVS News
                      की पहचान है।”
                    </p>
                  </div>

                  {/* Bottom Line */}

                  <div className="mt-7 flex items-center gap-3">
                    <div className="h-1 w-12 rounded-full bg-[#b91c1c]" />

                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                      Founder • AVS News
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            MISSION / VALUES
        ================================================= */}

        <section className="bg-white">
          <div className="mx-auto max-w-[1200px] px-5 py-14 md:py-16 lg:px-8 lg:py-20">
            <div className="mb-10 max-w-2xl">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#b91c1c]">
                हमारा उद्देश्य
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-950 md:text-4xl">
                हम किन बातों को महत्व देते हैं?
              </h2>

              <p className="mt-4 text-sm leading-7 text-gray-600 md:text-base">
                हमारे लिए अच्छी पत्रकारिता सिर्फ खबर प्रकाशित करना नहीं,
                बल्कि पाठकों तक जिम्मेदारी से जानकारी पहुंचाना है।
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {/* ACCURACY */}

              <div className="group rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-[#b91c1c] transition group-hover:bg-[#b91c1c] group-hover:text-white">
                  <FiTarget size={22} />
                </div>

                <h3 className="mt-6 text-xl font-black text-gray-950">
                  सटीकता
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-500">
                  खबरों को स्पष्ट और तथ्यात्मक तरीके से प्रस्तुत करना
                  हमारी प्राथमिकता है।
                </p>
              </div>

              {/* READERS */}

              <div className="group rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700 transition group-hover:bg-blue-700 group-hover:text-white">
                  <FiUsers size={22} />
                </div>

                <h3 className="mt-6 text-xl font-black text-gray-950">
                  पाठक पहले
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-500">
                  हमारी वेबसाइट का अनुभव इस तरह बनाया गया है कि पाठक
                  जरूरी जानकारी आसानी से प्राप्त कर सके।
                </p>
              </div>

              {/* RESPONSIBILITY */}

              <div className="group rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-700 group-hover:text-white">
                  <FiCheckCircle size={22} />
                </div>

                <h3 className="mt-6 text-xl font-black text-gray-950">
                  जिम्मेदारी
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-500">
                  समाचार प्रकाशित करते समय जिम्मेदार और संतुलित
                  पत्रकारिता को महत्व देना हमारा प्रयास है।
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            COVERAGE
        ================================================= */}

        <section className="bg-white">
          <div className="mx-auto max-w-[1200px] px-5 py-14 md:py-16 lg:px-8 lg:py-20">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-14">
              {/* TEXT */}

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#b91c1c]">
                  हमारी कवरेज
                </p>

                <h2 className="mt-2 text-3xl font-black leading-tight tracking-tight text-gray-950 md:text-4xl">
                  हर जरूरी विषय,
                  <span className="block text-[#b91c1c]">
                    एक जगह
                  </span>
                </h2>

                <p className="mt-5 text-sm leading-7 text-gray-600 md:text-base">
                  अलग-अलग क्षेत्रों की महत्वपूर्ण खबरों को एक ही जगह
                  पढ़ें और अपनी पसंद के विषयों से जुड़े रहें।
                </p>

                <Link
                  to="/"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#b91c1c] transition hover:gap-3"
                >
                  सभी खबरें देखें
                  <FiArrowUpRight size={16} />
                </Link>
              </div>

              {/* CATEGORIES */}

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {coverage.map((item, index) => (
                  <div
                    key={item}
                    className="group rounded-xl border border-gray-200 bg-white px-4 py-5 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:bg-red-50 hover:shadow-md"
                  >
                    <div className="mx-auto mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-gray-50 text-[10px] font-black text-gray-400 transition group-hover:bg-white group-hover:text-[#b91c1c]">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <p className="text-sm font-bold text-gray-700 transition group-hover:text-[#b91c1c]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            WHY AVS
        ================================================= */}

        <section className="border-y border-gray-200 bg-gray-50">
          <div className="mx-auto max-w-[1100px] px-5 py-14 md:py-16 lg:px-8 lg:py-20">
            <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm md:p-10">
              <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#b91c1c]">
                    AVS News क्यों?
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-gray-950 md:text-3xl">
                    खबरों का सरल और भरोसेमंद अनुभव
                  </h2>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-600">
                    हमारा प्रयास है कि वेबसाइट पर आने वाले हर पाठक को
                    जरूरी खबरें आसानी से मिलें, खबर पढ़ना सरल हो और
                    जानकारी स्पष्ट रूप से सामने आए।
                  </p>
                </div>

                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-[#b91c1c] md:h-20 md:w-20">
                  <FaNewspaper size={30} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            CONTACT CTA
        ================================================= */}

        <section className="relative overflow-hidden border-y border-gray-200 bg-gray-50">
          {/* Background Decoration */}

          <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-red-100/70 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-red-50/80 blur-3xl" />

          <div className="relative mx-auto max-w-[1000px] px-5 py-14 text-center md:py-16 lg:px-8 lg:py-20">
            {/* Icon */}

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#b91c1c] text-white shadow-md">
              <FiMail size={23} />
            </div>

            {/* Label */}

            <p className="mt-6 text-[10px] font-black uppercase tracking-[0.25em] text-[#b91c1c]">
              हमसे जुड़ें
            </p>

            {/* Heading */}

            <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-950 md:text-4xl">
              आपके सुझाव हमारे लिए महत्वपूर्ण हैं
            </h2>

            {/* Description */}

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-600 md:text-base">
              अगर आपके पास कोई सुझाव, प्रतिक्रिया या समाचार से जुड़ी
              जानकारी है, तो हमसे संपर्क करें।
            </p>

            {/* Buttons */}

            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {/* Contact */}

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-[#b91c1c] px-6 py-3.5 text-sm font-bold text-white shadow-sm transition duration-300 hover:bg-[#991b1b] hover:shadow-lg"
              >
                संपर्क करें
                <FiArrowUpRight size={17} />
              </Link>

              {/* Home */}

              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-bold text-gray-800 shadow-sm transition duration-300 hover:border-[#b91c1c] hover:text-[#b91c1c] hover:shadow-md"
              >
                होम पेज पर जाएं
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
