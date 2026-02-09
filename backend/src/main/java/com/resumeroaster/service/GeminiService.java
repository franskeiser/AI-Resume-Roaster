package com.resumeroaster.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Using v1beta API with gemini-flash-latest
    private static final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=";

    public Map<String, Object> analyzeResume(String resumeText) {
        if (resumeText == null || resumeText.trim().isEmpty()) {
            throw new RuntimeException("Resume text is empty.");
        }

        try {
            // Prepare request body for Gemini
            String prompt = getSystemPrompt() + "\n\nHere is the resume text:\n" + resumeText;

            Map<String, Object> part = new HashMap<>();
            part.put("text", prompt);

            Map<String, Object> content = new HashMap<>();
            content.put("parts", Collections.singletonList(part));

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", Collections.singletonList(content));

            // Add generation config with JSON response type
            Map<String, Object> generationConfig = new HashMap<>();
            generationConfig.put("temperature", 0.7);
            generationConfig.put("topP", 0.8);
            generationConfig.put("topK", 40);
            generationConfig.put("maxOutputTokens", 4096); // Increased from 2048
            generationConfig.put("responseMimeType", "application/json"); // Force JSON response
            requestBody.put("generationConfig", generationConfig);

            // Prepare headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            // Send request
            ResponseEntity<Map> response = restTemplate.postForEntity(GEMINI_URL + apiKey, entity, Map.class);

            if (response.getBody() == null) {
                throw new RuntimeException("Empty response from Gemini API");
            }

            // Parse response
            Map<String, Object> responseBody = response.getBody();
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");

            if (candidates == null || candidates.isEmpty()) {
                throw new RuntimeException("No candidates in Gemini response");
            }

            Map<String, Object> candidateContent = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) candidateContent.get("parts");

            if (parts == null || parts.isEmpty()) {
                throw new RuntimeException("No content parts in Gemini response");
            }

            String rawJsonText = (String) parts.get(0).get("text");

            String jsonString = rawJsonText.replaceAll("```json", "").replaceAll("```", "").trim();

            // Parse the JSON content from the AI
            return objectMapper.readValue(jsonString, Map.class);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to analyze resume with Gemini: " + e.getMessage());
        }
    }

    private String getSystemPrompt() {
        return "You are a brutally honest, Gen Z tech recruiter roasting resumes. " +
                "Analyze the provided resume text and return a STRICT JSON object (no markdown, no plain text preamble) with the following structure:\n"
                +
                "{\n" +
                "  \"overallScore\": (integer 0-100),\n" +
                "  \"summary\": (string, a short, spicy, Gen Z style summary of the candidate's profile),\n" +
                "  \"sectionFeedback\": [\n" +
                "    { \"title\": \"Experience\", \"feedback\": \"...\" },\n" +
                "    { \"title\": \"Skills\", \"feedback\": \"...\" },\n" +
                "    ...\n" +
                "  ],\n" +
                "  \"actionableItems\": [\n" +
                "    { \"description\": \"Fix X\", \"example\": \"Instead of Y, say Z\" },\n" +
                "    ...\n" +
                "  ]\n" +
                "}\n" +
                "Be specific, technical, and don't hold back. Use Gen Z slang appropriately (no cap, fr, based, cringe, etc.). "
                +
                "Focus on technical content: detailed projects, metrics, tech stack relevance.";
    }
}
