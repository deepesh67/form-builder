# Full-Stack Dynamic Form Builder

A modern full-stack web application that enables administrators to create, customize, publish, and manage dynamic forms without writing code. The platform provides a complete no-code solution for building forms, collecting responses, managing submissions, exporting data, and analyzing form performance through a clean and responsive user interface.

## Live Deployment

### Frontend

Live Application:
https://form-builder-eight-eta.vercel.app/

### Backend

API Base URL:
https://form-builder-hzve.onrender.com

### Deployment Stack

```text
Frontend (Vercel)
        │
        ▼
Backend API (Render)
        │
        ▼
MongoDB Atlas
```

---

## Admin Credentials

### Primary Admin

Email: `deepesh4938@gmail.com`
Password: `1234567`

### Secondary Admin

Email: `khushijangid7737@gmail.com`
Password: `123456`

---

## Features

### Form Builder

* Drag-and-Drop Form Builder
* Dynamic Form Creation
* Field Configuration Panel
* Real-Time Form Preview
* Custom Labels and Placeholders
* Required Field Validation
* Form Publishing and Sharing

### Supported Field Types

* Text Input
* Email Input
* Number Input
* Text Area
* Dropdown Select
* Radio Buttons
* Checkboxes
* Date Picker
* File Upload
* Signature Field

### Form Management

* Create Forms
* Edit Forms
* Delete Forms
* Publish Forms
* Public Form Access
* Form Sharing via URL

### Response Management

* Store Form Responses
* View Submitted Responses
* Duplicate Submission Prevention
* Response Table View
* CSV Export Functionality

### Authentication & Security

* JWT Authentication
* Protected Routes
* Role-Based Access Control
* Secure API Access
* Password Hashing

### Analytics

* Total Forms Count
* Total Responses Count
* Dashboard Overview
* Submission Tracking

### User Experience

* Fully Responsive Design
* Mobile-Friendly Interface
* Modern UI Components
* Fast Form Rendering
* Real-Time Validation

---

## Technology Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* React Hook Form
* Axios
* DnD Kit
* Lucide React

### Backend

* Node.js
* Express.js
* JWT Authentication
* REST APIs
* Express Validator

### Database

* MongoDB Atlas
* Mongoose ODM

### Deployment

* Vercel (Frontend Hosting)
* Render (Backend Hosting)
* MongoDB Atlas (Database)

---

## Project Architecture

```text
User
 │
 ▼
Frontend (React + Vite)
 │
 ▼
REST API (Node.js + Express)
 │
 ▼
MongoDB Atlas
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/deepesh67/form-builder.git
cd form-builder
```

### Backend Setup

```bash
cd server
npm install
npm run dev
```

Backend will start on:

```text
http://localhost:5000
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend will start on:

```text
http://localhost:5173
```

---

## Environment Variables

### Backend Environment Variables

Create a `.env` file inside the `server` directory.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### Frontend Environment Variables

Create a `.env` file inside the `client` directory.

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Production Environment Variables

### Backend (Render)

```env
PORT=10000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=https://form-builder-eight-eta.vercel.app
```

### Frontend (Vercel)

```env
VITE_API_URL=https://form-builder-hzve.onrender.com/api
```

---

## Project Structure

```text
form-builder/
│
├── client/
│   ├── public/
│   │
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   │
│   │   ├── components/
│   │   │   ├── builder/
│   │   │   │   ├── Canvas.jsx
│   │   │   │   ├── FieldSettings.jsx
│   │   │   │   ├── Preview.jsx
│   │   │   │   ├── ResponsesTable.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   │
│   │   │   ├── fields/
│   │   │   │   └── SignaturePad.jsx
│   │   │   │
│   │   │   └── shared/
│   │   │       └── Navbar.jsx
│   │   │
│   │   ├── constants/
│   │   │   └── fieldTypes.js
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── Builder.jsx
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   └── Responses.jsx
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   │
│   │   │   └── public/
│   │   │       ├── LandingPage.jsx
│   │   │       ├── PublicForm.jsx
│   │   │       └── Success.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── formController.js
│   │   │   └── responseController.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── role.js
│   │   │
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Form.js
│   │   │   └── Response.js
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── form.js
│   │   │   └── response.js
│   │   │
│   │   ├── seed.js
│   │   └── index.js
│   │
│   ├── package.json
│   └── .env
│
├── README.md
├── package.json
└── package-lock.json
```

---

## API Overview

### Authentication APIs

* Register User
* Login User
* JWT Token Generation
* Protected Routes

### Form APIs

* Create Form
* Update Form
* Delete Form
* Get All Forms
* Get Single Form

### Response APIs

* Submit Form Response
* Get Responses
* Export Responses
* Duplicate Submission Validation

---

## Key Highlights

* Full-Stack MERN Architecture
* No-Code Form Creation Platform
* Drag-and-Drop Form Builder
* Real-Time Form Preview
* Dynamic Field Configuration
* File Upload Support
* Signature Field Support
* Duplicate Submission Prevention
* CSV Export Functionality
* JWT Authentication
* Role-Based Access Control
* MongoDB Atlas Integration
* Production Deployment on Vercel and Render
* Responsive User Interface
* Scalable Project Structure
* Production-Ready Codebase

---

## Developer

Deepesh

Email: [deepesh4938@gmail.com](mailto:deepesh4938@gmail.com)

GitHub: https://github.com/deepesh67

Repository: https://github.com/deepesh67/form-builder

Frontend Deployment: https://form-builder-eight-eta.vercel.app/

Backend Deployment: https://form-builder-hzve.onrender.com
