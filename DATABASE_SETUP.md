# Database Setup Guide

This guide explains how to set up the database for Resume Roaster.

## Local Development (H2)

For local development, the application uses H2 in-memory database by default. **No setup required!**

The database is automatically created when you start the application and is accessible at:
- URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: (leave blank)

## Production (PostgreSQL)

For production deployments, use PostgreSQL.

### 1. Install PostgreSQL

**Windows:**
```bash
# Download from https://www.postgresql.org/download/windows/
# Or use Chocolatey:
choco install postgresql
```

**Mac:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE resume_roaster;

# Create user (optional)
CREATE USER roaster_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE resume_roaster TO roaster_user;

# Exit
\q
```

### 3. Configure Application

Update `backend/src/main/resources/application.properties`:

```properties
# Comment out H2 configuration
# spring.datasource.url=jdbc:h2:mem:testdb
# spring.h2.console.enabled=true

# Uncomment PostgreSQL configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/resume_roaster
spring.datasource.username=roaster_user
spring.datasource.password=your_secure_password
spring.datasource.driver-class-name=org.postgresql.Driver
```

### 4. Run the Application

The schema will be automatically created by Hibernate when you start the application:

```bash
cd backend
./mvnw spring-boot:run
```

## Database Schema

The application uses JPA/Hibernate to automatically manage the database schema. The main entities are:

### Resume Table
- `id` (BIGINT, Primary Key)
- `original_filename` (VARCHAR)
- `file_path` (VARCHAR)
- `uploaded_at` (TIMESTAMP)

### Analysis Table
- `id` (BIGINT, Primary Key)
- `resume_id` (BIGINT, Foreign Key)
- `overall_score` (INTEGER)
- `summary` (TEXT)
- `section_feedback` (JSONB/TEXT)
- `actionable_items` (JSONB/TEXT)
- `created_at` (TIMESTAMP)

## Manual Schema Creation (Optional)

If you prefer to create the schema manually, here's the SQL:

```sql
CREATE TABLE resume (
    id BIGSERIAL PRIMARY KEY,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE analysis (
    id BIGSERIAL PRIMARY KEY,
    resume_id BIGINT NOT NULL REFERENCES resume(id) ON DELETE CASCADE,
    overall_score INTEGER NOT NULL,
    summary TEXT,
    section_feedback TEXT,
    actionable_items TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_resume_uploaded_at ON resume(uploaded_at DESC);
CREATE INDEX idx_analysis_resume_id ON analysis(resume_id);
```

## Troubleshooting

### Connection Refused
- Ensure PostgreSQL is running: `sudo systemctl status postgresql` (Linux) or `brew services list` (Mac)
- Check if PostgreSQL is listening on port 5432: `netstat -an | grep 5432`

### Authentication Failed
- Verify username and password in `application.properties`
- Check PostgreSQL's `pg_hba.conf` for authentication settings

### Database Does Not Exist
- Create the database: `CREATE DATABASE resume_roaster;`
- Verify with: `\l` in psql

### Permission Denied
- Grant privileges: `GRANT ALL PRIVILEGES ON DATABASE resume_roaster TO your_user;`
