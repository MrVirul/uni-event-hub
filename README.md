# Uni Event Hub

Uni Event Hub is a comprehensive platform designed to manage and discover university events. This repository contains the backend source code for the platform, built with Node.js and MongoDB.

## 🚀 Features

- **User Authentication**: Secure registration and login using JWT and bcrypt password hashing.
- **Role-Based Access**: Support for 'user' and 'admin' roles.
- **Service Layer Architecture**: Clean separation of concerns between controllers and business logic.
- **Global Error Handling**: Consistent error responses across all API endpoints.
- **API Documentation**: Pre-configured Bruno collection for easy testing.

## 🛠️ Technology Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Security**: [JSON Web Tokens (JWT)](https://jwt.io/) & [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **Environment**: [dotenv](https://github.com/motdotla/dotenv)

## 📁 Project Structure

```text
backend/
├── src/
│   ├── Models/         # Mongoose schemas
│   ├── controller/     # Request handlers
│   ├── services/       # Business logic
│   ├── middleware/     # Auth and error handling
│   ├── routes/         # API route definitions
│   ├── utils/          # Helper functions
│   ├── lib/            # DB connection
│   └── index.js        # Server entry point
api/                    # Bruno API collection
```

## ⚙️ Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/MrVirul/uni-event-hub.git
   cd uni-event-hub
   ```

2. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the `backend` directory with the following variables:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Run the server**:
   ```bash
   npm run dev
   ```

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT |
| GET | `/api/auth/profile` | Get logged-in user profile (Protected) |

## 🧪 Testing
We use [Bruno](https://www.usebruno.com/) for API testing. You can find the collection in the `api/` folder. Import the `opencollection.yml` file into Bruno to get started.

## 🤝 Contributing
Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License
This project is licensed under the ISC License.
