package com.resumeroaster.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    // Comma-separated list of allowed origins. Defaults to local Vite dev ports.
    // In production, set app.cors.allowed-origins (or env CORS_ALLOWED_ORIGINS)
    // to your deployed frontend URL, e.g. https://your-app.vercel.app
    @Value("${app.cors.allowed-origins:http://localhost:5173,http://localhost:3000,http://localhost:5174}")
    private String[] allowedOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(allowedOrigins)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
