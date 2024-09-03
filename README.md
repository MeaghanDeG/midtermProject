

Nota Bene - Login Page
Table of Contents
Introduction
Features
Technologies Used
Installation
Usage
File Structure
Environment Variables
API Endpoints
Contributing
License
Introduction
Nota Bene - Login Page is the user authentication interface for the Nota Bene application. This page allows users to register, log in, and reset their passwords securely. It is a critical component of the Nota Bene project, ensuring that user data is protected and only accessible to authenticated users.

Features
User Registration: New users can create an account with an email and password.
User Login: Existing users can log in using their email or username and password.
Password Reset: Users can reset their password if they forget it.
Responsive Design: The login page is designed to be responsive and user-friendly.
Technologies Used
Node.js: JavaScript runtime environment for server-side logic.
Express.js: Web framework for Node.js to handle routing and middleware.
MongoDB: NoSQL database for storing user data.
Passport.js: Authentication middleware for Node.js.
bcrypt: Library for hashing passwords securely.
HTML/CSS: Frontend technologies for structuring and styling the login page.
JavaScript: For adding interactivity to the login page.
dotenv: Module for loading environment variables from a .env file.
Installation
Prerequisites
Node.js and npm installed on your machine.
A running instance of MongoDB.

Steps
Clone the repository:

bash
Copy code
git clone https://github.com/MeaghanDeGroot/midtermProject.git
cd midtermProject/loginPage
Install dependencies:

bash
Copy code
npm install
Set up environment variables:

Create a .env file in the loginPage directory.
Add the following variables:
makefile
Copy code
MONGO_URI=your_mongo_database_uri
SESSION_SECRET=your_session_secret
Run the application:

bash
Copy code
npm start
Usage
Once the server is running, you can access the login page at http://localhost:3000. From here, you can:

Register a new user account.
Log in with existing credentials.
Reset your password if necessary.
File Structure

midtermProject/
│
└───loginPage/
    │
    ├───controllers/
    │   └───authController.js  # Handles user authentication logic
    │
    ├───models/
    │   └───User.js             # User model schema (if using Mongoose)
    │
    ├───routes/
    │   └───auth.js             # Routes for authentication (login, signup, etc.)
    │
    ├───public/
    │   ├───images/             # Folder for images used in the login page
    │   ├───styles.css          # CSS file for styling the login page
    │   └───script.js           # JavaScript file for client-side functionality
    │
    ├───views/
    │   └───index.html          # Main HTML file for the login page
    │
    ├───.env                    # Environment variables
    ├───server.js               # Entry point for the Node.js server
    └───package.json            # Project dependencies and scripts
Environment Variables
The .env file should contain the following variables:

plaintext
Copy code
MONGO_URI=your_mongo_database_uri
SESSION_SECRET=your_session_secret
API Endpoints
POST /auth/login: Authenticate a user with email/username and password.
POST /auth/signup: Register a new user.
POST /auth/forgot-password: Handle password reset requests.
Contributing
If you'd like to contribute to this project, please fork the repository and use a feature branch. Pull requests are warmly welcome.

License
This project is licensed under the MIT License.









