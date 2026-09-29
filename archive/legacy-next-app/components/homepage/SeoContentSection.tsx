import React from "react";
import { Container } from "@/components/ui";

export const SeoContentSection: React.FC = () => {
  return (
    <section
      aria-labelledby="seo-overview-heading"
      className="py-8 sm:py-10 bg-white border-t border-[var(--border)] text-slate-700 text-xs sm:text-sm leading-relaxed"
    >
      <Container size="lg" className="space-y-6 max-w-5xl">
        <div className="space-y-2">
          <h2 id="seo-overview-heading" className="text-base sm:text-xl font-bold text-slate-900 tracking-tight">
            Latest Government Jobs (Sarkari Naukri), Exam Alerts & Career Opportunities in India
          </h2>
          <p className="text-slate-600">
            Welcome to <strong>NEXTVACANCY</strong>, your comprehensive destination for authentic recruitment updates, competitive examination schedules, hall tickets, and declared results across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900">
              Central & State Government Recruitments
            </h3>
            <p>
              We provide timely updates for major central recruitment agencies including the Staff Selection Commission (SSC CGL, CHSL, MTS, GD), Union Public Service Commission (UPSC Civil Services, NDA, CDS), Railway Recruitment Boards (RRB NTPC, Group D, ALP), and Banking boards (IBPS PO, Clerk, SBI, RBI). Candidates can access detailed post breakdowns, category-wise vacancies, age relaxations, and direct application links.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900">
              Admit Cards, Hall Tickets & Exam City Slips
            </h3>
            <p>
              Never miss an examination schedule. Our exam corner tracks official release dates for computer-based tests (CBT), written examinations, physical endurance tests (PET/PST), and interview call letters with step-by-step instructions on downloading hall tickets using registration numbers and date of birth.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900">
              Exam Results, Cut-Off Marks & Merit Lists
            </h3>
            <p>
              Access verified scorecards, qualifying cut-off marks, normalized marks calculations, and roll-number wise final merit lists published by government testing authorities and universities.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900">
              National Scholarships & PM Internship Schemes
            </h3>
            <p>
              Explore government financial assistance initiatives such as the National Scholarship Portal (NSP) schemes, state higher education grants, and the Prime Minister&apos;s Internship Scheme offering paid corporate internships with monthly stipends.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};

SeoContentSection.displayName = "SeoContentSection";
