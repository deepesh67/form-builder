# No-Code Dynamic Form Builder (MERN)

A powerful, production-ready full-stack application that allows admins to build dynamic forms via drag-and-drop, customize themes, and analyze user submissions.

## Features
- **Admin Authentication**: JWT-based login/signup with role-based protection.
- **Dynamic Builder**: Drag-and-drop interface powered by `@dnd-kit`.
- **Field Types**: Text, Email, Number, Password, Textarea, Dropdown, Radio, Checkbox, Date, File.
- **Live Preview**: Real-time preview of form layouts and themes.
- **Public Forms**: Unique URLs for each form for public submission.
- **Analytics**: Dashboard to view submissions and export data to CSV.
- **Premium UI**: Modern design with Tailwind CSS, Glassmorphism, and Dark/Light mode support.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, dnd-kit, React Hook Form, Axios, Lucide React.
- **Backend**: Node.js, Express, MongoDB (Local with Compass), JWT, Mongoose.

---

## Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) installed and running on `localhost:27017`.
- [MongoDB Compass](https://www.mongodb.com/products/compass) for database management.

### 1. Backend Setup
1. Open a terminal and navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (one has been provided for you):
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/formbuilder
   JWT_SECRET=yourSuperSecretKey
   CLIENT_URL=http://localhost:5173
   ```
4. (Optional) Seed the database with an admin user and demo form:
   ```bash
   npm run seed
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
4. Access the app at `http://localhost:5173`.

---

## Folder Structure
```text
/client
  /src
    /api          # Axios instance
    /components   # Reusable UI (Builder, Navbar, etc.)
    /context      # Auth management
    /pages        # Route pages (Dashboard, PublicForm, etc.)
/server
  /src
    /config       # Database config
    /controllers  # Route logic
    /models       # Mongoose schemas
    /routes       # API endpoints
    /middleware   # JWT & Role protection
```

---

## Sample Admin Credentials (if seeded)
- **Email**: `admin@example.com`
- **Password**: `Admin@123`
