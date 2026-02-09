package com.resumeroaster.service;

import com.resumeroaster.model.Analysis;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Map;

@Service
public class PdfGenerationService {

    public byte[] generateRoastReport(Analysis analysis) throws IOException {
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                // Title
                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 24);
                contentStream.newLineAtOffset(50, 750);
                contentStream.showText("Resume Roast Report");
                contentStream.endText();

                // Score
                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 48);
                contentStream.newLineAtOffset(50, 680);
                contentStream.showText(analysis.getOverallScore() + "%");
                contentStream.endText();

                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA, 12);
                contentStream.newLineAtOffset(180, 690);
                contentStream.showText("MATCH SCORE");
                contentStream.endText();

                // Summary
                writeMultiLineText(document, contentStream, 50, 640, "AI's Honest Take:", PDType1Font.HELVETICA_BOLD,
                        14);
                writeMultiLineText(document, contentStream, 50, 620, analysis.getSummary(), PDType1Font.HELVETICA, 12);

                // Actionable Items
                float yPosition = 500; // Simplified positioning for now
                if (analysis.getActionableItems() != null) {
                    writeMultiLineText(document, contentStream, 50, yPosition, "Action Items:",
                            PDType1Font.HELVETICA_BOLD, 14);
                    yPosition -= 20;

                    int count = 1;
                    for (Map<String, String> item : analysis.getActionableItems()) {
                        String text = count + ". " + item.get("description");
                        writeMultiLineText(document, contentStream, 50, yPosition, text, PDType1Font.HELVETICA, 11);
                        yPosition -= 30; // quick spacing
                        count++;
                    }
                }
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            document.save(baos);
            return baos.toByteArray();
        }
    }

    private void writeMultiLineText(PDDocument doc, PDPageContentStream contentStream, float x, float y, String text,
            PDType1Font font, int fontSize) throws IOException {
        // Very basic multi-line handling (splits by newline char only for simplicity in
        // this MVP)
        // A robust solution needs to calculate text width and wrap lines.
        contentStream.beginText();
        contentStream.setFont(font, fontSize);
        contentStream.newLineAtOffset(x, y);

        String[] lines = text.split("\n");
        for (String line : lines) {
            // Basic line wrapping could go here
            // For now, just printing the first 80 chars per line to prevent overflow (MVP
            // hack)
            if (line.length() > 90) {
                contentStream.showText(line.substring(0, 90) + "...");
            } else {
                contentStream.showText(line);
            }
            contentStream.newLineAtOffset(0, -1.5f * fontSize);
        }
        contentStream.endText();
    }
}
