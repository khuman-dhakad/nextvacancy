import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NEXTVACANCY — Government & Private Jobs Portal",
    short_name: "NEXTVACANCY",
    description:
      "Fast, reliable, and verified recruitment alerts, government jobs (Sarkari Naukri), private vacancies, admit cards, exam dates, and results across India.",
    start_url: "/",
    display: "standalone",
    background_color: "#0F2744",
    theme_color: "#0F2744",
    orientation: "portrait",
    categories: ["education", "business", "news"],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
