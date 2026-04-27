# PATA Backend API Specification

## Overview
PATA is a local service discovery and booking platform for Nairobi, Kenya. This document provides comprehensive API specifications for implementing the backend services that support the frontend application.

## Base URL
```
https://api.pata.co.ke/v1
```

## Authentication
- JWT-based authentication required for protected endpoints
- Authorization header: `Bearer <token>`
- Public endpoints available without authentication

## API Endpoints

### Authentication Endpoints

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+254712345678"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+254712345678",
      "createdAt": "2026-04-27T09:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST /auth/login
Authenticate user and return JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+254712345678"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST /auth/logout
Logout user and invalidate token.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### GET /auth/me
Get current user profile.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+254712345678",
    "createdAt": "2026-04-27T09:00:00Z",
    "updatedAt": "2026-04-27T09:00:00Z"
  }
}
```

### Categories Endpoints

#### GET /categories
Get all service categories.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "barbers",
      "name": "Barbers",
      "emoji": "",
      "description": "Hair cuts, shaves, and grooming",
      "count": 156
    },
    {
      "id": "hair-stylists",
      "name": "Hair Stylists",
      "emoji": "",
      "description": "Styling, treatments, and coloring",
      "count": 89
    }
  ]
}
```

#### GET /categories/:id
Get specific category details.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "barbers",
    "name": "Barbers",
    "emoji": "",
    "description": "Hair cuts, shaves, and grooming",
    "count": 156
  }
}
```

### Providers Endpoints

#### GET /providers
Get all providers with optional filtering.

**Query Parameters:**
- `category` (string, optional): Filter by category ID
- `location` (string, optional): Filter by location
- `verified` (boolean, optional): Filter verified providers only
- `featured` (boolean, optional): Filter featured providers only
- `rating` (number, optional): Minimum rating filter
- `priceMin` (number, optional): Minimum price filter
- `priceMax` (number, optional): Maximum price filter
- `limit` (number, optional): Limit results (default: 20)
- `offset` (number, optional): Offset for pagination (default: 0)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "providers": [
      {
        "id": "1",
        "name": "Kevo Cuts",
        "slug": "kevo-cuts",
        "emoji": "",
        "image": "https://cdn.pata.co.ke/providers/kevo-cuts.jpg",
        "specialty": "Fades & Line-ups",
        "category": "barbers",
        "location": "Nairobi CBD",
        "phone": "+254712345678",
        "rating": 4.9,
        "reviewCount": 212,
        "bookings": 580,
        "bookedCount": 89,
        "repeatClients": 156,
        "startingPrice": 350,
        "tags": ["Fades", "Line-ups", "Beard", "Kids"],
        "about": "Nairobi's top fade specialist...",
        "gallery": [
          "https://cdn.pata.co.ke/gallery/kevo-cuts-1.jpg",
          "https://cdn.pata.co.ke/gallery/kevo-cuts-2.jpg"
        ],
        "verified": true,
        "featured": true
      }
    ],
    "pagination": {
      "total": 156,
      "limit": 20,
      "offset": 0,
      "hasMore": true
    }
  }
}
```

#### GET /providers/trending
Get trending providers (high rating + high booking count).

**Query Parameters:**
- `limit` (number, optional): Limit results (default: 6)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Kevo Cuts",
      "slug": "kevo-cuts",
      "emoji": "",
      "image": "https://cdn.pata.co.ke/providers/kevo-cuts.jpg",
      "specialty": "Fades & Line-ups",
      "category": "barbers",
      "location": "Nairobi CBD",
      "phone": "+254712345678",
      "rating": 4.9,
      "reviewCount": 212,
      "bookings": 580,
      "bookedCount": 89,
      "repeatClients": 156,
      "startingPrice": 350,
      "tags": ["Fades", "Line-ups", "Beard", "Kids"],
      "verified": true,
      "featured": true
    }
  ]
}
```

#### GET /providers/:id
Get specific provider details by ID.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Kevo Cuts",
    "slug": "kevo-cuts",
    "emoji": "",
    "image": "https://cdn.pata.co.ke/providers/kevo-cuts.jpg",
    "specialty": "Fades & Line-ups",
    "category": "barbers",
    "location": "Nairobi CBD",
    "phone": "+254712345678",
    "rating": 4.9,
    "reviewCount": 212,
    "bookings": 580,
    "bookedCount": 89,
    "repeatClients": 156,
    "startingPrice": 350,
    "tags": ["Fades", "Line-ups", "Beard", "Kids"],
    "about": "Nairobi's top fade specialist with 7 years of precision work...",
    "gallery": [
      "https://cdn.pata.co.ke/gallery/kevo-cuts-1.jpg",
      "https://cdn.pata.co.ke/gallery/kevo-cuts-2.jpg",
      "https://cdn.pata.co.ke/gallery/kevo-cuts-3.jpg"
    ],
    "services": [
      {
        "name": "Classic Cut",
        "price": "KSh 350",
        "duration": "30 min"
      },
      {
        "name": "Fade + Line-up",
        "price": "KSh 500",
        "duration": "45 min"
      }
    ],
    "reviews": [
      {
        "id": "r1",
        "author": "Maina J.",
        "avatar": "M",
        "rating": 5,
        "date": "2 days ago",
        "text": "Kevo is the absolute GOAT. Perfect fade every single time...",
        "wouldRecommend": true,
        "tags": ["Clean", "On time", "Skilled"]
      }
    ],
    "verified": true,
    "featured": true
  }
}
```

#### GET /providers/:slug
Get specific provider details by slug.

**Response (200):** Same as GET /providers/:id

### Bookings Endpoints

#### POST /bookings
Create a new booking.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "providerId": "1",
  "service": {
    "name": "Classic Cut",
    "price": "KSh 350",
    "duration": "30 min"
  },
  "date": "2026-05-10",
  "time": "10:00 AM",
  "ref": "Special request"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "booking_123",
    "providerId": "1",
    "userId": "user_123",
    "service": {
      "name": "Classic Cut",
      "price": "KSh 350",
      "duration": "30 min"
    },
    "date": "2026-05-10",
    "time": "10:00 AM",
    "ref": "Special request",
    "status": "confirmed",
    "createdAt": "2026-04-27T09:00:00Z",
    "updatedAt": "2026-04-27T09:00:00Z"
  }
}
```

#### GET /bookings
Get user's bookings.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `status` (string, optional): Filter by status (confirmed, completed, cancelled)
- `limit` (number, optional): Limit results (default: 20)
- `offset` (number, optional): Offset for pagination (default: 0)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": "booking_123",
        "provider": {
          "id": "1",
          "name": "Kevo Cuts",
          "image": "https://cdn.pata.co.ke/providers/kevo-cuts.jpg",
          "phone": "+254712345678"
        },
        "service": {
          "name": "Classic Cut",
          "price": "KSh 350",
          "duration": "30 min"
        },
        "date": "2026-05-10",
        "time": "10:00 AM",
        "ref": "Special request",
        "status": "confirmed",
        "createdAt": "2026-04-27T09:00:00Z"
      }
    ],
    "pagination": {
      "total": 5,
      "limit": 20,
      "offset": 0,
      "hasMore": false
    }
  }
}
```

#### GET /bookings/:id
Get specific booking details.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "booking_123",
    "provider": {
      "id": "1",
      "name": "Kevo Cuts",
      "image": "https://cdn.pata.co.ke/providers/kevo-cuts.jpg",
      "phone": "+254712345678",
      "location": "Nairobi CBD"
    },
    "service": {
      "name": "Classic Cut",
      "price": "KSh 350",
      "duration": "30 min"
    },
    "date": "2026-05-10",
    "time": "10:00 AM",
    "ref": "Special request",
    "status": "confirmed",
    "createdAt": "2026-04-27T09:00:00Z",
    "updatedAt": "2026-04-27T09:00:00Z"
  }
}
```

#### PUT /bookings/:id/cancel
Cancel a booking.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "booking_123",
    "status": "cancelled",
    "cancelledAt": "2026-04-27T09:30:00Z"
  }
}
```

### Chat Endpoints

#### GET /chat/messages/:providerId
Get chat messages with a specific provider.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "msg_123",
        "sender": "user",
        "text": "Hi, are you available tomorrow?",
        "timestamp": 1714200000000
      },
      {
        "id": "msg_124",
        "sender": "provider",
        "text": "Hi! Yes, I'm available.",
        "timestamp": 1714200600000
      }
    ],
    "isTyping": false
  }
}
```

#### POST /chat/messages/:providerId
Send a message to a provider.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "text": "Hi, are you available tomorrow?"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "msg_123",
    "sender": "user",
    "text": "Hi, are you available tomorrow?",
    "timestamp": 1714200000000
  }
}
```

#### PUT /chat/messages/:providerId/typing
Indicate typing status.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "isTyping": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Typing status updated"
}
```

#### DELETE /chat/messages/:providerId
Clear chat history with provider.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Chat history cleared"
}
```

### Reviews Endpoints

#### POST /reviews
Create a new review for a provider.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "providerId": "1",
  "rating": 5,
  "text": "Excellent service! Highly recommended.",
  "wouldRecommend": true,
  "tags": ["Professional", "Clean", "On time"]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "review_123",
    "providerId": "1",
    "userId": "user_123",
    "author": "John D.",
    "avatar": "J",
    "rating": 5,
    "text": "Excellent service! Highly recommended.",
    "wouldRecommend": true,
    "tags": ["Professional", "Clean", "On time"],
    "date": "2 days ago",
    "createdAt": "2026-04-27T09:00:00Z"
  }
}
```

#### GET /reviews/provider/:providerId
Get reviews for a specific provider.

**Query Parameters:**
- `limit` (number, optional): Limit results (default: 10)
- `offset` (number, optional): Offset for pagination (default: 0)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "review_123",
        "author": "Maina J.",
        "avatar": "M",
        "rating": 5,
        "date": "2 days ago",
        "text": "Kevo is the absolute GOAT. Perfect fade every single time...",
        "wouldRecommend": true,
        "tags": ["Clean", "On time", "Skilled"]
      }
    ],
    "pagination": {
      "total": 212,
      "limit": 10,
      "offset": 0,
      "hasMore": true
    }
  }
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "message": "Invalid email format"
    }
  }
}
```

### Common Error Codes:
- `VALIDATION_ERROR`: Invalid request data
- `UNAUTHORIZED`: Invalid or missing authentication
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `CONFLICT`: Resource conflict (e.g., duplicate email)
- `RATE_LIMIT`: Too many requests
- `INTERNAL_ERROR`: Server error

## Rate Limiting
- Authentication endpoints: 5 requests per minute per IP
- General endpoints: 100 requests per minute per authenticated user
- Public endpoints: 1000 requests per minute per IP

## Webhooks
Provide webhook endpoints for real-time notifications:

### POST /webhooks/booking-status
Notify when booking status changes.

**Request Body:**
```json
{
  "event": "booking.status_changed",
  "data": {
    "bookingId": "booking_123",
    "userId": "user_123",
    "providerId": "1",
    "oldStatus": "confirmed",
    "newStatus": "completed",
    "timestamp": "2026-04-27T09:00:00Z"
  },
  "signature": "sha256=..."
}
```

### POST /webhooks/new-message
Notify when new chat message is received.

**Request Body:**
```json
{
  "event": "chat.new_message",
  "data": {
    "messageId": "msg_123",
    "providerId": "1",
    "userId": "user_123",
    "sender": "user",
    "text": "Hi, are you available?",
    "timestamp": "2026-04-27T09:00:00Z"
  },
  "signature": "sha256=..."
}
```

## File Upload
Image uploads should be handled via CDN service. API endpoints accept image URLs rather than file uploads.

## Environment Variables
Required environment variables:
- `JWT_SECRET`: Secret for JWT token signing
- `DATABASE_URL`: Database connection string
- `CDN_BASE_URL`: Base URL for image CDN
- `WEBHOOK_SECRET`: Secret for webhook signature validation

## Security Considerations
- All passwords must be hashed using bcrypt
- JWT tokens should expire after 24 hours
- Implement rate limiting on all endpoints
- Validate all input data and sanitize outputs
- Use HTTPS for all API communications
- Implement CORS with appropriate origins
