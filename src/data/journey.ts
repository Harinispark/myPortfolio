import type { Season } from '@/types'

export const seasons: Season[] = [
  {
    id: 's01',
    code: 'S01',
    title: 'The Beginning',
    period: '2022',
    accent: 'red',
    episodes: [
      {
        id: 's01e01',
        code: 'S01E01',
        title: 'Roll Call',
        summary:
          'Starts the B.Tech in Information Technology at Kings Engineering College.',
        tags: ['Education'],
      },
    ],
  },
  {
    id: 's02',
    code: 'S02',
    title: 'Learning the Craft',
    period: '2024',
    accent: 'gold',
    episodes: [
      {
        id: 's02e01',
        code: 'S02E01',
        title: 'The Workshop',
        summary:
          'Completes the UI/UX Workshop at Retech Solutions and picks up design fundamentals.',
        tags: ['UI/UX'],
      },
      {
        id: 's02e02',
        code: 'S02E02',
        title: 'First Internship',
        summary:
          'Joins Corizo edTech as a Web Development Intern for two months of hands-on frontend work.',
        period: 'Sep – Oct 2024',
        tags: ['Internship'],
        bullets: [
          'Built responsive UI components with HTML, CSS, and JavaScript.',
          'Collaborated with the team on interface consistency across screens.',
        ],
      },
    ],
  },
  {
    id: 's03',
    code: 'S03',
    title: 'Building Projects',
    /** Confirmed by Harini — spans the 2024–2025 project streak. */
    period: '2024 – 2025',
    accent: 'blue',
    episodes: [
      {
        id: 's03e01',
        code: 'S03E01',
        title: 'Student Registration System',
        summary:
          'A Java Servlets and JSP application with MySQL storage, file upload, and automated emails.',
        tags: ['Java', 'MySQL'],
      },
      {
        id: 's03e02',
        code: 'S03E02',
        title: 'Blood Donation Management System',
        summary:
          'A MERN-stack donor management platform with REST APIs and structured request tracking.',
        tags: ['MERN'],
      },
      {
        id: 's03e03',
        code: 'S03E03',
        title: 'E-Commerce Web Application',
        summary:
          'A React and Node.js storefront with dynamic routing, product listings, and cart management.',
        tags: ['React', 'Node.js'],
      },
    ],
  },
  {
    id: 's04',
    code: 'S04',
    title: 'Industry Exposure',
    period: '2025',
    accent: 'purple',
    episodes: [
      {
        id: 's04e01',
        code: 'S04E01',
        title: 'Inside the AFC Department',
        summary:
          'Interns at Chennai Metro Rail Limited, documenting Automated Fare Collection workflows.',
        period: 'Jul 2025',
        tags: ['Internship'],
      },
      {
        id: 's04e02',
        code: 'S04E02',
        title: 'Into the Cloud',
        summary:
          'Earns the Introduction to Cloud certification from IBM SkillsBuild.',
        tags: ['Certification'],
      },
    ],
  },
  {
    id: 's05',
    code: 'S05',
    title: "What's Next",
    period: '2026',
    accent: 'red',
    episodes: [
      {
        id: 's05e01',
        code: 'S05E01',
        title: 'Graduation & Beyond',
        summary:
          'Graduating and seeking roles in Software Testing, Application Support, or IT Operations.',
        tags: ['Looking ahead'],
      },
    ],
  },
]