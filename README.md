# 🚀 Travel Planner

A full-stack Travel Planning Application built with:

- ⚛️ React (Vite)
- ⚡ FastAPI
- 🐘 PostgreSQL
- 🐳 Docker & Docker Compose

---

## 📦 Tech Stack

### Frontend
- React (Vite)
- Axios
- Vite Dev Server (Hot Reload)

### Backend
- FastAPI
- SQLAlchemy (2.0)
- PostgreSQL
- Pydantic
- python-jose (JWT)
- Passlib (bcrypt)

### Infrastructure
- Docker
- Docker Compose

---

## 🛠 Prerequisites

Install the following before running the project:

### 1. Git
```bash
git --version
```

### 2. Docker & Docker Compose
```bash
docker --version
docker compose version
```

### 3. Node.js (Optional for local frontend)
```bash
node -v
npm -v
```

### 4. Python 3.10+ (Optional for local backend)
```bash
python --version
```

---

## 📁 Project Structure

```text
travel-app/
│
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── routers/
│   │   └── main.py
│   ├── requirements.txt
│   ├── .env
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
DATABASE_URL=postgresql://travel:travel123@db:5432/travel_db
SECRET_KEY=supersecretkey
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:8000
```

⚠️ Do NOT commit `.env` files.

---

## 🐳 Running with Docker (Recommended)

From the project root:

```bash
docker compose up --build
```

### Access URLs

Frontend:
```
http://localhost:5173
```

Backend:
```
http://localhost:8000
```

Swagger Docs:
```
http://localhost:8000/docs
```

---

## 🛑 Stop Containers

```bash
docker compose down
```

Reset database (remove volumes):

```bash
docker compose down -v
```

---

## 💻 Local Development (Recommended for Faster Workflow)

### Option 1: Frontend Local + Backend in Docker

Start backend and database:
```bash
docker compose up backend db
```

Start frontend locally:
```bash
cd frontend
npm install
npm run dev
```

---

### Option 2: Run Backend Locally

```bash
cd backend
python -m venv venv
source venv/bin/activate    # Mac/Linux
venv\Scripts\activate       # Windows

pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

## 🔥 Live Reload

Frontend:
- Enabled by default via Vite

Backend:
```bash
uvicorn app.main:app --reload
```

---

## 🗄 Database Configuration

```
User: travel
Password: travel123
Database: travel_db
Port: 5432
```

---

## 🧪 Sample API Test

POST `/users`

```json
{
  "name": "Test User",
  "email": "test@test.com",
  "password": "123456"
}
```

---

## 🛠 Common Issues

### Backend Not Connected
- Ensure backend container is running
- Verify `VITE_API_URL`
- Check CORS settings

### Database Connection Error
- Verify `DATABASE_URL`
- Ensure DB container is running
- Use `db` as hostname inside Docker

### Frontend Not Refreshing
- Ensure volume mount is configured
- Enable polling if needed in Vite config

---

## 📈 Development Workflow

1. Pull latest changes:
```bash
git pull
```

2. Create a feature branch:
```bash
git checkout -b feature/your-feature
```

3. Commit changes:
```bash
git commit -m "feat: add feature"
```

4. Push branch:
```bash
git push origin feature/your-feature
```

5. Create Pull Request

---

## 👥 Team Guidelines

- Use feature branches
- Do not push directly to main
- Do not commit `.env`
- Keep commits small and meaningful
- Review code before merging

---

## 🔐 Future Improvements

- JWT Authentication
- Role-Based Access Control
- Google Drive Integration
- Alembic Migrations
- CI/CD Pipeline
- Production Docker Setup

---

