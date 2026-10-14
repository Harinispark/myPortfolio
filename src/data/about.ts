export interface QuickFact {
  id: string
  label: string
  value: string
}

export interface AboutSection {
  eyebrow: string
  title: string
  paragraphs: string[]
  quickFacts: QuickFact[]
}

export const about: AboutSection = {
  eyebrow: 'The Pilot',
  title: 'About Me',
  paragraphs: [
    'Motivated Information Technology undergraduate with hands-on experience building database-driven and web-based applications.',
    'Strong interest in structured problem-solving, system workflows, and data management.',
    'Eager to begin a career in Software Testing, Application Support, or IT Operations where I can contribute and grow in a dynamic environment.',
  ],
  quickFacts: [
    { id: 'name', label: 'Name', value: 'Harini M' },
    { id: 'location', label: 'Based in', value: 'Chennai, India' },
    { id: 'studies', label: 'Studying', value: 'B.Tech IT, Kings Engineering College' },
    { id: 'focus', label: 'Aiming for', value: 'Software Testing · App Support · IT Operations' },
    { id: 'languages', label: 'Speaks', value: 'English · Tamil · Hindi' },
  ],
}