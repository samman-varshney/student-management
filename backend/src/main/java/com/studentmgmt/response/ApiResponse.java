package com.studentmgmt.response;

import java.time.LocalDateTime;

/**
 * Generic wrapper for all REST API responses.
 *
 * Ensures a consistent JSON envelope across every endpoint:
 * <pre>
 * {
 *   "status"    : 200,
 *   "message"   : "Students retrieved successfully",
 *   "data"      : { ... },
 *   "timestamp" : "2024-05-01T12:00:00"
 * }
 * </pre>
 *
 * @param <T> the type of the payload held in {@code data}
 */
public class ApiResponse<T> {

    private int           status;
    private String        message;
    private T             data;
    private LocalDateTime timestamp;

    // ── Constructors ──────────────────────────────────────────────────────────

    public ApiResponse() {}

    private ApiResponse(int status, String message, T data, LocalDateTime timestamp) {
        this.status    = status;
        this.message   = message;
        this.data      = data;
        this.timestamp = timestamp;
    }

    // ── Static factory helpers ────────────────────────────────────────────────

    /** Create a successful response with a data payload. */
    public static <T> ApiResponse<T> success(int status, String message, T data) {
        return new ApiResponse<>(status, message, data, LocalDateTime.now());
    }

    /** Create an error response (no data payload). */
    public static <T> ApiResponse<T> error(int status, String message, LocalDateTime timestamp) {
        return new ApiResponse<>(status, message, null, timestamp);
    }

    // ── Getters & Setters ─────────────────────────────────────────────────────

    public int           getStatus()                    { return status; }
    public void          setStatus(int status)          { this.status = status; }

    public String        getMessage()                   { return message; }
    public void          setMessage(String message)     { this.message = message; }

    public T             getData()                      { return data; }
    public void          setData(T data)                { this.data = data; }

    public LocalDateTime getTimestamp()                 { return timestamp; }
    public void          setTimestamp(LocalDateTime ts) { this.timestamp = ts; }
}
