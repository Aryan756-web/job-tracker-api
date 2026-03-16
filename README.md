# Job Application Tracker API

A RESTful backend API for managing job applications with authentication and CRUD operations.

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

## Installation

git clone https://github.com/Aryan756-web/job-tracker-api.git

cd job-tracker-api

npm install

npm run dev

## Environment Variables

Create a .env file and add:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
