package com.smartcanteen.dto;

import com.smartcanteen.domain.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthRequests {

    public record LoginRequest(
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        String email,

        @NotBlank(message = "Password is required")
        String password
    ) {}

    public record RegisterRequest(
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        String email,

        @NotBlank(message = "Name is required")
        @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
        String name,

        @NotBlank(message = "Password is required")
        @Size(min = 6, max = 64, message = "Password must be at least 6 characters")
        String password
    ) {}

    public record UserSummary(
        Long id,
        String email,
        String name,
        User.Role role
    ) {}

    public record AuthResponse(
        String token,
        UserSummary user
    ) {}
}
