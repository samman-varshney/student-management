package com.studentmgmt;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

/**
 * Basic smoke test — verifies that the Spring application context loads.
 *
 * Note: Requires a running PostgreSQL instance bound to the datasource
 * configured in application.properties. For CI pipelines, configure
 * a test-scoped datasource via @TestPropertySource or Testcontainers.
 */
@SpringBootTest
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:postgresql://localhost:5432/student_db",
        "spring.datasource.username=postgres",
        "spring.datasource.password=your_password"
})
class StudentManagementApplicationTests {

    @Test
    void contextLoads() {
        // If the application context starts without exceptions the test passes.
    }
}
