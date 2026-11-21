# BitePulse⚡ — Next-Gen Campus Canteen & Fast-Lane Pre-Order System

> Formerly *Smart Canteen*. Rebranded with modern architecture, fluid motion graphics, and bank-grade backend security.

---

## 📌 Executive Extract & Problem Statement

### The Problem
1. **Lunchtime Queue Bottlenecks**: University and corporate campuses suffer from severe peak-hour rushes (12:00 PM – 2:00 PM). Students and faculty waste 20–30 minutes waiting in physical lines, frequently missing meal breaks or classes.
2. **Kitchen Chaos & Blind Demand**: Cafeteria kitchens receive erratic spikes without prior visibility into incoming meal demand, leading to food wastage, delayed service, and misplaced tickets.
3. **No Real-Time Tracking**: Customers stand around crowded counters with zero visibility into whether their dish is on the stove, plated, or waiting for pickup.
4. **Lack of Business Intelligence**: Cafeteria managers lack actionable analytics on peak rush hours, daily revenues, and top-performing menu items.

### The BitePulse Solution
- **Zero-Queue Pre-Orders**: Browse categorized catalog, view dietary badges (🟢 Veg, 🔴 Non-Veg, 🌱 Vegan), select a scheduled pickup time, and place orders with instant tray feedback.
- **Interactive Kitchen Display System (KDS)**: Kanban-style board for chefs (`New Orders` ➔ `On the Stove` ➔ `Ready for Pickup`) with 1-click status progression.
- **Live Progress Stepper**: Live sync updates for students as their food moves from order receipt to kitchen stove to counter pickup.
- **Admin Management Hub**: Live analytics dashboard (peak order hours bar chart, kitchen stage pie chart, revenue KPIs) and a full Menu Manager with live-preview dish creator.
- **Security-First Backend**: Spring Boot 3 with BCrypt password hashing, 256-bit HMAC-SHA256 stateless JWT authentication, Role-Based Access Control (`STUDENT`, `STAFF`, `ADMIN`), server-side price calculation, and RFC 7807 Global Exception Handling to thwart vulnerability probing.

---

## 💡 Innovative Name Suggestions for the Product / Folder

If you wish to rename the project folder, here are the top 5 curated brand identities:

| Brand Name | Tagline / Pitch | Recommended For |
|---|---|---|
| **BitePulse** *(Current Choice)* | *Beat the Queue. Savor the Break.* | Modern, energetic, campus & tech-forward |
| **Cravo Campus** | *Smart Canteen, Zero Wait.* | Trendy, premium student dining |
| **NomRush** | *Fresh Food on Fast Forward.* | Fast-paced, vibrant, memorable |
| **FeastFlow** | *Orchestrated Campus Cafeteria.* | Microservice, enterprise & multi-vendor |
| **QuickBite Hub** | *Grab, Go, and Recharge.* | Universal, reliable, straightforward |

---

## 🗂️ Improved Folder Structure

### Before (Monolithic & Fragile)
```
smart-canteen/
├── backend/
│   ├── src/main/java/com/smartcanteen/ (single-line unreadable code with compilation errors)
│   └── pom.xml (single-line XML, missing maven wrapper)
├── frontend/
│   ├── src/
│   │   ├── main.jsx (39 lines of squashed code containing all views and contexts)
│   │   └── styles.css (2 lines of squashed CSS)
│   └── index.html (1 bare line without doctype, viewport, or title)
```

### After (Modular, Scalable, Production-Ready)
```
smart-canteen/  (or bitepulse/)
├── backend/
│   ├── mvnw.cmd                              # Windows Maven launcher wrapper
│   ├── pom.xml                               # Formatted, validated Spring Boot 3.4.2 POM
│   └── src/main/
│       ├── java/com/smartcanteen/
│       │   ├── SmartCanteenApplication.java  # Main Boot Application
│       │   ├── api/                          # REST Controllers
│       │   │   ├── AuthController.java       # Login, Register, Me
│       │   │   ├── MenuController.java       # Menu Catalog CRUD & Stock Toggle
│       │   │   ├── OrderController.java      # Customer & Kitchen endpoints
│       │   │   └── AdminController.java      # Real-time analytics
│       │   ├── config/                       # Security & Seeding
│       │   │   ├── SecurityConfig.java       # JWT Filter, CORS, CSRF, Headers
│       │   │   └── SeedData.java             # Demo accounts & rich menu items
│       │   ├── domain/                       # JPA Entities
│       │   │   ├── User.java                 # User with Student/Staff/Admin roles
│       │   │   ├── MenuItem.java             # Items with dietary tags & prep times
│       │   │   └── Order.java                # Order with status & timestamps
│       │   ├── dto/                          # Strong Request & Response Validation DTOs
│       │   │   ├── AuthRequests.java
│       │   │   ├── MenuItemRequest.java
│       │   │   └── OrderRequests.java
│       │   ├── exception/
│       │   │   └── GlobalExceptionHandler.java # Unified error responses (no stack trace leak)
│       │   ├── repo/                         # Spring Data JPA Repositories
│       │   │   ├── UserRepository.java
│       │   │   ├── MenuRepository.java
│       │   │   └── OrderRepository.java
│       │   └── service/                      # Business & Security Logic Layer
│       │       ├── AuthService.java
│       │       ├── MenuService.java
│       │       └── OrderService.java
│       └── resources/
│           └── application.yml               # H2 and MySQL profile configs
├── frontend/
│   ├── index.html                            # HTML5 with viewport, title & Google fonts
│   ├── package.json                          # Vite + React 18 + Recharts
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx                          # React DOM Root
│       ├── App.jsx                           # Master App router & layout
│       ├── context/
│       │   ├── AuthContext.jsx               # Auth state & role helpers
│       │   ├── CartContext.jsx               # Tray state, item quantities, total calculation
│       │   └── ToastContext.jsx              # Toast notification system
│       ├── services/
│       │   ├── api.js                        # Unified API client with offline fallback
│       │   └── mockData.js                   # High-fidelity offline seed data
│       ├── components/
│       │   ├── layout/Navbar.jsx             # Glassmorphism header with bouncing tray badge
│       │   ├── common/                       # Modal, Badge, ToastContainer
│       │   ├── menu/                         # HeroBanner, CategoryFilters, FoodCard, MenuGrid
│       │   ├── cart/CartDrawer.jsx           # Slide-in tray drawer with order confirmation
│       │   ├── orders/OrderTracker.jsx       # Stepper tracking Ordered -> Cooking -> Ready
│       │   ├── kitchen/KitchenBoard.jsx      # Kitchen Kanban board with status advancement
│       │   └── admin/                        # AdminDashboard, AddItemModal (with live preview)
│       └── styles/
│           ├── index.css                     # Design tokens, variables & responsive styling
│           └── animations.css                # Motion graphics: pulse, float, slide, bounce
└── docs/
    ├── API_SPEC.md                           # Complete endpoint documentation
    └── SAMPLE_DATA.md                        # Sample test accounts & payload examples
```

---

## 🛠️ Key Improvements & Bug Fixes

### 1. Fixed the Broken "Add Item" Buttons
- **Admin Menu Manager**: Previously, `<button className="primary small">+ Add item</button>` had no `onClick` handler and did nothing. Now, clicking **"+ Add New Dish"** opens a modal (`AddItemModal.jsx`) allowing admins to enter dish name, category, price, dietary tag (Veg / Non-Veg / Vegan), prep time, emoji, and description with a **live interactive card preview**!
- **Customer Food Cards**: The `+` button now features tactile press animations, active ripple feedback, and transforms into a counter stepper `[-] [count] [+]` when items are in your tray. Adding an item triggers a floating toast alert and bounces the navbar tray icon!
- **Cart Tray Reset**: Fixed an issue where the tray stayed locked on the order confirmation screen without clearing items or letting users order again.

### 2. Fortified Backend Security
- **BCrypt Password Hashing**: Passwords are never stored in plaintext.
- **256-Bit Cryptographic JWT**: Tokens are cryptographically signed using HMAC-SHA256 with 24-hour expiration.
- **Server-Side Price Validation**: Order totals are computed strictly from verified database prices, preventing tampering attacks.
- **RFC 7807 Global Exception Handling**: Traps `MethodArgumentNotValidException`, `AccessDeniedException`, and database errors, ensuring internal server stack traces and table structures are never leaked to attackers.
- **Security Headers & CORS**: Strict same-origin framing, content-type sniffing protection, and scoped CORS allowed origins.

### 3. Motion Graphics & Visual Polish
- Sticky glassmorphism header with blurred background.
- Floating dietary & promotional badges with keyframe animations.
- Stepper progress tracker with live glow pulses.
- Responsive design optimized for mobile, tablet, and desktop viewports.

---

## 🚀 How to Run the Project

### 1. Frontend
From the `frontend` directory:
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

> **Tip:** The frontend includes a smart offline mode! If the backend is not running yet, you can still test all views, add dishes, place orders, and test the kitchen board with instant local persistence.

### 2. Backend (Spring Boot API)
From the `backend` directory:

**On Windows:**
```cmd
cd backend
mvnw.cmd spring-boot:run
```
*(Or use `mvn spring-boot:run` if Maven is installed in your PATH).*

**On Mac / Linux:**
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

### 3. Demo Credentials
| Role | Email | Password | What You Can Access |
|---|---|---|---|
| **Student** | `student@campus.test` | `password` | Menu catalog, Cart Tray, Live Order Tracker |
| **Kitchen Staff** | `staff@campus.test` | `password` | Menu, Orders, Live Kitchen Kanban Board |
| **Admin** | `admin@campus.test` | `password` | Everything + Admin Analytics & Menu CRUD Manager |
