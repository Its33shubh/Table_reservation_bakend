<div align="center">

# 🍽️ ReserveX Backend
### A Robust Table Reservation System API

[![Node.js](https://img.shields.io/badge/Node.js-Always-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen.svg)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express-Framework-blue.svg)](https://expressjs.com/)

---

*ReserveX is a comprehensive backend solution designed for seamless restaurant table management and customer bookings. Built for performance and scalability.*

</div>

## 📑 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [API Documentation](#-api-documentation)
- [Getting Started](#-getting-started)
- [Contact](#-contact)

---

## 🚀 Features
- **User Authentication**: Secure registration and login for Customers and Admins.
- **Restaurant Management**: Advanced CRUD operations for restaurant profiles.
- **Smart Table Management**: Manage availability, seating capacity, and status.
- **Reservation Logic**: Real-time availability checks and booking management.
- **Role-Based Access**: Specialized endpoints for Admins and Customers.

---

## 🛠️ Tech Stack
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB
*   **Auth**: JWT (JSON Web Tokens)

---

## 📖 API Documentation

### 🔐 Authentication
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Secure login |
| `GET` | `/api/auth/profile` | Get user profile |
| `PUT` | `/api/auth/profile` | Update user profile |

### 🏢 Restaurant Management (Admin Only)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/restaurants` | View all restaurants |
| `POST` | `/api/restaurants` | Create new restaurant |
| `PUT` | `/api/restaurants/:id` | Update restaurant details |
| `DELETE` | `/api/restaurants/:id` | Soft delete restaurant |

### 🪑 Table Management
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/tables/restaurant/:id` | View restaurant tables |
| `POST` | `/api/tables` | Create new table (Admin) |
| `PUT` | `/api/tables/:id` | Update table status/info (Admin) |

### 📅 Reservation System
| Method | Endpoint | Description |
| :--- | :--- | :1 |
| `POST` | `/api/reservations` | Create new reservation |
| `GET` | `/api/reservations` | Get user bookings |
| `GET` | `/api/reservations/available-tables` | Check availability |

---

## ⚡ Getting Started
1. Clone the repository: `git clone https://github.com/Its33shubh/ReserveX-Table_reservation_bakend`
2. Install dependencies: `npm install`
3. Configure your `.env` file.
4. Start the server: `npm start`

---
<div align="center">
Built by <b>Shubham</b> | ReserveX &copy; 2026
</div>
