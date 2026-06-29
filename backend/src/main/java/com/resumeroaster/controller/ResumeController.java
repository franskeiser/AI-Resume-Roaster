package com.resumeroaster.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.resumeroaster.exception.Exceptions;
import com.resumeroaster.model.Analysis;
import com.resumeroaster.model.Resume;
import com.resumeroaster.repository.AnalysisRepository;
import com.resumeroaster.repository.ResumeRepository;
import com.resumeroaster.service.FileStorageService;
import com.resumeroaster.service.GeminiService;
import com.resumeroaster.service.PdfGenerationService;
import com.resumeroaster.service.TextExtractionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Paths;
import java.util.Map;

@RestController
@RequestMapping("/api/resumes")
public class ResumeController {

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private TextExtractionService textExtractionService;

    @Autowired
    private GeminiService geminiService;

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private AnalysisRepository analysisRepository;

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeResume(@RequestParam("resume") MultipartFile file) {
        try {
            // 1. Store File
            String storedFilePath = fileStorageService.storeFile(file);

            // 2. Extract Text
            String extractedText = textExtractionService.extractText(file, Paths.get(storedFilePath));

            // 3. Save Resume Metadata
            Resume resume = new Resume();
            resume.setOriginalFilename(file.getOriginalFilename());
            resume.setFilePath(storedFilePath);
            resume.setContentType(file.getContentType());
            resume.setFileSize(file.getSize());
            resume.setExtractedText(extractedText);

            resume = resumeRepository.save(resume);

            // 4. Analyze with Gemini
            Map<String, Object> aiResult = geminiService.analyzeResume(extractedText);

            // 5. Save Analysis
            Analysis analysis = new Analysis();
            analysis.setResume(resume);

            if (aiResult.containsKey("overallScore")) {
                analysis.setOverallScore((Integer) aiResult.get("overallScore"));
            }
            if (aiResult.containsKey("summary")) {
                analysis.setSummary((String) aiResult.get("summary"));
            }

            ObjectMapper mapper = new ObjectMapper();
            if (aiResult.containsKey("sectionFeedback")) {
                analysis.setSectionFeedbackJson(mapper.writeValueAsString(aiResult.get("sectionFeedback")));
            }
            if (aiResult.containsKey("actionableItems")) {
                analysis.setActionableItemsJson(mapper.writeValueAsString(aiResult.get("actionableItems")));
            }

            analysisRepository.save(analysis);

            // 6. Return Result
            return ResponseEntity.ok(analysis);

        } catch (Exception e) {
            e.printStackTrace();
            throw new Exceptions.BadRequestException("Analysis failed: " + e.getMessage());
        }
    }

    @Autowired
    private PdfGenerationService pdfGenerationService;

    @GetMapping("/{id}/export")
    public ResponseEntity<byte[]> exportAnalysis(@PathVariable Long id) {
        Analysis analysis = analysisRepository.findById(id)
                .orElseThrow(() -> new Exceptions.BadRequestException("Analysis not found"));

        try {
            byte[] pdfContent = pdfGenerationService.generateRoastReport(analysis);

            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=resume-roast.pdf")
                    .header("Content-Type", "application/pdf")
                    .body(pdfContent);
        } catch (Exception e) {
            throw new Exceptions.BadRequestException("Failed to generate PDF: " + e.getMessage());
        }
    }

}
