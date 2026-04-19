# SSInfoChat

Minimal production-oriented full-stack application with:

- Angular 21 frontend
- Node.js + Express backend
- Google OAuth 2.0 login
- JWT-protected APIs
- MySQL persistence
- CometChat Angular UI Kit integration
- Google Calendar event creation

## Structure

- `frontend/`: Angular application with feature folders for `auth`, `chat`, `calendar`, and shared infrastructure.
- `backend/`: Express API with modular routes, Passport Google OAuth, CometChat token brokering, and Calendar integration.

## Backend setup

1. Copy `backend/.env.example` to `backend/.env`.
2. Fill in:
   - Google OAuth credentials
   - MySQL connection values
   - JWT secret
   - CometChat app id, region, and full-access REST API key
3. Run the schema in `backend/database/schema.sql`.
4. Start the backend:

```bash
cd backend
npm install
npm run dev
```

The API runs on `http://localhost:3000`.

## Frontend setup

1. Confirm `frontend/src/environments/environment.ts` points to the backend URL.
2. Start the frontend:

```bash
cd frontend
npm install
npm start
```

The Angular app runs on `http://localhost:4200`.

## Auth flow

- `GET /auth/google`: starts Google OAuth
- `GET /auth/callback`: creates/updates the user, signs a JWT, and redirects to Angular
- `GET /auth/logout`: clears the backend Passport session context and lets the client drop the JWT
- `GET /auth/me`: protected route used by Angular to restore the signed-in user and directory list
- `GET /auth/chat-token`: protected route that syncs the current user into CometChat and returns a CometChat auth token

## Chat

- Angular uses `@cometchat/chat-uikit-angular` for real-time one-to-one chat UI.
- The backend stores optional message metadata through:
  - `POST /chat/send`
  - `GET /chat/history?peerId=<id>`

## Calendar

- Angular posts the event form to:
  - `POST /calendar/create-event`
- The backend uses the signed-in user’s Google tokens to create a primary calendar event.

## Verification

- Backend syntax checked across all files.
- Frontend production build completed successfully with `npm run build`.
