# MediSphere Cognitive Twin - Backend

**Java Spring Boot REST API**

## Overview

The backend provides the REST API layer for MediSphere, handling:
- Patient management
- FHIR integration
- Real-time vitals (Kafka)
- Digital Health Twin
- Consent management
- HIPAA audit logging
- AI risk predictions (Milestone 2)
- Model management (Milestone 2)
- Federated learning (Milestone 2)

## Technology Stack

- **Java:** 25
- **Spring Boot:** 4.0.0
- **Database:** MongoDB 7.0
- **Messaging:** Apache Kafka 7.5.0
- **Healthcare:** HAPI FHIR 6.8.0
- **Build:** Maven 3.9.0

## Directory Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/medisphere/
│   │   │   ├── controller/          (REST controllers)
│   │   │   ├── service/             (Business logic)
│   │   │   ├── repository/          (Data access)
│   │   │   ├── domain/              (Models)
│   │   │   ├── config/              (Configuration)
│   │   │   ├── kafka/               (Kafka consumers)
│   │   │   └── MediSphereApplication.java
│   │   └── resources/
│   │       └── application.yml      (Configuration)
│   └── test/                        (Unit tests)
├── pom.xml                          (Maven configuration)
├── Dockerfile                       (Container image)
└── README.md                        (This file)
```

## Getting Started

### Prerequisites

- Java 25 JDK
- Maven 3.9.0
- MongoDB 7.0
- Apache Kafka 7.5.0

### Local Development

```bash
# Build
mvn clean compile

# Run tests
mvn test

# Run application
mvn spring-boot:run
```

## Docker

```bash
# Build image
docker build -t medisphere-backend .

# Run container
docker run -p 8080:8080 \
  -e SPRING_DATA_MONGODB_URI=mongodb://admin:admin123@mongodb:27017/medisphere \
  -e SPRING_KAFKA_BOOTSTRAP_SERVERS=kafka:9092 \
  medisphere-backend
```

## API Documentation

See `../MILESTONE_2_README.md` for complete API documentation.

## Configuration

Edit `src/main/resources/application.yml`:

- MongoDB connection string
- Kafka bootstrap servers
- FHIR server URL
- Audit logging settings
- JWT configuration

## Development

### Controllers

Located in `src/main/java/com/medisphere/controller/`:
- PatientController
- VitalsController
- HealthTwinController
- ConsentController
- RiskPredictionController (Milestone 2)
- ModelManagementController (Milestone 2)
- FederatedLearningController (Milestone 2)

### Services

Located in `src/main/java/com/medisphere/service/`:
- PatientService
- VitalsService
- HealthTwinService
- ConsentService
- FHIRIntegrationService
- AuditService
- RiskPredictionService (Milestone 2)
- ExplainabilityService (Milestone 2)
- ModelVersionService (Milestone 2)
- FederatedLearningService (Milestone 2)

### Repositories

Located in `src/main/java/com/medisphere/repository/`:
- PatientRepository
- VitalsRepository
- HealthTwinRepository
- ConsentRepository
- FHIRResourceRepository
- LabResultRepository
- RiskPredictionRepository (Milestone 2)
- ModelVersionRepository (Milestone 2)

## Security

- Spring Security with OAuth2
- JWT authentication
- SMART on FHIR support
- Role-Based Access Control (RBAC)
- Consent verification before sensitive operations
- HIPAA audit logging

## Health Check

```bash
curl http://localhost:8080/api/v1/health/status
```

## Testing

```bash
# Run all tests
mvn test

# Run specific test
mvn test -Dtest=PatientServiceTest

# With coverage
mvn test jacoco:report
```

## Database

MongoDB connection details in `application.yml`:
- Default: `mongodb://admin:admin123@mongodb:27017/medisphere`

Collections:
- patients
- vitals
- lab_results
- health_twins
- consents
- fhir_resources
- risk_predictions (Milestone 2)
- risk_alerts (Milestone 2)
- model_versions (Milestone 2)
- federated_learning_models (Milestone 2)

## Logging

Logs are written to:
- Console (INFO level)
- `logs/medisphere.log` (DEBUG level)
- `logs/hipaa-audit.log` (HIPAA audit trail)

## Troubleshooting

### MongoDB Connection Error
- Verify MongoDB is running
- Check connection string in application.yml
- Ensure authentication credentials are correct

### Kafka Connection Error
- Verify Kafka broker is running
- Check bootstrap servers in application.yml
- Verify Zookeeper is running

### Build Failures
- Clean Maven cache: `mvn clean`
- Rebuild: `mvn clean install`
- Check Java version: `java -version` (should be 25)

## Support

See `../TESTING_GUIDE.md` for API testing examples.
See `../MILESTONE_2_README.md` for feature documentation.

---

**MediSphere Cognitive Twin - Backend API**
**Version:** 2.0.0 (Milestone 1 + 2)
