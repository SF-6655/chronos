# ⏱ Chronos

A modern productivity dashboard designed to help you track your time, build consistency, and gain insights into how you spend your day.

🔗 Live Demo: YOUR_DEPLOYMENT_URL_HERE

---

## What it does

* Track focused work sessions with a built-in timer
* Categorize activities (Study, Work, Health, Lifestyle, Side Projects, Social)
* Visualize weekly productivity trends
* View recent sessions and historical records
* Monitor productivity streaks
* Receive smart insights based on your tracked data
* See category breakdowns and time allocation percentages
* Built-in analogue and digital clocks
* Set alarms directly inside the dashboard
* Responsive auto-scaling layout for different screen sizes

---

## Who it's for

Students, freelancers, remote workers, developers, creators, and anyone who wants a clear picture of where their time is going.

Whether you're studying for exams, building projects, or managing client work, Chronos helps you stay intentional with your time.

---

## Features

### ⏱ Session Tracking

Track work sessions with a clean timer interface and automatically save entries.

### 📊 Analytics Dashboard

View productivity trends, weekly charts, category breakdowns, and historical activity.

### 🔥 Streak System

Build consistency by maintaining daily productivity streaks.

### 🧠 Smart Insights

Generate personalized observations based on your tracked sessions and habits.

### 🕒 Clock & Alarm Widgets

Built-in analogue and digital clocks with alarm functionality integrated directly into the dashboard.

### ☁️ Cloud Sync

All data is securely stored and synced using Supabase.

---

## Tech Stack

* React
* Vite
* Supabase (Authentication + Database)
* JavaScript
* CSS-in-JS Styling
* Recharts (for analytics visualizations)
* Component-Based Architecture

---

## Running Locally

### Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/chronos.git
cd chronos
```

### Install dependencies

```bash
npm install
```

### Create a .env file

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Start development server

```bash
npm run dev
```

---

## Project Structure

```text
src/
├── components/
│   ├── Timer
│   ├── WeeklyChart
│   ├── StatsCards
│   ├── SmartInsight
│   ├── RecentSessions
│   ├── SessionsTable
│   ├── AnalogueClock
│   └── DigitalClock
├── hooks/
├── lib/
├── pages/
└── styles/
```

---

## What I Learned

* Building a scalable dashboard architecture using React
* Designing responsive layouts with dynamic scaling
* Integrating Supabase Authentication and Database services
* Managing complex state across multiple interconnected widgets
* Creating reusable visualization and analytics components
* Building productivity-focused UX with real-time data updates
* Working with timers, session tracking, and data aggregation logic
* Implementing glassmorphism UI and modern dashboard design patterns

---

## Future Improvements

* Multiple alarms
* Custom productivity goals
* Calendar integration
* Session tags and filtering
* Export productivity reports
* AI-powered productivity recommendations
* Team and shared workspaces

---

Built with ❤️ using React and Supabase.