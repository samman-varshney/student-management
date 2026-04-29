-- ============================================================
--  Student Management DB Schema
--  Run this script once to set up the database.
-- ============================================================

-- Create the database (run as a superuser / psql command line):
-- CREATE DATABASE student_db;

-- Connect to student_db, then run the table DDL below:

CREATE TABLE IF NOT EXISTS students (
    id     SERIAL       PRIMARY KEY,
    name   VARCHAR(100) NOT NULL,
    email  VARCHAR(100) NOT NULL UNIQUE,
    course VARCHAR(100) NOT NULL
);
