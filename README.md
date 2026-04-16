# Secure Task API

A full-stack task management web application with user authentication, protected routes, task CRUD operations, advanced filtering, and a polished modern dashboard UI.

##Live Link- https://secure-task-api-omega.vercel.app/

## Features

- User registration and login
- JWT-based authentication
- Protected dashboard route
- Create new tasks
- Update existing tasks
- Delete tasks with confirmation popup
- Search tasks by title or description
- Filter tasks by status
- Filter tasks by priority
- Task fields include title, description, status, priority, and due date
- Responsive and polished dark-themed UI

## Tech Stack

### Frontend
- React.js
- React Router DOM
- Axios
- CSS / Inline Styling

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

## Project Structure

secure-task-api/
├── client/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Register.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── README.md

## Screens / Modules

  Authentication-
            Register page for new users
            Login page for existing users

  Dashboard-
            Welcome header with user details
            Task statistics cards
            Create / edit task form
            Search and filter bar
            Task cards with status and priority badges
            Delete confirmation modal

Task Fields-
  Each task contains:
         Title
         Description
         Status (pending, in-progress, completed)
        Priority (low, medium, high)
        Due Date

        ## Installation and Setup
        1- Clone the repository
        git clone https://github.com/your-username/your-repo-name.git
        cd your-repo-name

2- Setup backend 
     cd server
     npm install

     Create a .env file inside the server folder and add: PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_secret_key
     Start the backend server- npm run dev

3- Setup frontend
    In new terminal- cd client
    npm install
    npm run dev

4- Frontend runs on: http://localhost:5173
   Backend runs on- http://localhost:5000

## API Endpoints
  Auth Routes-
POST /auth/register → Register user
POST /auth/login → Login user
Task Routes
GET /tasks → Get all tasks
POST /tasks → Create task
PATCH /tasks/:id → Update task
DELETE /tasks/:id → Delete task

## Authentication Flow-
User registers with name, email, and password
User logs in with email and password
Backend returns JWT token
Token is stored in localStorage
Protected routes allow only authenticated users to access dashboard

## Future Improvements
Toast notifications
Drag and drop tasks
Task sorting
Pagination
User profile page
Theme switcher
Deployment with frontend and backend hosting

##Learning Outcomes
Through this project, I practiced and improved:

Full-stack web development
REST API integration
Authentication and authorization
Protected routing
State management with React hooks
CRUD operations
UI/UX enhancement
Frontend and backend integration

## Author-
Akarsh Singh Sisoudia
B.Tech CSE (AI/ML)
Frontend + Backend Developer Enthusiast
