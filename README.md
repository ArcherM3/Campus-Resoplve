<div align="center">

<img src="CR.png" alt="CampusResolve Logo" width="100" height="100" />

# CampusResolve

### *Report. Track. Resolve.*

A full-stack campus complaint management system built for **NIT Silchar** — connecting students with administrators for fast, transparent issue resolution.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-A75F37?style=for-the-badge&logo=vercel&logoColor=white)](https://your-live-link.com)
[![Backend](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://web-wizards-backend.onrender.com)
[![Made with](https://img.shields.io/badge/Made%20with-HTML%20%7C%20CSS%20%7C%20JS-F2E7DD?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/License-MIT-7A958F?style=for-the-badge)](#)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Screenshots](#screenshots)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Team](#team)

---

## Overview

**CampusResolve** is a web-based complaint management portal that empowers NIT Silchar students to raise, track, and get campus issues resolved — from hostel maintenance to IT problems — without chasing anyone down. Admins get a real-time dashboard to triage, manage, and close complaints efficiently.

```
Student raises complaint → Auto-routed to department → Admin reviews → Status updated → Resolved ✓
```

---

## Screenshots

> *Below is a visual walkthrough of the key pages.*

### 🏠 Home Page
```
┌──────────────────────────────────────────────────────────┐
│  CampusResolve                    Home | Complaint | Dept │
│──────────────────────────────────────────────────────────│
│                                                          │
│   Campus issues,                    [ Total: __ ]        │
│   resolved fast.                    [ Resolved: __ ]     │
│                                     [ Efficiency: 0% ]   │
│   [Raise a Complaint]  See how →                         │
└──────────────────────────────────────────────────────────┘
```

### 🎓 Student Profile Dashboard
```
┌──────────────────────────────────────────────────────────┐
│  [ Avatar ]  Rohan Ali            Scholar ID: 25CS10072  │
│              Email: rohan@nits.ac.in       [Log Out]     │
│──────────────────────────────────────────────────────────│
│  Dashboard                        Complaint Summary      │
│  ┌──────────────┐ ┌─────────────┐ ┌────────────────┐    │
│  │ 📄 Submitted │ │ ✅ Resolved │ │ 🕐 Open        │    │
│  │      12      │ │      9      │ │       3        │    │
│  └──────────────┘ └─────────────┘ └────────────────┘    │
│              [View all submitted] [View open complaints]  │
└──────────────────────────────────────────────────────────┘
```

### 🔧 Admin Dashboard
```
┌──────────────────────────────────────────────────────────┐
│  [ Avatar ]  Sarah Mitchell       Dept: Infrastructure   │
│              Position: Administrator        [Log Out]    │
│──────────────────────────────────────────────────────────│
│  ┌──────────────────────────────────────────────────┐    │
│  │  📋 Total: 28  ✅ Resolved: 20  🕐 Open: 8      │    │
│  └──────────────────────────────────────────────────┘    │
│         [View all registered ↗]  [View open complaints ↗]│
│──────────────────────────────────────────────────────────│
│  ID         Description       Date        Status         │
│  #CMP-001   Broken fan...     12 Apr      [In Progress ▼]│
│  #CMP-002   WiFi outage...    14 Apr      [Open      ▼]  │
└──────────────────────────────────────────────────────────┘
```

---

## Features

### For Students

| Feature | Description |
|---|---|
| 🔐 **Secure Signup & Login** | Register with your `@nits.ac.in` email, scholar ID, and photo |
| 📝 **Raise a Complaint** | Fill a structured form with title, description, department, and optional file attachment |
| 📊 **Personal Dashboard** | View total submitted, resolved, and open complaint counts with animated progress bars |
| 📋 **Complaint History** | Expandable panels showing all submitted and in-progress complaints |
| 🖼️ **Avatar Upload** | Click-to-change profile photo with optimistic preview and status feedback |

### For Admins

| Feature | Description |
|---|---|
| 🏢 **Department-scoped View** | Each admin sees only complaints routed to their department |
| 📈 **Live Metrics Dashboard** | Real-time totals for registered, resolved, and open complaints with animated fill bars |
| 🔄 **Status Management** | Inline dropdown to move complaints between `Open → In Progress → Resolved` |
| 🚦 **Auto Table Migration** | Changing status instantly moves the row between the "All Registered" and "Open" tables — no page reload |
| 🔍 **Complaint Search** | Filter any table by complaint ID in real time |
| 🖼️ **Avatar Upload** | Same smooth photo-change experience as students |

### Platform-wide

| Feature | Description |
|---|---|
| 🧭 **Smart Navbar** | Dynamically switches between Login/Signup buttons and a profile icon based on auth state |
| 🔁 **Auto Role Routing** | After login, admins land on the admin dashboard; students land on the home page |
| 📱 **Responsive Design** | Mobile-optimised layouts for profile cards, tables, and the navbar |
| 🎨 **Warm Editorial Theme** | Consistent design system with copper, vanilla, and charcoal colour palette across all pages |
| 🔒 **JWT Auth** | Token-based authentication with `localStorage` persistence across page navigations |
| ☁️ **Cloudinary Avatars** | Profile photos stored on Cloudinary, returned as absolute URLs |

---

## Tech Stack

### Frontend
```
HTML5  ·  CSS3 (Custom Properties)  ·  Vanilla JavaScript (ES6+)
Fonts: Playfair Display · DM Sans (Google Fonts)
```

### Backend
```
FastAPI (Python)  ·  JWT Authentication  ·  Cloudinary (image storage)
Hosted on: Render   →   https://web-wizards-backend.onrender.com
```

### Design System

```css
--copper:   #A75F37   /* Primary accent  */
--vanilla:  #F2E7DD   /* Background / light text */
--tan:      #D9B99F   /* Secondary text  */
--black:    #1E1B18   /* Card backgrounds */
--green:    #7A958F   /* Success / resolved */
```

---

## Project Structure

```
CampusResolve/
│
├── index.html              # Landing page with hero, stats & how-it-works
├── index.css
│
├── login.html              # Unified login with role query-param routing
├── login.css
│
├── role.html               # Role selector (Student / Admin)
├── role.css
│
├── signup2.html            # Student registration
├── signup2.js
├── signup.css
│
├── admin-signup.html       # Admin registration
├── admin-signup.js
├── admin-signup.css
│
├── stud-profile.html       # Student dashboard & complaint panels
├── stud-profile.js
├── stud-profile.css
│
├── admin-profile.html      # Admin dashboard & complaint management
├── admin-profile.js
├── admin-profile.css
│
├── complaint.html          # Complaint submission form
├── complaint.css
│
├── dept1.html              # Department directory
├── dept1.css
│
├── navbar.js               # Shared navbar auth logic & logout
├── navbar.css
│
└── assets/                 # Images: CR.png, NITS.svg, step icons, dept photos
```

---

## Getting Started

CampusResolve is a **static frontend** — no build step required.

### 1. Clone the repo
```bash
git clone https://github.com/your-org/campusresolve.git
cd campusresolve
```

### 2. Serve locally

Using VS Code Live Server, or any static file server:
```bash
# Python
python -m http.server 8080

# Node.js
npx serve .
```

### 3. Open in browser
```
http://localhost:8080
```

> **Note:** The backend is already deployed at `https://web-wizards-backend.onrender.com` — no local backend setup needed.

### Student Demo Flow
1. Go to `signup2.html` → sign up with any `@nits.ac.in` email
2. Login via `login.html?role=student`
3. Raise a complaint at `complaint.html`
4. Track it on your dashboard at `stud-profile.html`

### Admin Demo Flow
1. Go to `admin-signup.html` → sign up and choose a department
2. Login via `login.html?role=admin`
3. Manage complaints on `admin-profile.html`

---

## API Reference

All endpoints are on `https://web-wizards-backend.onrender.com`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/signup/student` | Student registration (multipart) |
| `POST` | `/auth/signup/admin` | Admin registration (multipart) |
| `POST` | `/auth/login/student` | Student login → JWT token |
| `POST` | `/auth/login/admin` | Admin login → JWT token |
| `GET` | `/student/me` | Authenticated student profile |
| `GET` | `/admin/me` | Authenticated admin profile |
| `PATCH` | `/student/avatar` | Upload student profile photo |
| `PATCH` | `/admin/avatar` | Upload admin profile photo |
| `POST` | `/complaints/complaint/raise` | Raise a new complaint |
| `GET` | `/complaints/student/my-complaints` | Student's own complaints |
| `GET` | `/complaints/admin/my-complaints` | Department complaints (admin) |
| `GET` | `/complaints/complaint/student/stats` | Student complaint stats |
| `GET` | `/complaints/complaint/admin/stats` | Admin department stats |
| `PATCH` | `/complaints/complaint/{id}/status` | Update complaint status |

All protected routes require: `Authorization: Bearer <token>`

---

## How It Works

```
 [Student]                    [Backend]                   [Admin]
     │                            │                           │
     │── POST /complaints ────────▶                           │
     │                            │── routes to department ──▶│
     │                            │                           │── PATCH status: in_progress
     │◀── status: open ───────────│◀──────────────────────────│
     │                            │                           │── PATCH status: resolved
     │◀── status: resolved ───────│◀──────────────────────────│
```

---

## Team

Built with ❤️ by **WebWizards** — a team of 4 developers from NIT Silchar.

---

<div align="center">

© 2026 CampusResolve · National Institute of Technology Silchar · All rights reserved

*Designed & Developed by WebWizards*

</div>
