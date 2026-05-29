# Running the Hotel Table Booking System Backend

## Prerequisites

Before running the backend, you need to have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (either locally or use MongoDB Atlas)

## Setting up MongoDB

### Option 1: Local MongoDB Installation

1. Download and install MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Follow the installation wizard
3. Make sure to install MongoDB as a service so it starts automatically
4. Verify installation by running `mongod --version` in your terminal

### Option 2: MongoDB Atlas (Cloud)

1. Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas/database)
2. Create a free cluster
3. Create a database user with username and password
4. Get your connection string
5. Replace the `MONGODB_URI` in the `.env` file with your Atlas connection string:

```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-address>/hotel_table_booking?retryWrites=true&w=majority
```

## Running the Application

### Method 1: Using npm commands

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies (if not already installed):
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

### Method 2: Using the batch file (Windows)

Double-click the `start.bat` file in the backend directory to run the server.

## Environment Variables

Make sure your `.env` file contains all required variables:

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hotel_table_booking
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_random
FRONTEND_URL=http://localhost:3000
```

## API Endpoints

Once running, the API will be available at `http://localhost:5000/api/` with the following main endpoints:

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id/tables` - Get tables for a restaurant
- `POST /api/reservations` - Create a new reservation
- `GET /api/reservations` - Get user's reservations (requires authentication)

## Testing the Server

Visit `http://localhost:5000/health` to verify the server is running correctly.

Response should be:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

## Troubleshooting

1. **MongoDB Connection Issues**: Make sure MongoDB is installed and running as a service
2. **Port Already in Use**: Change the PORT variable in your `.env` file
3. **Environment Variables**: Ensure all variables in `.env` are properly set

## Stopping the Server

Press `Ctrl+C` in the terminal where the server is running to stop it.