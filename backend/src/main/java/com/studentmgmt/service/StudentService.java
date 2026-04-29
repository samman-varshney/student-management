package com.studentmgmt.service;

import com.studentmgmt.model.Student;

import java.util.List;

/**
 * Business-logic contract for Student operations.
 */
public interface StudentService {

    Student     createStudent(Student student);

    List<Student> getAllStudents();

    Student     getStudentById(Integer id);

    Student     updateStudent(Integer id, Student student);

    void        deleteStudent(Integer id);
}
