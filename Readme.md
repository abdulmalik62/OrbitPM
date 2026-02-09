# 🚀 OrbitPM

**OrbitPM** is a secure multi-tenant SaaS-based Project & Task Management System built as a Proof of Concept.

The system demonstrates tenant isolation, role-based access control (RBAC), and scalable backend architecture using a modern full-stack approach.

## 🧱 Architecture
- Multi-tenant design (Shared DB + tenantId isolation)
- Secure JWT-based authentication
- Project-level RBAC (Admin / Member)
- Clean middleware-driven authorization layer

## 🖥 Tech Stack
Frontend: React
Backend: Node.js · Express
Database: MongoDB
Auth: JWT · bcrypt

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- MongoDB (local installation or cloud service like MongoDB Atlas)

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd projectmanagement/backend
   ```
2. Install dependencies:
   ```
   npm install
   ```

### Environment Setup
1. Create a `.env` file in the `backend` directory:
   ```
   MONGO_URI=mongodb://localhost:27017/orbitpm
   PORT=4000
   ```
   - Replace `mongodb://localhost:27017/orbitpm` with your MongoDB connection string if using a different setup.
   - Adjust `PORT` as needed (default is 4000).

### Database Configuration
1. Ensure MongoDB is running locally (if using local installation):
   - Start MongoDB service (e.g., `mongod` on macOS/Linux or MongoDB service on Windows).
2. If using MongoDB Atlas or another cloud service, update the `MONGO_URI` in `.env` accordingly.
3. The application will automatically connect to the database on startup.

### Running the Application
- For development:
  ```
  npm run dev
  ```
  This starts the server with hot reloading using `ts-node-dev`.

- For production:
  ```
  npm run build
  npm start
  ```
  The server will run at `http://localhost:<PORT>/graphql` (e.g., http://localhost:4000/graphql).

---

> OrbitPM — Secure by design. Scalable by architecture.
