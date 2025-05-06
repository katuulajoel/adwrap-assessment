# adwrap-assessment

**Full-stack assessment for ADWrap** – build a media management system with support for **billboards** and **streetpoles**, scoped to unique workspaces. Includes sample data and expectations.

---

# ADWrap Media Management – Full-Stack Assessment

Welcome to the ADWrap technical assessment. This task is designed to evaluate your skills in full-stack development using real-world concepts from our platform.

---

## 🧭 Summary of What You’ll Do

- Use provided **mock data** as a reference.
- Create **media items** via backend logic.
- Ensure proper **workspace-scoped ID tracking**.
- Build a frontend for creating or displaying media items.

---

## 🎯 Objective

Build an API that allows users to create and manage **media items** (**static billboards** and **street poles**), ensuring that each workspace has its own independent ID and tracking logic.

---

## 📐 What You'll Be Working With

Each **media item** can be:

- A **Static Billboard** with multiple `staticMediaFaces`
- A **Street Pole** with one or more `routes`

Sample JSON data is included in `/mock-data/`:

- **Media Items**

Each media item belongs to a **workspace**. Counts (e.g., IDs) should be **independent per workspace** — e.g., each workspace starts counting media items from `1`.

---

## 🧱 Backend Notes – Database Setup (Recommended)

Using a database (e.g., **Postgres**), you can do the following:

- **Create tables** for:

  - `mediaItems`
  - `staticMediaFaces`
  - `routes`
  - `workspaces`

- Requirements:
  - Media items must be scoped to a **workspace**.
  - Each workspace should maintain its own count of media item IDs (`BB-1`, `SP-1`, etc.).
  - API should support **nested creation**:
    - Static media with `faces`
    - Street poles with `routes`

> You can also seed your database with sample data or use mock JSON to simulate behavior.

---

## 💻 Frontend Task (Encouraged)

### 🎨 Figma Designs

View the full design prototype here: [Figma Link](https://www.figma.com/design/5cvz0q0X4J4OombQ8hRwjr/Dev-Assessment?t=uMSJTFakAgEC6upl-0)

Please reference these screens when implementing the media feature.  
⚠️ You may ignore extras like filters, pagination, or search on the media table if time is limited.

---

### 🛠️ Media Selection UI

- Display a list of media items in a **table format**
- Each row should be **expandable** to show:
  - `staticMediaFaces` (for static billboards)
  - `routes` (for street poles)

Example behavior:

- A static billboard media item will expand to show all its faces.
- A street pole media item will expand to show all its routes.

---

## ✅ Bonus Points (Nice-to-Haves)

- Responsive layout
- Clean component and state management

---

## 📁 Sample Data

- Mock data for initial development can be found in `/mock-data/`:

---

## Stack Expectations

- Frontend: Next.js + Tailwind + ShadCN
- Backend: Node.js + Express
- State: Redux Toolkit or local state
- Data: Postgres or Use the provided JSON as mock data. Feel free to replicate

---

## 🚀 Deployment & Running Locally

This project is fully containerized using Docker and `docker-compose`. It includes:

- **Postgres database**
- **Backend (Node.js + Express)**
- **Frontend (Next.js + Tailwind + ShadCN)**

### 🔧 Quick Start

1. **Clone the repo:**

```bash
git clone <your-repo-url>
cd adwrap-assessment
```

2. **Run the full stack with Docker:**

```bash
docker-compose up -d
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Swagger API Documentation: http://localhost:5000/api-docs/#/
- Postgres: available at localhost:5432 (default creds in `docker-compose.yml`)

3. **Shut down:**

```bash
docker-compose down -v
```

---

## 📚 API Documentation

The project includes Swagger UI for API documentation and testing:

- Access the Swagger UI at: http://localhost:5000/api-docs/#/
- The documentation provides a complete overview of all available endpoints
- You can test API calls directly through the Swagger interface
- Endpoints are organized by resource type (media items, workspaces, etc.)

---

## ✅ Project Status

- ✅ Backend API implemented with workspace-scoped media items and nested creation (faces, routes).
- ✅ Database schema set up and seeded with sample data.
- ✅ Frontend UI built with dynamic forms and expandable tables to show media details.
- ✅ Docker-based deployment tested and verified.

---

## 🧪 How to Submit

- Fork this repo (or clone and create a private one).
- Complete the task.
- Share your GitHub link or ZIP file with us via email.

## ⏱️ Estimated Time

- We recommend spending no more than 3–6 days total. You’re not expected to build everything — focus on clean, thoughtful implementation.

## 🙌 Questions?

If you’re stuck or unsure about any part of the task, feel free to reach out.

Good luck, and have fun!
– Team ADWrap

Happy building 🚀
