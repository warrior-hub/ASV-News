import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend,
  FiClock,
  FiArrowRight,
  FiExternalLink,
} from "react-icons/fi";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const response = await fetch("http://localhost:5000/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Message send failed");
    }

    console.log("Contact API Response:", data);

    setSubmitted(true);

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });

    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  } catch (error) {
    console.error("Contact Form Error:", error);

    alert(error.message || "संदेश भेजने में समस्या हुई। कृपया दोबारा प्रयास करें।");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />

      <main>
        {/* =================================================
            HERO
        ================================================= */}

        <section className="relative overflow-hidden border-b border-gray-200 bg-gray-50">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-red-100 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-red-50 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-[1200px] px-5 py-14 md:py-16 lg:px-8 lg:py-20">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-white px-4 py-2 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[#b91c1c]" />

                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#b91c1c]">
                  संपर्क करें
                </span>
              </div>

              <h1 className="mt-5 text-4xl font-black leading-[1.1] tracking-tight text-gray-950 md:text-5xl lg:text-6xl">
                हमसे संपर्क करें
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-gray-600 md:text-base md:leading-8">
                आपके सुझाव, सवाल, प्रतिक्रिया या किसी खबर से जुड़ी जानकारी
                हमारे लिए महत्वपूर्ण है। हमारी टीम से सीधे संपर्क करें।
              </p>

              <div className="mt-7 h-1 w-20 rounded-full bg-[#b91c1c]" />
            </div>
          </div>
        </section>

        {/* =================================================
            CONTACT SECTION
        ================================================= */}

        <section className="bg-white">
          <div className="mx-auto max-w-[1200px] px-5 py-12 md:py-16 lg:px-8 lg:py-20">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">

              {/* =================================================
                  LEFT SIDE
              ================================================= */}

              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#b91c1c]">
                  संपर्क जानकारी
                </p>

                <h2 className="mt-2 text-3xl font-black leading-tight text-gray-950 md:text-4xl">
                  बात करना चाहते हैं?
                </h2>

                <p className="mt-4 max-w-lg text-sm leading-7 text-gray-600">
                  न्यूज़, विज्ञापन, सहयोग, सुझाव या किसी अन्य विषय के लिए
                  हमारी टीम से संपर्क कर सकते हैं।
                </p>

                {/* =================================================
                    CONTACT CARDS
                ================================================= */}

                <div className="mt-8 space-y-4">

                  {/* EMAIL */}

                  <a
                    href="mailto:info@news24.com"
                    className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-lg"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#b91c1c] transition duration-300 group-hover:bg-[#b91c1c] group-hover:text-white">
                      <FiMail size={20} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                        ईमेल
                      </p>

                      <p className="mt-1 truncate text-sm font-bold text-gray-900">
                        info@news24.com
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        सामान्य पूछताछ के लिए
                      </p>
                    </div>

                    <FiArrowRight
                      className="ml-auto shrink-0 text-gray-300 transition group-hover:translate-x-1 group-hover:text-[#b91c1c]"
                      size={18}
                    />
                  </a>

                  {/* PHONE */}

                  <a
                    href="tel:+917084159000"
                    className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-lg"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#b91c1c] transition duration-300 group-hover:bg-[#b91c1c] group-hover:text-white">
                      <FiPhone size={20} />
                    </div>

                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                        फोन
                      </p>

                      <p className="mt-1 text-sm font-bold text-gray-900">
                        +91 70841 59000
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        सीधे हमसे बात करें
                      </p>
                    </div>

                    <FiArrowRight
                      className="ml-auto shrink-0 text-gray-300 transition group-hover:translate-x-1 group-hover:text-[#b91c1c]"
                      size={18}
                    />
                  </a>

                  {/* OFFICE */}

                  <div className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-lg">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#b91c1c] transition duration-300 group-hover:bg-[#b91c1c] group-hover:text-white">
                      <FiMapPin size={20} />
                    </div>

                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                        कार्यालय
                      </p>

                      <p className="mt-1 text-sm font-bold text-gray-900">
                        कानपुर, उत्तर प्रदेश, भारत
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        मुख्य कार्यालय
                      </p>
                    </div>
                  </div>

                  {/* TIMING */}

                  <div className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-lg">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#b91c1c] transition duration-300 group-hover:bg-[#b91c1c] group-hover:text-white">
                      <FiClock size={20} />
                    </div>

                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                        कार्य समय
                      </p>

                      <p className="mt-1 text-sm font-bold text-gray-900">
                        सुबह 10:00 बजे - शाम 6:00 बजे
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        सोमवार से शनिवार
                      </p>
                    </div>
                  </div>
                </div>

                {/* =================================================
                    KANPUR LOCATION MAP
                ================================================= */}

                <div className="mt-6 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">

                  {/* MAP HEADER */}

                  <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#b91c1c]">
                        <FiMapPin size={18} />
                      </div>

                      <div>
                        <p className="text-sm font-black text-gray-950">
                          हमारा स्थान
                        </p>

                        <p className="mt-0.5 text-xs text-gray-500">
                          कानपुर, उत्तर प्रदेश
                        </p>
                      </div>
                    </div>

                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Kanpur,Uttar+Pradesh,India"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 transition hover:border-red-200 hover:text-[#b91c1c]"
                    >
                      Map खोलें
                      <FiExternalLink size={13} />
                    </a>
                  </div>

                  {/* MAP */}

                  <div className="relative h-[260px] w-full bg-gray-100">
                    <iframe
                      title="News24 Kanpur Location"
                      src="https://www.google.com/maps?q=Kanpur,Uttar%20Pradesh,India&output=embed"
                      width="100%"
                      height="100%"
                      style={{
                        border: 0,
                        display: "block",
                      }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                    />

                    {/* MAP BOTTOM LABEL */}

                    <div className="pointer-events-none absolute bottom-3 left-3 right-3">
                      <div className="flex items-center gap-2 rounded-xl border border-white/70 bg-white/95 px-4 py-3 shadow-lg backdrop-blur-sm">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50 text-[#b91c1c]">
                          <FiMapPin size={15} />
                        </div>

                        <div>
                          <p className="text-xs font-black text-gray-900">
                            News24
                          </p>

                          <p className="text-[11px] text-gray-500">
                            कानपुर, उत्तर प्रदेश, भारत
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* =================================================
                  CONTACT FORM
              ================================================= */}

              <div className="h-fit rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8 lg:p-9">

                <div className="mb-7">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#b91c1c]">
                    संदेश भेजें
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-gray-950 md:text-3xl">
                    अपनी बात हमें बताएं
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    फॉर्म भरें और हमारी टीम से संपर्क करें।
                  </p>
                </div>

                {/* SUCCESS MESSAGE */}

                {submitted && (
                  <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                    <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-green-500" />

                    <p className="text-sm font-semibold leading-6 text-green-700">
                      आपका संदेश सफलतापूर्वक भेज दिया गया है।
                    </p>
                  </div>
                )}

                {/* FORM */}

                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >

                  {/* NAME + EMAIL */}

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                    <div>
                      <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-bold text-gray-800"
                      >
                        आपका नाम
                      </label>

                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="अपना नाम लिखें"
                        className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#b91c1c] focus:bg-white focus:ring-4 focus:ring-red-50"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-bold text-gray-800"
                      >
                        ईमेल
                      </label>

                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="your@email.com"
                        className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#b91c1c] focus:bg-white focus:ring-4 focus:ring-red-50"
                      />
                    </div>

                  </div>

                  {/* SUBJECT */}

                  <div>
                    <label
                      htmlFor="subject"
                      className="mb-2 block text-sm font-bold text-gray-800"
                    >
                      विषय
                    </label>

                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="किस विषय में संपर्क करना चाहते हैं?"
                      className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#b91c1c] focus:bg-white focus:ring-4 focus:ring-red-50"
                    />
                  </div>

                  {/* MESSAGE */}

                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block text-sm font-bold text-gray-800"
                    >
                      संदेश
                    </label>

                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={7}
                      placeholder="अपना संदेश यहां लिखें..."
                      className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-7 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#b91c1c] focus:bg-white focus:ring-4 focus:ring-red-50"
                    />
                  </div>

                  {/* SUBMIT */}

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#b91c1c] px-6 py-3.5 text-sm font-black text-white transition hover:bg-[#991b1b] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <FiSend size={17} />

                    {loading
                      ? "भेजा जा रहा है..."
                      : "संदेश भेजें"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            BOTTOM CTA
        ================================================= */}

        <section className="border-y border-gray-200 bg-gray-50">
          <div className="mx-auto max-w-[1000px] px-5 py-14 text-center md:py-16 lg:px-8">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-[#b91c1c]">
              <FiMail size={23} />
            </div>

            <p className="mt-5 text-[11px] font-black uppercase tracking-[0.2em] text-[#b91c1c]">
              हम आपकी बात सुनते हैं
            </p>

            <h2 className="mt-2 text-3xl font-black text-gray-950 md:text-4xl">
              कोई खबर या सुझाव साझा करना है?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-600 md:text-base">
              अगर आपके पास किसी घटना, खबर या स्थानीय मुद्दे से जुड़ी
              महत्वपूर्ण जानकारी है, तो हमें जरूर बताएं।
            </p>

            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">

              <a
                href="mailto:info@news24.com"
                className="inline-flex items-center gap-2 rounded-xl bg-gray-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-[#b91c1c]"
              >
                <FiMail size={16} />
                हमें ईमेल करें
              </a>

              <a
                href="tel:+917084159000"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-800 transition hover:border-[#b91c1c] hover:text-[#b91c1c]"
              >
                <FiPhone size={16} />
                +91 70841 59000
              </a>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
