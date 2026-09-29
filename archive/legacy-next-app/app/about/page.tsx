import React from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/ui';

export const metadata: Metadata = {
  title: 'About Us | NEXTVACANCY',
  description:
    "Learn about NEXTVACANCY, an informational portal for job listings and recruitment details.",
};

export default function AboutPage() {
  return (
    <div className="bg-[#F8FAFC] min-h-screen py-12 sm:py-16">
      <Container>
        <div className="max-w-4xl mx-auto">

          {/* Hero Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12 mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0F2744] mb-6">
              About NEXTVACANCY
            </h1>
            <p className="text-slate-700 leading-relaxed text-lg mb-4">
              NEXTVACANCY is an informational portal for government and private
              job listings, recruitment details, and exam updates.
            </p>
            <p className="text-slate-700 leading-relaxed">
              Recruitment information and dates can change. Confirm eligibility,
              deadlines, and application instructions with the recruiting
              organization&apos;s official notice before taking action.
            </p>
          </div>

          {/* Mission Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12 mb-8">
            <h2 className="text-2xl font-bold text-[#0F2744] mb-4">Our Mission</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We aim to make recruitment listings and related information easier
              to browse across government and private organizations.
            </p>
            <p className="text-slate-700 leading-relaxed">
              NEXTVACANCY is not a government body. Official recruiting
              organizations remain the authority for notices, eligibility, and
              application decisions.
            </p>
          </div>

          {/* Editorial Team Section */}
          <div className="bg-[#0F2744] rounded-2xl p-8 sm:p-12 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Using Recruitment Information</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Use the information on this site as a starting point, then verify
              current requirements and deadlines directly with the recruiting
              organization.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
              {[
                {
                  title: 'Gazette Verification',
                  desc: 'Compare relevant notices with the official Government or state gazette.',
                },
                {
                  title: 'Source Attribution',
                  desc: 'Use the recruiting organization\'s official website to confirm details.',
                },
                {
                  title: 'Deadline Changes',
                  desc: 'Check the official portal for changes to dates and application requirements.',
                },
                {
                  title: 'Application Safety',
                  desc: "Submit applications through the recruiting organization's official channels.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-3">
                  <span className="text-[#F59E0B] text-xl mt-0.5">✓</span>
                  <div>
                    <p className="text-white font-semibold mb-1">{item.title}</p>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Values Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12">
            <h2 className="text-2xl font-bold text-[#0F2744] mb-6">What We Stand For</h2>
            <div className="space-y-5">
              {[
                {
                  title: 'Accuracy First',
                  desc: 'We would rather publish late than publish wrong. Editorial accuracy is non-negotiable.',
                },
                {
                  title: 'Aspirant-Centric',
                  desc: 'Every product and editorial decision is made with one question in mind: does this help the aspirant?',
                },
                {
                  title: 'Transparency',
                  desc: 'We are clear about what we are: an information portal, not a government body. We never mislead.',
                },
                {
                  title: 'Accessibility',
                  desc: 'Quality recruitment information should be free and accessible to every aspirant, regardless of location or background.',
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 pb-5 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="w-1 bg-[#F59E0B] rounded-full flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-[#0F2744] mb-1">{item.title}</p>
                    <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </Container>
    </div>
  );
}
