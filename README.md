# EventHub - Attendee Client

## Overview

EventHub Attendee Client is a React-based web application that allows users to discover events, register for participation, manage registrations, and share event experiences through reviews and ratings.

The application is optimized for event discovery and attendee engagement.

---

## Features

### Authentication

* User Registration
* User Login
* Google OAuth Login
* Persistent Authentication
* Protected Routes

### Event Discovery

* Browse Public Events
* Search Events
* Filter by Category
* Event Detail Pages
* Responsive Event Cards

### Event Registration

* Register for Events
* Dynamic Registration Forms
* Registration Status Tracking
* Waitlist Participation
* Registration Cancellation

### Reviews

* Submit Reviews
* Rate Events
* View User Feedback

### Notifications

* Registration Updates
* Waitlist Promotion Alerts
* Event Status Notifications

---

## Tech Stack

| Technology      | Purpose            |
| --------------- | ------------------ |
| React 19        | Frontend Framework |
| Vite            | Build Tool         |
| React Router v7 | Routing            |
| Zustand         | State Management   |
| Axios           | API Communication  |
| Bootstrap 5     | UI Components      |
| Tailwind CSS    | Styling            |
| React Icons     | Icons              |
| React Toastify  | Notifications      |

---

## Project Structure

```text
src/
├── assets/
├── components/
├── pages/
├── routes/
├── services/
├── stores/
├── hooks/
├── utils/
└── layouts/
```

---

## Main User Flows

### Event Discovery

```text
Homepage
   ↓
Search Event
   ↓
Event Details
   ↓
Register
```

### Registration Flow

```text
Open Event
   ↓
Fill Registration Form
   ↓
Submit Registration
   ↓
Pending / Approved / Waitlisted
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/Community-Event-Platform/attendee-client.git

cd attendee-client
```

### Install Dependencies

```bash
npm install
```

### Configure Environment

```env
VITE_API_URL=(ex: https://api.example.com)
```

### Start Development Server

```bash
npm run dev
```

### Build Production Version

```bash
npm run build
```

---

## Screens

### Attendee Features

* Login Page
* Register Page
* Event Listing
* Event Details
* Search & Filter
* Registration Form
* My Registrations
* Reviews & Ratings

---

## Connected Services

This application communicates with:

```text
community-event-api
```

using RESTful APIs and Bearer Token Authentication.

---

## Team

### Group 5 – Advanced Web Application Development

* Nguyễn Thị Dung
* Nguyễn Tiến Nhựt
* Hồ Thị Vãi
* Hồ Văn Tiết

Passerelles Numériques Vietnam (PNV)
