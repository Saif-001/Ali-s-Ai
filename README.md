# AI Image Generator 🎨

An AI-powered image generation web application built using the MERN Stack (MongoDB, Express.js, React.js, Node.js) integrated with Hugging Face Stable Diffusion API.  
Users can register, log in securely, generate AI images from prompts, save generation history, and manage their generated images.

---

# 🚀 Features

- 🔐 User Authentication (JWT Based)
- 🧠 AI Image Generation using Hugging Face API
- 🖼️ Save Generated Images to MongoDB
- 📜 Personal Image History
- 🗑️ Delete Generated Images
- 🌐 Fully Responsive UI
- ⚡ MERN Stack Architecture
- ☁️ Deployment Ready (Vercel + Render + MongoDB Atlas)

---

# 🛠️ Tech Stack

## Frontend
- React.js
- Vite
- Axios
- React Router DOM
- Tailwind CSS / CSS

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- Hugging Face Inference API

---

# 📂 Project Structure

```bash
project-root/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── .env
│   └── package.json
│
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   └── server.js
│
└── README.md
