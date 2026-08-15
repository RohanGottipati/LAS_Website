/**
 * All homepage copy lives here so it can be edited without touching layout or
 * motion code. Numbers in `stats` are placeholders — swap them for real ones.
 */

export const site = {
  name: 'LAS Club',
  tagline: 'Liberal Arts & Sciences student society',
  email: 'hello@lasclub.org',
} as const

export const nav = [
  { label: 'About', href: '#about' },
  { label: 'Team', href: '#team' },
  { label: 'Events', href: '#events' },
  { label: 'Future Events', href: '#future-events' },
  { label: 'FAQ', href: '#faq' },
] as const

export const hero = {
  headlineLines: [
    'A student-led club for',
    'people who take craft,',
    'curiosity and community',
    'seriously.',
  ],
  cta: { label: 'Join the club', href: '#future-events' },
  secondary: { label: 'See what we do', href: '#about' },
} as const

export const practices = [
  { name: 'Writing circle', note: 'Weekly, Thursdays' },
  { name: 'Debate lab', note: 'Motions & rebuttals' },
  { name: 'Design studio', note: 'Posters, zines, type' },
  { name: 'Reading group', note: 'One text a month' },
  { name: 'Film society', note: 'Screen & discuss' },
  { name: 'Field research', note: 'Campus & city' },
  { name: 'Music sessions', note: 'Open rehearsal' },
  { name: 'Archive nights', note: 'Library deep dives' },
] as const

export const bridge = {
  eyebrow: 'What we practise',
  statement: 'Eight standing programmes, one shared standard: make something worth defending.',
  cta: { label: 'Browse the programmes', href: '#events' },
} as const

export const ecosystem = {
  eyebrow: 'Inside the club',
  title: 'A small society with a wide surface area.',
  cards: [
    {
      title: 'Workshops',
      body: 'Hands-on sessions run by members and visiting alumni.',
      art: '/art/grid-workshop.webp',
      alt: 'Painting of a dance class rehearsing in a studio',
    },
    {
      title: 'Socials',
      body: 'Low-stakes evenings that make the high-stakes work possible.',
      art: '/art/grid-outing.webp',
      alt: 'Painting of friends boating on bright water',
    },
    {
      title: 'Studio nights',
      body: 'Open tables, shared materials, quiet company until late.',
      art: '/art/grid-studio.webp',
      alt: 'Still life painting of apples and a pot of primroses on a table',
    },
    {
      title: 'Reading groups',
      body: 'One text a month, read closely, argued generously.',
      art: '/art/grid-study.webp',
      alt: 'Painting of a young woman knitting by a window',
    },
  ],
} as const

export const framework = {
  eyebrow: 'How a semester works',
  title: 'Taste is a framework, not a talent.',
  steps: [
    {
      title: 'Week 1 — Orientation',
      body: 'Meet the programmes, pick two, commit to a term project.',
    },
    {
      title: 'Weeks 2–9 — Practice',
      body: 'Weekly sessions, peer critique, and one public checkpoint.',
    },
    {
      title: 'Week 10 — Showcase',
      body: 'The club rents a room and the work has to stand on its own.',
    },
  ],
} as const

export const gallery = {
  eyebrow: 'Events',
  title: 'Nine years of evenings worth showing up for.',
  tiles: [
    { art: '/art/gallery-1.webp', caption: 'Portrait night', alt: '' },
    { art: '/art/gallery-2.webp', caption: 'Spring showcase', alt: '' },
    { art: '/art/gallery-3.webp', caption: 'Archive walk', alt: '' },
    { art: '/art/gallery-4.webp', caption: 'Founders’ dinner', alt: '' },
    { art: '/art/gallery-5.webp', caption: 'Zine fair', alt: '' },
    { art: '/art/gallery-6.webp', caption: 'Open rehearsal', alt: '' },
    { art: '/art/gallery-7.webp', caption: 'Print collectors', alt: '' },
    { art: '/art/gallery-8.webp', caption: 'Alumni panel', alt: '' },
  ],
} as const

export const impact = {
  eyebrow: 'The club by numbers',
  title: 'Small society, stubborn output.',
  note: 'Placeholder figures — replace with the committee’s current numbers.',
  stats: [
    { value: 320, suffix: '+', label: 'active members', tone: 'teal' },
    { value: 48, suffix: '', label: 'sessions a year', tone: 'butter' },
    { value: 9, suffix: ' yrs', label: 'running', tone: 'blush' },
    { value: 26, suffix: 'x', label: 'showcases hosted', tone: 'sand' },
    { value: 12, suffix: '', label: 'partner societies', tone: 'pale' },
  ],
} as const

export const joinCta = {
  eyebrow: 'Future events',
  title: 'The next room is already booked.',
  body: 'Membership opens at the start of each term. Bring a notebook and something you are working on.',
  cta: { label: 'Reserve a seat', href: '#faq' },
} as const

export const team = {
  eyebrow: 'Team',
  title: 'Run entirely by students, mentored by the people who came before.',
  body: 'A committee of nine keeps the calendar honest: two chairs, a treasurer, and a lead for each programme. Alumni return every term to critique the work and open doors.',
  quotes: [
    {
      quote: 'The critique is kind and completely unsentimental. That combination is rare.',
      author: 'Programme lead, Design studio',
    },
    {
      quote: 'I joined for the reading group and left with a portfolio.',
      author: 'Third-year member',
    },
  ],
} as const

export const finale = {
  title: 'Come make something you would defend in public.',
  cta: { label: 'Join the club', href: '#future-events' },
} as const

export const faq = [
  {
    q: 'Who can join?',
    a: 'Any enrolled student, any programme, any year. No portfolio or audition.',
  },
  {
    q: 'Is there a fee?',
    a: 'A small termly membership covers materials and the showcase venue. Bursaries are available on request.',
  },
  {
    q: 'How much time does it take?',
    a: 'One session a week plus a term project. Most members run two programmes at once.',
  },
  {
    q: 'Can I bring a friend?',
    a: 'Yes. The first session of every programme is open to guests.',
  },
] as const
