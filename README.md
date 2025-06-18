## Clean Backend ,Learning, and usage of Mongodb

## 🚀 Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (Access + Refresh Token)
- bcrypt (Password hashing)
- dotenv (Environment configuration)

---

## 📁 Project Structure (Partial)

```

chai-backend/
├── src/
│   ├── controllers/
│   │   └── user.controller.js
│   ├── models/
│   │   └── user.model.js
│   ├── routes/
│   │   └── user.routes.js
│   ├── middlewares/
│   └── utils/
├── .env.sample
├── app.js
└── index.js

````

---

## 🔐 User Module Features

### 1. **Register User**
- **Route:** `POST /api/v1/users/register`
- **Body Params:**
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securepassword"
  }
````

* **Returns:** Success message, access token, refresh token

---

### 2. **Login User**

* **Route:** `POST /api/v1/users/login`
* **Body Params:**

  ```json
  {
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```
* **Returns:** Welcome message, access token, refresh token

---

### 3. **Logout User**

* **Route:** `GET /api/v1/users/logout`
* **Headers:** Requires token (optional depending on setup)
* **Returns:** Logout confirmation

---

### 4. **Refresh Token**

* **Route:** `POST /api/v1/users/refresh-token`
* **Body:**

  ```json
  {
    "refreshToken": "<valid-refresh-token>"
  }
  ```
* **Returns:** New access token

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create `.env` file**
   Duplicate `.env.sample` and configure your environment variables (MongoDB URI, JWT secret, etc.)

4. **Start the server**

   ```bash
   npm run dev
   ```

---

## 📌 Notes

* Passwords are hashed using `bcrypt`.
* Tokens are handled using `jsonwebtoken`, with secure refresh and access tokens.
* Rate limiting and advanced validation can be added via middleware (e.g., Joi, express-rate-limit).


