# Primetrade.ai
# Backend Developer Intern Assignment

## 📋 Project Overview

A full-stack task management application with:
- **Backend**: Node.js + Express + MongoDB + Redis
- **Frontend**: React + Vite
- **Features**: JWT authentication, role-based access control, CRUD operations, API caching, comprehensive validation

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (running locally or connection string)
- Redis (optional for caching)

### Installation

1. **Clone and navigate to project**
   ```bash
   cd d:\internMilegi
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env and set your MongoDB URI and JWT secret
   npm run dev
   ```

3. **Frontend Setup** (in a new terminal)
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000
   - API Documentation: http://localhost:4000/docs

---

## 📁 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/          # Database, Redis, environment config
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth, validation, caching, error handling
│   │   ├── models/          # MongoDB schemas (User, Task)
│   │   ├── routes/          # API route definitions
│   │   ├── validators/      # Zod validation schemas
│   │   ├── utils/           # Helper functions and error classes
│   │   ├── docs/            # Swagger documentation setup
│   │   ├── app.js           # Express app configuration
│   │   └── server.js        # Server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/             # API client utilities
│   │   ├── components/      # React components
│   │   ├── App.jsx          # Main app component
│   │   ├── main.jsx         # React entry point
│   │   └── styles.css       # Application styles
│   └── package.json
└── README.md
```

---

## 🔑 Core Features

### Authentication & Authorization
- ✅ User registration with password hashing (bcrypt)
- ✅ JWT-based authentication
- ✅ Role-based access control (user/admin)
- ✅ Secure token validation middleware

### Task Management (CRUD)
- ✅ Create tasks with title, description, status
- ✅ Read tasks (users see own tasks, admins see all)
- ✅ Update task details and status
- ✅ Delete tasks with ownership validation
- ✅ Admin-only task summary endpoint

### API Features
- ✅ RESTful API design with proper HTTP methods and status codes
- ✅ API versioning (`/api/v1/`)
- ✅ Input validation with Zod schemas
- ✅ Error handling with consistent JSON responses
- ✅ Request sanitization (MongoDB injection protection)
- ✅ Security headers with Helmet
- ✅ CORS configuration
- ✅ Request logging with Morgan

### Caching
- ✅ Redis-based response caching for task lists
- ✅ Automatic cache invalidation on mutations
- ✅ Graceful degradation when Redis is unavailable

### API Documentation
- ✅ Swagger/OpenAPI documentation
- ✅ Interactive API testing interface at `/docs`

---

## 🗄️ Database Schema

### User Collection
```javascript
{
  name: String,           // User's full name
  email: String,          // Unique email (lowercase)
  password: String,       // Bcrypt hashed password
  role: String,           // "user" or "admin"
  createdAt: Date,
  updatedAt: Date
}
```

### Task Collection
```javascript
{
  title: String,          // Task title (required)
  description: String,    // Task description
  status: String,         // "todo", "in_progress", or "done"
  owner: ObjectId,        // Reference to User
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Security Implementations

1. **Password Security**: bcrypt hashing with 12 rounds
2. **JWT Authentication**: Tokens with expiration
3. **Input Validation**: Zod schemas on all endpoints
4. **MongoDB Injection Prevention**: express-mongo-sanitize
5. **XSS Protection**: Helmet security headers
6. **HTTP Parameter Pollution**: HPP middleware
7. **Request Size Limits**: JSON body limited to 10KB
8. **CORS**: Configured for specific origin

---

## 📊 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user

### Tasks (Protected)
- `GET /api/v1/tasks` - List tasks
- `POST /api/v1/tasks` - Create task
- `PUT /api/v1/tasks/:id` - Update task
- `DELETE /api/v1/tasks/:id` - Delete task
- `GET /api/v1/tasks/admin/summary` - Task summary (admin only)

### System
- `GET /health` - Health check
- `GET /docs` - API documentation

---

## ⚡ Scalability Considerations

### Current Architecture
- **Modular Structure**: Controllers, services, and routes are separated for easy maintenance
- **Stateless API**: No session state stored on server (JWT-based)
- **Caching Layer**: Redis for frequently accessed data
- **Database Indexing**: Unique indexes on user emails

### Scalability Strategies

1. **Horizontal Scaling**
   - API is stateless and can run multiple instances behind a load balancer
   - No server-side session storage

2. **Microservices Migration**
   - Auth service: Handle user management and authentication
   - Task service: Handle CRUD operations
   - API Gateway: Route requests and handle cross-cutting concerns

3. **Database Optimization**
   - MongoDB sharding for high write loads
   - Read replicas for scaling read operations
   - Compound indexes on frequently queried fields

4. **Caching Strategy**
   - Redis cluster for distributed caching
   - Cache-aside pattern with TTL-based invalidation
   - Consider CDN for frontend static assets

5. **Performance Monitoring**
   - Add logging service (Winston + ELK stack)
   - APM tools (New Relic, DataDog)
   - Request tracing for debugging

6. **Queue System**
   - Background job processing with Bull/BullMQ
   - Email notifications, report generation

---

## 🧪 Testing the Application

### Manual Testing Flow

1. **Register a user**
   - Navigate to http://localhost:5173
   - Click "Need an account? Register"
   - Fill in name, email, password
   - Select role (user or admin)

2. **Login**
   - Use registered credentials
   - Verify dashboard loads with empty task list

3. **Create tasks**
   - Fill out task creation form
   - Set title, description, and status
   - Verify task appears in list

4. **Update task status**
   - Change status using dropdown
   - Verify update confirmation message

5. **Delete task**
   - Click delete button
   - Verify task is removed

6. **Admin features** (if registered as admin)
   - View task summary by status
   - Access all users' tasks

### API Testing with Swagger
Visit http://localhost:4000/docs and test endpoints directly

---

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js with ES modules
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Caching**: Redis with ioredis
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod schemas
- **Security**: Helmet, CORS, express-mongo-sanitize, hpp
- **Documentation**: Swagger (swagger-jsdoc + swagger-ui-express)
- **Logging**: Morgan
- **Password Hashing**: bcryptjs

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Custom CSS with CSS variables
- **State Management**: React hooks (useState, useEffect)
- **HTTP Client**: Native Fetch API

---

## 📝 Environment Variables

### Backend (.env)
```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/primetrade
JWT_SECRET=your-secret-key-change-this
JWT_EXPIRES_IN=1d
REDIS_URL=redis://localhost:6379
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:4000/api/v1
```

---

## 🚨 Troubleshooting

### Redis Connection Errors
- Redis is optional - the app works without it (caching disabled)
- To enable caching, start Redis: `redis-server`

### MongoDB Connection Failed
- Ensure MongoDB is running: `mongod` or check your connection string
- Verify `MONGO_URI` in backend/.env

### CORS Issues
- Verify `CORS_ORIGIN` in backend/.env matches frontend URL
- Check that both servers are running

---

## 👨‍💻 Development

### Backend Scripts
```bash
npm run dev    # Start with nodemon (auto-reload)
npm start      # Start production server
```

### Frontend Scripts
```bash
npm run dev      # Start dev server with HMR
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## 📦 Deployment Readiness

- ✅ Environment-based configuration
- ✅ Production-ready error handling
- ✅ Security best practices implemented
- ✅ Scalable architecture
- ✅ API documentation for client integration
- ✅ Modular code structure
- ✅ Comprehensive validation
- ✅ Graceful error messages

### Next Steps for Production
1. Set up CI/CD pipeline
2. Configure production database with replica sets
3. Set up Redis cluster
4. Implement rate limiting
5. Add logging service
6. Configure monitoring and alerts
7. Set up SSL/TLS certificates
8. Deploy to cloud (AWS, Azure, GCP)

---

## 📄 License

This project was created as an assignment for PrimeTrade backend developer internship.

---

## 📧 Contact

For questions about this assignment, please contact:
- joydip@primetrade.ai
- hello@primetrade.ai
- chetan@primetrade.ai
- sonika@primetrade.ai
