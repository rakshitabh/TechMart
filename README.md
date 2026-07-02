# TechMart | Premium Full-Stack E-Commerce Application

TechMart is a production-ready, full-stack tech e-commerce platform designed for tech enthusiasts, developers, and creators. The application is built using a modern developer-centric theme, incorporating dark mode, responsive styling, secure JWT authentication, and interactive admin dashboards.

---

## Folder Structure

```text
techmart/
├── .github/workflows/
│   └── ci-cd.yml             # CI/CD pipeline definition
├── client/                   # Frontend React Application
│   ├── src/
│   │   ├── components/       # Reusable React components (Navbar, Footer, Rating...)
│   │   ├── context/          # Context API state managers (Auth, Cart, Wishlist...)
│   │   ├── pages/            # Frontend routes (Home, Products, Details, Cart...)
│   │   ├── services/         # Axios config & interceptor rules
│   │   ├── App.jsx           # Main routing definition
│   │   ├── index.css         # Styling directives and custom effects
│   │   └── main.jsx          # Entry point
│   ├── tailwind.config.js    # Theme styling specifications
│   ├── vite.config.js        # Vite config with API proxy
│   └── vercel.json           # Vercel SPA routing
├── server/                   # Backend Node/Express Server
│   ├── config/               # DB & Cloudinary credentials
│   ├── controllers/          # Endpoint router handlers (auth, products, orders...)
│   ├── middleware/           # Security, Uploads, Error handles
│   ├── models/               # MongoDB Mongoose Schemas (User, Product, Order, Cart)
│   ├── routes/               # API route maps
│   ├── utils/                # Token signing & Cloudinary streams
│   ├── tests/                # Jest / Supertest integration checks
│   ├── seeder.js             # Seed sample product listings
│   └── server.js             # Main server setup
└── package.json              # Workspaces scripts definition
```

---

## Environment Variable Setup

Create an `.env` file in the `/server` directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/techmart
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=development
```

> [!NOTE]
> If Cloudinary variables are missing or set to `mock`, the server will fall back to storing uploads locally inside `server/public/uploads` and serving them statically.
> If MongoDB URI is empty, it connects to a local instance `mongodb://127.0.0.1:27017/techmart`.

---

## Installation Guide

### Prerequisites
- Node.js (v18.x or v20.x recommended)
- MongoDB running locally or an Atlas connection

### Steps
1. Clone the repository and navigate into the folder:
   ```bash
   cd techmart
   ```
2. Install all dependencies across root, server, and client directories:
   ```bash
   npm run install-all
   ```
3. Populate database with sample products:
   ```bash
   npm run data:import --prefix server
   ```
4. Run server and client concurrently in development mode:
   ```bash
   npm run dev
   ```
   The client will run on [http://localhost:5173](http://localhost:5173) and backend API on [http://localhost:5000](http://localhost:5000).

---

## API Documentation

All routes prefix with `/api`.

### Auth Endpoints (`/api/auth`)
- `POST /register`: Registers user account. Returns user object & token.
- `POST /login`: Logs in user. Returns user object & token.
- `GET /profile` [Protected]: Gets authenticated user profile.
- `PUT /profile` [Protected]: Updates authenticated user profile details.

### Product Endpoints (`/api/products`)
- `GET /`: Lists products (includes search, brand/category filters, sort, price parameters).
- `GET /:id`: Retrieves single product details.
- `POST /` [Protected/Admin]: Creates a new product. Accepts image file.
- `PUT /:id` [Protected/Admin]: Modifies single product.
- `DELETE /:id` [Protected/Admin]: Removes single product.
- `POST /:id/reviews` [Protected]: Posts product customer review.
- `GET /meta/categories`: Fetches unique categories and brands list.

### Cart Endpoints (`/api/cart`)
- `GET /` [Protected]: Retrieves user cart details.
- `POST /` [Protected]: Adds item to cart or updates quantity.
- `DELETE /:productId` [Protected]: Removes item from cart.
- `DELETE /` [Protected]: Clears entire cart items.

### User Endpoints (`/api/users`)
- `GET /` [Protected/Admin]: Lists all users in database.
- `DELETE /:id` [Protected/Admin]: Deletes single user.
- `PUT /:id/role` [Protected/Admin]: Toggles user administrative access.
- `POST /wishlist` [Protected]: Adds product to user wishlist.
- `DELETE /wishlist/:id` [Protected]: Removes product from user wishlist.

### Order Endpoints (`/api/orders`)
- `POST /` [Protected]: Places a new order, reduces stock inventory, empties user cart.
- `GET /myorders` [Protected]: Lists order logs for authenticated user.
- `GET /:id` [Protected]: Retrieves single order details.
- `GET /` [Protected/Admin]: Lists all customer orders.
- `PUT /:id/status` [Protected/Admin]: Updates delivery status.
- `GET /admin/stats` [Protected/Admin]: Aggregates dashboard analytics.

---

## Deployment Instructions

### Backend (Render)
1. Sign up on [Render](https://render.com).
2. Click **New** -> **Web Service**.
3. Link your GitHub repository.
4. Set Build Command: `npm install`
5. Set Start Command: `npm start` (make sure directory is pointed to `/server` or set `Root Directory` in Render to `server`).
6. Set the Environment Variables (`MONGO_URI`, `JWT_SECRET`, etc.) in Render Console.

### Frontend (Vercel)
1. Sign up on [Vercel](https://vercel.com).
2. Click **Add New** -> **Project**.
3. Import your repository.
4. Set **Root Directory** as `client`.
5. Vercel automatically detects Vite. Set Build Command: `npm run build`.
6. Deploy. The `client/vercel.json` file handles rewriting routes, ensuring React Router routes function.
7. Configure `VITE_API_URL` if you want to bypass the local proxy in production.

---

## CI/CD Pipeline

The GitHub Actions workflow under `.github/workflows/ci-cd.yml` automatically triggers on push to the `main` branch. It:
1. Installs root, client, and server dependencies.
2. Runs backend unit tests using Jest.
3. Compiles the React application using Vite build to verify production-ready builds.
