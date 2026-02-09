package com.resumeroaster.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ResumeSummaryDTO {
    private Long id;
    private String originalFilename;
    private LocalDateTime uploadedAt;
    private Integer overallScore; // Null if not analyzed yet
    private String summaryPreview;
}
