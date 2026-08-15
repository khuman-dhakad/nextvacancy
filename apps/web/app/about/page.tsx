import React from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/ui';

export const metadata: Metadata = {
  title: 'About Us | NEXTVACANCY',
  description:
    "Learn about NEXTVACANCY - India's most trusted government job and recruitment information portal.",
};

const stats = [
  { value: '54,000+', label: 'Active Jobs' },
  { value: '1M+', label: 'Aspirants Served' },
  { value: '100%', label: 'Gazette Verified' },
];

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
              NEXTVACANCY was founded with a singular mission: to eliminate clickbait and misinformation
              in India&apos;s government job recruitment space. We are India&apos;s most trusted recruitment
              information portal, dedicated to providing accurate, gazette-verified circulars to millions
              of aspirants across the country.
            </p>
            <p className="text-slate-700 leading-relaxed">
              In an era where fake notifications and misleading job postings have become rampant, we saw
              the need for a platform that aspirants could rely on completely. Every single notification
              published on NEXTVACANCY is cross-referenced against official government gazettes, official
              recruiting body websites, and authenticated public records before it reaches you.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center"
              >
                <p className="text-4xl font-extrabold text-[#F59E0B] mb-2">{stat.value}</p>
                <p className="text-slate-600 font-medium text-sm uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Mission Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12 mb-8">
            <h2 className="text-2xl font-bold text-[#0F2744] mb-4">Our Mission</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We believe every aspirant deserves accurate, timely, and trustworthy information about
              government job opportunities. Our mission is to be the definitive source for recruitment
              notifications across Central and State government bodies — from UPSC and SSC to Railway
              Recruitment Boards, Banking sector, and State PSCs.
            </p>
            <p className="text-slate-700 leading-relaxed">
              We are committed to maintaining complete editorial independence. NEXTVACANCY is not
              affiliated with any government body, which means our only obligation is to you — the
              aspirant. We do not receive sponsored notifications, and we do not publish unverified
              information regardless of external pressure.
            </p>
          </div>

          {/* Editorial Team Section */}
          <div className="bg-[#0F2744] rounded-2xl p-8 sm:p-12 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Our Editorial Standard</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Our editorial team cross-verifies every notification against official government gazettes
              before publication. This rigorous process ensures that aspirants receive only authentic,
              actionable recruitment information — never rumours, never clickbait.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
              {[
                {
                  title: 'Gazette Verification',
                  desc: 'Every notification is checked against the official Government of India Gazette or respective state gazette.',
                },
                {
                  title: 'Source Attribution',
                  desc: 'We always link back to the official recruiting body\'s website so you can verify directly.',
                },
                {
                  title: 'Timely Updates',
                  desc: 'Our team monitors official portals around the clock to ensure you never miss a deadline.',
                },
                {
                  title: 'No Paid Promotions',
                  desc: 'We do not accept payment to feature or promote any recruitment notification.',
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
