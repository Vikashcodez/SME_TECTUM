# SME Management System

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-Active-brightgreen.svg)

A comprehensive web-based management system designed specifically for Small and Medium Enterprises (SMEs) to streamline operations, manage company data, and handle user authentication with role-based access control.

[Features](#features) • [Tech Stack](#tech-stack) • [Installation](#installation) • [Configuration](#configuration) • [Getting Started](#getting-started)

</div>

---

##  Table of Contents

- [About the Application](#about-the-application)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation Guide](#installation-guide)
- [Configuration & Setup](#configuration--setup)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)

---

##  About the Application

The **SME Management System** is a modern, full-stack web application designed to empower small and medium-sized enterprises with powerful tools for business management. This system provides a centralized platform for:

- **Company Information Management**: Store and maintain detailed company profiles including industry classification, location data, and operational capacity
- **Employee Management**: Manage employee information with role-based access control and security
- **User Authentication**: Secure login system with JWT token-based authentication and password hashing
- **Role-Based Access Control**: Different user roles (Admin, Manager, User) with specific permissions
- **Data Security**: Industry-standard encryption and secure credential management

The application is built with a modern technology stack, featuring a responsive React frontend and a robust Node.js/Express backend powered by PostgreSQL database.

---

##  Features

### Core Features
- ✅ **Secure Authentication System**: JWT-based authentication with bcrypt password hashing
- ✅ **Company Management**: Create, read, update, and manage multiple company profiles
- ✅ **User Management**: Complete user lifecycle management with role assignment
- ✅ **Role-Based Access Control (RBAC)**: Admin, Manager, and User roles with specific permissions
- ✅ **RESTful API**: Well-structured API endpoints for seamless integration
- ✅ **Database Integrity**: Automatic table creation and schema initialization
- ✅ **CORS Support**: Cross-origin resource sharing for multi-domain deployments
- ✅ **Health Check Endpoint**: System monitoring and status verification
- ✅ **Error Handling**: Comprehensive error handling and logging
- ✅ **Responsive Design**: Mobile-friendly user interface with Tailwind CSS

---

##  Tech Stack

### Backend
| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | Runtime Environment | 22.x |
| **Express.js** | Web Framework | 4.18.2 |
| **PostgreSQL** | Database | 12+ |
| **JWT** | Authentication | 9.0.2 |
| **bcryptjs** | Password Hashing | 2.4.3 |
| **dotenv** | Environment Configuration | 16.3.1 |
| **CORS** | Cross-Origin Support | 2.8.5 |
| **Nodemon** | Development Tool | 3.0.1 |

### Frontend
| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI Library | 19.2.5 |
| **Vite** | Build Tool | 8.0.10 |
| **Tailwind CSS** | Styling | 4.2.4 |
| **ESLint** | Code Quality | 10.2.1 |

### Database
| Component | Details |
|-----------|---------|
| **DBMS** | PostgreSQL |
| **Tables** | company, users |
| **Features** | Transactions, Triggers, Indexes, Constraints |

---

##  Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js**: v18 or higher ([Download](https://nodejs.org/))
- **npm**: v9 or higher (included with Node.js)
- **PostgreSQL**: v12 or higher ([Download](https://www.postgresql.org/download/))
- **Git**: For version control ([Download](https://git-scm.com/))
- **Text Editor/IDE**: VS Code recommended ([Download](https://code.visualstudio.com/))

### Verify Installation
```bash
node --version
npm --version
psql --version
git --version
```

---

## 📥 Installation Guide

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/vikashcodez/SME-TECTUM.git

# Navigate to project directory
cd SME-TECTUM
```

### Step 2: Install Backend Dependencies

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install
```

Expected output:
```
added 128 packages, audited 129 packages in 15s
found 0 vulnerabilities
```

### Step 3: Install Frontend Dependencies

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

---

##  Configuration & Setup

### Backend Environment Configuration

#### Step 1: Create `.env` File in Backend Directory

Create a new file named `.env` in the `backend` directory:

```bash
cd backend
touch .env  # On Windows: type nul > .env
```

#### Step 2: Configure Environment Variables

Add the following environment variables to the `.env` file:

```env
# ===== Database Configuration =====
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sme_management_db

# ===== Server Configuration =====
PORT=5000
NODE_ENV=development

# ===== JWT Configuration =====
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# ===== Admin Credentials (Default) =====
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=123

# ===== Application Settings =====
LOG_LEVEL=debug
CORS_ORIGIN=http://localhost:5173
```

### Environment Variables Explanation

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_USER` | PostgreSQL database user | `postgres` |
| `DB_PASSWORD` | PostgreSQL database password | `your_secure_password` |
| `DB_HOST` | Database host address | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_NAME` | Database name | `sme_management_db` |
| `PORT` | Express server port | `5000` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `JWT_SECRET` | Secret key for JWT signing | `generate_a_long_random_string` |
| `JWT_EXPIRE` | JWT token expiration time | `7d` |
| `ADMIN_EMAIL` | Default admin email | `admin@gmail.com` |
| `ADMIN_PASSWORD` | Default admin password | `123` |
| `CORS_ORIGIN` | Frontend URL for CORS | `http://localhost:5173` |

---

##  Backend Setup

### Step 1: Verify PostgreSQL Installation

```bash
# Connect to PostgreSQL
psql -U postgres

# Inside psql, create the database
CREATE DATABASE sme_management_db;

# Verify database creation
\l

# Exit psql
\q
```

### Step 2: Configure Backend

```bash
# Navigate to backend directory
cd backend

# Create .env file with your database credentials
# (Follow the configuration guide above)

# Install dependencies (if not already done)
npm install
```

### Step 3: Verify Database Connection

```bash
# Run the development server
npm run dev
```

Look for this output confirming successful connection:
```
✅ Database connected successfully
✅ Summary table created
✅ Users table created
✅ Indexes created
✅ Trigger created
✅ All tables created successfully
🚀 Server is running on port 5000
```

### Backend Startup Sequence

The backend automatically:
1. Connects to PostgreSQL database
2. Tests the connection
3. Creates required tables (company, users)
4. Sets up indexes for performance
5. Creates database triggers for timestamps
6. Starts the Express server
7. Initializes test data if empty

---

##  Frontend Setup

### Step 1: Configure Frontend Environment

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

### Step 2: Frontend Configuration

Create `.env` file in `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=SME Management System
```

---

##  Running the Application

### Start Backend Server

```bash
# From backend directory
cd backend

# Development mode with auto-reload
npm run dev

# Or production mode
npm start
```

**Expected Output:**
```
🚀 Server is running on port 5000
📝 API URL: http://localhost:5000/api/auth
✅ Health check: http://localhost:5000/health

📋 Test Credentials:
Admin - Email: admin@gmail.com, Password: 123
User - Email: john@techcorp.com, Password: 123
User - Email: jane@manufacturing.com, Password: 123
```

### Start Frontend Development Server

```bash
# From frontend directory
cd frontend

# Start development server
npm run dev
```

**Expected Output:**
```
  VITE v8.0.10  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health


## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit changes (`git commit -m 'Add YourFeature'`)
4. Push to branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

### Code Standards
- Follow ESLint rules for JavaScript
- Use meaningful commit messages
- Add comments for complex logic
- Test your changes before submitting

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (Windows)
taskkill /PID <PID> /F
```

### Database Connection Error
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists: `CREATE DATABASE sme_management_db;`

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### CORS Issues
- Update `CORS_ORIGIN` in backend `.env`
- Ensure frontend URL matches CORS configuration

---



---



<div align="center">

**Made with ❤️ for SMEs**

[⬆ Back to Top](#sme-management-system)

</div>
