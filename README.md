# CineBook - Movie Ticket Booking (MERN Stack)

A movie ticket booking application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- Browse movies
- User authentication
- Book movie tickets
- Secure payment processing
- Instant booking confirmation

## Tech Stack

- **Frontend**: React with React Router
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Styling**: Plain CSS

## Project Structure

```
movie-booking/
├── client/          # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── index.js
│   └── package.json
├── server/          # Express backend
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── .env
│   └── package.json
└── package.json     # Root package.json
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm run install-all
   ```

2. **Start MongoDB** (make sure MongoDB is running locally)

3. **Start the development servers:**
   ```bash
   npm run dev
   ```

   This will start both the client (port 3000) and server (port 5000).

## Available Scripts

- `npm run install-all` - Install dependencies for both client and server
- `npm run dev` - Start both client and server in development mode
- `npm run client` - Start only the React client
- `npm run server` - Start only the Express server
- `npm run build` - Build the React app for production

## Environment Variables

Create a `.env` file in the `server/` directory:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/movie-booking
JWT_SECRET=your-secret-key
```

## API Endpoints

- `GET /api/movies` - Get all movies
- `GET /api/movies/:id` - Get movie by ID
- `POST /api/movies` - Create a new movie

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
