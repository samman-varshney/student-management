package com.studentmgmt.repository;

import com.studentmgmt.model.Student;

import java.util.List;
import java.util.Optional;

/**
 * Repository contract for Student persistence operations.
 * Implementations use raw JDBC (JdbcTemplate) — no ORM.
 */
public interface StudentRepository {

    /**
     * Persist a new student and return the generated record (with id).
     */
    Student save(Student student);

    /**
     * Retrieve every student row from the database.
     */
    List<Student> findAll();

    /**
     * Find a single student by primary key.
     *
     * @return an Optional containing the student, or empty if not found
     */
    Optional<Student> findById(Integer id);

    /**
     * Update all mutable fields of an existing student.
     *
     * @return number of rows affected (0 means the id did not exist)
     */
    int update(Integer id, Student student);

    /**
     * Delete a student record by primary key.
     *
     * @return number of rows deleted (0 means the id did not exist)
     */
    int delete(Integer id);
}
