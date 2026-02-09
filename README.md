# Resume Roaster 

An AI-powered resume analysis tool that provides brutally honest feedback on technical resumes. Built with Spring Boot, React, and Google's Gemini AI.

## Features

- **AI-Powered Analysis**: Uses Google Gemini to analyze resumes with technical, actionable feedback
- **PDF Export**: Download your roast report as a PDF
- **History Tracking**: View all your past resume analyses
- **Modern UI**: Clean, responsive interface built with React and Tailwind CSS

## Tech Stack

### Backend
- **Java 17** with Spring Boot 3.5.0
- **Google Gemini API** for AI analysis
- **PostgreSQL** for production (H2 for local dev)
- **Apache PDFBox** for PDF generation

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation

## Prerequisites

- **Java 17** or higher
- **Node.js 18** or higher
- **PostgreSQL 14** or higher (for production)
- **Google AI Studio API Key** (free tier available)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/resume-roaster.git
cd resume-roaster
```

### 2. Backend Setup

#### Get a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy your API key

#### Configure Environment Variables

Create a `.env` file in the `backend` directory (or set environment variables):

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

Alternatively, you can directly edit `backend/src/main/resources/application.properties`:

```properties
gemini.api.key=your_gemini_api_key_here
```

#### Database Setup

**For Local Development (H2 - No setup required):**

The application uses H2 in-memory database by default. No configuration needed!

**For Production (PostgreSQL):**

1. Install PostgreSQL
2. Create a database:
   ```sql
   CREATE DATABASE resume_roaster;
   ```
3. Update `application.properties`:
   ```properties
   # Comment out H2 configuration
   # spring.datasource.url=jdbc:h2:mem:testdb
   
   # Uncomment PostgreSQL configuration
   spring.datasource.url=jdbc:postgresql://localhost:5432/resume_roaster
   spring.datasource.username=your_db_username
   spring.datasource.password=your_db_password
   ```

#### Run the Backend

```bash
cd backend
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173` (or 5174/5175 if port is busy)

## Usage

1. **Open the app** in your browser at `http://localhost:5173`
2. **Upload your resume** (PDF, DOCX, or image formats supported)
3. **Get roasted!** The AI will analyze your resume and provide feedback
4. **Download the report** as a PDF
5. **View history** to see all your past analyses

## Project Structure

```
resume-roaster/
├── backend/
│   ├── src/main/java/com/resumeroaster/
│   │   ├── controller/      # REST API endpoints
│   │   ├── model/           # JPA entities
│   │   ├── repository/      # Data access layer
│   │   ├── service/         # Business logic
│   │   └── config/          # Configuration classes
│   └── src/main/resources/
│       └── application.properties
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service layer
│   │   └── App.jsx          # Main app component
│   └── package.json
└── README.md
```

## API Endpoints

- `POST /api/resumes/analyze` - Analyze a resume
- `GET /api/resumes` - Get all past analyses
- `GET /api/resumes/{id}` - Get a specific analysis
- `GET /api/resumes/{id}/export` - Download analysis as PDF

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google AI Studio API key | Yes |
| `DB_URL` | PostgreSQL connection URL | Production only |
| `DB_USERNAME` | Database username | Production only |
| `DB_PASSWORD` | Database password | Production only |

## Development

### Running Tests

```bash
# Backend
cd backend
./mvnw test

# Frontend
cd frontend
npm test
```

### Building for Production

```bash
# Backend
cd backend
./mvnw clean package

# Frontend
cd frontend
npm run build
```

## Troubleshooting

### Backend won't start
- Ensure Java 17+ is installed: `java -version`
- Check that port 8080 is not in use
- Verify your Gemini API key is set correctly

### Frontend won't start
- Ensure Node.js 18+ is installed: `node -v`
- Delete `node_modules` and run `npm install` again
- Check that the backend is running on port 8080

### PDF download fails
- Check backend logs for errors
- Ensure the analysis ID exists
- Verify PDFBox dependencies are installed

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Powered by [Google Gemini](https://ai.google.dev/)
- Built with [Spring Boot](https://spring.io/projects/spring-boot)
- UI built with [React](https://react.dev/) and [Tailwind CSS](https://tailwindcss.com/)

## Contact

For questions or feedback, please open an issue on GitHub.

---

**Note**: This is a demo project for educational purposes. The AI feedback is meant to be humorous and should not be taken as professional career advice.
