import { JobPosting } from "@/types";

export const MOCK_JOB_POSTINGS: JobPosting[] = [
  // 1. SSC CGL 2026
  {
    id: "job-1",
    slug: "ssc-cgl-2026-recruitment",
    title: "SSC CGL 2026 Recruitment for 14,582 Group B & C Vacancies",
    shortSummary:
      "Staff Selection Commission (SSC) invites online applications for Combined Graduate Level (CGL) Examination 2026 for 14,582 posts including Assistant Section Officer, Inspector, and Tax Assistant.",
    organization: "Staff Selection Commission",
    organizationLogo: "",
    department: "Department of Personnel & Training (DoPT)",
    category: "government",
    status: "OPEN",
    location: "All India",
    totalVacancies: 14582,
    salaryOrStipend: "Pay Level 4 to Level 8 (₹25,500 - ₹1,51,100)",
    qualificationSummary: "Bachelor's Degree in any discipline from a recognized university",
    importantDates: {
      notificationDate: "2026-06-15",
      applicationStartDate: "2026-06-15",
      applicationEndDate: "2026-07-24",
      lastDateFeePayment: "2026-07-25",
      examDate: "September - October 2026",
    },
    feeStructure: {
      general: "₹100",
      obcEws: "₹100",
      scStPwd: "Nil (Exempted)",
      female: "Nil (Exempted)",
      paymentMode: "Online via UPI, Net Banking, Debit/Credit Card",
    },
    ageLimit: {
      minAge: 18,
      maxAge: 32,
      asOnDate: "01-08-2026",
      relaxationNotes: "OBC: 3 yrs, SC/ST: 5 yrs, PwD: 10 yrs as per government rules",
    },
    importantLinks: [
      {
        label: "Apply Online (Official SSC Portal)",
        url: "https://ssc.gov.in",
        linkType: "apply_online",
        isExternal: true,
      },
      {
        label: "Download Official Notification PDF",
        url: "https://ssc.gov.in/notices",
        linkType: "official_notification_pdf",
        isExternal: true,
      },
    ],
    viewsCount: 48520,
    isFeatured: true,
    isTrending: true,
    isVerified: true,
    createdAt: "2026-06-15T10:00:00Z",
    updatedAt: "2026-06-16T14:30:00Z",
  },

  // 2. UPSC Civil Services
  {
    id: "job-2",
    slug: "upsc-civil-services-2026-prelims",
    title: "UPSC Civil Services Examination (CSE) 2026 — IAS / IPS / IFS",
    shortSummary:
      "Union Public Service Commission (UPSC) has notified 1,056 vacancies for Indian Administrative Service, Indian Police Service, and Indian Foreign Service through CSE 2026.",
    organization: "Union Public Service Commission",
    department: "Cabinet Secretariat",
    category: "government",
    status: "OPEN",
    location: "All India",
    totalVacancies: 1056,
    salaryOrStipend: "Pay Level 10 (₹56,100 - ₹1,77,500) + DA, HRA",
    qualificationSummary: "Graduation degree in any stream from a UGC recognized university",
    importantDates: {
      notificationDate: "2026-02-14",
      applicationStartDate: "2026-02-14",
      applicationEndDate: "2026-03-05",
      examDate: "2026-05-24",
    },
    feeStructure: {
      general: "₹100",
      obcEws: "₹100",
      scStPwd: "Nil",
      female: "Nil",
      paymentMode: "Online / SBI Challan",
    },
    ageLimit: {
      minAge: 21,
      maxAge: 32,
      asOnDate: "01-08-2026",
    },
    importantLinks: [
      {
        label: "UPSC OTR & Online Application",
        url: "https://upsconline.nic.in",
        linkType: "apply_online",
        isExternal: true,
      },
    ],
    viewsCount: 89400,
    isFeatured: true,
    isTrending: true,
    isVerified: true,
    createdAt: "2026-02-14T09:00:00Z",
    updatedAt: "2026-02-14T09:00:00Z",
  },

  // 3. RRB NTPC
  {
    id: "job-3",
    slug: "rrb-ntpc-2026-graduate-recruitment",
    title: "RRB NTPC 2026 Recruitment for 11,558 Graduate & Under-Graduate Posts",
    shortSummary:
      "Railway Recruitment Boards (RRB) Centralized Employment Notice (CEN 05/2026) for Station Master, Goods Train Manager, Junior Clerk, and Commercial Apprentice.",
    organization: "Railway Recruitment Control Board",
    department: "Ministry of Railways",
    category: "government",
    status: "ENDING_SOON",
    location: "All India",
    totalVacancies: 11558,
    salaryOrStipend: "7th CPC Level 2 to Level 6 (₹19,900 - ₹35,400 Basic)",
    qualificationSummary: "12th Pass or Bachelor's Degree depending on post",
    importantDates: {
      notificationDate: "2026-09-10",
      applicationStartDate: "2026-09-14",
      applicationEndDate: "2026-10-13",
      examDate: "December 2026 - January 2027",
    },
    feeStructure: {
      general: "₹500 (₹400 refundable after CBT-1)",
      obcEws: "₹500 (₹400 refundable after CBT-1)",
      scStPwd: "₹250 (Full refund after CBT-1)",
      female: "₹250 (Full refund after CBT-1)",
    },
    ageLimit: {
      minAge: 18,
      maxAge: 33,
      asOnDate: "01-01-2026",
    },
    importantLinks: [
      {
        label: "Apply via Official RRB Apply Portal",
        url: "https://www.rrbapply.gov.in",
        linkType: "apply_online",
        isExternal: true,
      },
    ],
    viewsCount: 65120,
    isFeatured: true,
    isTrending: true,
    isVerified: true,
    createdAt: "2026-09-10T12:00:00Z",
    updatedAt: "2026-09-12T16:00:00Z",
  },

  // 4. IBPS PO
  {
    id: "job-4",
    slug: "ibps-po-xiv-recruitment-2026",
    title: "IBPS PO / MT XIV 2026 Recruitment for 4,455 Probationary Officers",
    shortSummary:
      "Institute of Banking Personnel Selection (IBPS) announces Common Recruitment Process (CRP PO/MT-XIV) for Probationary Officers in 11 participating public sector banks.",
    organization: "Institute of Banking Personnel Selection",
    department: "Public Sector Banks",
    category: "government",
    status: "ENDING_SOON",
    location: "All India",
    totalVacancies: 4455,
    salaryOrStipend: "₹52,000 - ₹58,000 / month gross CTC",
    qualificationSummary: "Any Graduate degree from recognized University",
    importantDates: {
      notificationDate: "2026-08-01",
      applicationStartDate: "2026-08-01",
      applicationEndDate: "2026-08-21",
      examDate: "October 2026 (Prelims), November 2026 (Mains)",
    },
    feeStructure: {
      general: "₹850",
      obcEws: "₹850",
      scStPwd: "₹175",
    },
    ageLimit: {
      minAge: 20,
      maxAge: 30,
      asOnDate: "01-08-2026",
    },
    importantLinks: [
      {
        label: "IBPS Online Registration",
        url: "https://ibps.in",
        linkType: "apply_online",
        isExternal: true,
      },
    ],
    viewsCount: 34100,
    isFeatured: false,
    isTrending: true,
    isVerified: true,
    createdAt: "2026-08-01T08:30:00Z",
    updatedAt: "2026-08-02T10:00:00Z",
  },

  // 5. SBI Clerk
  {
    id: "job-5",
    slug: "sbi-junior-associates-clerk-2026",
    title: "SBI Clerk 2026 Recruitment for 8,283 Junior Associates (Customer Support)",
    shortSummary:
      "State Bank of India invites online applications for 8,283 posts of Junior Associates in Clerical Cadre across state circles.",
    organization: "State Bank of India",
    department: "Central Recruitment & Promotion Department",
    category: "government",
    status: "OPEN",
    location: "All India",
    totalVacancies: 8283,
    salaryOrStipend: "₹32,000 - ₹37,000 / month approx",
    qualificationSummary: "Graduation in any discipline",
    importantDates: {
      notificationDate: "2026-11-15",
      applicationStartDate: "2026-11-17",
      applicationEndDate: "2026-12-07",
    },
    feeStructure: {
      general: "₹750",
      obcEws: "₹750",
      scStPwd: "Nil",
    },
    ageLimit: {
      minAge: 20,
      maxAge: 28,
      asOnDate: "01-04-2026",
    },
    importantLinks: [
      {
        label: "SBI Careers Portal",
        url: "https://sbi.co.in/careers",
        linkType: "apply_online",
        isExternal: true,
      },
    ],
    viewsCount: 52100,
    isFeatured: false,
    isTrending: true,
    isVerified: true,
    createdAt: "2026-11-15T09:00:00Z",
    updatedAt: "2026-11-15T09:00:00Z",
  },

  // 6. SSC CHSL 10+2
  {
    id: "job-6-chsl",
    slug: "ssc-chsl-2026-recruitment-10-plus-2",
    title: "SSC CHSL (10+2) 2026 Recruitment for 3,712 LDC, JSA & DEO Posts",
    shortSummary:
      "Staff Selection Commission (SSC) Combined Higher Secondary Level (10+2) Examination 2026 for Lower Divisional Clerk, Junior Secretariat Assistant, and Data Entry Operator.",
    organization: "Staff Selection Commission",
    department: "Central Government Ministries",
    category: "government",
    status: "OPEN",
    location: "All India",
    totalVacancies: 3712,
    salaryOrStipend: "Pay Level 2 & Level 4 (₹19,900 - ₹81,100)",
    qualificationSummary: "12th Standard or equivalent from a recognized board",
    importantDates: {
      notificationDate: "2026-04-02",
      applicationStartDate: "2026-04-08",
      applicationEndDate: "2026-05-07",
      examDate: "July 2026",
    },
    importantLinks: [
      {
        label: "Apply via SSC Portal",
        url: "https://ssc.gov.in",
        linkType: "apply_online",
        isExternal: true,
      },
    ],
    viewsCount: 39800,
    isFeatured: false,
    isTrending: true,
    isVerified: true,
    createdAt: "2026-04-02T10:00:00Z",
    updatedAt: "2026-04-02T10:00:00Z",
  },

  // 7. Delhi Police Constable (10th / 12th)
  {
    id: "job-7-delhi-police",
    slug: "delhi-police-constable-executive-2026",
    title: "Delhi Police Executive Constable 2026 Recruitment for 7,547 Posts",
    shortSummary:
      "SSC conducts recruitment for Constable (Executive) Male and Female in Delhi Police Examination 2026. Physical tests and computer-based examination.",
    organization: "Delhi Police / SSC",
    category: "government",
    status: "OPEN",
    location: "Delhi",
    totalVacancies: 7547,
    salaryOrStipend: "Pay Level 3 (₹21,700 - ₹69,100)",
    qualificationSummary: "10+2 (Senior Secondary) Pass with valid LMV Driving License for Male",
    importantDates: {
      applicationStartDate: "2026-09-01",
      applicationEndDate: "2026-09-30",
    },
    importantLinks: [
      {
        label: "SSC Delhi Police Portal",
        url: "https://delhipolice.gov.in",
        linkType: "apply_online",
        isExternal: true,
      },
    ],
    viewsCount: 46200,
    isFeatured: false,
    isTrending: true,
    isVerified: true,
    createdAt: "2026-09-01T08:00:00Z",
    updatedAt: "2026-09-01T08:00:00Z",
  },

  // 8. ISRO Scientist / Engineer (B.Tech / Graduate)
  {
    id: "job-8-isro",
    slug: "isro-scientist-engineer-sc-recruitment-2026",
    title: "ISRO ICRB Scientist / Engineer 'SC' 2026 Recruitment for 303 Posts",
    shortSummary:
      "Indian Space Research Organisation (ISRO) Centralised Recruitment Board invites applications for Scientist/Engineer 'SC' in Electronics, Mechanical, and Computer Science.",
    organization: "Indian Space Research Organisation",
    department: "Department of Space",
    category: "government",
    status: "OPEN",
    location: "Karnataka",
    totalVacancies: 303,
    salaryOrStipend: "Level 10 (₹56,100 Basic + Allowances)",
    qualificationSummary: "BE / B.Tech or equivalent with minimum 65% marks or 6.84 CGPA",
    importantDates: {
      applicationStartDate: "2026-05-10",
      applicationEndDate: "2026-05-31",
    },
    importantLinks: [
      {
        label: "ISRO Careers Application",
        url: "https://isro.gov.in/careers",
        linkType: "apply_online",
        isExternal: true,
      },
    ],
    viewsCount: 28900,
    isFeatured: true,
    isTrending: false,
    isVerified: true,
    createdAt: "2026-05-10T10:00:00Z",
    updatedAt: "2026-05-10T10:00:00Z",
  },

  // 9. Google India Software Engineer
  {
    id: "job-6-google",
    slug: "google-india-software-engineer-early-career-2026",
    title: "Google India Software Engineer (Early Career / University Graduate) 2026",
    shortSummary:
      "Google India is hiring Software Engineers for Bengaluru, Hyderabad, and Pune campuses to work on distributed systems, Cloud, Search, and Android platforms.",
    organization: "Google India Pvt Ltd",
    category: "private",
    status: "OPEN",
    location: "Karnataka",
    totalVacancies: "Multiple Openings",
    salaryOrStipend: "Competitive Tech Package (₹18 - ₹32 LPA CTC)",
    qualificationSummary: "B.Tech / B.E. / M.Tech / MCA in Computer Science or related STEM field",
    importantDates: {
      applicationStartDate: "2026-01-10",
      applicationEndDate: "2026-03-31",
    },
    importantLinks: [
      {
        label: "Google Careers Application",
        url: "https://careers.google.com",
        linkType: "apply_online",
        isExternal: true,
      },
    ],
    viewsCount: 41200,
    isFeatured: true,
    isTrending: true,
    isVerified: true,
    createdAt: "2026-01-10T11:00:00Z",
    updatedAt: "2026-01-12T15:00:00Z",
  },

  // 10. Infosys Specialist Programmer
  {
    id: "job-7-infosys",
    slug: "infosys-specialist-programmer-2026",
    title: "Infosys Specialist Programmer (SP) & Digital Specialist Engineer (DSE) 2026",
    shortSummary:
      "Infosys off-campus hiring drive for high-potential engineering freshers with strong algorithmic coding and system architecture problem-solving skills.",
    organization: "Infosys Limited",
    category: "private",
    status: "OPEN",
    location: "Maharashtra",
    totalVacancies: "2,500+ Openings",
    salaryOrStipend: "₹6.25 LPA - ₹9.5 LPA CTC",
    qualificationSummary: "B.E / B.Tech / M.E / M.Tech / MCA / M.Sc (CS/IT)",
    importantDates: {
      applicationStartDate: "2026-02-01",
      applicationEndDate: "2026-03-15",
    },
    importantLinks: [
      {
        label: "Infosys Launchpad Registration",
        url: "https://career.infosys.com",
        linkType: "apply_online",
        isExternal: true,
      },
    ],
    viewsCount: 29800,
    isFeatured: false,
    isTrending: false,
    isVerified: true,
    createdAt: "2026-02-01T10:00:00Z",
    updatedAt: "2026-02-01T10:00:00Z",
  },

  // 11. Tata Consultancy Services (TCS NQT 2026)
  {
    id: "job-11-tcs",
    slug: "tcs-national-qualifier-test-nqt-2026",
    title: "TCS National Qualifier Test (NQT) 2026 for Ninja, Digital & Prime Roles",
    shortSummary:
      "Tata Consultancy Services announces national hiring for 2025 and 2026 batch graduates. Direct job opportunities across 50+ locations in India.",
    organization: "Tata Consultancy Services",
    category: "private",
    status: "ENDING_SOON",
    location: "All India",
    totalVacancies: "15,000+ Freshers",
    salaryOrStipend: "₹3.36 LPA to ₹9.0 LPA CTC",
    qualificationSummary: "B.E. / B.Tech / M.E. / M.Tech / MCA / M.Sc with 60% aggregate",
    importantDates: {
      applicationStartDate: "2026-01-15",
      applicationEndDate: "2026-03-10",
      examDate: "March 2026",
    },
    importantLinks: [
      {
        label: "TCS NextStep Portal",
        url: "https://nextstep.tcs.com",
        linkType: "apply_online",
        isExternal: true,
      },
    ],
    viewsCount: 56400,
    isFeatured: true,
    isTrending: true,
    isVerified: true,
    createdAt: "2026-01-15T09:00:00Z",
    updatedAt: "2026-01-15T09:00:00Z",
  },

  // 12. HDFC Bank Deputy Manager
  {
    id: "job-12-hdfc",
    slug: "hdfc-bank-future-bankers-program-2026",
    title: "HDFC Bank Future Bankers Program 2026 — Deputy Manager Trainee",
    shortSummary:
      "HDFC Bank invites fresh and experienced graduates for the full-time Deputy Manager program with guaranteed job placement upon completion of training.",
    organization: "HDFC Bank Ltd",
    category: "private",
    status: "OPEN",
    location: "Maharashtra",
    totalVacancies: "1,200 Posts",
    salaryOrStipend: "₹4.50 LPA - ₹6.20 LPA CTC",
    qualificationSummary: "Graduate in any stream with minimum 55% marks",
    importantDates: {
      applicationStartDate: "2026-02-10",
      applicationEndDate: "2026-04-10",
    },
    importantLinks: [
      {
        label: "HDFC Careers",
        url: "https://hdfcbank.com/careers",
        linkType: "apply_online",
        isExternal: true,
      },
    ],
    viewsCount: 22100,
    isFeatured: false,
    isTrending: false,
    isVerified: true,
    createdAt: "2026-02-10T10:00:00Z",
    updatedAt: "2026-02-10T10:00:00Z",
  },

  // 13. NTA JEE Main Admit Card
  {
    id: "job-8-jee",
    slug: "nta-jee-main-2026-session-2-admit-card",
    title: "NTA JEE Main 2026 Session 2 Hall Ticket & City Intimation Slip",
    shortSummary:
      "National Testing Agency (NTA) has released the Admit Card for Joint Entrance Examination (Main) 2026 Session 2. Candidates can download using Application No. and DOB.",
    organization: "National Testing Agency (NTA)",
    category: "admit-card",
    status: "ADMIT_CARD_OUT",
    location: "All India",
    totalVacancies: "Entrance Exam",
    salaryOrStipend: "N/A (National Exam)",
    qualificationSummary: "10+2 / Intermediate with PCM",
    importantDates: {
      admitCardDate: "2026-03-31",
      examDate: "April 04 - 15, 2026",
    },
    importantLinks: [
      {
        label: "Download JEE Main 2026 Hall Ticket",
        url: "https://jeemain.nta.nic.in",
        linkType: "admit_card",
        isExternal: true,
      },
    ],
    viewsCount: 78900,
    isFeatured: true,
    isTrending: true,
    isVerified: true,
    createdAt: "2026-03-31T06:00:00Z",
    updatedAt: "2026-03-31T06:00:00Z",
  },

  // 14. SSC GD Constable Admit Card
  {
    id: "job-9-ssc-gd",
    slug: "ssc-gd-constable-2026-admit-card",
    title: "SSC GD Constable 2026 Computer Based Exam Admit Card Download",
    shortSummary:
      "Staff Selection Commission regional portals have activated the admit card download links for Constable (GD) in CAPFs, SSF, and Rifleman (GD) in Assam Rifles Examination.",
    organization: "Staff Selection Commission",
    category: "admit-card",
    status: "ADMIT_CARD_OUT",
    location: "All India",
    totalVacancies: 39481,
    salaryOrStipend: "Pay Level 3 (₹21,700 - ₹69,100)",
    qualificationSummary: "10th Class (Matriculation) Pass",
    importantDates: {
      admitCardDate: "2026-02-10",
      examDate: "February 20 - March 07, 2026",
    },
    importantLinks: [
      {
        label: "SSC Regional Admit Card Portal",
        url: "https://ssc.gov.in",
        linkType: "admit_card",
        isExternal: true,
      },
    ],
    viewsCount: 92300,
    isFeatured: false,
    isTrending: true,
    isVerified: true,
    createdAt: "2026-02-10T08:00:00Z",
    updatedAt: "2026-02-10T08:00:00Z",
  },

  // 15. UPSC CSE Prelims Admit Card
  {
    id: "job-15-upsc-admit",
    slug: "upsc-civil-services-prelims-2026-admit-card",
    title: "UPSC Civil Services Prelims 2026 e-Admit Card Available",
    shortSummary:
      "Union Public Service Commission (UPSC) has made available the e-Admit Card for Civil Services (Preliminary) Examination 2026. Verify exam centre and instructions.",
    organization: "Union Public Service Commission",
    category: "admit-card",
    status: "ADMIT_CARD_OUT",
    location: "All India",
    totalVacancies: 1056,
    salaryOrStipend: "N/A (Exam Admit Card)",
    qualificationSummary: "Graduation",
    importantDates: {
      admitCardDate: "2026-05-05",
      examDate: "2026-05-24",
    },
    importantLinks: [
      {
        label: "Download UPSC e-Admit Card",
        url: "https://upsconline.nic.in",
        linkType: "admit_card",
        isExternal: true,
      },
    ],
    viewsCount: 64100,
    isFeatured: true,
    isTrending: true,
    isVerified: true,
    createdAt: "2026-05-05T09:00:00Z",
    updatedAt: "2026-05-05T09:00:00Z",
  },

  // 16. CTET July 2026 Admit Card
  {
    id: "job-16-ctet",
    slug: "ctet-july-2026-hall-ticket-download",
    title: "Central Teacher Eligibility Test (CTET) July 2026 Admit Card",
    shortSummary:
      "Central Board of Secondary Education (CBSE) has issued the CTET July 2026 Hall Ticket for Paper I and Paper II. Download using application number.",
    organization: "Central Board of Secondary Education",
    category: "admit-card",
    status: "ADMIT_CARD_OUT",
    location: "All India",
    totalVacancies: "Eligibility Test",
    salaryOrStipend: "Teaching Certification",
    qualificationSummary: "D.El.Ed / B.Ed / Graduation with Teaching Diploma",
    importantDates: {
      admitCardDate: "2026-06-25",
      examDate: "2026-07-07",
    },
    importantLinks: [
      {
        label: "CTET Official Admit Card Portal",
        url: "https://ctet.nic.in",
        linkType: "admit_card",
        isExternal: true,
      },
    ],
    viewsCount: 41900,
    isFeatured: false,
    isTrending: false,
    isVerified: true,
    createdAt: "2026-06-25T10:00:00Z",
    updatedAt: "2026-06-25T10:00:00Z",
  },

  // 17. UPSC NDA-1 Result
  {
    id: "job-10-nda",
    slug: "upsc-nda-na-i-2026-written-result",
    title: "UPSC NDA & NA (I) 2026 Written Examination Result & Merit List Released",
    shortSummary:
      "Union Public Service Commission has published the roll-number wise list of qualified candidates for SSB Interview for National Defence Academy & Naval Academy Examination.",
    organization: "Union Public Service Commission",
    category: "result",
    status: "RESULT_OUT",
    location: "All India",
    totalVacancies: 404,
    salaryOrStipend: "Cadet Stipend ₹56,100 during training",
    qualificationSummary: "12th Pass / Appearing",
    importantDates: {
      resultDate: "2026-05-18",
    },
    importantLinks: [
      {
        label: "Download UPSC NDA-1 2026 Written Result PDF",
        url: "https://upsc.gov.in",
        linkType: "result_merit_list",
        isExternal: true,
      },
    ],
    viewsCount: 45600,
    isFeatured: true,
    isTrending: true,
    isVerified: true,
    createdAt: "2026-05-18T14:00:00Z",
    updatedAt: "2026-05-18T14:00:00Z",
  },

  // 18. RRB ALP Stage-1 Scorecard & Result
  {
    id: "job-18-rrb-alp",
    slug: "rrb-alp-cbt-1-result-cut-off-marks-2026",
    title: "RRB Assistant Loco Pilot (ALP) CBT-1 Result & Cut-off Marks Declared",
    shortSummary:
      "Railway Recruitment Boards have announced the normalized cut-off scores and candidate shortlisted list for CBT-2 examination for CEN 01/2026 ALP recruitment.",
    organization: "Railway Recruitment Control Board",
    category: "result",
    status: "RESULT_OUT",
    location: "All India",
    totalVacancies: 18799,
    salaryOrStipend: "Level 2 (₹19,900 Basic)",
    qualificationSummary: "10th Pass + ITI or Diploma in Mechanical/Electrical Engineering",
    importantDates: {
      resultDate: "2026-04-20",
    },
    importantLinks: [
      {
        label: "View RRB ALP Result & Scorecard",
        url: "https://rrbapply.gov.in",
        linkType: "result_merit_list",
        isExternal: true,
      },
    ],
    viewsCount: 58200,
    isFeatured: true,
    isTrending: true,
    isVerified: true,
    createdAt: "2026-04-20T12:00:00Z",
    updatedAt: "2026-04-20T12:00:00Z",
  },

  // 19. SSC CGL Tier-1 Final Answer Key & Result
  {
    id: "job-19-cgl-result",
    slug: "ssc-cgl-2026-tier-1-merit-list-cutoff",
    title: "SSC CGL 2026 Tier-1 Scorecard, Category Cut-off & Qualified List",
    shortSummary:
      "Staff Selection Commission has uploaded the marks and roll-number wise qualification list for Tier-2 examination for CGL 2026.",
    organization: "Staff Selection Commission",
    category: "result",
    status: "RESULT_OUT",
    location: "All India",
    totalVacancies: 14582,
    salaryOrStipend: "Pay Level 4 - 8",
    qualificationSummary: "Graduate",
    importantDates: {
      resultDate: "2026-11-04",
    },
    importantLinks: [
      {
        label: "Check CGL Tier-1 Marks",
        url: "https://ssc.gov.in",
        linkType: "result_merit_list",
        isExternal: true,
      },
    ],
    viewsCount: 71300,
    isFeatured: false,
    isTrending: true,
    isVerified: true,
    createdAt: "2026-11-04T15:00:00Z",
    updatedAt: "2026-11-04T15:00:00Z",
  },

  // 20. PM Internship Scheme
  {
    id: "job-11-pm-intern",
    slug: "pm-internship-scheme-round-2-2026",
    title: "Prime Minister's Internship Scheme 2026 — 1,25,000 Corporate Internships",
    shortSummary:
      "Ministry of Corporate Affairs (MCA) invites eligible youth (aged 21-24) to register for 12-month paid internships in top 500 companies in India with ₹5,000/month stipend.",
    organization: "Ministry of Corporate Affairs",
    category: "internship",
    status: "OPEN",
    location: "All India",
    totalVacancies: 125000,
    salaryOrStipend: "₹5,000 / month + ₹6,000 one-time grant",
    qualificationSummary: "10th, 12th, ITI, Polytechnic Diploma, or Graduation (BA, BSc, BCom, BCA, BBA, B.Pharma)",
    importantDates: {
      applicationStartDate: "2026-03-01",
      applicationEndDate: "2026-04-15",
    },
    importantLinks: [
      {
        label: "PM Internship Portal Registration",
        url: "https://pminternship.mca.gov.in",
        linkType: "apply_online",
        isExternal: true,
      },
    ],
    viewsCount: 68400,
    isFeatured: true,
    isTrending: true,
    isVerified: true,
    createdAt: "2026-03-01T09:00:00Z",
    updatedAt: "2026-03-02T11:00:00Z",
  },

  // 21. National Scholarship Portal
  {
    id: "job-12-nsp",
    slug: "national-scholarship-portal-post-matric-2026",
    title: "National Scholarship Portal (NSP) Post-Matric & Merit Scholarship 2026",
    shortSummary:
      "Government of India Central Sector Scheme of Scholarships for College and University Students for Higher Education. Full fee reimbursement and yearly financial grants.",
    organization: "Ministry of Education & Social Justice",
    category: "scholarship",
    status: "OPEN",
    location: "All India",
    totalVacancies: "82,000 Fresh Scholarships / Year",
    salaryOrStipend: "Up to ₹20,000 / annum financial assistance",
    qualificationSummary: "Students pursuing regular graduate/post-graduate courses",
    importantDates: {
      applicationStartDate: "2026-07-01",
      applicationEndDate: "2026-10-31",
    },
    importantLinks: [
      {
        label: "NSP Official Application Portal",
        url: "https://scholarships.gov.in",
        linkType: "apply_online",
        isExternal: true,
      },
    ],
    viewsCount: 37900,
    isFeatured: false,
    isTrending: false,
    isVerified: true,
    createdAt: "2026-07-01T10:00:00Z",
    updatedAt: "2026-07-01T10:00:00Z",
  },

  // 22. BHEL Trade & Technician Apprenticeship
  {
    id: "job-13-bhel",
    slug: "bhel-trade-technician-apprentice-2026",
    title: "BHEL Trade & Technician Apprenticeship 2026 for 450 Vacancies",
    shortSummary:
      "Bharat Heavy Electricals Limited (BHEL) invites online applications for 1-year Apprenticeship Training under the Apprentices Act 1961 in multiple trades.",
    organization: "Bharat Heavy Electricals Limited",
    category: "apprenticeship",
    status: "ENDING_SOON",
    location: "Madhya Pradesh",
    totalVacancies: 450,
    salaryOrStipend: "₹8,050 - ₹9,000 / month stipend",
    qualificationSummary: "ITI Pass in relevant trade / Diploma in Engineering",
    importantDates: {
      applicationStartDate: "2026-02-15",
      applicationEndDate: "2026-03-07",
    },
    importantLinks: [
      {
        label: "BHEL Apprenticeship Application",
        url: "https://bhel.com",
        linkType: "apply_online",
        isExternal: true,
      },
    ],
    viewsCount: 18400,
    isFeatured: false,
    isTrending: false,
    isVerified: true,
    createdAt: "2026-02-15T09:00:00Z",
    updatedAt: "2026-02-15T09:00:00Z",
  },

  // 23. SSC CGL 2026 Provisional Answer Key
  {
    id: "job-23-answerkey",
    slug: "ssc-cgl-2026-tier-1-provisional-answer-key",
    title: "SSC CGL 2026 Tier-1 Tentative Answer Key & Response Sheet",
    shortSummary:
      "Staff Selection Commission has released the provisional answer keys with candidate response sheets for CGL Tier-1. Submit challenges within specified window.",
    organization: "Staff Selection Commission",
    category: "answer-key",
    status: "ANSWER_KEY_OUT",
    location: "All India",
    totalVacancies: 14582,
    salaryOrStipend: "Pay Level 4 - 8",
    qualificationSummary: "Bachelor's Degree",
    importantDates: {
      answerKeyDate: "2026-10-15",
    },
    importantLinks: [
      {
        label: "Submit Answer Key Challenge",
        url: "https://ssc.gov.in",
        linkType: "answer_key",
        isExternal: true,
      },
    ],
    viewsCount: 31200,
    isFeatured: false,
    isTrending: true,
    isVerified: true,
    createdAt: "2026-10-15T11:00:00Z",
    updatedAt: "2026-10-15T11:00:00Z",
  },
];
