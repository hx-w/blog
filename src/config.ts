export const SITE = {
  website: "https://blog.scubot.com", // 替换为你部署后的 Netlify 域名
  author: "Carol",
  profile: "https://github.com/hx-w",
  desc: "口腔医疗设计技术、工程与创业笔记",
  title: "Carol's Blog",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: false,
    text: "编辑此页",
    url: "https://github.com/hx-w/blog/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "zh-CN", // html lang code. Set this empty and default will be "en"
  timezone: "Asia/Shanghai", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
