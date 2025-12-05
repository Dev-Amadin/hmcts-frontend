# HMCTS Task Management – Angular Frontend

This is the frontend application for the HMCTS Task Management system.  
It is built using **=Angular 17**, **Standalone Components**, **Reactive Forms**, and **TailwindCSS**.

## Features
- View list of tasks  
- Create a new task  
- Update existing tasks  
- Delete tasks  
- Communicates with a Spring Boot backend API  
- Uses HttpClient for CRUD operations  

## Project Structure
src/app
─ task/
 ─ task.component.ts
 ─ task.component.html
 ─ task.service.ts
 ─ task.model.ts
─ app.component.ts
─ app.config.ts

## Running the App

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
ng serve
```

The app runs at:

```
http://localhost:4200
```

---

## API Configuration

The frontend communicates with the backend using:

```
environment.serverUrl = 'http://localhost:8080/api/hmcts';
```

Example request:

```ts
this.http.get<Task[]>(`${this.url}`);
```

---

## Angular Testing

Run all frontend unit tests:

```bash
ng test
```

Includes tests for:
- Component creation  
- Service HTTP calls (using HttpTestingController)

---

## Requirements
- Node.js 18+
- Angular CLI
- Spring Boot backend running locally

## 📄 License
For educational and demonstration purposes.
