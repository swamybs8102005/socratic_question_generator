# PostgreSQL Authentication Setup

## Prerequisites

1. Install PostgreSQL
2. Create database:
   ```bash
   createdb vidyayathra
   ```

## Database Setup

1. Run the schema SQL:
   ```bash
   psql -U postgres -d vidyayathra -f backend/src/db/schema.sql
   ```

## Environment Variables

Add to `backend/.env`:

```env
# Database
DB_USER=postgres
DB_HOST=localhost
DB_NAME=vidyayathra
DB_PASSWORD=your_password
DB_PORT=5432

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## Install Dependencies

```bash
cd backend
npm install pg bcryptjs jsonwebtoken
npm install --save-dev @types/pg @types/bcryptjs @types/jsonwebtoken
```

## API Endpoints

### Authentication

- **POST** `/api/auth/register` - Register new user
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe"
  }
  ```

- **POST** `/api/auth/login` - Login
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- **POST** `/api/auth/logout` - Logout (requires Bearer token)

- **GET** `/api/auth/me` - Get current user profile (requires Bearer token)

- **PUT** `/api/auth/profile` - Update profile (requires Bearer token)
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe",
    "bio": "Software developer",
    "avatarUrl": "https://..."
  }
  ```

- **PUT** `/api/auth/preferences` - Update preferences (requires Bearer token)
  ```json
  {
    "theme": "dark",
    "language": "en",
    "notificationsEnabled": true,
    "emailNotifications": true
  }
  ```

## Usage

1. Register a new user
2. Login to receive JWT token
3. Store token in localStorage as 'auth_token'
4. Include token in Authorization header for protected routes:
   ```
   Authorization: Bearer <token>
   ```

## Features

✅ Secure password hashing with bcrypt
✅ JWT-based authentication
✅ Session management
✅ User profile management
✅ User preferences
✅ Email verification status
✅ Last login tracking
✅ PostgreSQL database storage

## Frontend Integration

The profile page is available at `/dashboard/profile` and includes:
- Profile information display
- Avatar, name, bio editing
- Email verification status
- Account creation and last login dates
- Theme and notification preferences
- Auto-save functionality

Access the profile through:
- Sidebar navigation (add Profile link)
- User dropdown menu in navbar (already configured)
