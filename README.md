# Vidya AI Backend

## Overview

Vidya AI Backend is a Node.js application that provides a backend service for a chat application powered by AI. It allows users to sign up, log in, and engage in chat sessions where they can communicate with an AI. The application uses JWT for authentication and MongoDB for data storage.

## Features

- User authentication (signup, login, logout)
- Chat functionality with AI responses
- Secure JWT token management
- CORS support for cross-origin requests
- Cookie-based session management

## Technologies Used

- **Node.js**: JavaScript runtime for building the server
- **Express**: Web framework for Node.js
- **MongoDB**: NoSQL database for storing user and chat data
- **Mongoose**: ODM for MongoDB to manage data models
- **JWT (JSON Web Tokens)**: For secure user authentication
- **Bcrypt.js**: For hashing passwords
- **Axios**: For making HTTP requests to the AI API
- **dotenv**: For managing environment variables
- **CORS**: For enabling cross-origin resource sharing
- **Cookie-parser**: For parsing cookies in requests

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/vidya-ai-backend.git
   cd vidya-ai-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:

   ```plaintext
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=http://localhost:3000
   AI_API_URL=your_ai_api_url
   ```

4. Start the application:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication Routes

- **POST /api/auth/signup**
  - Create a new user account.
  - Request body: `{ f_name, l_name, username, password, conf_password, gender }`
- **POST /api/auth/login**
  - Log in an existing user.
  - Request body: `{ username, password }`
- **POST /api/auth/logout**
  - Log out the user and clear the session.
- **GET /api/auth/refresh**
  - Refresh the user session and return user details.

### Chat Routes

- **POST /api/chat/**
  - Create a new chat session.
- **GET /api/chat/**
  - Retrieve all chats for the logged-in user.
- **GET /api/chat/:chatId**
  - Get messages for a specific chat.
- **POST /api/chat/:chatId/send-message**
  - Send a message in an ongoing chat.

## Middleware

- **verify_token**: Middleware to verify JWT tokens and authenticate users.

## Models

- **User**: Represents a user in the system with fields for name, username, password, gender, profile picture, and avatar.
- **Chat**: Represents a chat session linked to a user.
- **Message**: Represents a message in a chat, including the role (user or AI) and the message content.

## Utilities

- **generate_token_and_set_cookie**: Function to generate a JWT token and set it in a cookie.
- **generate_new_chat**: Function to create a new chat session for a user.
- **generateThreadId**: Function to generate a unique thread ID for chat sessions.
- **getAIResponse**: Function to interact with an external AI API to get responses based on user messages.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to the contributors and the open-source community for their support and resources.
