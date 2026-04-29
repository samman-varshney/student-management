# Student Management System

A **production-quality REST API** built with **Spring Boot 3** and **Spring JDBC (JdbcTemplate)** that performs full CRUD operations on a `Student` entity stored in **PostgreSQL**. No ORM (JPA/Hibernate) is used — all SQL is written by hand.

---

## Tech Stack

| Layer       | Technology                     |
|-------------|--------------------------------|
| Language    | Java 17                        |
| Framework   | Spring Boot 3.2.x              |
| Web         | Spring Web (REST)              |
| Persistence | Spring JDBC / JdbcTemplate     |
| Database    | PostgreSQL                     |
| Build Tool  | Maven 3.8+                     |

---

## Project Structure

```
student-management/
├── pom.xml
├── README.md
└── src/
    ├── main/
    │   ├── java/com/studentmgmt/
    │   │   ├── StudentManagementApplication.java   ← Boot entry point
    │   │   ├── controller/
    │   │   │   └── StudentController.java          ← REST endpoints
    │   │   ├── service/
    │   │   │   ├── StudentService.java             ← Business logic interface
    │   │   │   └── StudentServiceImpl.java         ← Business logic implementation
    │   │   ├── repository/
    │   │   │   ├── StudentRepository.java          ← Persistence interface
    │   │   │   └── StudentRepositoryImpl.java      ← JdbcTemplate implementation
    │   │   ├── model/
    │   │   │   └── Student.java                    ← Domain model
    │   │   ├── response/
    │   │   │   └── ApiResponse.java                ← Unified JSON envelope
    │   │   └── exception/
    │   │       ├── StudentNotFoundException.java   ← 404 domain exception
    │   │       └── GlobalExceptionHandler.java     ← @RestControllerAdvice
    │   └── resources/
    │       ├── application.properties              ← App + DB config
    │       └── schema.sql                          ← Table DDL
    └── test/
        └── java/com/studentmgmt/
            └── StudentManagementApplicationTests.java
```

---

## Database Schema

```sql
-- 1. Create the database (run once as superuser)
CREATE DATABASE student_db;

-- 2. Connect to student_db, then create the table
CREATE TABLE IF NOT EXISTS students (
    id     SERIAL       PRIMARY KEY,
    name   VARCHAR(100) NOT NULL,
    email  VARCHAR(100) NOT NULL UNIQUE,
    course VARCHAR(100) NOT NULL
);
```

The DDL is also saved at `src/main/resources/schema.sql`.

---

## API Endpoints

| Method   | Endpoint          | Description          | Success Code |
|----------|-------------------|----------------------|--------------|
| `POST`   | `/students`        | Create a student     | `201`        |
| `GET`    | `/students`        | Get all students     | `200`        |
| `GET`    | `/students/{id}`   | Get student by ID    | `200`        |
| `PUT`    | `/students/{id}`   | Update a student     | `200`        |
| `DELETE` | `/students/{id}`   | Delete a student     | `200`        |

### Response Envelope

Every response (success or error) follows the same JSON envelope:

```json
{
  "status"    : 201,
  "message"   : "Student created successfully.",
  "data"      : { ... },
  "timestamp" : "2024-05-01T12:00:00.000"
}
```

---

## Running the Project Locally

### Prerequisites

- Java 17+ installed (`java -version`)
- Maven 3.8+ installed (`mvn -version`)
- PostgreSQL running locally on port `5432`

### Step 1 — Set up the database

```bash
# Log into psql as the postgres superuser
psql -U postgres

# Create the database
CREATE DATABASE student_db;

# Connect and create the table
\c student_db
CREATE TABLE IF NOT EXISTS students (
    id     SERIAL       PRIMARY KEY,
    name   VARCHAR(100) NOT NULL,
    email  VARCHAR(100) NOT NULL UNIQUE,
    course VARCHAR(100) NOT NULL
);
\q
```

### Step 2 — Configure credentials

Edit `src/main/resources/application.properties` and set your password:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/student_db
spring.datasource.username=postgres
spring.datasource.password=YOUR_ACTUAL_PASSWORD
```

### Step 3 — Build & run

```bash
# From the project root
mvn clean package -DskipTests
java -jar target/student-management-1.0.0.jar

# Or run directly with Maven
mvn spring-boot:run
```

The API will start on **http://localhost:8080**.

---

## Sample Requests

### Create a student — `POST /students`

```bash
curl -s -X POST http://localhost:8080/students \
  -H "Content-Type: application/json" \
  -d '{
        "name"   : "Alice Johnson",
        "email"  : "alice@example.com",
        "course" : "Computer Science"
      }' | jq
```

**Response (201):**
```json
{
  "status"    : 201,
  "message"   : "Student created successfully.",
  "data"      : {
    "id"     : 1,
    "name"   : "Alice Johnson",
    "email"  : "alice@example.com",
    "course" : "Computer Science"
  },
  "timestamp" : "2024-05-01T10:00:00"
}
```

---

### Get all students — `GET /students`

```bash
curl -s http://localhost:8080/students | jq
```

---

### Get student by ID — `GET /students/1`

```bash
curl -s http://localhost:8080/students/1 | jq
```

**404 response when not found:**
```json
{
  "status"    : 404,
  "message"   : "Student not found with id: 99",
  "data"      : null,
  "timestamp" : "2024-05-01T10:05:00"
}
```

---

### Update a student — `PUT /students/1`

```bash
curl -s -X PUT http://localhost:8080/students/1 \
  -H "Content-Type: application/json" \
  -d '{
        "name"   : "Alice Smith",
        "email"  : "alice.smith@example.com",
        "course" : "Data Science"
      }' | jq
```

---

### Delete a student — `DELETE /students/1`

```bash
curl -s -X DELETE http://localhost:8080/students/1 | jq
```

**Response (200):**
```json
{
  "status"    : 200,
  "message"   : "Student with id 1 deleted successfully.",
  "data"      : null,
  "timestamp" : "2024-05-01T10:10:00"
}
```

---

## Error Handling

| Scenario                     | HTTP Status |
|------------------------------|-------------|
| Student not found            | `404`       |
| Duplicate email              | `409`       |
| Blank / missing field        | `400`       |
| Unexpected server error      | `500`       |

---

## Design Decisions

- **No ORM** — All SQL written in `StudentRepositoryImpl` using `JdbcTemplate`.
- **Interface-based layers** — `StudentRepository` and `StudentService` are interfaces; implementations are `@Repository` / `@Service` beans.
- **`ApiResponse<T>` envelope** — All endpoints return a uniform JSON wrapper.
- **`GlobalExceptionHandler`** — `@RestControllerAdvice` converts exceptions to HTTP responses centrally.
- **Constructor injection** — All Spring beans use constructor injection (no `@Autowired` field injection).
