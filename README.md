
CineBook 


What you have:
- backend/: Express + Mongoose server connecting to local MongoDB (default mongodb://127.0.0.1:27017/cinebook)
- frontend/: Vite + React single page app

Quick start 

1) Start MongoDB .

2) Backend:
   cd cinebook/backend
   npm install
   npm run seed    # seeds sample movies
   npm start       # server starts on http://localhost:4000

3) Frontend:
   cd cinebook/frontend
   npm install
   npm run dev     # dev server (Vite) shows a port (usually 5173). Frontend expects backend at http://localhost:4000/api

Note :


- If MongoDB is on a different host/port, set MONGO environment variable before starting backend:
    MONGO='mongodb://127.0.0.1:27017/cinebook' npm start
- To build the frontend and serve from backend static build:
   cd frontend && npm run build
   Then start backend; backend serves the `frontend/dist` files automatically.


