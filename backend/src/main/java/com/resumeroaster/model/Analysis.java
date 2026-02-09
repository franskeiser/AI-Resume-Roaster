package com.resumeroaster.model;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.*;
import lombok.Data;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Entity
@Data
@Table(name = "analyses")
public class Analysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "resume_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Resume resume;

    private Integer overallScore;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(columnDefinition = "TEXT")
    private String rawJson; // Store the full raw JSON response for debugging/future use

    @Column(columnDefinition = "TEXT") // Store as JSON string
    private String sectionFeedbackJson;

    @Column(columnDefinition = "TEXT") // Store as JSON string
    private String actionableItemsJson;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Helper methods to deserialize JSON strings if needed
    public List<Map<String, String>> getSectionFeedback() {
        try {
            return new ObjectMapper().readValue(sectionFeedbackJson, new TypeReference<List<Map<String, String>>>() {
            });
        } catch (IOException e) {
            return null;
        }
    }

    public List<Map<String, String>> getActionableItems() {
        try {
            return new ObjectMapper().readValue(actionableItemsJson, new TypeReference<List<Map<String, String>>>() {
            });
        } catch (IOException e) {
            return null;
        }
    }
}
