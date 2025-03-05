# [Movies App](https://movies-app-next-js-pi.vercel.app/)
A Next.js movies application that fetches data using the TMDB API. The app features client-side interactivity, server-side API routes for security. The app uses TypeScript for type safety and global CSS for styling.
![IMG1](./screenshots/Screenshot%202025-03-05%20154921.jpg)
![IMG2](./screenshots/Screenshot%202025-03-05%20155149.jpg)

## Table of Contents

- [Getting Started](#getting-started)
- [Features](#features)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Environment Variables](#environment-variables)

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

---

## Features

- Fetches movies data from the TMDB API.
- Client-side interactivity with React hooks.
- Server-side API routes for secure data fetching.
- TypeScript for type safety.
- Global CSS for consistent styling.

---

## Technologies

- Next.js
- React
- TypeScript
- Bootstrap
- FontAwesome

---

## Project Structure

```
/movies-app
    ├── app/
    │   ├── api/
    │   │   └── movies/
    │   │       └── route.ts
    │   ├── movie/
    │   │   └── [id]/
    │   │       └── page.tsx
    │   ├── components/
    │   │   └── Footer.tsx
    │   └── page.tsx
    ├── public/
    ├── styles/
    ├── package.json
    └── README.md
```

---

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
     ```bash
     git clone https://github.com/your-username/movies-app.git
     ```
2. Navigate to the project directory:
     ```bash
     cd movies-app
     ```
3. Install dependencies:
     ```bash
     npm install
     ```

### Environment Variables

Create a `.env.local` file in the root directory and add the following environment variables:

```
API_KEY=your_tmdb_api_key
API_URL_POPULAR=https://api.themoviedb.org/3/movie/popular
API_URL_SEARCH=https://api.themoviedb.org/3/search/movie
```

Replace `your_tmdb_api_key` with your actual TMDB API key.

---

