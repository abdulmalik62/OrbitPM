# 🚀 OrbitPM

**OrbitPM** is a secure multi-tenant SaaS-based Project & Task Management System built as a Proof of Concept.

The system demonstrates tenant isolation, role-based access control (RBAC), and scalable backend architecture using a modern full-stack approach.

## 🧱 Architecture
- Multi-tenant design (Shared DB + tenantId isolation)
- Secure JWT-based authentication
- Project-level RBAC (Admin / Member)
- Clean middleware-driven authorization layer

## 🖥 Tech Stack
Frontend: React Native with TypeScript
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

### Running the Mobile App

#### Prerequisites
- Node.js (version 14 or higher)
- Expo CLI (install globally: `npm install -g @expo/cli`)

#### Installation
1. Navigate to the mobile app directory:
   ```
   cd MyApp
   ```
2. Install dependencies:
   ```
   npm install
   ```

#### Running the Application
- To start the Expo development server:
  ```
  npm start
  ```
  This will open the Expo DevTools in your browser.

- For specific platforms:
  - Android: `npm run android`
  - iOS: `npm run ios`
  - Web: `npm run web`

---

> OrbitPM — Secure by design. Scalable by architecture.

## Screenshots

### Common Screens
![Common Screen 1](Images/Common_Screens/Screenshot%202026-02-10%20073813.png)
![Common Screen 2](Images/Common_Screens/Screenshot%202026-02-10%20081403.png)

### System Admin
![System Admin 1](Images/System_Admin/Screenshot%202026-02-10%20073129.png)
![System Admin 2](Images/System_Admin/Screenshot%202026-02-10%20073142.png)
![System Admin 3](Images/System_Admin/Screenshot%202026-02-10%20073150.png)

### Tenant Admin
![Tenant Admin 1](Images/Tenant_Admin/Screenshot%202026-02-10%20072857.png)
![Tenant Admin 2](Images/Tenant_Admin/Screenshot%202026-02-10%20072910.png)
![Tenant Admin 3](Images/Tenant_Admin/Screenshot%202026-02-10%20073005.png)
![Tenant Admin 4](Images/Tenant_Admin/Screenshot%202026-02-10%20073017.png)
![Tenant Admin 5](Images/Tenant_Admin/Screenshot%202026-02-10%20073028.png)
![Tenant Admin 6](Images/Tenant_Admin/Screenshot%202026-02-10%20073042.png)
![Tenant Admin 7](Images/Tenant_Admin/Screenshot%202026-02-10%20073051.png)
![Tenant Admin 8](Images/Tenant_Admin/Screenshot%202026-02-10%20073101.png)

### Tenant Member
![Tenant Member 1](Images/Tenant_Member/Screenshot%202026-02-10%20075033.png)
![Tenant Member 2](Images/Tenant_Member/Screenshot%202026-02-10%20075045.png)
