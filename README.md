# Hotel Table Booking System - Backend

This is the backend for the Hotel Table Booking System built with Node.js, Express.js, and MongoDB.

## Features

- User authentication and authorization
- Restaurant management
- Table management
- Reservation system
- Availability checking
- Admin controls
- Secure API endpoints

## Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file in the root directory with the following variables:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hotel_table_booking
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_random
FRONTEND_URL=http://localhost:3000
```

5. Start the development server:

```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires authentication)
- `PUT /api/auth/profile` - Update user profile (requires authentication)

### Restaurants

- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get a specific restaurant
- `POST /api/restaurants` - Create a new restaurant (admin only)
- `PUT /api/restaurants/:id` - Update a restaurant (admin only)
- `DELETE /api/restaurants/:id` - Delete a restaurant (admin only)

### Tables

- `GET /api/restaurants/:restaurantId/tables` - Get tables for a restaurant
- `GET /api/tables/:id` - Get a specific table
- `POST /api/tables` - Create a new table (admin only)
- `PUT /api/tables/:id` - Update a table (admin only)
- `DELETE /api/tables/:id` - Delete a table (admin only)

### Reservations

- `POST /api/reservations` - Create a new reservation (requires authentication)
- `GET /api/reservations` - Get user's reservations (requires authentication)
- `GET /api/reservations/:id` - Get a specific reservation (requires authentication)
- `PUT /api/reservations/:id` - Update reservation status (admin only)
- `DELETE /api/reservations/:id` - Cancel a reservation (requires authentication)
- `GET /api/restaurants/:restaurantId/reservations` - Get reservations for a restaurant (admin only)
- `GET /api/reservations/check-availability` - Check table availability

## Database Models

### User
- name: String (required)
- email: String (required, unique)
- password: String (required, hashed)
- phone: String
- role: String (enum: 'user', 'admin', default: 'user')

### Restaurant
- name: String (required)
- cuisine: String
- image: String
- rating: Number (0-5)
- address: String
- contact: String
- openingHours: Object
- isActive: Boolean (default: true)

### Table
- restaurantId: ObjectId (ref: 'Restaurant', required)
- tableName: String (required)
- section: String
- seats: Number (required, min: 1)
- status: String (enum: 'Available', 'Booked', 'Maintenance', 'Reserved', default: 'Available')
- features: Array of Strings
- pricePerHour: Number (default: 0)
- isActive: Boolean (default: true)

### Reservation
- userId: ObjectId (ref: 'User', required)
- restaurantId: ObjectId (ref: 'Restaurant', required)
- restaurantName: String (required)
- tableName: String (required)
- tableId: ObjectId (ref: 'Table', required)
- date: Date (required)
- time: String (required)
- guests: Number (required, min: 1)
- specialRequests: String
- status: String (enum: 'Pending', 'Confirmed', 'Cancelled', 'Completed', default: 'Pending')
- bookingReference: String (unique, required)
- totalAmount: Number (default: 0)
- paymentStatus: String (enum: 'Pending', 'Paid', 'Failed', 'Refunded', default: 'Pending')

## Roles

- **User**: Can view restaurants, tables, make reservations, view their own reservations
- **Admin**: Has all user permissions plus can manage restaurants, tables, and update reservation statuses

## Error Handling

All API endpoints return standardized error responses:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [] // Validation errors (optional)
}
```

## Success Responses

Success responses follow this format:

```json
{
  "success": true,
  "message": "Success message", // Optional
  "data": {}, // Response data (optional)
  "count": 0, // Count of items (optional)
  "page": 1, // Page number (optional)
  "totalPages": 1 // Total pages (optional)
}
```

## Running in Production

To run the application in production mode:

```bash
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request