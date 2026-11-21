# BitePulse API Specification

Base URL: `http://localhost:8080/api`  
Security: Bearer JWT in `Authorization` header.

---

## 1. Authentication (`/api/auth`)

### `POST /api/auth/register`
Creates a new student account.
- **Request Body**:
  ```json
  {
    "email": "student@campus.test",
    "name": "Aarav Sharma",
    "password": "password123"
  }
  ```
- **Response**: `201 Created` with JWT token & user summary.

### `POST /api/auth/login`
Authenticates a user and returns a stateless 24-hour signed JWT token.
- **Request Body**:
  ```json
  {
    "email": "student@campus.test",
    "password": "password"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "token": "eyJhbGciOi...",
    "user": {
      "id": 1,
      "email": "student@campus.test",
      "name": "Aarav Sharma",
      "role": "STUDENT"
    }
  }
  ```

### `GET /api/auth/me`
Returns the currently authenticated user's profile.

---

## 2. Menu Catalog (`/api/menu`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/menu` | Public | List all active catalog dishes |
| `GET` | `/api/menu/{id}` | Public | Get single dish details |
| `POST` | `/api/menu` | `ADMIN` | Add new dish with validation |
| `PUT` | `/api/menu/{id}` | `ADMIN` | Update dish details & price |
| `PATCH` | `/api/menu/{id}/toggle` | `ADMIN` | Toggle In-Stock / Sold-Out |
| `DELETE` | `/api/menu/{id}` | `ADMIN` | Remove dish from catalog |

---

## 3. Orders (`/api/orders`)

### `POST /api/orders`
Places a new customer pre-order. Calculates price securely server-side.
- **Access**: Authenticated (`STUDENT`, `STAFF`, `ADMIN`)
- **Request Body**:
  ```json
  {
    "pickupSlot": "1:00 PM",
    "items": [
      { "menuItemId": 1, "quantity": 1 },
      { "menuItemId": 3, "quantity": 2 }
    ]
  }
  ```

### `GET /api/orders/my`
Retrieves all orders placed by the currently authenticated customer, ordered newest first.

### `GET /api/orders/kitchen`
Live Kitchen Display System (KDS) queue (`NEW`, `ON_STOVE`, `READY`).
- **Access**: `STAFF` or `ADMIN`

### `PATCH /api/orders/{id}/status`
Advances an order status in the kitchen line.
- **Access**: `STAFF` or `ADMIN`
- **Request Body**:
  ```json
  { "status": "ON_STOVE" }
  ```
- **Valid Status Values**: `NEW`, `ON_STOVE`, `READY`, `PICKED_UP`, `CANCELLED`

---

## 4. Admin Analytics (`/api/admin/analytics`)
- **Access**: `ADMIN`
- **Response**:
  - `ordersToday`: Count of orders
  - `totalRevenue`: Sum of order totals in ₹
  - `avgPrepTimeMinutes`: Preparation time average
  - `statuses`: Distribution counts across order stages
  - `peakHours`: Aggregated hourly breakdown for lunch/tea rush
