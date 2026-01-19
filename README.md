# Vidya Yathra Main EL

A comprehensive learning platform with a Socratic AI tutor (Backend) and a modern, gamified UI (Frontend).

## 🚀 Project Overview

This project consists of two main components:
1.  **Backend**: A Socratic AI tutor built with Mastra, Express, and Google Gemini.
2.  **Frontend**: A React application featuring a Neon-tech dark theme, gamified dashboard, and interactive learning components.

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)

---

## 📁 Project Structure

```text
vidya-yathra-main-el/
├── backend/          # AI Agent and API Logic
├── frontend/         # React Application
└── ... (documentation files)
```

---

## ⚙️ Backend Setup

### 1. Install Dependencies
Navigate to the `backend` directory and install the required packages:
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend` directory by copying the example file:
```bash
cp .env.example .env
```
Open `.env` and fill in your API keys and database credentials:
- `GEMINI_API_KEY`: Your Google Gemini API key.
- `OPENAI_API_KEY`: (Optional) Your OpenAI API key.
- `QDRANT_URL` & `QDRANT_API_KEY`: For vector storage.
- `PGVECTOR_*`: If using Postgres with PGVector.

### 3. Run the Backend
Start the backend server:
```bash
npm run api
```
The server usually runs on `http://localhost:3000` (or as configured in the source).

---

## 💻 Frontend Setup

### 1. Install Dependencies
Navigate to the `frontend` directory and install the required packages:
```bash
cd frontend
npm install
```

### 2. Configure Environment Variables
Ensure you have a `.env` file in the `frontend` directory. At minimum, it should include:
```text
VITE_NEON_AUTH_URL=your_neon_auth_url
```
*(Check the `frontend/.env` file for existing configuration)*

### 3. Run the Frontend
Start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## 📜 Available Scripts

### Backend
- `npm run dev`: Run the orchestrator route.
- `npm run start` / `npm run api`: Start the API server.
- `npm run ingest`: Ingest data into the RAG system.
- `npm run reindex`: Reindex the vector store.

### Frontend
- `npm run dev`: Start development server.
- `npm run build`: Build for production.
- `npm run lint`: Run ESLint.
- `npm run preview`: Preview the production build.

---

## 📘 Documentation
Refer to the following files for deeper insights:
- `ARCHITECTURE.md`: Technical architecture overview.
- `MAP_FEATURE.md`: Details about the learning map.
- `PROGRESSION_SYSTEM.md`: Explanation of the gamification/leveling system.
- `QUIZ_HISTORY_FEATURE.md`: How quiz history is tracked.
