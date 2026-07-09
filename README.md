# S.T.A.R. AI Agent — Frontend Hub

Welcome to the official frontend repository for **S.T.A.R.** (Sales Targeting & Readiness Assistant), an elegant and powerful AI agent deployed on the **Croo Network**. 

S.T.A.R. serves as a sleek intelligence layer that helps sales, outreach, and business teams understand companies, shape smarter outreach, and convert cold prospects into warm momentum.

---

## 🌟 Key Features

### 1. Immersive Sales-Focused Ambient Relaxation (Background Music)
Sales outreach can be high-stress and high-tension. To address this, S.T.A.R. includes a built-in background ambient player:
- **Calming Soundtrack**: Loaded with a soothing track (`assets/1001141003-1.mp3`) designed to ease cognitive load and lower sales reps' tension.
- **Synthesizer Drone Layer**: Interwoven with a gentle, mathematically generated low-frequency synthesizer drone (55Hz base harmonics with slow LFO modulation) to create an immersive, focus-enhancing flow state.
- **Unified Audio Controls**: Effortlessly toggled via the main header's "Audio: On/Off" button or the prominent "Ambient Sound" console launcher in the hero section.

### 2. Full-Fidelity Integration & Direct Hand-off
The **Use Agent** button is fully wired to redirect the user directly to the active live AI Agent UI on the Croo Network:
- **Direct Hand-off**: Navigates directly to [S.T.A.R. on Croo Network](https://agent.croo.network/agents/888b2e91-245a-4776-b6aa-9e6fc1654a21).
- **Smooth Navigation**: Opens in a secure, new browser tab, allowing the sales rep to smoothly transition from browsing to direct strategic execution.

### 3. Highly Visible Responsive Dark & Light Themes
Designed with a meticulous visual identity that stays readable under any environmental condition:
- **Adaptive Typography**: In dark mode, the main core message ("*Meet the intelligence layer...*") transforms into pristine, high-contrast crisp white, guaranteeing maximum visibility and zero eye-strain during late-night prospecting.
- **Sleek Brand Assets**: High-resolution icons and customized favicons stay sharp and perfectly rendered across both desktop and mobile layouts.

---

## 🛠️ Local Development & Setup

This repository is built as a hybrid, full-stack application leveraging **Vite** (frontend bundler), **React 19**, **Tailwind CSS v4**, and an **Express** backend proxy. 

Follow these steps to clone, configure, and execute the repository on your local computer:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18.0.0 or higher) and [npm](https://www.npmjs.com/) installed on your local operating system.

### 1. Clone the Repository
```bash
git clone <repository-url>
cd star-frontend
```

### 2. Install Project Dependencies
Run npm install to populate the local `node_modules` folder and install all compilation and runtime engines:
```bash
npm install
```

### 3. Set Up Environment Variables (Optional)
If your app utilizes the Gemini API server-side, copy the `.env.example` file to `.env` and add your api keys:
```bash
cp .env.example .env
```
Open the `.env` file and supply any necessary keys:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run the Local Development Server
The development script launches the Express backend in tandem with the Vite frontend assets, utilizing `tsx` for real-time TypeScript execution:
```bash
npm run dev
```
Once executed, open your browser and navigate to:
```
http://localhost:3000
```

### 5. Build and Start the Production Build
To test the application exactly as it builds in production (including optimization, static file asset mapping, and minification):
```bash
# 1. Compile the React assets and bundle the server script with esbuild
npm run build

# 2. Spin up the production bundle
npm run start
```
The server will boot, hosting the static production assets on port `3000`.

---

## 🗄️ File & Asset Architecture
- `/public/assets/` — Home of the static favicons, custom agent icons, and calming audio assets (`1001141003-1.mp3`).
- `/src/components/` — Modularized UI elements including `Header.tsx`, `Footer.tsx`, and interactive panel components.
- `/src/App.tsx` — The core application view orchestrating state, Web Audio API synthesis controls, and interactive sections.
- `server.ts` — Secure server entry point configured to serve assets and securely host static folders under production environments.
