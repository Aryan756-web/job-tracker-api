# Job Application Tracker API

![Node.js](https://img.shields.io/badge/Node.js-Backend-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![Express](https://img.shields.io/badge/Express.js-Framework-black)

# Job Tracker API

A RESTful backend API for tracking job applications.  
Users can register, login, and manage their job applications securely using JWT authentication.

Built with Node.js, Express, and MongoDB, and deployed on Render with interactive API documentation using Swagger.

## 🌐 Live API

Base URL  
https://job-tracker-api-yp4q.onrender.com

API Documentation (Swagger)  
https://job-tracker-api-yp4q.onrender.com/api-docs

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- JWT Authentication
- Mongoose
- Render (Deployment)
- Postman (API Testing)

## Features

- User registration and login
- JWT authentication
- Create, read, update, and delete job applications
- Secure routes using middleware
- MongoDB database integration
- RESTful API architecture

## API Endpoints

### Authentication

POST /auth/register
POST /auth/login

### Jobs

GET /jobs
POST /jobs
PATCH /jobs/:id
DELETE /jobs/:id

## Live API

https://job-tracker-api-yp4q.onrender.com

POST /auth/register

{
"name": "Aryan",
"email": "aryan@test.com",
"password": "12345678"
}

## 📁 Project Structure

src/
config/
db.js
swagger.js

controllers/
authController.js
jobController.js

middleware/
authMiddleware.js

models/
User.js
Job.js

routes/
authRoutes.js
jobRoutes.js

server.js

## Installation

git clone https://github.com/Aryan756-web/job-tracker-api.git

cd job-tracker-api

npm install

npm run dev

## Environment Variables

Create a .env file and add:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
