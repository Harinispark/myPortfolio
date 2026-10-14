import type { SkillCategory } from '@/types'

export const skillCategories: SkillCategory[] = [
  {
    id: 'programming',
    label: 'Programming',
    accent: 'red',
    skills: ['Java', 'Python', 'C', 'JavaScript'],
  },
  {
    id: 'databases',
    label: 'Databases',
    accent: 'gold',
    skills: ['SQL', 'MySQL', 'MongoDB'],
  },
  {
    id: 'web-backend',
    label: 'Web & Backend',
    accent: 'blue',
    skills: ['HTML', 'CSS', 'Java Servlets', 'JSP', 'Node.js'],
  },
  {
    id: 'tools',
    label: 'Tools',
    accent: 'purple',
    skills: ['Git', 'Apache Tomcat', 'VS Code', 'IntelliJ IDEA'],
  },
  {
    id: 'languages',
    label: 'Spoken Languages',
    accent: 'gold',
    skills: ['English', 'Tamil', 'Hindi'],
  },
  {
    id: 'interests',
    label: 'Interests',
    accent: 'red',
    skills: ['Software Testing', 'Application Support', 'IT Operations'],
  },
]