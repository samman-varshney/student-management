package com.studentmgmt.service;

import com.studentmgmt.exception.StudentNotFoundException;
import com.studentmgmt.model.Student;
import com.studentmgmt.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service layer implementation for Student business logic.
 *
 * Responsibilities:
 *  - Input validation
 *  - Delegating persistence to the repository
 *  - Translating repository "not found" signals into domain exceptions
 */
@Service
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;

    public StudentServiceImpl(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    // ── Create ────────────────────────────────────────────────────────────────

    /**
     * Validate mandatory fields and persist a new student.
     */
    @Override
    public Student createStudent(Student student) {
        validateStudent(student);
        return studentRepository.save(student);
    }

    // ── Read ──────────────────────────────────────────────────────────────────

    /** Retrieve all students (may return an empty list — never null). */
    @Override
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    /**
     * Find a student by id.
     *
     * @throws StudentNotFoundException if no row exists for the given id
     */
    @Override
    public Student getStudentById(Integer id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException(id));
    }

    // ── Update ────────────────────────────────────────────────────────────────

    /**
     * Update an existing student's details.
     *
     * @throws StudentNotFoundException if the student id is not present in the DB
     */
    @Override
    public Student updateStudent(Integer id, Student student) {
        // Ensure the student actually exists before attempting the update
        getStudentById(id);

        validateStudent(student);

        int rowsAffected = studentRepository.update(id, student);

        if (rowsAffected == 0) {
            throw new StudentNotFoundException(id);
        }

        // Return the updated state
        student.setId(id);
        return student;
    }

    // ── Delete ────────────────────────────────────────────────────────────────

    /**
     * Delete a student by id.
     *
     * @throws StudentNotFoundException if the student id does not exist
     */
    @Override
    public void deleteStudent(Integer id) {
        // Verify existence first for a meaningful 404 response
        getStudentById(id);

        studentRepository.delete(id);
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    /**
     * Validates that all mandatory Student fields are present and non-blank.
     *
     * @throws IllegalArgumentException on missing / blank fields
     */
    private void validateStudent(Student student) {
        if (student == null) {
            throw new IllegalArgumentException("Student payload must not be null.");
        }
        if (isBlank(student.getName())) {
            throw new IllegalArgumentException("Student name must not be blank.");
        }
        if (isBlank(student.getEmail())) {
            throw new IllegalArgumentException("Student email must not be blank.");
        }
        if (isBlank(student.getCourse())) {
            throw new IllegalArgumentException("Student course must not be blank.");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
