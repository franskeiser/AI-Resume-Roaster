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
public class OpenAIService {

    @Value("${openai.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private static final String OPENAI_URL = "https://api.openai.com/v1/chat/completions";

    public Map<String, Object> analyzeResume(String resumeText) {
        if (resumeText == null || resumeText.trim().isEmpty()) {
            throw new RuntimeException("Resume text is empty.");
        }

        try {
            // Prepare request body
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "gpt-4o-mini"); // Or "gpt-3.5-turbo" if preferred
            requestBody.put("response_format", Map.of("type", "json_object"));

            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "system", "content", getSystemPrompt()));
            messages.add(Map.of("role", "user", "content", "Here is the resume text:\n\n" + resumeText));
            requestBody.put("messages", messages);

            // Prepare headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            // Send request
            ResponseEntity<Map> response = restTemplate.postForEntity(OPENAI_URL, entity, Map.class);

            if (response.getBody() == null) {
                throw new RuntimeException("Empty response from OpenAI");
            }

            // Parse response
            Map<String, Object> responseBody = response.getBody();
            List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
            if (choices == null || choices.isEmpty()) {
                throw new RuntimeException("No choices in OpenAI response");
            }

            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            String content = (String) message.get("content");

            // Parse the JSON content from the AI
            return objectMapper.readValue(content, Map.class);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to analyze resume with OpenAI: " + e.getMessage());
        }
    }

    private String getSystemPrompt() {
        return "You are a brutally honest, Gen Z tech recruiter roasting resumes. " +
                "Analyze the provided resume text and return a JSON object with the following structure:\n" +
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
