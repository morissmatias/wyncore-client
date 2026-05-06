# WynCore Client
React frontend for Wyn Power Corporation's Online Service Request and Ordering Management System.

## Tech Stack
- **Framework**: React 18
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Icons**: React Icons
- **Charts**: Recharts
- **Deployment**: Vercel

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Set VITE_API_URL to your Railway backend URL in production
# Leave as-is for local dev (proxy handles it)
```

### 3. Start dev server
```bash
npm run dev
# Runs on http://localhost:5173
# API calls are proxied to http://localhost:5000
```

## Pages

### Public (no login required)
- `/`          — Landing page
- `/catalog`   — Browse products
- `/services`  — Browse services

### Auth
- `/login`        — Customer login
- `/register`     — Customer registration
- `/admin/login`  — Admin login

### Customer (login required)
- `/dashboard`        — Customer dashboard
- `/cart`             — Shopping cart
- `/checkout`         — Checkout
- `/my-orders`        — Order history + tracking
- `/request-service`  — Submit service request
- `/profile`          — Edit profile

### Admin
- `/admin`                — Dashboard (all roles)
- `/admin/orders`         — Manage orders (CEO + CS)
- `/admin/invoices`       — Invoice list (CEO + CS)
- `/admin/invoices/:id`   — Review invoice (CEO + CS)
- `/admin/customers`      — Customer records (CEO + CS)
- `/admin/products`       — Product catalog (CEO + Purchasing)
- `/admin/services-mgmt`  — Services catalog (CEO + Purchasing)
- `/admin/suppliers`      — Supplier records (CEO + Purchasing)
- `/admin/accounts`       — Admin accounts (CEO only)
- `/admin/logs`           — Activity logs (CEO only)
