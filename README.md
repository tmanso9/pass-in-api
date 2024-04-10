# pass.in

pass.in is an application for **managing participants in in-person events**.

It was built during Rocketseat's NLW Unite event.

The tool allows the organizer to register an event and open a public registration page.

Registered participants can generate a credential for check-in on the day of the event.

The system will scan the participant's credential to allow entry to the event.

1. [Functionality](#functionality)
    - [Functional Requirements](#functional-requirements)
    - [Business Rules](#business-rules)
    - [Non-functional Requirements](#non-functional-requirements)
2. [Tech Requirements](#tech-requirements)
3. [Getting Started](#getting-started)
    - [Commands](#commands)
4. [API Documentation (Swagger)](#api-documentation-swagger)
5. [Database](#database)
    - [Database structure](#database-structure)
6. [Tech Stack](#tech-stack)

## Functionality

### Functional Requirements

- [x] The organizer must be able to register a new event;
- [x] The organizer must be able to view event data;
- [x] The organizer must be able to view the list of participants;
- [x] The participant must be able to register for an event;
- [x] The participant must be able to view their registration badge;
- [x] The participant must be able to check-in at the event;

### Business Rules

- [x] Participants can only register for an event once;
- [x] Participants can only register for events with available slots;
- [x] Participants can only check-in at an event once;

### Non-functional Requirements

- [x] Event check-in will be done via a QR Code;

## Tech Requirements

To run this project, you need:

- Node.js installed on your machine

## Getting Started

The API is deployed at https://pass-in-api-3cbc3460e010.herokuapp.com .

For development purposes, choose the option that best fits your requirements and environment. Each option provides a different level of control and scalability, so consider your needs before making a decision.

1. **Build DB with Docker Compose PostgreSQL and API with npm script**:

    - Run the following command to build the database using Docker Compose and start the API:
        ```bash
        docker-compose up -d postgres
        npm run db:start:dev && npm run dev
        ```

2. **Build both PostgreSQL and API with Docker Compose**:

    - Use the following command to build and start both the PostgreSQL database and the API:
        ```bash
        docker-compose up -d
        ```

3. **Use Automation Scripts and Generate Local Kubernetes Cluster**:
    - Execute the provided automation scripts to generate a local Kubernetes cluster and deploy both PostgreSQL and the API. These scripts should handle setting up the necessary resources, such as deployments, services, and volumes, for the PostgreSQL database and the API.
    - Once the Kubernetes cluster is set up, deploy the applications using the provided scripts.

### Commands

To make development easier, we have provided some commands you can run from your terminal. Here's what each of them does:

- `npm run dev`: This command starts a development server, allowing you to work on your project. It watches for changes in your files and automatically restarts the server when needed.
  
- `npm run build`: When you're ready to deploy your application, use this command to build your project. It compiles your TypeScript code into a format suitable for deployment.

- `npm start`: Once your project is built, you can start the server using this command. It runs the compiled code from the `dist` directory.

- `npm run db:migrate`: This command runs database migrations, ensuring that your database schema is up-to-date with your code changes.

- `npm run db:studio`: If you need to visually inspect your database or make changes to your data, use this command to open Prisma Studio, a graphical interface for managing your database.

## API Documentation (Swagger)

Once the API is running, you can access detailed documentation at [http://localhost:3000/docs](http://localhost:3000/docs).

<img src=".assets/swagger.png" width="600" alt="swagger api documentation screenshot" />

## Database

This application will use a relational database (SQL). For development environment, we will proceed with SQLite for its ease of setup.

### Database structure

```sql
-- CreateTable
CREATE TABLE "events" (
	"id" TEXT NOT NULL,
	"title" TEXT NOT NULL,
	"details" TEXT,
	"slug" TEXT NOT NULL,
	"maximum_attendees" INTEGER,

	CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendees" (
	"id" SERIAL NOT NULL,
	"name" TEXT NOT NULL,
	"email" TEXT NOT NULL,
	"created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"event_id" TEXT NOT NULL,

	CONSTRAINT "attendees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "check_ins" (
	"id" SERIAL NOT NULL,
	"created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"attendee_id" INTEGER NOT NULL,

	CONSTRAINT "check_ins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "attendees_event_id_email_key" ON "attendees"("event_id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "check_ins_attendee_id_key" ON "check_ins"("attendee_id");

-- AddForeignKey
ALTER TABLE "attendees" ADD CONSTRAINT "attendees_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_attendee_id_fkey" FOREIGN KEY ("attendee_id") REFERENCES "attendees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

## Tech Stack

- Backend: Node.js with Typescript and Fastify
- Database: Prisma
