# Carbon Footprint Assistant (CARBON)

Professional-Grade Carbon Footprint Assistant — Track, analyze, and reduce your climate impact with data-driven insights. Built using a modular MERN architecture with TypeScript type safety, Bento-grid dashboard layouts, and Glassmorphism styling.

## 🚀 Key Features

- **Dynamic Bento-Grid Dashboard**: High-impact visualization of monthly carbon emissions, comparative statistics, interactive charts, and eco scores.
- **Glassmorphism Dark Mode**: Frosted-glass components, subtle gradients, and transitions designed to wow users.
- **Multi-Category Calculator Engine**: Form calculators for Travel (vehicle fuels, distance, flights), Energy (electricity, gas, heating oil), and Diet (food group weights) using authoritative emission factors.
- **Historical Analysis**: Aggregated monthly trends with interactive Line and Doughnut charts.
- **Actionable Insights & Personalized Tips**: Curated carbon-reduction suggestions prioritized by highest-emission categories.
- **Security Hardened**: AES-256-GCM email encryption, HttpOnly session cookie authorization, Express rate-limit protection, and Zod input validation schemas.

---

## 🏛️ Project Architecture

```
CARBON/
├── shared/          # Shared type definitions & Zod validation schemas
├── client/          # Vite + React + TypeScript frontend
└── server/          # Express + Mongoose + TypeScript backend
```

---

## 🛠️ Quick Start

### 1. Prerequisites
- Node.js >= 18.x
- MongoDB (local or Atlas)

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27000/carbon
JWT_SECRET=super-secret-jwt-key
JWT_REFRESH_SECRET=super-secret-refresh-key
ENCRYPTION_KEY=32_bytes_hex_string_for_aes_gcm
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Installation
Install all dependencies for root workspace and sub-packages:
```bash
npm install
```

### 4. Running the App
Run both frontend and backend concurrently in development mode:
```bash
npm run dev
```

---

## 🧪 Testing

Both client and server include comprehensive Vitest suites:

- **Run Server Tests**: `npm run test -w server`
- **Run Client Tests**: `npm run test -w client`
- **Run All Workspace Tests**: `npm run test`
