import React from "react";
import { Header } from "./Header";
import { UpdateBar } from "./UpdateBar";
import { CategoryNavigation } from "./CategoryNavigation";
import { Footer } from "./Footer";
import { Container } from "@/components/ui";

export interface SiteLayoutProps {
  children: React.ReactNode;
  showUpdateBar?: boolean;
  showCategoryNav?: boolean;
  activePath?: string;
}

export const SiteLayout: React.FC<SiteLayoutProps> = ({
  children,
  showUpdateBar = true,
  showCategoryNav = true,
  activePath,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[var(--foreground)] antialiased">
      {/* Skip to Main Content Link for Keyboard Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--primary)] focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none text-xs font-bold"
      >
        Skip to main content
      </a>

      {/* Global Header */}
      <Header activePath={activePath} />

      {/* Latest Alerts Strip */}
      {showUpdateBar && <UpdateBar />}

      {/* Category Scroll Strip */}
      {showCategoryNav && <CategoryNavigation activeHref={activePath} />}

      {/* Main Content Area */}
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

SiteLayout.displayName = "SiteLayout";

export interface ContentWithSidebarProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  className?: string;
  sidebarPosition?: "right" | "left";
}

export const ContentWithSidebar: React.FC<ContentWithSidebarProps> = ({
  children,
  sidebar,
  className = "",
  sidebarPosition = "right",
}) => {
  return (
    <Container size="lg" className={["py-6 sm:py-8", className].filter(Boolean).join(" ")}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Main Content (8 cols on desktop) */}
        <div
          className={[
            "w-full lg:col-span-8 space-y-6",
            sidebarPosition === "left" ? "lg:order-2" : "lg:order-1",
          ].join(" ")}
        >
          {children}
        </div>

        {/* Sidebar (4 cols on desktop, responsive below on mobile) */}
        <aside
          aria-label="Secondary Sidebar"
          className={[
            "w-full lg:col-span-4 space-y-6",
            sidebarPosition === "left" ? "lg:order-1" : "lg:order-2",
          ].join(" ")}
        >
          {sidebar}
        </aside>
      </div>
    </Container>
  );
};

ContentWithSidebar.displayName = "ContentWithSidebar";
