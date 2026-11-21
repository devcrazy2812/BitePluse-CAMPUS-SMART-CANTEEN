package com.smartcanteen.service;

import com.smartcanteen.domain.User;
import com.smartcanteen.dto.AuthRequests;
import com.smartcanteen.repo.UserRepository;
import io.jsonwebtoken.Jwts;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SecretKey jwtSecretKey;
    private final long jwtExpirationMs = 86400000L; // 24 hours

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, SecretKey jwtSecretKey) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtSecretKey = jwtSecretKey;
    }

    public AuthRequests.AuthResponse register(AuthRequests.RegisterRequest req) {
        if (userRepository.existsByEmail(req.email().trim().toLowerCase())) {
            throw new IllegalArgumentException("Email is already registered. Please login.");
        }

        User user = new User(
            req.email().trim().toLowerCase(),
            req.name().trim(),
            passwordEncoder.encode(req.password()),
            User.Role.STUDENT
        );

        User saved = userRepository.save(user);
        String token = generateToken(saved);
        return new AuthRequests.AuthResponse(token, toSummary(saved));
    }

    @Transactional(readOnly = true)
    public AuthRequests.AuthResponse login(AuthRequests.LoginRequest req) {
        User user = userRepository.findByEmail(req.email().trim().toLowerCase())
            .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(req.password(), user.password)) {
            throw new BadCredentialsException("Invalid email or password");
        }

        String token = generateToken(user);
        return new AuthRequests.AuthResponse(token, toSummary(user));
    }

    public String generateToken(User user) {
        return Jwts.builder()
            .subject(user.email)
            .claim("role", user.role.name())
            .claim("name", user.name)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
            .signWith(jwtSecretKey)
            .compact();
    }

    public AuthRequests.UserSummary toSummary(User user) {
        return new AuthRequests.UserSummary(user.id, user.email, user.name, user.role);
    }
}
