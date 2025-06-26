# Todo Frontend (React)

A modern Todo List application built with React, featuring authentication and CRUD operations, communicating with a Laravel backend via Axios API.

---

## Project Overview

This project is a simple yet robust Todo List frontend application. It allows users to register, log in, and manage their personal todo tasks. The frontend is built with React and styled using Tailwind CSS. It communicates with a Laravel backend API for authentication and data persistence using Axios.

## Features

- User registration and login
- JWT-based authentication (token stored in localStorage)
- Add, edit, complete, and delete todos
- Logout functionality
- Responsive and modern UI with Tailwind CSS
- Protected routes for authenticated users

## Tech Stack

- **React** (with Vite for fast development)
- **React Router** for client-side routing
- **Axios** for HTTP requests
- **Tailwind CSS** for styling
- **Laravel** (backend, not included in this repo)

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd todo-front1
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure API endpoint:**
   - By default, the frontend expects the Laravel API at `http://localhost:8000/api` (see `src/api.js`).
   - Update the `baseURL` in `src/api.js` if your backend runs elsewhere.
4. **Start the development server:**
   ```bash
   npm run dev
   ```

## Usage

- Register a new account or log in with existing credentials.
- Add new todos, mark them as complete/incomplete, edit, or delete them.
- Log out to end your session.

## API Communication

- All API requests are made via Axios to the Laravel backend.
- JWT tokens are stored in `localStorage` and attached to requests via the `Authorization` header.
- Endpoints used:
  - `POST /login` — Authenticate user
  - `POST /register` — Register new user
  - `GET /todos` — Fetch todos
  - `POST /todos` — Add todo
  - `PUT /todos/:id` — Update todo
  - `DELETE /todos/:id` — Delete todo
  - `POST /logout` — Logout user

## Author

Hassan Balleh

## License

This project is open source and available under the [MIT License](LICENSE) (add a LICENSE file if needed).
