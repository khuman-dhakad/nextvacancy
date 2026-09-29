import React from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Contact Us | NEXTVACANCY',
  description:
    'Get in touch with the NEXTVACANCY team for support, grievances, or editorial queries.',
};

export default function ContactPage() {
  return (
    <div className="bg-[#F8FAFC] min-h-screen py-12 sm:py-16">
      <Container>
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0F2744] mb-3">
              Contact &amp; Support
            </h1>
            <p className="text-slate-600 leading-relaxed">
              Have a question, found an error in a listing, or need editorial support? We&apos;re here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* Left Column — Contact Info */}
            <div className="lg:col-span-2 space-y-6">

              {/* Email Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-[#0F2744] mb-4">Contact Information</h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-0.5">Email</p>
                      <a
                        href="mailto:support@nextvacancy.com"
                        className="text-[#0F2744] font-medium hover:text-[#F59E0B] transition-colors text-sm"
                      >
                        support@nextvacancy.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-0.5">Response Time</p>
                      <p className="text-[#0F2744] font-medium text-sm">Within 24 hours</p>
                      <p className="text-slate-500 text-xs mt-0.5">Mon–Sat, 9 AM – 6 PM IST</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grievance Notice */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-[#0F2744] mb-3">Grievance Redressal</h2>
                <p className="text-slate-600 text-sm leading-relaxed mb-3">
                  If you believe any recruitment notification on NEXTVACANCY is inaccurate, outdated, or
                  misleading, please write to us immediately. We take editorial accuracy very seriously and
                  will investigate all reported discrepancies within 24 working hours.
                </p>
                <p className="text-slate-500 text-xs leading-relaxed">
                  <strong className="text-slate-600">Disclaimer:</strong> NEXTVACANCY is an independent
                  information portal. We are not affiliated with any government body. For official
                  government grievances, please contact the respective recruiting organisation directly.
                </p>
              </div>

              {/* Editorial Queries */}
              <div className="bg-[#0F2744] rounded-2xl p-6">
                <h2 className="text-base font-semibold text-white mb-2">Editorial Queries</h2>
                <p className="text-slate-300 text-sm leading-relaxed">
                  For press, partnerships, or editorial collaboration, please mention &ldquo;Editorial&rdquo; in
                  your subject line. We endeavour to respond to all partnership queries within 48 hours.
                </p>
              </div>

            </div>

            {/* Right Column — Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <h2 className="text-xl font-semibold text-[#0F2744] mb-6">Send Us a Message</h2>

                <form className="space-y-5" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="contact-name" className="block text-sm font-medium text-slate-700 mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        name="name"
                        placeholder="Ramesh Kumar"
                        autoComplete="name"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-sm font-medium text-slate-700 mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="block text-sm font-medium text-slate-700 mb-1.5">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="contact-subject"
                      name="subject"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition bg-white"
                    >
                      <option value="">Select a subject</option>
                      <option value="inaccurate-listing">Inaccurate Job Listing</option>
                      <option value="missing-notification">Missing Notification</option>
                      <option value="technical-issue">Technical Issue</option>
                      <option value="account-support">Account Support</option>
                      <option value="editorial">Editorial / Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-sm font-medium text-slate-700 mb-1.5">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={6}
                      placeholder="Please describe your query in detail. If reporting an inaccurate listing, include the job title and URL."
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#F59E0B] hover:bg-amber-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-sm"
                  >
                    Send Message
                  </button>

                  <p className="text-xs text-slate-400 text-center">
                    By submitting this form you agree to our{' '}
                    <a href="/privacy-policy" className="underline hover:text-slate-600">Privacy Policy</a>.
                    We will never share your information with third parties.
                  </p>
                </form>
              </div>
            </div>

          </div>
        </div>
      </Container>
    </div>
  );
}
