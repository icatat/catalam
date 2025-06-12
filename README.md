# Cata & Lam Wedding Website

A modern wedding website built with Next.js, featuring dual wedding celebrations in Vietnam and Romania.

## Features

- **Photo Carousel Homepage**: Beautiful sliding photo gallery with navigation controls
- **Dual Wedding Pages**: Separate pages for Vietnam and Romania celebrations
- **Detailed Itineraries**: Complete wedding day schedules for both locations
- **RSVP Functionality**: Individual RSVP forms for each wedding
- **Responsive Design**: Mobile-friendly design with Tailwind CSS
- **Modern Color Scheme**: Ivory white and light blue theme

## Pages

### Home Page (`/`)
- Interactive photo carousel
- Navigation to both wedding pages
- Overview of celebrations

### Vietnam Wedding (`/vietnam`)
- March 15, 2025 in Ho Chi Minh City
- Traditional Vietnamese ceremony details
- Complete itinerary with tea ceremony, church wedding, and reception
- RSVP form with Vietnamese cultural elements

### Romania Wedding (`/romania`)
- May 20, 2025 in Oradea
- Traditional Romanian ceremony details
- Complete itinerary with civil ceremony, orthodox wedding, and mountain celebrations
- RSVP form with Romanian cultural elements

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Technology Stack

- **Framework**: Next.js 15.3.3 with React 19
- **Styling**: Tailwind CSS 4.0
- **Language**: TypeScript
- **Deployment**: Ready for Vercel deployment

## Customization

### Adding Wedding Photos
Replace the placeholder photos in the carousel by adding actual wedding photos to the `/public` directory and updating the `photos` array in `src/app/page.tsx`.

### RSVP Form Handling
Currently, RSVP forms log to console. Integrate with your preferred backend service (e.g., Formspree, Netlify Forms, or custom API) by updating the `handleSubmit` functions in both wedding pages.

### Color Scheme
The website uses a custom color palette. Modify colors in the Tailwind classes throughout the components:
- Primary: Blue tones (blue-50, blue-100, blue-500, blue-600)
- Secondary: Slate tones (slate-50, slate-100, slate-700, slate-800)
- Background: Gradients from slate-50 to blue-50

## Deployment

The website is ready for deployment on Vercel, Netlify, or any platform that supports Next.js applications.

```bash
npm run build
npm run start
```