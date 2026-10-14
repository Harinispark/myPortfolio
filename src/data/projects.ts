import type { Project } from '@/types'

export const projects: Project[] = [
  {
    id: 'student-registration',
    title: 'Student Registration System',
    category: 'Backend',
    logline:
      'A database-driven web application with server-side validation, file upload, and automated email notifications.',
    bullets: [
      'Database-driven web application with server-side validation.',
      'MySQL integration for structured data storage and retrieval.',
      'File upload, resume text extraction, and automated email notifications.',
    ],
    tech: ['Java Servlets', 'JSP', 'MySQL', 'Apache Tomcat'],
    accent: 'red',
    featured: true,
    links: {},
  },
  {
    id: 'blood-donation',
    title: 'Blood Donation Management System',
    category: 'Full Stack',
    logline:
      'A full-stack donor management platform with REST API integration and structured request tracking.',
    bullets: [
      'Full-stack donor management platform with REST API integration.',
      'Structured request tracking and backend data processing.',
    ],
    tech: ['MongoDB', 'Express.js', 'React.js', 'Node.js'],
    accent: 'blue',
    featured: true,
    links: {},
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce Web Application',
    category: 'Full Stack',
    logline:
      'A responsive product listing and cart management system with dynamic routing.',
    bullets: [
      'Responsive product listing and cart management system.',
      'Dynamic routing and seamless frontend-backend interaction.',
    ],
    tech: ['React.js', 'Node.js', 'MongoDB'],
    accent: 'gold',
    featured: true,
    links: {},
  },
]