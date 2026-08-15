import React from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Disclaimer | NEXTVACANCY',
  description:
    'Official disclaimer: NEXTVACANCY is an independent information portal not affiliated with the Government of India, UPSC, SSC, NTA, or any PSC.',
};

export default function DisclaimerPage() {
  return (
    <div className="bg-[#F8FAFC] min-h-screen py-12 sm:py-16">
      <Container>
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0F2744] mb-3">
              Official Disclaimer
            </h1>
            <p className="text-slate-600 leading-relaxed">
              Please read this disclaimer carefully before relying on any information published on NEXTVACANCY.
            </p>
          </div>

          {/* Primary Warning Box */}
          <div className="bg-amber-400 rounded-2xl p-6 sm:p-8 mb-8 border-2 border-amber-500">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white bg-opacity-30 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-amber-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-amber-900 text-lg mb-2 leading-tight">
                  Independent Information Portal — Not a Government Website
                </p>
                <p className="text-amber-900 font-medium leading-relaxed">
                  NEXTVACANCY is an independent information portal. We are{' '}
                  <strong>NOT affiliated with, endorsed by, or officially connected to</strong> the
                  Government of India, UPSC, SSC, NTA, Railway Recruitment Boards, or any State PSC.
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Disclaimer Sections */}
          <div className="space-y-6">

            {/* Nature of Service */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-xl font-bold text-[#0F2744] mb-4 pb-3 border-b border-slate-100">
                Nature of This Portal
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                NEXTVACANCY is a privately operated digital media platform that collects, verifies, and
                publishes information about government and public sector recruitment notifications in India.
                We source our information from official government gazettes, official recruiting body
                portals, and authenticated public records.
              </p>
              <p className="text-slate-700 leading-relaxed">
                While we make every effort to ensure the accuracy and timeliness of all information published
                on this platform, we are not an official government resource. The ultimate authority for any
                recruitment notification rests with the respective recruiting organisation. Aspirants are
                always advised to cross-verify all details — including eligibility criteria, application
                dates, examination dates, and fee structures — directly on the official website of the
                relevant government body.
              </p>
            </div>

            {/* No Official Role */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-xl font-bold text-[#0F2744] mb-4 pb-3 border-b border-slate-100">
                No Official Role in Recruitment
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                NEXTVACANCY does not:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {[
                  'Accept or process job applications',
                  'Issue admit cards or hall tickets',
                  'Conduct examinations or interviews',
                  'Declare or publish official results',
                  'Issue appointment letters or offer letters',
                  'Collect application fees on behalf of any body',
                  'Represent any government department',
                  'Guarantee accuracy of any notification',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    <span className="text-red-500 font-bold text-xs flex-shrink-0">✕</span>
                    <span className="text-sm text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">
                Any entity claiming to represent NEXTVACANCY in an official government capacity is
                fraudulent. Please report such activity to us immediately at{' '}
                <a href="mailto:support@nextvacancy.com" className="text-[#F59E0B] hover:underline">
                  support@nextvacancy.com
                </a>
                .
              </p>
            </div>

            {/* Accuracy Disclaimer */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-xl font-bold text-[#0F2744] mb-4 pb-3 border-b border-slate-100">
                Accuracy &amp; Timeliness
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                We invest significant editorial effort to ensure that every notification on NEXTVACANCY is
                gazette-verified and accurately summarised. However, government notifications can be amended,
                extended, cancelled, or revised at any time without prior notice.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                NEXTVACANCY shall not be held responsible for:
              </p>
              <ul className="list-none space-y-2 text-sm text-slate-700">
                {[
                  'Any loss or damage arising from reliance on information published on this portal.',
                  'Missed application deadlines due to delays in our publication.',
                  'Errors in officially notified information that have been accurately reproduced.',
                  'Changes made by the recruiting body after our publication date.',
                  'Any third-party links we provide to official government portals.',
                ].map((item) => (
                  <li key={item.substring(0, 30)} className="flex items-start gap-2">
                    <span className="text-[#F59E0B] font-bold mt-0.5">•</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Scam Warning */}
            <div className="bg-[#0F2744] rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-4">
                ⚠️ Beware of Fraudulent Entities
              </h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                NEXTVACANCY will never contact you asking for money, personal documents, or payment of
                any kind in exchange for job placement, application assistance, or results. If you
                receive a call, message, or email from anyone claiming to be NEXTVACANCY and asking
                for payment, it is a scam.
              </p>
              <p className="text-slate-300 leading-relaxed mb-4">
                Legitimate government recruitment processes are conducted exclusively through official
                government portals. Application fees, if applicable, are paid directly on official
                government payment gateways — never through third-party portals like NEXTVACANCY.
              </p>
              <div className="bg-white bg-opacity-10 rounded-xl p-4">
                <p className="text-white text-sm font-medium">
                  Report fraud attempts to us:{' '}
                  <a href="mailto:support@nextvacancy.com" className="text-[#F59E0B] hover:underline">
                    support@nextvacancy.com
                  </a>
                </p>
              </div>
            </div>

            {/* Governing Statement */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-xl font-bold text-[#0F2744] mb-4 pb-3 border-b border-slate-100">
                Governing Statement
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                This disclaimer, together with our{' '}
                <a href="/terms" className="text-[#F59E0B] hover:underline">Terms &amp; Conditions</a>{' '}
                and{' '}
                <a href="/privacy-policy" className="text-[#F59E0B] hover:underline">Privacy Policy</a>
                , constitutes the entire agreement between you and NEXTVACANCY regarding the use of this
                platform. By continuing to use NEXTVACANCY, you acknowledge that you have read,
                understood, and accepted this disclaimer.
              </p>
              <p className="text-slate-700 leading-relaxed text-sm">
                This disclaimer is governed by the laws of India and is subject to periodic revision.
                The most current version will always be available at nextvacancy.com/disclaimer.
              </p>
            </div>

          </div>
        </div>
      </Container>
    </div>
  );
}
