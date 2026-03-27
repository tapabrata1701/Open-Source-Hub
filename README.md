# 🚀 OpenSource Hub

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=blue)

A premium, full-stack community platform designed to bridge the gap between developers and open-source initiatives. Built with a focus on high-performance animations, secure architecture, and seamless GitHub integration, this platform serves as a centralized hub for discovering projects, tracking contributions, and fostering a competitive coding culture.

Ideal for scaling university technical groups or managing tech communities, this application provides everything from automated leaderboards to comprehensive admin controls.

---

## ✨ Key Features

* **Seamless Authentication (OAuth 2.0):** One-click login powered by GitHub, instantly syncing user avatars and handles, followed by a custom profile completion flow (Branch, Year, Section).
* **Automated Real-Time Leaderboard:** A dynamic ranking system driven by secure GitHub Webhooks. Points are automatically awarded and updated in the database when users push code to registered repositories.
* **Premium UI/UX & Responsive Design:** A breathtaking, fully responsive glassmorphism design utilizing a polished dark slate theme, brought to life with buttery-smooth Framer Motion page transitions and micro-interactions.
* **Role-Based Access Control (RBAC):** Secure separation between standard users and administrators. 
* **Admin Control Center:** A dedicated, protected dashboard for administrators to add/remove open-source projects, manage repository links, and track participant engagement metrics.
* **Personalized Developer Profiles:** Individual user dashboards to track leaderboard rank, total score, and the specific projects they are actively contributing to.

---

## 🛠️ Tech Stack

### Frontend Architecture
* **Framework:** React.js (Bootstrapped with Vite for optimized bundling)
* **Styling:** Tailwind CSS (Fluid responsive design & custom theming)
* **Animation:** Framer Motion (Complex layout animations and page transitions)
* **State & Feedback:** React Hot Toast (Global notifications)
* **Icons:** Lucide React

### Backend Architecture
* **Environment:** Node.js
* **Framework:** Express.js (RESTful API development)
* **Database:** MongoDB & Mongoose (Flexible, document-based data modeling)
* **Authentication:** Passport.js (GitHub Strategy)

### Security & Optimization
* **Webhook Security:** Node `crypto` (Cryptographic `x-hub-signature-256` payload verification)
* **Traffic Control:** `express-rate-limit` (DDoS and spam prevention)
* **Cross-Origin:** `cors` (Strict origin matching)

---
## 🔐 Security Architecture

* **Webhook Signature Verification:** To prevent malicious actors from spoofing leaderboard points, the `/api/webhooks/github` endpoint utilizes `crypto.timingSafeEqual` to verify the HMAC hex digest sent by GitHub.

* **Protected Routes (RBAC):** Both frontend views and backend API endpoints are protected using RBAC middleware, ensuring standard users cannot access or modify project administration data.

* **Rate Limiting:** API endpoints are protected against brute-force attacks and spam using strict rate-limiting policies.

---

**Architected and developed by Tapabrata Gayen.**
