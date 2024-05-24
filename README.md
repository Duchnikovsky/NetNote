# NetNote

## Description
**NetNote** is a modern application for creating and managing notes, designed for authorized users. It allows users to easily and securely create, edit, and organize notes within directories. Users can log in to the system, manage their notes and directories, and utilize advanced features such as creation and editing modals.

This application is deployed and accessible at [net-note.vercel.app](https://net-note.vercel.app).

## Technologies
The project is built using modern web technologies, including React.js and TypeScript for the front-end, and Node.js with Prisma for the back-end. It also utilizes React Query for managing asynchronous state and Radix UI for user interface components.

## Installation Requirements
To run the project, the following dependencies are necessary:
- Node.js
- npm or yarn
- Vite
- Prisma

Install the dependencies using npm or Yarn:
```
npm install
# or
yarn install
```

## Running the Project
To run the project locally, follow these steps:

1. Clone the repository.
2. Start the back-end server:
   ```
   npm run dev
   # or
   yarn dev
   ```
3. Start the front-end:
   ```
   npm run dev
   # or
   yarn dev
   ```

## Features
- User authentication and authorization.
- Creating, editing, deleting, and organizing notes within directories.
- Modals for creating and editing notes.
- Error handling and user notifications via toasts.

## Project Structure
The project is divided into two main parts: front-end and back-end. Each section contains appropriate models, controllers, and routes needed to manage the application's state.

## License
This project is available under the MIT license.