import React from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Privacy Policy | NEXTVACANCY',
  description:
    'Read the NEXTVACANCY Privacy Policy to understand how we collect, use, and protect your personal information.',
};

const sections = [
  {
    id: 'information-we-collect',
    title: '1. Information We Collect',
    content: (
      <>
        <p className="text-slate-700 leading-relaxed mb-3">
          We collect information to provide and improve our services. The types of data we collect include:
        </p>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-[#0F2744] mb-1">Account Data</h3>
            <p className="text-slate-700 leading-relaxed text-sm">
              When you create an account, we collect your name, email address, and password (stored in
              encrypted form). You may optionally provide your phone number, state of residence, and
              preferred job categories to personalise your experience.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-[#0F2744] mb-1">Usage Data</h3>
            <p className="text-slate-700 leading-relaxed text-sm">
              We automatically collect information about how you interact with NEXTVACANCY — including
              pages visited, search queries entered, job notifications viewed, links clicked, device
              type, browser type, IP address, and timestamps. This data is used solely to improve our
              platform and is not sold to third parties.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-[#0F2744] mb-1">Communications Data</h3>
            <p className="text-slate-700 leading-relaxed text-sm">
              If you contact us via email or the contact form, we retain your message and contact
              details for the purpose of responding to your query and maintaining support records.
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'how-we-use',
    title: '2. How We Use Your Information',
    content: (
      <>
        <p className="text-slate-700 leading-relaxed mb-3">
          Your information is used exclusively for the following purposes:
        </p>
        <ul className="list-none space-y-2">
          {[
            'To create and manage your NEXTVACANCY account.',
            'To send you personalised job alerts and recruitment notifications based on your preferences.',
            'To respond to your support queries and grievances.',
            'To analyse platform usage and improve our content and features.',
            'To send important service-related communications (e.g., policy updates).',
            'To detect and prevent fraud, abuse, or illegal activity on the platform.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
              <span className="text-[#F59E0B] font-bold mt-0.5">→</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="text-slate-700 leading-relaxed text-sm mt-3">
          We do <strong>not</strong> sell, rent, or trade your personal information to third parties for
          marketing purposes.
        </p>
      </>
    ),
  },
  {
    id: 'data-security',
    title: '3. Data Security',
    content: (
      <p className="text-slate-700 leading-relaxed">
        We implement industry-standard security measures to protect your personal information, including
        TLS/SSL encryption for data in transit, bcrypt hashing for passwords, and access controls that
        limit employee access to personal data on a need-to-know basis. While we take all reasonable
        precautions, no method of transmission over the internet or electronic storage is 100% secure.
        We encourage you to use a strong, unique password and to keep your login credentials confidential.
      </p>
    ),
  },
  {
    id: 'cookies',
    title: '4. Cookies',
    content: (
      <>
        <p className="text-slate-700 leading-relaxed mb-3">
          NEXTVACANCY uses cookies and similar tracking technologies to enhance your browsing experience.
          We use:
        </p>
        <ul className="list-none space-y-2 mb-3">
          {[
            { type: 'Essential Cookies', desc: 'Required for the platform to function (e.g., session management, authentication).' },
            { type: 'Analytics Cookies', desc: 'Help us understand how visitors interact with the platform so we can improve it.' },
            { type: 'Preference Cookies', desc: 'Remember your settings and personalisation choices.' },
          ].map((item) => (
            <li key={item.type} className="text-sm text-slate-700">
              <span className="font-semibold text-[#0F2744]">{item.type}: </span>
              {item.desc}
            </li>
          ))}
        </ul>
        <p className="text-slate-700 text-sm leading-relaxed">
          You can control or disable cookies through your browser settings. Note that disabling essential
          cookies may affect the functionality of the platform.
        </p>
      </>
    ),
  },
  {
    id: 'third-party-links',
    title: '5. Third-Party Links',
    content: (
      <p className="text-slate-700 leading-relaxed">
        NEXTVACANCY contains links to external websites including official government portals, recruiting
        body websites, and gazette resources. These links are provided for your convenience and
        verification purposes. We are not responsible for the privacy practices or content of any
        third-party websites. We encourage you to review the privacy policies of any external sites you visit.
      </p>
    ),
  },
  {
    id: 'contact-us',
    title: '6. Contact Us',
    content: (
      <p className="text-slate-700 leading-relaxed">
        If you have any questions, concerns, or requests regarding this Privacy Policy or the handling
        of your personal data, please contact our Data Protection team at{' '}
        <a href="mailto:support@nextvacancy.com" className="text-[#F59E0B] hover:underline font-medium">
          support@nextvacancy.com
        </a>
        . We will respond to all privacy-related queries within 5 working days.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#F8FAFC] min-h-screen py-12 sm:py-16">
      <Container>
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12 mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0F2744] mb-3">
              Privacy Policy
            </h1>
            <p className="text-sm text-slate-500">
              Last updated: <time dateTime="2026-01-01">January 1, 2026</time>
            </p>
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-sm text-amber-800 leading-relaxed">
                Your privacy matters to us. This policy explains what data NEXTVACANCY collects, how it is
                used, and the choices you have. Please read it carefully. By using NEXTVACANCY, you agree
                to the practices described herein.
              </p>
            </div>
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

          {/* Footer Note */}
          <div className="mt-8 bg-[#0F2744] rounded-2xl p-6 text-center">
            <p className="text-slate-300 text-sm leading-relaxed">
              This Privacy Policy may be updated from time to time. We will notify registered users of
              material changes via email. Continued use of NEXTVACANCY after changes constitutes
              acceptance of the updated policy.
            </p>
          </div>

        </div>
      </Container>
    </div>
  );
}
