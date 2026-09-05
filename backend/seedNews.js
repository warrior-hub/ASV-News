const mongoose = require("mongoose");
const News = require("./models/News");

require("dotenv").config();

const news = [
  {
    title: "भारत में डिजिटल टेक्नोलॉजी का तेजी से विस्तार",
    shortDescription: "देश में डिजिटल सेवाओं और नई तकनीकों का इस्तेमाल लगातार बढ़ रहा है।",
    content: "भारत में डिजिटल टेक्नोलॉजी के क्षेत्र में तेजी से बदलाव देखने को मिल रहे हैं।",
    category: "Technology",
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    location: "नई दिल्ली",
    author: "Rahul Sharma",
    tags: ["India", "Technology", "Digital"],
    isPublished: true,
    isTrending: true,
    isEditorsPick: true,
    isMostRead: true,
    status: "published",
    publishedAt: new Date(),
  },

  {
    title: "भारतीय अर्थव्यवस्था में कारोबार को लेकर बढ़ी उम्मीद",
    shortDescription: "कारोबार और निवेश के क्षेत्र में नई संभावनाएं दिखाई दे रही हैं।",
    content: "भारतीय अर्थव्यवस्था में कारोबार को लेकर सकारात्मक माहौल बना हुआ है।",
    category: "Business",
    thumbnail: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80",
    location: "मुंबई",
    author: "Vikram Mehta",
    tags: ["Business", "Economy", "India"],
    isPublished: true,
    isTrending: true,
    isEditorsPick: false,
    isMostRead: true,
    status: "published",
    publishedAt: new Date(),
  },

  {
    title: "भारतीय शहरों में नए इंफ्रास्ट्रक्चर प्रोजेक्ट्स पर जोर",
    shortDescription: "शहरी विकास और बेहतर सुविधाओं के लिए कई परियोजनाओं पर काम जारी है।",
    content: "देश के प्रमुख शहरों में इंफ्रास्ट्रक्चर को बेहतर बनाने के लिए नई योजनाओं पर काम किया जा रहा है।",
    category: "India",
    thumbnail: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80",
    location: "लखनऊ",
    author: "Ankit Verma",
    tags: ["India", "Infrastructure", "Cities"],
    isPublished: true,
    isTrending: true,
    isEditorsPick: true,
    isMostRead: false,
    status: "published",
    publishedAt: new Date(),
  },

  {
    title: "एआई टूल्स से शिक्षा के क्षेत्र में आ रहा बड़ा बदलाव",
    shortDescription: "नई तकनीक छात्रों और शिक्षकों के काम करने के तरीके को बदल रही है।",
    content: "आर्टिफिशियल इंटेलिजेंस आधारित टूल्स का इस्तेमाल शिक्षा के क्षेत्र में तेजी से बढ़ रहा है।",
    category: "Education",
    thumbnail: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
    location: "बेंगलुरु",
    author: "Neha Kapoor",
    tags: ["Education", "AI", "Technology"],
    isPublished: true,
    isTrending: false,
    isEditorsPick: true,
    isMostRead: true,
    status: "published",
    publishedAt: new Date(),
  },

  {
    title: "भारतीय स्टार्टअप्स ने ग्लोबल मार्केट पर बढ़ाया फोकस",
    shortDescription: "देश के नए स्टार्टअप अंतरराष्ट्रीय बाजार में अपनी पहचान बनाने की तैयारी कर रहे हैं।",
    content: "भारतीय स्टार्टअप इकोसिस्टम लगातार विस्तार कर रहा है और कई कंपनियां ग्लोबल मार्केट पर ध्यान दे रही हैं।",
    category: "Business",
    thumbnail: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80",
    location: "गुरुग्राम",
    author: "Priya Singh",
    tags: ["Startup", "Business", "India"],
    isPublished: true,
    isTrending: true,
    isEditorsPick: false,
    isMostRead: true,
    status: "published",
    publishedAt: new Date(),
  },

  {
    title: "भारतीय खिलाड़ियों ने अंतरराष्ट्रीय मुकाबलों की तैयारी शुरू की",
    shortDescription: "खिलाड़ी आगामी प्रतियोगिताओं के लिए प्रशिक्षण और फिटनेस पर ध्यान दे रहे हैं।",
    content: "भारतीय खिलाड़ी आगामी अंतरराष्ट्रीय प्रतियोगिताओं को लेकर अपनी तैयारियों में जुटे हुए हैं।",
    category: "Sports",
    thumbnail: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
    location: "नई दिल्ली",
    author: "Aman Gupta",
    tags: ["Sports", "India", "Athletes"],
    isPublished: true,
    isTrending: true,
    isEditorsPick: false,
    isMostRead: true,
    status: "published",
    publishedAt: new Date(),
  },

  {
    title: "मनोरंजन जगत में डिजिटल कंटेंट का बढ़ता प्रभाव",
    shortDescription: "ओटीटी और डिजिटल प्लेटफॉर्म ने मनोरंजन उद्योग को नई दिशा दी है।",
    content: "डिजिटल प्लेटफॉर्म और ऑनलाइन कंटेंट मनोरंजन उद्योग का महत्वपूर्ण हिस्सा बन चुके हैं।",
    category: "Entertainment",
    thumbnail: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80",
    location: "मुंबई",
    author: "Rohit Kumar",
    tags: ["Entertainment", "Digital", "Movies"],
    isPublished: true,
    isTrending: false,
    isEditorsPick: true,
    isMostRead: false,
    status: "published",
    publishedAt: new Date(),
  },

  {
    title: "स्वास्थ्य सेवाओं में डिजिटल प्लेटफॉर्म का इस्तेमाल बढ़ा",
    shortDescription: "डिजिटल सुविधाओं के कारण स्वास्थ्य सेवाओं तक पहुंच आसान हो रही है।",
    content: "डिजिटल हेल्थ प्लेटफॉर्म और ऑनलाइन सेवाओं का इस्तेमाल लगातार बढ़ रहा है।",
    category: "Health",
    thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
    location: "हैदराबाद",
    author: "Sneha Mishra",
    tags: ["Health", "Digital", "India"],
    isPublished: true,
    isTrending: false,
    isEditorsPick: false,
    isMostRead: true,
    status: "published",
    publishedAt: new Date(),
  },

  {
    title: "दुनिया भर में नई टेक्नोलॉजी को लेकर बढ़ी दिलचस्पी",
    shortDescription: "नई तकनीकों का असर कारोबार और आम जीवन दोनों पर दिखाई दे रहा है।",
    content: "दुनिया भर में नई तकनीकों को अपनाने और उनके इस्तेमाल को लेकर लगातार चर्चा हो रही है।",
    category: "World",
    thumbnail: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1200&q=80",
    location: "लंदन",
    author: "Rahul Sharma",
    tags: ["World", "Technology", "Global"],
    isPublished: true,
    isTrending: true,
    isEditorsPick: false,
    isMostRead: false,
    status: "published",
    publishedAt: new Date(),
  },

  {
    title: "भारत में युवाओं के बीच ऑनलाइन सेवाओं का इस्तेमाल बढ़ा",
    shortDescription: "युवा वर्ग पढ़ाई, काम और रोजमर्रा की जरूरतों के लिए डिजिटल सेवाओं का उपयोग कर रहा है।",
    content: "भारत में युवाओं के बीच ऑनलाइन प्लेटफॉर्म और डिजिटल सेवाओं की लोकप्रियता बढ़ रही है।",
    category: "India",
    thumbnail: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80",
    location: "कानपुर",
    author: "Neha Kapoor",
    tags: ["India", "Youth", "Digital"],
    isPublished: true,
    isTrending: false,
    isEditorsPick: true,
    isMostRead: false,
    status: "published",
    publishedAt: new Date(),
  },
];

// बाकी 40 automatically create होंगे
const allNews = [];

for (let i = 0; i < 50; i++) {
  const item = news[i % news.length];

  allNews.push({
    ...item,

    title: `${item.title} - अपडेट ${i + 1}`,

    slug: `news-update-${i + 1}`,

    shortDescription: item.shortDescription,

    content: item.content,

    publishedAt: new Date(
      Date.now() - i * 60 * 60 * 1000
    ),
  });
}

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    await News.deleteMany({});

    await News.insertMany(allNews);

    console.log("✅ 50 News Successfully Saved!");

    process.exit();
  } catch (error) {
    console.log("❌ Error:", error.message);
    process.exit(1);
  }
};
