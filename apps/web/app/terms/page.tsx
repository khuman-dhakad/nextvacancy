import React from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Terms & Conditions | NEXTVACANCY',
  description:
    'Read the Terms & Conditions governing your use of the NEXTVACANCY recruitment information portal.',
};

const sections = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    content: (
      <p className="text-slate-700 leading-relaxed">
        By accessing or using the NEXTVACANCY website (nextvacancy.com) or any of its associated
        services, you agree to be bound by these Terms &amp; Conditions (&ldquo;Terms&rdquo;) and our{' '}
        <a href="/privacy-policy" className="text-[#F59E0B] hover:underline">Privacy Policy</a>.
        If you do not agree to these Terms, you must immediately discontinue use of the platform.
        These Terms apply to all visitors, registered users, and anyone who accesses or uses our services
        in any capacity. We reserve the right to update these Terms at any time, and continued use of
        the platform after changes constitutes acceptance of the revised Terms.
      </p>
    ),
  },
  {
    id: 'service-description',
    title: '2. Service Description',
    content: (
      <>
        <p className="text-slate-700 leading-relaxed mb-4">
          NEXTVACANCY is an independent online information portal that aggregates, verifies, and
          publishes recruitment notifications, job alerts, and related information concerning government
          and public sector employment opportunities in India.
        </p>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4">
          <p className="text-sm font-semibold text-[#0F2744] mb-2">Important Notice</p>
          <p className="text-sm text-slate-700 leading-relaxed">
            NEXTVACANCY is <strong>not affiliated with, endorsed by, or officially connected to</strong> the
            Government of India, UPSC, SSC, NTA, any Railway Recruitment Board, any State Public Service
            Commission, or any other government or semi-government body. We are a private information
            portal only.
          </p>
        </div>
        <p className="text-slate-700 leading-relaxed">
          The platform does not process job applications, conduct examinations, issue admit cards,
          publish results, or perform any official government function. All such activities must be
          conducted directly through the respective official government websites.
        </p>
      </>
    ),
  },
  {
    id: 'user-responsibilities',
    title: '3. User Responsibilities',
    content: (
      <>
        <p className="text-slate-700 leading-relaxed mb-3">
          By using NEXTVACANCY, you agree to the following responsibilities:
        </p>
        <ul className="list-none space-y-3">
          {[
            'You will verify all recruitment information directly on the official website of the relevant government body before taking any action (applying, paying fees, etc.).',
            'You will not use the platform for any unlawful, fraudulent, or harmful purpose.',
            'You will not attempt to reverse-engineer, scrape, copy, or redistribute NEXTVACANCY\'s content without express written permission.',
            'You will not submit false, misleading, or defamatory content through our contact or feedback forms.',
            'You are responsible for maintaining the security of your account credentials and for all activity that occurs under your account.',
            'You will not impersonate any government official, government body, or NEXTVACANCY team member.',
          ].map((item) => (
            <li key={item.substring(0, 30)} className="flex items-start gap-3 text-sm text-slate-700">
              <span className="text-[#F59E0B] font-bold mt-0.5 flex-shrink-0">•</span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: 'intellectual-property',
    title: '4. Intellectual Property',
    content: (
      <>
        <p className="text-slate-700 leading-relaxed mb-3">
          All content on NEXTVACANCY — including but not limited to text, graphics, logos, icons,
          editorial write-ups, and the overall platform design — is the intellectual property of
          NEXTVACANCY and is protected under applicable Indian and international copyright laws.
        </p>
        <p className="text-slate-700 leading-relaxed mb-3">
          You may share individual notification links for personal, non-commercial purposes, provided
          you clearly attribute NEXTVACANCY as the source. You may not reproduce, redistribute, or
          commercially exploit any content without prior written consent from NEXTVACANCY.
        </p>
        <p className="text-slate-700 leading-relaxed text-sm">
          Official government notifications and gazette extracts reproduced on this platform remain the
          property of the respective government bodies and are reproduced here for public information
          purposes only, in accordance with applicable Indian government opendata policies.
        </p>
      </>
    ),
  },
  {
    id: 'disclaimer-warranties',
    title: '5. Disclaimer of Warranties',
    content: (
      <>
        <p className="text-slate-700 leading-relaxed mb-3">
          NEXTVACANCY provides its services on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis.
          While we make every effort to ensure the accuracy and timeliness of information published on
          this platform, we make no representations or warranties, express or implied, regarding:
        </p>
        <ul className="list-none space-y-2 mb-3">
          {[
            'The completeness, accuracy, or reliability of any recruitment notification or information.',
            'The uninterrupted or error-free operation of the platform.',
            'The suitability of any content for any particular purpose.',
          ].map((item) => (
            <li key={item.substring(0, 30)} className="flex items-start gap-2 text-sm text-slate-700">
              <span className="text-[#F59E0B] font-bold mt-0.5">–</span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
        <p className="text-slate-700 text-sm leading-relaxed">
          Always verify information directly with the official government portal of the recruiting
          organisation before submitting an application or making any payment.
        </p>
      </>
    ),
  },
  {
    id: 'limitation-liability',
    title: '6. Limitation of Liability',
    content: (
      <p className="text-slate-700 leading-relaxed">
        To the maximum extent permitted by applicable law, NEXTVACANCY, its founders, employees, and
        affiliates shall not be liable for any direct, indirect, incidental, consequential, or punitive
        damages arising from your use of, or inability to use, the platform or any content therein —
        including but not limited to damages arising from missed application deadlines, incorrect fees
        paid, or reliance on unverified information. Your sole remedy for dissatisfaction with any
        aspect of the platform is to discontinue its use. These limitations apply regardless of the
        legal theory under which damages are sought.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <div className="bg-[#F8FAFC] min-h-screen py-12 sm:py-16">
      <Container>
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12 mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0F2744] mb-3">
              Terms &amp; Conditions
            </h1>
            <p className="text-sm text-slate-500">
              Last updated: <time dateTime="2026-01-01">January 1, 2026</time>
            </p>
            <p className="text-slate-700 leading-relaxed mt-4 text-sm">
              Please read these Terms &amp; Conditions carefully before using NEXTVACANCY. These Terms
              constitute a legally binding agreement between you and NEXTVACANCY governing your use of
              the platform and services.
            </p>
          </div>

          {/* Table of Contents */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Table of Contents
            </h2>
            <ol className="list-none space-y-1.5">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="text-sm text-[#0F2744] hover:text-[#F59E0B] transition-colors"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>

          {/* Sections */}
          <div className="space-y-6">
            {sections.map((section) => (
              <div
                key={section.id}
                id={section.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8"
              >
                <h2 className="text-xl font-bold text-[#0F2744] mb-4 pb-3 border-b border-slate-100">
                  {section.title}
                </h2>
                {section.content}
              </div>
            ))}
          </div>

          {/* Governing Law */}
          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-base font-semibold text-[#0F2744] mb-2">Governing Law</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              These Terms are governed by and construed in accordance with the laws of India. Any disputes
              arising under these Terms shall be subject to the exclusive jurisdiction of the courts of
              New Delhi, India.
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-slate-500 text-sm">
              Questions about these Terms?{' '}
              <a href="/contact" className="text-[#F59E0B] hover:underline font-medium">
                Contact us
              </a>
            </p>
          </div>

        </div>
      </Container>
    </div>
  );
}
