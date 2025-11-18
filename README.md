# 🚀 CodeSage Backend — AI-Powered Code Review & Assistance API

A powerful backend built with **Node.js**, **Express**, **MongoDB**, and **Gemini/GPT models**, providing AI-driven services such as:

✔ Code Review
✔ Fixing Errors
✔ Code Optimization
✔ Code Explanation
✔ Code Generation
✔ Full User Auth + History Tracking + Trash System

---

## 📂 Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + OAuth (GitHub, Google, etc.) |
| AI Model | Gemini 2.5 Flash / GPT-4.x |
| Utility |  CORS, bcrypt, dotenv |

---

## ⚙️ Features

### 🔐 Authentication

- JWT-based login/signup
- OAuth (GitHub, Google, Microsoft)
- Access & refresh token workflow

### 🤖 AI Services

- Send prompt + code to model
- Get structured explanation / fixes / refactored code
- Generate clean readable output
- Auto-generate meaningful titles

### 📜 History & Trash System

- Saves every AI run
- Stores: service, language, prompt, code, output, title
- Soft delete system → items move to Trash
- User-based filtering via timestamps

---

## 🧱 Project Structure

``` bash
backend/
│── controller/
│── models/
│── routes/
│── middleware/
│── utils/
│── .env
│── server.js
```

---

## 🔑 Environment Variables

```bash
PORT=4000
MONGO_URI=your_mongo_connection_url
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=1d
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key
CLIENT_URL=http://localhost:3000
```

---

## 🗂 History Saving Logic

- AI generates a title using a second model call
- MongoDB stores all metadata + timestamps

---

## 🗑 Trash System Flow

Delete → Move to Trash
Restore → Move back
Permanent Delete → Remove from DB

Indexes:

``` bash
historySchema.index({ user: 1, createdAt: -1 });
trashSchema.index({ user: 1, createdAt: -1 });
```

---

## ▶️ Running the Backend

``` bash
npm install
npm run dev
npm start
```

---

## 🧪 Testing

Use Postman with:

``` bash
Authorization: Bearer <token>
Content-Type: application/json
```

---

## ⭐ Contributions

PRs and issues are welcome.
