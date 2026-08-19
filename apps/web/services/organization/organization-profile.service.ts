import { OrganizationProfile, JobPosting } from "@/types";
import { MOCK_JOB_POSTINGS } from "@/services/jobs/jobs.mock";

export const MOCK_ORGANIZATION_PROFILES: OrganizationProfile[] = [
  {
    id: "org-ssc",
    slug: "ssc",
    name: "Staff Selection Commission",
    shortName: "SSC",
    categoryType: "Central Commission",
    headquarters: "CGO Complex, Lodhi Road, New Delhi, India",
    establishedYear: 1975,
    state: "Central / New Delhi",
    website: "https://ssc.gov.in",
    verified: true,
    tagline: "Recruiting Premier Group B & C Civil Cadres for Ministries and Departments of the Government of India.",
    description:
      "The Staff Selection Commission (SSC) is an attached office of the Department of Personnel and Training (DoPT), Government of India. It conducts centralized competitive examinations to recruit staff for various non-gazetted, non-technical Group 'B' and Group 'C' posts across Ministries, Departments, and Subordinate Offices.",
    aboutDetails: [
      "The Commission was established on 4 November 1975 under the chairmanship of Saiyid Hamid.",
      "Operates through 9 Regional and Sub-Regional offices located across Delhi, Mumbai, Kolkata, Chennai, Prayagraj, Guwahati, Bengaluru, Raipur, and Chandigarh.",
      "Conducts flagship national recruitment examinations including CGL (Combined Graduate Level), CHSL (Combined Higher Secondary Level), CPO (Central Police Organisation), MTS (Multi-Tasking Staff), and GD Constable.",
      "Serves over 25+ million aspirants annually with computer-based testing (CBT) and biometric verification across 150+ Indian cities.",
    ],
    selectionProcess: [
      "Tier I: Computer Based Examination (Objective Multiple Choice)",
      "Tier II: Computer Based Examination (Subject Specialization & Mathematical Abilities)",
      "Data Entry Speed Test (DEST) / Typing / Computer Proficiency Test (CPT)",
      "Document Verification & Medical Fitness Examination by User Departments",
    ],
    keyDepartments: [
      "Central Secretariat Service (CSS)",
      "Intelligence Bureau (Ministry of Home Affairs)",
      "Ministry of External Affairs (MEA)",
      "Central Board of Direct Taxes (CBDT)",
      "Central Board of Indirect Taxes and Customs (CBIC)",
      "Comptroller and Auditor General of India (CAG)",
    ],
    faqs: [
      {
        question: "What is the One-Time Registration (OTR) requirement on the new SSC portal?",
        answer:
          "All candidates must complete the new One-Time Registration (OTR) on ssc.gov.in. Existing registrations from the legacy ssc.nic.in portal are no longer valid. The OTR requires live photo capture via webcam or the MySSC mobile app.",
      },
      {
        question: "What is the educational qualification needed for SSC CGL vs SSC CHSL?",
        answer:
          "SSC CGL requires a recognized Bachelor's Degree in any discipline from an accredited university. SSC CHSL requires a 12th standard (10+2) pass certificate from a recognized education board.",
      },
      {
        question: "Is there negative marking in SSC recruitment computer-based examinations?",
        answer:
          "Yes, Tier I examinations typically impose a penalty of 0.50 marks for each incorrect response, while Tier II sessions penalize 1 mark per incorrect answer in objective modules.",
      },
      {
        question: "How can candidates download the official SSC Admit Card?",
        answer:
          "Admit cards are released regionally 4-7 days prior to the examination date on respective regional portal domains (e.g. sscnr.nic.in, sscer.org) and accessible via registration ID and date of birth.",
      },
    ],
    stats: {
      activeVacanciesCount: 3,
      totalPostsCount: 22890,
      admitCardsCount: 2,
      resultsCount: 1,
    },
  },
  {
    id: "org-upsc",
    slug: "upsc",
    name: "Union Public Service Commission",
    shortName: "UPSC",
    categoryType: "Central Commission",
    headquarters: "Dholpur House, Shahjahan Road, New Delhi, India",
    establishedYear: 1926,
    state: "Central / New Delhi",
    website: "https://upsc.gov.in",
    verified: true,
    tagline: "Constitutional Authority for All India Services and Higher Central Civil & Defence Services.",
    description:
      "The Union Public Service Commission (UPSC) is India's premier constitutional recruiting agency established under Article 315 of the Constitution of India. It conducts nationwide recruitment for Group 'A' and Group 'B' officers across IAS, IPS, IFS, IRS, and Defence cadres.",
    aboutDetails: [
      "Established as the Public Service Commission on 1 October 1926 under the Government of India Act 1919.",
      "Mandated under Article 320 to conduct examinations for appointments to the services of the Union.",
      "Conducts flagship competitive exams including Civil Services Examination (CSE), Engineering Services (ESE), Combined Defence Services (CDS), National Defence Academy (NDA), and Central Armed Police Forces (CAPF).",
      "Celebrated for its absolute integrity, strict meritocracy, and rigorous 3-stage selection protocol.",
    ],
    selectionProcess: [
      "Stage 1: Preliminary Examination (Objective Screening - GS Paper 1 & CSAT)",
      "Stage 2: Main Written Examination (Descriptive Essay, General Studies & Optional Papers)",
      "Stage 3: Personality Test / Interview conducted at Dholpur House, New Delhi",
      "Medical Board Assessment & All India Merit Rank Allocation",
    ],
    keyDepartments: [
      "Indian Administrative Service (IAS)",
      "Indian Police Service (IPS)",
      "Indian Foreign Service (IFS)",
      "Indian Revenue Service (IRS Income Tax & Customs)",
      "Indian Audit and Accounts Service (IAAS)",
      "Indian Defence Accounts Service (IDAS)",
    ],
    faqs: [
      {
        question: "How many attempts are permitted for the UPSC Civil Services Examination?",
        answer:
          "General category candidates are allowed 6 attempts up to 32 years of age. OBC candidates receive 9 attempts up to 35 years of age. SC/ST candidates have unlimited attempts up to 37 years of age.",
      },
      {
        question: "What is the minimum qualifying score in CSAT (Paper-II) of UPSC Prelims?",
        answer:
          "CSAT is a qualifying paper requiring a minimum score of 33% (66 marks out of 200). Merit ranking for Mains qualification is determined solely by Paper-I (General Studies).",
      },
      {
        question: "When is the official UPSC Annual Calendar released?",
        answer:
          "The Commission publishes its comprehensive Annual Examination Calendar in May/June of the preceding year on upsc.gov.in, detailing notification release dates, application windows, and exam schedules.",
      },
    ],
    stats: {
      activeVacanciesCount: 2,
      totalPostsCount: 1450,
      admitCardsCount: 1,
      resultsCount: 2,
    },
  },
  {
    id: "org-rrb",
    slug: "rrb",
    name: "Railway Recruitment Boards",
    shortName: "RRB",
    categoryType: "Railways",
    headquarters: "Rail Bhavan, Raisina Road, New Delhi, India",
    establishedYear: 1942,
    state: "All India",
    website: "https://indianrailways.gov.in",
    verified: true,
    tagline: "Powering Indian Railways through Large-Scale Technical and Operational Recruitment.",
    description:
      "Railway Recruitment Boards (RRB) operate under the Ministry of Railways, Government of India. The 21 nodal RRBs across India conduct mega-scale recruitments for technical, operational, clerical, and safety positions across all 18 Railway Zones and Production Units.",
    aboutDetails: [
      "Consists of 21 regional boards including RRB Allahabad, RRB Mumbai, RRB Kolkata, RRB Chennai, RRB Secunderabad, and RRB Chandigarh.",
      "Conducts massive Centralized Employment Notifications (CEN) for NTPC (Non-Technical Popular Categories), ALP (Assistant Loco Pilot), Technician, Junior Engineer (JE), and Group D (Level 1).",
      "Executes the world's largest computerized testing logistics, assessing over 10+ million candidates in multiple shifts.",
    ],
    selectionProcess: [
      "1st Stage Computer Based Test (CBT-1: Screening Exam)",
      "2nd Stage Computer Based Test (CBT-2: Core Technical / Subject Domain)",
      "Computer Based Aptitude Test (CBAT) / Typing Skill Test where applicable",
      "Comprehensive Document Verification & Railway Medical Fitness Standards (A-1, A-2, B-1, C-1)",
    ],
    keyDepartments: [
      "Operating & Traffic Department (Station Masters, Goods Train Managers)",
      "Mechanical & Electrical Engineering (Loco Pilots & Technicians)",
      "Civil Engineering & Track Maintenance (Junior Engineers & Section Engineers)",
      "Commercial & Accounts Division (Senior Commercial Clerks & Ticket Examiners)",
    ],
    faqs: [
      {
        question: "Can a candidate apply to multiple Railway Recruitment Boards for the same CEN?",
        answer:
          "No. Candidates are allowed to choose and apply to only ONE Railway Recruitment Board per notification. Submitting multiple applications across different RRBs leads to disqualification.",
      },
      {
        question: "What medical standards are required for Assistant Loco Pilot (ALP)?",
        answer:
          "ALP requires the stringent Medical Standard A-1, including 6/6 distant vision without glasses, near vision Sn: 0.6 without glasses, and mandatory passing of the Color Vision test.",
      },
    ],
    stats: {
      activeVacanciesCount: 2,
      totalPostsCount: 18760,
      admitCardsCount: 1,
      resultsCount: 1,
    },
  },
  {
    id: "org-ibps",
    slug: "ibps",
    name: "Institute of Banking Personnel Selection",
    shortName: "IBPS",
    categoryType: "Banking",
    headquarters: "IBPS House, Kandivali East, Mumbai, Maharashtra, India",
    establishedYear: 1975,
    state: "Maharashtra",
    website: "https://ibps.in",
    verified: true,
    tagline: "Autonomous Apex Body Conducting Common Recruitment for Public Sector & Regional Rural Banks.",
    description:
      "The Institute of Banking Personnel Selection (IBPS) is an autonomous research-based testing body governed by representatives from the Reserve Bank of India, Ministry of Finance, Indian Institute of Banking and Finance, and major Nationalized Banks. It conducts centralized recruitment for Probationary Officers (PO), Clerks, Specialist Officers (SO), and RRB Cadres.",
    aboutDetails: [
      "Started as the Personnel Selection Services (PSS) unit of NIBM in 1975 and evolved into an independent body in 1984.",
      "Conducts annual Common Recruitment Processes (CRP) for 11 Participating Public Sector Banks and 43 Regional Rural Banks (Gramin Banks).",
      "Pioneered online aptitude testing systems with instant normalization, scoring, and algorithmic bank preference allocation.",
    ],
    selectionProcess: [
      "CRP Preliminary Online Examination (Speed & Numerical Ability)",
      "CRP Main Online Examination (Data Analysis, Reasoning & General Banking Awareness)",
      "Common Interview (Jointly conducted by Participating Banks & IBPS for PO/SO)",
      "Provisional Merit Allocation based on candidate's preferred bank choices",
    ],
    keyDepartments: [
      "General Banking & Branch Management (Probationary Officers)",
      "Information Technology & Cyber Security Cadre (IT Officers)",
      "Agricultural Field Operations (AFO)",
      "Treasury, Risk & Credit Management",
    ],
    faqs: [
      {
        question: "Which Public Sector Banks participate in IBPS PO & Clerk recruitment?",
        answer:
          "11 major nationalized banks participate: Bank of Baroda, Bank of India, Bank of Maharashtra, Canara Bank, Central Bank of India, Indian Bank, Indian Overseas Bank, Punjab National Bank, Punjab & Sind Bank, UCO Bank, and Union Bank of India.",
      },
      {
        question: "Is there an interview stage for IBPS Clerk positions?",
        answer:
          "No. As per Government of India guidelines, interviews are discontinued for clerical/junior level appointments. Final merit for IBPS Clerk is determined 100% on Main Examination scores.",
      },
    ],
    stats: {
      activeVacanciesCount: 2,
      totalPostsCount: 9800,
      admitCardsCount: 1,
      resultsCount: 2,
    },
  },
  {
    id: "org-sbi",
    slug: "sbi",
    name: "State Bank of India",
    shortName: "SBI",
    categoryType: "Banking",
    headquarters: "State Bank Bhavan, Madame Cama Road, Nariman Point, Mumbai, India",
    establishedYear: 1955,
    state: "Maharashtra",
    website: "https://sbi.co.in/careers",
    verified: true,
    tagline: "India's Largest Fortune 500 Public Sector Bank & Premier Financial Institution.",
    description:
      "State Bank of India (SBI) is a statutory public sector banking institution and India's largest commercial bank with over 22,000 branches nationwide. SBI conducts independent recruitment for Probationary Officers (PO), Junior Associates (Customer Support & Sales), and Specialist Cadre Officers (SCO).",
    aboutDetails: [
      "Traces its lineage to the Bank of Calcutta (1806) and Imperial Bank of India, nationalized into State Bank of India in 1955.",
      "Commands over 23% market share in assets and 25% share of total loan and deposit markets in India.",
      "Offers the most lucrative compensation package in Indian public sector banking, including 4 additional increments for Probationary Officers.",
    ],
    selectionProcess: [
      "Phase I: Preliminary Online Examination",
      "Phase II: Main Online Examination + Descriptive English Writing",
      "Phase III: Psychometric Test, Group Discussion & Personal Interview",
      "Final Selection based on Normalized 75:25 composite score (Mains + Interview)",
    ],
    keyDepartments: [
      "Retail Banking & Credit Appraisal",
      "Corporate Banking & International Operations",
      "Digital Banking, Wealth Management & Fintech",
      "Specialist Cadre (Law, Treasury, IT, Forex)",
    ],
    faqs: [
      {
        question: "Does SBI recruitment have a limit on the number of attempts for Probationary Officers?",
        answer:
          "Yes. General/EWS candidates are restricted to 4 attempts in the Main examination. General PwD/EWS PwD candidates have 7 attempts. OBC/OBC PwD candidates have 7 attempts. There are no attempt restrictions for SC/ST candidates.",
      },
      {
        question: "What is the starting basic pay of an SBI Probationary Officer?",
        answer:
          "SBI PO basic pay starts at ₹48,480 (with 4 advance increments in the scale of ₹48,480-85,920), leading to a gross monthly remuneration of approximately ₹75,000 - ₹82,000 plus leased housing accommodation.",
      },
    ],
    stats: {
      activeVacanciesCount: 2,
      totalPostsCount: 11200,
      admitCardsCount: 1,
      resultsCount: 1,
    },
  },
  {
    id: "org-isro",
    slug: "isro",
    name: "Indian Space Research Organisation",
    shortName: "ISRO",
    categoryType: "PSU / Research",
    headquarters: "Antariksh Bhavan, New BEL Road, Bengaluru, Karnataka, India",
    establishedYear: 1969,
    state: "Karnataka",
    website: "https://isro.gov.in",
    verified: true,
    tagline: "Pioneering Space Technology in the Service of the Nation (Chandrayaan & Gaganyaan).",
    description:
      "The Indian Space Research Organisation (ISRO) is the primary space agency of the Government of India, functioning under the Department of Space (DOS). ISRO recruits top scientists, engineers, technicians, and administrative officers via the ISRO Centralised Recruitment Board (ICRB).",
    aboutDetails: [
      "Founded by Dr. Vikram Sarabhai in 1969, succeeding INCOSPAR.",
      "Achieved monumental milestones including Mars Orbiter Mission (Mangalyaan), Chandrayaan-3 lunar south pole landing, and Aditya-L1 solar observatory.",
      "Recruits Scientist/Engineer 'SC' (Level 10) in Mechanical, Electronics, Computer Science, and Aerospace domains.",
    ],
    selectionProcess: [
      "Stage 1: Written Examination (Technical Discipline Knowledge + Engineering Aptitude)",
      "Stage 2: Technical Interview by Senior ISRO Scientist Panel (minimum 60% qualifying score)",
      "Final Selection based 100% on interview merit of screened candidates",
    ],
    keyDepartments: [
      "Vikram Sarabhai Space Centre (VSSC, Thiruvananthapuram)",
      "U R Rao Satellite Centre (URSC, Bengaluru)",
      "Satish Dhawan Space Centre (SDSC SHAR, Sriharikota)",
      "Liquid Propulsion Systems Centre (LPSC, Valiamala)",
      "Space Applications Centre (SAC, Ahmedabad)",
    ],
    faqs: [
      {
        question: "What is the minimum percentage required to apply for ISRO ICRB Scientist/Engineer SC?",
        answer:
          "Candidates must hold a B.E./B.Tech or equivalent degree with an aggregate minimum of 65% marks or a CGPA of 6.84/10 from an AICTE/UGC recognized university.",
      },
      {
        question: "Are final year engineering students eligible for ISRO Scientist recruitment?",
        answer:
          "Yes, provided they can produce their final degree certificate or provisional scorecard at the time of document verification / technical interview.",
      },
    ],
    stats: {
      activeVacanciesCount: 1,
      totalPostsCount: 380,
      admitCardsCount: 0,
      resultsCount: 1,
    },
  },
  {
    id: "org-drdo",
    slug: "drdo",
    name: "Defence Research and Development Organisation",
    shortName: "DRDO",
    categoryType: "Defence",
    headquarters: "DRDO Bhawan, Rajaji Marg, New Delhi, India",
    establishedYear: 1958,
    state: "Central / New Delhi",
    website: "https://drdo.gov.in",
    verified: true,
    tagline: "Empowering the Nation with Cutting-Edge Defence & Strategic Technologies.",
    description:
      "DRDO is the R&D wing of the Ministry of Defence, Government of India, with a network of over 50 laboratories dedicated to aeronautics, armaments, electronics, missiles, naval systems, and combat vehicles. Recruitment is conducted via CEPTAM and RAC.",
    aboutDetails: [
      "Formed in 1958 by merging the Technical Development Establishment and the Directorate of Technical Development & Production with DSO.",
      "Recruits Scientist 'B' through the Recruitment & Assessment Centre (RAC) based on GATE scores and personal interviews.",
      "Recruits Technical (Senior Technical Assistant - STA 'B') and Administrative staff through CEPTAM.",
    ],
    selectionProcess: [
      "Screening based on Valid GATE Score / CEPTAM Tier I Online Exam",
      "Tier II Subject Knowledge Assessment / Trade Skill Test",
      "Personal Interview for Scientist Cadre appointments",
    ],
    keyDepartments: [
      "Aeronautical Development Establishment (ADE)",
      "Defence Research & Development Laboratory (DRDL - Missiles)",
      "Combat Vehicles Research and Development Establishment (CVRDE)",
      "Naval Physical and Oceanographic Laboratory (NPOL)",
    ],
    faqs: [
      {
        question: "What is CEPTAM in DRDO?",
        answer:
          "CEPTAM (Centre for Personnel Assessment and Management) is the corporate body of DRDO responsible for non-gazetted technical, administrative, and allied cadre recruitment.",
      },
    ],
    stats: {
      activeVacanciesCount: 1,
      totalPostsCount: 1150,
      admitCardsCount: 0,
      resultsCount: 1,
    },
  },
  {
    id: "org-nta",
    slug: "nta",
    name: "National Testing Agency",
    shortName: "NTA",
    categoryType: "Education / Testing",
    headquarters: "Okhla Phase III, New Delhi, India",
    establishedYear: 2017,
    state: "Central / New Delhi",
    website: "https://nta.ac.in",
    verified: true,
    tagline: "Premier, Specialist, Autonomous Testing Organization for High-Stakes National Entrances.",
    description:
      "The National Testing Agency (NTA) is an autonomous agency approved by the Union Council of Ministers and registered under the Societies Registration Act, 1860. It conducts major national examinations including JEE Main, NEET UG, CUET, UGC NET, and recruitment drives for Central Universities and High Courts.",
    aboutDetails: [
      "Established in November 2017 following budget announcements by the Ministry of Education.",
      "Utilizes cutting-edge AI-driven question banking, biometric matching, and computerized test delivery platforms.",
    ],
    selectionProcess: [
      "Computer Based Test (CBT) / Written Exam",
      "Skill Proficiency / Typing Assessment",
      "Merit List Announcement & Counselling",
    ],
    keyDepartments: [
      "Higher Education Testing Division",
      "Recruitment & Assessment Division",
      "National Eligibility Testing Wing",
    ],
    faqs: [
      {
        question: "How does NTA conduct UGC NET for Assistant Professor and JRF?",
        answer:
          "NTA conducts UGC NET twice a year (June and December sessions) in 83 subjects across India in Computer Based Test mode.",
      },
    ],
    stats: {
      activeVacanciesCount: 1,
      totalPostsCount: 5200,
      admitCardsCount: 1,
      resultsCount: 1,
    },
  },
  {
    id: "org-mppsc",
    slug: "mppsc",
    name: "Madhya Pradesh Public Service Commission",
    shortName: "MPPSC",
    categoryType: "State PSC",
    headquarters: "Residency Area, Daly College Road, Indore, Madhya Pradesh, India",
    establishedYear: 1956,
    state: "Madhya Pradesh",
    website: "https://mppsc.mp.gov.in",
    verified: true,
    tagline: "Constitutional State Recruiting Authority for Madhya Pradesh Administrative Cadres.",
    description:
      "MPPSC is constituted under Article 315 of the Constitution of India and Section 118(3) of the States Reorganisation Act 1956. It conducts recruitment for State Civil Services (Deputy Collector, DSP, Naib Tehsildar), State Forest Service, and specialized engineering/medical wings.",
    aboutDetails: [
      "Constituted on 1 November 1956 with the reorganization of Madhya Pradesh state.",
      "Headquartered in the commercial hub of Indore, conducting exams across 55 districts.",
      "Conducts flagship State Service Exam (SSE), State Engineering Exam (SES), and Assistant Professor examinations.",
    ],
    selectionProcess: [
      "Preliminary Examination (OMR-based General Studies Paper I & CSAT Paper II)",
      "Main Written Examination (6 Descriptive Papers in Hindi/English)",
      "Interview / Personality Assessment at MPPSC Headquarters, Indore",
    ],
    keyDepartments: [
      "General Administration Department (State Civil Services)",
      "Home Police Department (Deputy Superintendent of Police - DSP)",
      "Commercial Tax & Excise Department",
      "Revenue Department (Naib Tehsildar & Sub-Registrar)",
    ],
    faqs: [
      {
        question: "Can candidates from other states apply for MPPSC examinations?",
        answer:
          "Yes. Candidates from all Indian states can apply for MPPSC vacancies under the Unreserved (Open) category, provided they meet educational and age criteria.",
      },
    ],
    stats: {
      activeVacanciesCount: 1,
      totalPostsCount: 1240,
      admitCardsCount: 1,
      resultsCount: 1,
    },
  },
];

/**
 * Returns all organization profiles
 */
export async function getAllOrganizationProfiles(): Promise<OrganizationProfile[]> {
  return MOCK_ORGANIZATION_PROFILES;
}

/**
 * Returns all organization slugs for dynamic route validation
 */
export function getAllOrganizationSlugs(): string[] {
  return MOCK_ORGANIZATION_PROFILES.map((org) => org.slug);
}

/**
 * Returns single organization profile by slug (case-insensitive)
 */
export async function getOrganizationProfileBySlug(slug: string): Promise<OrganizationProfile | null> {
  const clean = slug.toLowerCase().trim();
  const profile = MOCK_ORGANIZATION_PROFILES.find(
    (org) => org.slug.toLowerCase() === clean || org.shortName.toLowerCase() === clean
  );
  return profile || null;
}

/**
 * Returns all recruitment posts matching the organization name or acronym
 */
export async function getOrganizationJobs(orgSlugOrShortName: string): Promise<JobPosting[]> {
  const clean = orgSlugOrShortName.toLowerCase().trim();
  const profile = await getOrganizationProfileBySlug(clean);

  return MOCK_JOB_POSTINGS.filter((job) => {
    const orgField = job.organization.toLowerCase();
    const titleField = job.title.toLowerCase();

    if (profile) {
      if (orgField.includes(profile.shortName.toLowerCase())) return true;
      if (orgField.includes(profile.name.toLowerCase())) return true;
      if (titleField.includes(profile.shortName.toLowerCase())) return true;
    }

    return orgField.includes(clean) || titleField.includes(clean);
  });
}

/**
 * Returns related recruitment bodies in the same sector or type
 */
export async function getRelatedOrganizations(
  currentSlug: string,
  categoryType: string,
  limit: number = 3
): Promise<OrganizationProfile[]> {
  const related = MOCK_ORGANIZATION_PROFILES.filter(
    (org) => org.slug !== currentSlug && org.categoryType === categoryType
  );

  if (related.length >= limit) {
    return related.slice(0, limit);
  }

  const others = MOCK_ORGANIZATION_PROFILES.filter(
    (org) => org.slug !== currentSlug && org.categoryType !== categoryType
  );

  return [...related, ...others].slice(0, limit);
}
