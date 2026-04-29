package com.studentmgmt.controller;

import com.studentmgmt.model.Student;
import com.studentmgmt.response.ApiResponse;
import com.studentmgmt.service.StudentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller exposing CRUD endpoints for the Student resource.
 *
 * Base path: /students
 *
 *  POST   /students        → create a student
 *  GET    /students        → list all students
 *  GET    /students/{id}   → get one student
 *  PUT    /students/{id}   → update a student
 *  DELETE /students/{id}   → delete a student
 */
@RestController
@RequestMapping("/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // ── POST /students ────────────────────────────────────────────────────────

    /**
     * Create a new student.
     *
     * @param student JSON body with name, email, course fields
     * @return 201 Created with the persisted student (including generated id)
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Student>> createStudent(@RequestBody Student student) {
        Student created = studentService.createStudent(student);
        ApiResponse<Student> response = ApiResponse.success(
                HttpStatus.CREATED.value(),
                "Student created successfully.",
                created
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ── GET /students ─────────────────────────────────────────────────────────

    /**
     * Retrieve all students.
     *
     * @return 200 OK with a list of students (may be empty)
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Student>>> getAllStudents() {
        List<Student> students = studentService.getAllStudents();
        ApiResponse<List<Student>> response = ApiResponse.success(
                HttpStatus.OK.value(),
                "Students retrieved successfully.",
                students
        );
        return ResponseEntity.ok(response);
    }

    // ── GET /students/{id} ────────────────────────────────────────────────────

    /**
     * Retrieve a student by id.
     *
     * @param id path variable — the student's primary key
     * @return 200 OK with the student, or 404 if not found
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Student>> getStudentById(@PathVariable Integer id) {
        Student student = studentService.getStudentById(id);
        ApiResponse<Student> response = ApiResponse.success(
                HttpStatus.OK.value(),
                "Student retrieved successfully.",
                student
        );
        return ResponseEntity.ok(response);
    }

    // ── PUT /students/{id} ────────────────────────────────────────────────────

    /**
     * Update an existing student.
     *
     * @param id      path variable — the student's primary key
     * @param student JSON body with updated fields
     * @return 200 OK with the updated student, or 404 if not found
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Student>> updateStudent(
            @PathVariable Integer id,
            @RequestBody  Student student) {

        Student updated = studentService.updateStudent(id, student);
        ApiResponse<Student> response = ApiResponse.success(
                HttpStatus.OK.value(),
                "Student updated successfully.",
                updated
        );
        return ResponseEntity.ok(response);
    }

    // ── DELETE /students/{id} ─────────────────────────────────────────────────

    /**
     * Delete a student by id.
     *
     * @param id path variable — the student's primary key
     * @return 200 OK with a confirmation message, or 404 if not found
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteStudent(@PathVariable Integer id) {
        studentService.deleteStudent(id);
        ApiResponse<Void> response = ApiResponse.success(
                HttpStatus.OK.value(),
                "Student with id " + id + " deleted successfully.",
                null
        );
        return ResponseEntity.ok(response);
    }
}
