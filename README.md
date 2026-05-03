# Interest Management Web Application

A full-stack application built with React (frontend) and Node.js with Express (backend) and MySQL database. This system is designed for **Admin Only** use.

## Features Included
*   **Admin Login:** Secure authentication using JWT. Default admin account is automatically created on startup.
*   **Dashboard:** Summary of active customers, total loans, and total interest collected, along with payment reminders.
*   **Customer Management:** Add new customers with loan details, view customer lists with active/closed status, and detailed view pages.
*   **Interest Calculation:** Automated logic for monthly or yearly interest rates.
*   **Payment Tracking:** Record interest or principal payments. Principal payments automatically reduce the loan amount.
*   **PDF Reports:** Generate and download detailed customer PDF reports including their payment history using `pdfkit`.
*   **Premium UI:** Built with React Bootstrap featuring a mobile-friendly, glassmorphism design.

## Prerequisites
*   Node.js installed
*   MySQL Server installed and running

## Setup Instructions

### 1. Database Setup
Create a MySQL database manually or let the backend create it automatically.
Ensure your MySQL server is running and matches the credentials in the backend `.env` file.

### 2. Backend Setup
Navigate to the `backend` directory:
```bash
cd backend
```
Install dependencies:
```bash
npm install
```
Start the backend server (it will automatically initialize the database and tables):
```bash
npm start
```
*Note: The server runs on port `5000` by default. The default admin credentials are:*
*   **Username:** admin
*   **Password:** admin123

### 3. Frontend Setup
Navigate to the `frontend` directory:
```bash
cd frontend
```
Install dependencies:
```bash
npm install
```
Start the React development server:
```bash
npm run dev
```
*Note: The frontend runs on port `3000` by default. Access it at `http://localhost:3000`.*
