export const featuredStories = [
  {
    id: 1,
    category: "Top Story",
    title: "Coastal cities move to climate-smart infrastructure after rare twin storms",
    summary:
      "Urban planners roll out resilient transit corridors and flood-ready housing blocks in record time.",
    readTime: "6 min read"
  },
  {
    id: 2,
    category: "Political Desk",
    title: "Election watchdog launches public tracker for manifesto promises",
    summary:
      "The open dashboard follows 300+ campaign commitments across states with weekly updates.",
    readTime: "4 min read"
  },
  {
    id: 3,
    category: "Investigations",
    title: "Inside the cross-border semiconductor race shaping Asia's supply chain",
    summary:
      "New incentives, logistics hubs, and R&D alliances are redrawing the balance of power.",
    readTime: "8 min read"
  }
];

export const horoscopeItems = [
  "Aries", "Taurus", "Gemini", "Cancer",
  "Leo", "Virgo", "Libra", "Scorpio",
  "Sagittarius", "Capricorn", "Aquarius", "Pisces"
].map((sign, index) => ({
  sign,
  prediction: [
    "A strong day for brave calls and clean conversations.",
    "Money matters settle when you choose patience over speed.",
    "A fresh contact opens a smart new direction.",
    "Home and routine deserve more attention today."
  ][index % 4]
}));

export const categoryStories = {
  World: [
    "Aid corridors reopen after regional ceasefire talks",
    "Summit pushes AI governance framework across 40 nations",
    "Shipping insurers revise Red Sea risk models"
  ],
  Business: [
    "EV finance startups lower rates for fleet operators",
    "Retail majors test bilingual shopping assistants",
    "Gold steadies as bond yields cool"
  ],
  Tech: [
    "Consumer robotics enters the affordable home market",
    "Open-source browser engine gets enterprise backing",
    "Chipmakers unveil smaller on-device AI packages"
  ]
};

export const videoFeed = [
  {
    title: "Market Wrap: Banking, energy, and rupee outlook in 3 minutes",
    duration: "03:20"
  },
  {
    title: "Ground Report: Inside the monsoon preparedness drills",
    duration: "05:40"
  },
  {
    title: "Explainer: Why satellite internet pricing is shifting",
    duration: "04:15"
  }
];

export const trendingNews = [
  "Cabinet clears expansion of national logistics corridor",
  "Metro line trials begin ahead of festive season",
  "Rain deficit narrows as late showers reach central belt",
  "Cricket board approves expanded women’s domestic calendar",
  "Startups pitch regional-language copilots to banks"
];

export const articleRows = [
  {
    titleEn: "Cabinet clears riverfront mobility project",
    titleHi: "कैबिनेट ने रिवरफ्रंट मोबिलिटी प्रोजेक्ट को मंजूरी दी",
    author: "Ritika Sen",
    time: "10 min ago",
    status: "PUBLISHED"
  },
  {
    titleEn: "Gold edges higher as treasury yields soften",
    titleHi: "ट्रेजरी यील्ड नरम पड़ने से सोना मजबूत हुआ",
    author: "Aman Kapoor",
    time: "32 min ago",
    status: "PUBLISHED"
  },
  {
    titleEn: "State boards adopt AI literacy in new curriculum",
    titleHi: "राज्य बोर्ड ने नए पाठ्यक्रम में एआई साक्षरता जोड़ी",
    author: "Neha Arora",
    time: "1 hr ago",
    status: "PUBLISHED"
  },
  {
    titleEn: "Airport cargo zone records highest quarterly throughput",
    titleHi: "एयरपोर्ट कार्गो ज़ोन ने सबसे अधिक तिमाही थ्रूपुट दर्ज किया",
    author: "Vikram Dutta",
    time: "2 hr ago",
    status: "PUBLISHED"
  }
];

export const adminStats = [
  {
    label: "Total News",
    value: "1,284",
    accent: "bg-pastel-peach text-slate-900"
  },
  {
    label: "E-Papers",
    value: "54",
    accent: "bg-pastel-mint text-slate-900"
  },
  {
    label: "Highlights",
    value: "212",
    accent: "bg-pastel-sky text-slate-900"
  },
  {
    label: "Categories",
    value: "18",
    accent: "bg-pastel-lilac text-slate-900"
  }
];
