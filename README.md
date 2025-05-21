Project-Mangement-System is a TypeScript-powered backend built with Express.js and MongoDB, designed to handle robust project management workflows. It features JWT-based authentication, role-based access control, rate-limited API endpoints, and supports file uploads using Cloudinary.

This backend serves as the core engine for managing users, projects, tasks, subtasks, and file attachments in a scalable and modular fashion. With clear separation of concerns, reusable middlewares, and Zod validation, TS-MEGA is ideal for enterprise-grade applications and modern full-stack projects.

Whether you're building a productivity tool, a task manager, or an internal collaboration platform, TS-MEGA gives you the foundational backend structure to move fast and build with confidence.



### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/)
- Cloudinary credentials (for image upload)
- Email SMTP config (for mail services)



/BE
│── logs/                  # Winston log files (error.log, combined.log)
│── public/
│   └── uploads/           # Temporary storage for uploaded files (via Multer)
│── src/
│   ├── controllers/       # Request handlers and business logic
│   ├── middleware/        # Express middleware (auth, error handler, etc.)
|   ├── models/            # Mongoose models (Project, User, Notes, etc.)
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions (CustomError, permissions)
|   ├── validators/        # Zod schemas and validation logic
|   ├── config/            # Configs for DB, cloudinary, logger, etc.
│   ├── types.d.ts         # Global/custom TypeScript declarations
│   ├── app.ts             # Express app setup (middlewares, routes)
│   ├── index.ts           # Entry point — starts server and connects to DB
├── .env.example           # Sample environment configuration
├── .gitignore             # Files and folders to exclude from Git
├── package.json           # Project dependencies and metadata
├── package-lock.json      # Lockfile for dependency versions
├── tsconfig.json          # TypeScript configuration
└── README.md              # Project overview and documentation

## Contributing

Pull requests are welcome! Feel free to fork the repo and submit a PR.

## License

This project is open-source and available under the **ISC License**.
# ProjectNest

**ProjectNest** is a **TypeScript-based** project and task management system built with **Node.js**, **Express**, and **MongoDB**. It features a clean, modular architecture with role-based access control, project collaboration, team notes, and structured logging using **Winston**.

## Features

- **Project Management** (Create, update, delete projects)
- **Task & Subtask Management**
- **Team Collaboration**
- **Role-Based Access Control** (Owner, Project Manager, Member)
- **Zod Validation**
- **Centralized Error Handling**
- **Mongoose Aggregation Pipelines**
- **Winston Logging Integration**
- **Rate Limiting for Sensitive Endpoints** (e.g., password reset, email verification)

## Technologies Used

- **Language:** TypeScript
- **Runtime:** Node.js
- **Framework:** Express
- **Database:** MongoDB (via Mongoose)
- **Validation:** Zod
- **Authentication:** JWT-based
- **File Uploads:** Multer + Cloudinary
- **Mailing:** Nodemailer + Mailgen
- **Logging:** Winston
- **Security:** express-rate-limit for API throttling

## Installation


### Steps

1. Clone the repository:
   git clone https://github.com/rambhardwajj/project-management-system
   cd project-nest
   
2. Install dependencies:
   npm install
   
3. Copy .env file:
   cp .env.example .env
   
4. Start the server:
   npm start
   
