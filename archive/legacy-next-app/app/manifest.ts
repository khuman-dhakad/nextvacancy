import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NEXTVACANCY — Government & Private Jobs Portal",
    short_name: "NEXTVACANCY",
    description:
      "Fast, reliable, and verified recruitment alerts, government jobs (Sarkari Naukri), private vacancies, admit cards, exam dates, and results across India.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0F2744",
    theme_color: "#0F2744",
    categories: ["education", "business", "news", "productivity"],
    lang: "en",
    dir: "ltr",
    prefer_related_applications: false,
    icons: [
      {
        src: "/favicon.ico",
        sizes: "48x48 72x72 96x96 128x128 256x256",
        type: "image/x-icon",
        purpose: "any",
      },
      {
        src: "/favicon.ico",
        sizes: "192x192 512x512",
        type: "image/x-icon",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Government Jobs",
        short_name: "Govt Jobs",
        description: "Latest Sarkari Naukri notifications",
        url: "/government-jobs",
        icons: [{ src: "/favicon.ico", sizes: "96x96" }],
      },
      {
        name: "Private & IT Careers",
        short_name: "Private Jobs",
        description: "Latest tech and corporate vacancies",
        url: "/private-jobs",
        icons: [{ src: "/favicon.ico", sizes: "96x96" }],
      },
      {
        name: "Admit Cards",
        short_name: "Admit Cards",
        description: "Download exam hall tickets",
        url: "/admit-cards",
        icons: [{ src: "/favicon.ico", sizes: "96x96" }],
      },
      {
        name: "Exam Results",
        short_name: "Results",
        description: "Check published scorecards and merit lists",
        url: "/results",
        icons: [{ src: "/favicon.ico", sizes: "96x96" }],
      },
      {
        name: "Search Vacancies",
        short_name: "Search",
        description: "Search all recruitment opportunities",
        url: "/search",
        icons: [{ src: "/favicon.ico", sizes: "96x96" }],
      },
    ],
  };
}
