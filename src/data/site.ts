export const brand = {
  name: 'Laurier Analytics Society',
  short: 'LAS'
};

export const navLinks = [
{ label: 'About', href: '#about' },
{ label: 'Impact', href: '#impact' },
{ label: 'Initiatives', href: '#initiatives' },
{ label: 'Team', href: '#team' },
{ label: 'Datathon', href: '#datathon' },
{ label: 'FAQ', href: '#faq' }];


export const aboutParagraphs = [
'The Laurier Analytics Society (LAS) is Wilfrid Laurier University\u2019s student-run data community \u2014 the home for anyone who works with numbers, models, dashboards and messy spreadsheets.',
'We turn coursework into career capital: hands-on workshops, case competitions, industry mentorship and a datathon that ships real analysis for real partners.'];


export const aboutFacts = [
{ k: 'Founded', v: '2019' },
{ k: 'Portfolios', v: '06' },
{ k: 'Campus', v: 'Waterloo' }];


export const stats = [
{ value: 24, suffix: '+', label: 'Events per year', detail: 'workshops / socials / panels' },
{ value: 38, suffix: '', label: 'Executive members', detail: 'across 6 portfolios' },
{ value: 2400, suffix: '+', label: 'Students reached', detail: 'BBA, Fin Math, DS, Econ' },
{ value: 96, suffix: '%', label: 'Would return', detail: 'post-event survey, 2026' }];


export const impactEvents = [
{
  label: 'Analytics Bootcamp',
  meta: '1,840 seats · 92% attendance',
  images: ["/b0fe33a0-c9c2-4ffd-aee3-f8494ae0cdca.jpg", "/d1853298-0a78-455a-90e2-c3e7e14e3bda.jpg", "/01f72e1a-b10e-401f-9544-526c9cd83eb0.jpg"]




},
{
  label: 'Case Competition Circuit',
  meta: '312 competitors · 74% participation',
  images: ["/4365f002-726a-40b2-9eb6-da5851a478e5.jpg", "/40a3f51e-9fb8-4e47-b98d-492548e9197a.jpg", "/fd6d0476-489a-451f-955b-f990ac772fe2.jpg"]




},
{
  label: 'Speaker Series',
  meta: '18 partner companies · 9 sessions',
  images: ["/f204cfa3-9065-407a-bc2b-e4ccb53b7ad0.jpg", "/f9cf5e5f-5208-432f-a21a-83bf08464618.jpg", "/63977fc0-5799-4d9f-9f7d-7cd392fa6072.jpg"]




},
{
  label: 'Mentorship Program',
  meta: '146 pairs · 83% match rate',
  images: ["/cd2122a3-f97c-4677-8e5d-a0c2f85d4dbc.jpg", "/02115bde-205e-4837-8da2-cde98f486c37.jpg", "/d15ed4b8-550e-4dd4-9fe9-a700f9add1f8.jpg"]




},
{
  label: 'LAS Datathon',
  meta: '350 participants · 71 reported offers',
  images: ["/394422da-f151-4fe1-a529-0ff189cea3ec.jpg", "/2d03bf79-f6c0-4b51-9205-8eb689d343fb.jpg", "/87b9a3f5-3ab1-48c4-b12e-902f6346af24.jpg"]




}];


export const impactSeries = [
{ year: '2021', value: 180 },
{ year: '2022', value: 410 },
{ year: '2023', value: 760 },
{ year: '2024', value: 1290 },
{ year: '2025', value: 1880 },
{ year: '2026', value: 2400 }];


export const initiatives = [
{
  code: 'INIT_01',
  title: 'Analytics Bootcamp',
  blurb: 'A six-week track through SQL, Python and dashboarding. Students leave with a portfolio project and a reviewed resume.',
  tags: ['SQL', 'Python', 'Power BI'],
  metric: '6 weeks / 120 seats',
  href: '#newsletter'
},
{
  code: 'INIT_02',
  title: 'Case Competition Circuit',
  blurb: 'Monthly analytics cases with real partner datasets, judged by alumni working in consulting, banking and product.',
  tags: ['Cases', 'Judging', 'Prizes'],
  metric: '8 cases / $6K awarded',
  href: '#impact'
},
{
  code: 'INIT_03',
  title: 'Mentorship Program',
  blurb: 'First and second years get paired with upper-year students and alumni for structured monthly check-ins.',
  tags: ['1:1', 'Alumni', 'Career'],
  metric: '146 matches',
  href: '#faq'
},
{
  code: 'INIT_04',
  title: 'Speaker Series',
  blurb: 'Practitioners from Shopify, RBC, Deloitte and Wealthsimple break down how decisions actually get made with data.',
  tags: ['Panels', 'Networking'],
  metric: '9 sessions / yr',
  href: '#impact'
},
{
  code: 'INIT_05',
  title: 'Research Lab',
  blurb: 'Small teams publish open analyses on campus life, markets and sports \u2014 with code reviewed by faculty advisors.',
  tags: ['Open data', 'Notebooks'],
  metric: '11 papers shipped',
  href: '#team'
},
{
  code: 'INIT_06',
  title: 'LAS Newsletter',
  blurb: 'A biweekly signal-over-noise digest: events, deadlines, internships and one chart worth your attention.',
  tags: ['Biweekly', 'Free'],
  metric: '2,400 subscribers',
  href: '#newsletter'
}];


export const team = [
{ name: 'Amara Singh', role: 'President', focus: 'BBA + Data Science' },
{ name: 'Daniel Okafor', role: 'VP Operations', focus: 'Financial Math' },
{ name: 'Priya Raman', role: 'VP Analytics', focus: 'Computer Science' },
{ name: 'Ethan Wolfe', role: 'VP Events', focus: 'Economics' },
{ name: 'Mei Tanaka', role: 'VP Partnerships', focus: 'BBA + Finance' },
{ name: 'Omar Haddad', role: 'VP Marketing', focus: 'Digital Media' },
{ name: 'Sofia Castillo', role: 'Director, Datathon', focus: 'Data Science' },
{ name: 'Liam Brooks', role: 'Director, Education', focus: 'Statistics' }];


export const datathonStats = [
{ k: 'Participants', v: '350' },
{ k: 'Hours', v: '36' },
{ k: 'Prize pool', v: '$15K' },
{ k: 'Partners', v: '12' }];


export const datathonTracks = [
{ title: 'Campus Ops', blurb: 'Optimize scheduling, transit and space usage with live Laurier operational data.' },
{ title: 'Markets', blurb: 'Build a signal, backtest it honestly, and defend it to a room of quants.' },
{ title: 'Social Good', blurb: 'Partner with Waterloo Region nonprofits to turn their raw records into decisions.' }];


export const sponsors = [
'SHOPIFY',
'RBC',
'DELOITTE',
'WEALTHSIMPLE',
'MANULIFE',
'SUN LIFE',
'OPENTEXT',
'TD',
'KPMG',
'DATABRICKS'];


export const faqs = [
{
  q: 'Do I need to know how to code?',
  a: 'No. About a third of our members join with zero code experience. The Analytics Bootcamp starts from a blank spreadsheet and takes you to a working Python notebook.'
},
{
  q: 'Which programs can join?',
  a: 'All of them. We draw heavily from BBA, Financial Math, Data Science, Computer Science and Economics, but every Laurier student is welcome regardless of faculty or year.'
},
{
  q: 'Is there a membership fee?',
  a: 'General membership is free. Some flagship events (the datathon banquet, for example) have a small ticket cost to cover food and venue.'
},
{
  q: 'How do I join the executive team?',
  a: 'Applications open every March for the following academic year, plus a smaller round in September. Subscribe to the newsletter and we will send the form the day it opens.'
},
{
  q: 'Where do events happen?',
  a: 'Mostly the Lazaridis School and the Science Building on the Waterloo campus, with a few hybrid sessions streamed for Brantford students.'
}];


export const socials = [
{ label: 'Instagram', handle: '@laurier_analytics', url: 'https://www.instagram.com/laurier_analytics' },
{ label: 'LinkedIn', handle: '/company/laurier-analytics-society-las', url: 'https://www.linkedin.com/company/laurier-analytics-society-las' },
{ label: 'Newsletter', handle: 'Biweekly digest', url: '#newsletter' }];