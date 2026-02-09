package com.resumeroaster.service;

import com.resumeroaster.exception.Exceptions;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
public class TextExtractionService {

    @Value("${tesseract.data.path}")
    private String tesseractDataPath;

    public String extractText(MultipartFile file, Path filePath) {
        String contentType = file.getContentType();
        String filename = file.getOriginalFilename().toLowerCase();

        try {
            if (contentType.equals("application/pdf") || filename.endsWith(".pdf")) {
                return extractPdf(filePath.toFile());
            } else if (contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document")
                    || filename.endsWith(".docx")) {
                return extractDocx(filePath.toFile());
            } else if (contentType.equals("text/plain") || filename.endsWith(".txt")) {
                return Files.readString(filePath);
            } else if (contentType.startsWith("image/") || filename.endsWith(".png") || filename.endsWith(".jpg")
                    || filename.endsWith(".jpeg")) {
                return extractImage(filePath.toFile());
            } else {
                throw new Exceptions.BadRequestException("Unsupported file type: " + contentType);
            }
        } catch (Exception e) {
            throw new Exceptions.UnreadableFileException("Failed to extract text: " + e.getMessage());
        }
    }

    private String extractPdf(File file) throws IOException {
        try (PDDocument document = PDDocument.load(file)) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    private String extractDocx(File file) throws IOException {
        try (java.io.FileInputStream fis = new java.io.FileInputStream(file);
                XWPFDocument doc = new XWPFDocument(fis);
                XWPFWordExtractor extractor = new XWPFWordExtractor(doc)) {
            return extractor.getText();
        }
    }

    private String extractImage(File file) throws TesseractException {
        Tesseract tesseract = new Tesseract();
        tesseract.setDatapath(tesseractDataPath);
        tesseract.setLanguage("eng");
        return tesseract.doOCR(file);
    }
}
