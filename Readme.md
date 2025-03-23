# API Endpoints

## Authentication

### Register User
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "username": "string (3-20 chars, letters and spaces only)",
    "email": "valid email",
    "password": "string (min 6 chars, must contain uppercase, lowercase and number)"
  }
  ```
- **Response**: Sends verification email

### Login
- **URL**: `/api/auth/login` 
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "valid email",
    "password": "string"
  }
  ```
- **Response**: Returns user data and JWT token

### Get User Profile
- **URL**: `/api/auth/me`
- **Method**: `GET`
- **Auth**: Required (JWT Token)
- **Response**: Returns user profile data

### Verify Email
- **URL**: `/api/auth/verify-email/:token`
- **Method**: `GET`
- **Response**: Verifies user email

## Google OAuth

### Google Authentication
- **URL**: `/api/auth/google/auth`
- **Method**: `GET`
- **Query Params**: 
  ```
  code: string
  ```
- **Response**: Returns authentication result

### Google Callback
- **URL**: `/api/auth/google/callback`
- **Method**: `GET`
- **Query Params**:
  ```
  code: string
  ```
- **Response**: Returns callback result with auth URL or user data
