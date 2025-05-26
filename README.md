# Appointment Booking Frontend

This is the frontend application for the Appointment Booking system. It provides a user interface for booking appointments and managing participants, and connects to the Symfony-based backend API.

## 🛠️ Built With

- [React](https://reactjs.org/) (version 18)
- JavaScript
- HTML/CSS (Tailwind)
- Axios(for backend communication)

## 📦 Features

- Create new appointments
- Add participants to appointments
- Fetch and display appointments and participants
- Prevent double-booking for the same participant

## 🚀 Getting Started

These instructions will get the frontend running on your local development machine.

### Prerequisites

- Node.js (v18.19.1)
- npm
- Git

### Installation

### Clone the repository
```bash
git clone https://github.com/Mehul90/appointment-booking-frontend.git
cd appointment-booking-frontend
```

### Install dependencies
```bash
npm install
```

### Create a .env file in the project root:
```bash
cp .env.example .env
```

### Edit Configure of environment variables
```bash
VITE_API_BASE_URL=PLACE_YOUR_API_URL_HERE
```

### Start the development server:
```bash
npm run dev
```
