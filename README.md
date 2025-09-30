# Mini Vutto

A full-stack platform for buying and selling used bikes.

## Project Structure
- `/frontend` – React app (client)
- `/backend` – Node.js + Express + PostgreSQL (API server)
  - `/backend/db` - Database initialization and connection utilities
  - `/backend/migrations` - SQL migration files for database setup

## Getting Started

### Prerequisites
- Docker and Docker Compose (recommended for easy setup)
- Alternatively: Node.js (v20+ recommended) and PostgreSQL

### Local Development

#### Frontend
```sh
cd frontend
npm install
npm start
```

#### Backend
```sh
cd backend
npm install
# Create a .env file (see below)
node index.js
```

#### Environment Variables (`backend/.env`)
```
DATABASE_URL=postgres://user:password@localhost:5432/minivutto
PORT=5001
JWT_SECRET=your_jwt_secret
```


### Docker Setup (Recommended)

This project includes example Docker Compose configuration for easy setup.

#### Setting up Environment Files

1. Copy the example files:
```sh
cp docker-compose.example.yml docker-compose.yml
cp .env.example .env
```

2. Edit the `.env` file with your own values for:
   - Database credentials
   - JWT secret
   - API URLs

#### Starting All Services
```sh
docker compose up --build
```
This will start:
- PostgreSQL (on port 5432)
- Backend API (on port 5001)
- Frontend (on port 3000)

#### Stopping Services
```sh
docker compose down
```

#### 3. Database Setup
The database tables are **automatically created** when you start the application through:
1. PostgreSQL initialization scripts that run when the database container is first created
2. Backend migration system that checks and creates tables if they don't exist

You do not need to install PostgreSQL or run migrations manually!

