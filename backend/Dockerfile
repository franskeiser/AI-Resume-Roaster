# ---- Build stage ----
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn -B clean package -DskipTests

# ---- Runtime stage ----
FROM eclipse-temurin:17-jre

# Tesseract OCR + English data are required for image-based resumes (.png/.jpg).
# Symlink the installed tessdata dir to a stable path the app points at.
RUN apt-get update \
    && apt-get install -y --no-install-recommends tesseract-ocr tesseract-ocr-eng \
    && rm -rf /var/lib/apt/lists/* \
    && ln -s "$(dirname "$(find /usr/share -name eng.traineddata | head -1)")" /tessdata

WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

ENV SPRING_PROFILES_ACTIVE=prod
ENV TESSERACT_DATA_PATH=/tessdata
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
