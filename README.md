# Full-Stack Dynamic Form Builder

A modern full-stack web application that enables administrators to create, customize, publish, and manage dynamic forms without writing code. The platform includes a drag-and-drop form builder, real-time preview, response management, file uploads, analytics, and a fully responsive user interface.

## Admin Credentials

**Email:** `deepesh4938@gmail.com`
**Password:** `1234567`

---

## Features

* Drag-and-Drop Form Builder
* Dynamic Form Creation
* Real-Time Form Preview
* File Upload Support
* Signature Field Support
* Required Field Validation
* Duplicate Submission Prevention
* Response Management
* CSV Export
* Analytics Dashboard
* JWT Authentication
* Role-Based Access Control
* Fully Responsive Design

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

### Database

* MongoDB
* Mongoose

---

## Installation

### Backend Setup

```bash
cd server
npm install
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## Environment Variables

Create a `.env` file inside the server folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/formbuilder
JWT_SECRET=yourSecretKey
CLIENT_URL=http://localhost:5173
```

---

## Project Structure

```text
form-builder/
│
├── client/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   │
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
│   │
│   ├── src/
│   │   │
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

## Key Highlights

* Full-Stack Architecture
* No-Code Form Creation
* Drag-and-Drop Builder
* Dynamic Form Management
* File Upload & Preview
* CSV Export Functionality
* Secure JWT Authentication
* Responsive Design
* Analytics Dashboard
* Production-Ready Structure

---

## Developer

Deepesh

Email: [deepesh4938@gmail.com](mailto:deepesh4938@gmail.com)
GitHub: https://github.com/deepesh67
