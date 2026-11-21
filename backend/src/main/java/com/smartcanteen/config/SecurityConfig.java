package com.smartcanteen.config;

import com.smartcanteen.repo.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecretKey secretKey(@Value("${app.jwt-secret:bitepulse-default-secure-jwt-token-signing-key-2026-canteen}") String secret) {
        try {
            // Safely produce a 256-bit key from the configured secret
            MessageDigest sha256 = MessageDigest.getInstance("SHA-256");
            byte[] keyBytes = sha256.digest(secret.getBytes(StandardCharsets.UTF_8));
            return Keys.hmacShaKeyFor(keyBytes);
        } catch (NoSuchAlgorithmException e) {
            byte[] rawBytes = secret.getBytes(StandardCharsets.UTF_8);
            byte[] padded = Arrays.copyOf(rawBytes, Math.max(32, rawBytes.length));
            return Keys.hmacShaKeyFor(padded);
        }
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of(
            "http://localhost:*",
            "http://127.0.0.1:*",
            "https://*.vercel.app"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept", "X-Requested-With", "Origin"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtFilter) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .headers(headers -> headers
                .frameOptions(frame -> frame.disable())
                .contentTypeOptions(cto -> {})
                .xssProtection(xss -> {})
            )
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/menu/**").permitAll()
                .requestMatchers("/h2-console/**").permitAll()
                .requestMatchers("/error").permitAll()
                // Role-based endpoints
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/menu/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/menu/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/menu/**").hasRole("ADMIN")
                .requestMatchers("/api/orders/kitchen/**").hasAnyRole("STAFF", "ADMIN")
                // All other requests require authentication
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter(UserRepository userRepository, SecretKey secretKey) {
        return new JwtAuthenticationFilter(userRepository, secretKey);
    }

    public static class JwtAuthenticationFilter extends OncePerRequestFilter {
        private final UserRepository userRepository;
        private final SecretKey secretKey;

        public JwtAuthenticationFilter(UserRepository userRepository, SecretKey secretKey) {
            this.userRepository = userRepository;
            this.secretKey = secretKey;
        }

        @Override
        protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
                throws ServletException, IOException {
            String header = request.getHeader("Authorization");

            if (header != null && header.startsWith("Bearer ")) {
                String token = header.substring(7).trim();
                try {
                    Claims claims = Jwts.parser()
                        .verifyWith(secretKey)
                        .build()
                        .parseSignedClaims(token)
                        .getPayload();

                    String email = claims.getSubject();
                    if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                        userRepository.findByEmail(email).ifPresent(user -> {
                            var authority = new SimpleGrantedAuthority("ROLE_" + user.role.name());
                            var authToken = new UsernamePasswordAuthenticationToken(
                                user.email,
                                null,
                                List.of(authority)
                            );
                            SecurityContextHolder.getContext().setAuthentication(authToken);
                        });
                    }
                } catch (Exception ex) {
                    // Invalid, expired, or tampered token: continue without setting authentication
                    SecurityContextHolder.clearContext();
                }
            }

            filterChain.doFilter(request, response);
        }
    }
}
