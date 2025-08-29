# WanderCall Backend API

## Setup
1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and configure
3. Start development server: `npm run dev`

## API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /health` - Health check

## Folder Structure
```
src/
├── config/         # Database and app configuration
├── controllers/    # Route handlers
├── middleware/     # Custom middleware
├── models/         # Database models
├── routes/         # API routes
├── services/       # Business logic
└── utils/          # Helper functions
```