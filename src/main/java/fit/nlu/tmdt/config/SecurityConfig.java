package fit.nlu.tmdt.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Security Configuration
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Value("${app.url:http://localhost:3000}")
    private String appUrl;

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
                          JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(exception -> exception.authenticationEntryPoint(jwtAuthenticationEntryPoint))
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints - Authentication
                        .requestMatchers("/v1/auth/**").permitAll()

                        // Public endpoints - Posts (GET only)
                        .requestMatchers(HttpMethod.GET, "/v1/posts").permitAll()
                        .requestMatchers(HttpMethod.GET, "/v1/posts/{id}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/v1/posts/public/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/v1/posts/featured").permitAll()

                        // Public endpoints - Rooms & Amenities
                        .requestMatchers(HttpMethod.GET, "/v1/rooms").permitAll()
                        .requestMatchers(HttpMethod.GET, "/v1/rooms/{id}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/v1/rooms/amenities").permitAll()
                        .requestMatchers(HttpMethod.GET, "/v1/rooms/amenities/**").permitAll()

                        // Public endpoints - Vouchers
                        .requestMatchers(HttpMethod.GET, "/v1/vouchers/available").permitAll()
                        .requestMatchers(HttpMethod.GET, "/v1/vouchers/featured").permitAll()
                        .requestMatchers(HttpMethod.GET, "/v1/vouchers/{code}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/v1/vouchers/validate").permitAll()

                        // Public endpoints - Subscriptions
                        .requestMatchers(HttpMethod.GET, "/v1/subscriptions/packages").permitAll()

                        // Public endpoints - Reviews
                        .requestMatchers(HttpMethod.GET, "/v1/reviews/average/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/v1/reviews/post/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/v1/reviews/landlord/**").permitAll()

                        // Swagger & OpenAPI
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()
                        .requestMatchers("/swagger-resources/**", "/v3/api-docs.yaml").permitAll()

                        // Actuator (health check)
                        .requestMatchers("/actuator/health/**", "/actuator/info").permitAll()
                        .requestMatchers("/actuator/**").hasRole("ADMIN")

                        // User endpoints
                        .requestMatchers(HttpMethod.GET, "/v1/users/profile").authenticated()
                        .requestMatchers("/v1/users/**").authenticated()
                        .requestMatchers("/v1/users/{id}").permitAll()
                        .requestMatchers("/v1/users/landlords/{id}").permitAll()

                        // Landlord endpoints - Posts (POST, PUT, DELETE)
                        .requestMatchers(HttpMethod.POST, "/v1/posts").hasAnyRole("LANDLORD", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/v1/posts/**").hasAnyRole("LANDLORD", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/v1/posts/**").hasAnyRole("LANDLORD", "ADMIN")
                        .requestMatchers("/v1/posts/my/**").hasAnyRole("LANDLORD", "ADMIN")
                        .requestMatchers("/v1/posts/pending/**").hasRole("ADMIN")
                        .requestMatchers("/v1/posts/{id}/stats/**").hasAnyRole("LANDLORD", "ADMIN")
                        .requestMatchers("/v1/posts/{id}/boost/**").hasAnyRole("LANDLORD", "ADMIN")
                        .requestMatchers("/v1/posts/{id}/extend/**").hasAnyRole("LANDLORD", "ADMIN")

                        // Room management
                        .requestMatchers(HttpMethod.POST, "/v1/rooms").hasRole("LANDLORD")
                        .requestMatchers(HttpMethod.PUT, "/v1/rooms/**").hasRole("LANDLORD")
                        .requestMatchers(HttpMethod.DELETE, "/v1/rooms/**").hasRole("LANDLORD")
                        .requestMatchers("/v1/rooms/my/**").hasRole("LANDLORD")

                        // Booking endpoints
                        .requestMatchers("/v1/bookings/**").authenticated()

                        // Favorites endpoints
                        .requestMatchers("/v1/favorites/**").authenticated()

                        // Messages endpoints
                        .requestMatchers("/v1/messages/**").authenticated()

                        // Notifications endpoints
                        .requestMatchers("/v1/notifications/**").authenticated()

                        // Reviews - write operations
                        .requestMatchers(HttpMethod.POST, "/v1/reviews/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/v1/reviews/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/v1/reviews/**").authenticated()

                        // Payments
                        .requestMatchers("/v1/payments/**").authenticated()

                        // Subscriptions
                        .requestMatchers("/v1/subscriptions/**").hasAnyRole("LANDLORD", "ADMIN")

                        // Admin endpoints
                        .requestMatchers("/v1/admin/**").hasRole("ADMIN")
                        .requestMatchers("/v1/reports/admin/**").hasRole("ADMIN")
                        .requestMatchers("/v1/reports/**").authenticated()
                        .requestMatchers("/v1/blacklist/**").authenticated()

                        // All other requests require authentication
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(appUrl, "http://localhost:3000", "http://localhost:3001"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept", "X-Requested-With"));
        configuration.setExposedHeaders(List.of("X-Total-Count", "X-Page-Number", "X-Page-Size"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}