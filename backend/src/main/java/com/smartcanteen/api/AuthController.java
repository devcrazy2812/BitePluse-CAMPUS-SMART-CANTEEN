package com.smartcanteen.api;

import com.smartcanteen.domain.User;
import com.smartcanteen.dto.AuthRequests;
import com.smartcanteen.repo.UserRepository;
import com.smartcanteen.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    public AuthController(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthRequests.AuthResponse> register(@Valid @RequestBody AuthRequests.RegisterRequest request) {
        AuthRequests.AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthRequests.AuthResponse> login(@Valid @RequestBody AuthRequests.LoginRequest request) {
        AuthRequests.AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<AuthRequests.UserSummary> getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return ResponseEntity.ok(authService.toSummary(user));
    }
}
