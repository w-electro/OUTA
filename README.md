# OUTA ERP - Next-Generation Saudi ERP System

AI-powered, cloud-native ERP system built to surpass REST ERP with superior AI (Claude Opus 4.5), modern architecture, and exceptional UX.

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Python 3.11+ (for local development)
- Node.js 18+ (for frontend)

### Running with Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Services

Once running, access:

- **Auth Service**: http://localhost:8001
  - API Docs: http://localhost:8001/docs
  - Health: http://localhost:8001/health

- **Finance Service**: http://localhost:8002
  - API Docs: http://localhost:8002/docs
  - Health: http://localhost:8002/health

- **PostgreSQL**: localhost:5432
  - Database: outa_erp
  - User: outa
  - Password: outa_password

- **Redis**: localhost:6379

## 📋 Features Implemented

### ✅ Authentication Service
- User registration
- JWT-based authentication
- Access and refresh tokens
- Password hashing (bcrypt)
- OAuth2 compatible endpoints
- User profile management

### ✅ Finance Service
- Invoice creation and management
- ZATCA e-invoicing integration (Phase 2 ready)
- VAT calculations (15% Saudi rate)
- QR code generation
- Payment tracking
- Revenue reporting
- Multiple invoice types (B2B/B2C)

## 🧪 Testing the API

### Register a User

```bash
curl -X POST "http://localhost:8001/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@outa.sa",
    "password": "SecurePass123!",
    "first_name": "Ahmed",
    "last_name": "Al-Saudi",
    "phone": "+966501234567"
  }'
```

### Login

```bash
curl -X POST "http://localhost:8001/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@outa.sa",
    "password": "SecurePass123!"
  }'
```

### Create an Invoice

```bash
curl -X POST "http://localhost:8002/invoices" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "مؤسسة التجارة السعودية",
    "customer_email": "customer@example.sa",
    "customer_vat_number": "300000000000003",
    "invoice_type": "standard",
    "invoice_date": "2026-01-17",
    "due_date": "2026-02-17",
    "line_items": [
      {
        "description": "Professional Services",
        "quantity": 10,
        "unit_price": 1000.00,
        "tax_rate": 0.15
      }
    ],
    "notes": "Payment terms: 30 days"
  }'
```

### List Invoices

```bash
curl "http://localhost:8002/invoices"
```

### Submit Invoice to ZATCA

```bash
# Replace {invoice_id} with actual ID from create response
curl -X POST "http://localhost:8002/invoices/{invoice_id}/approve"
curl -X POST "http://localhost:8002/invoices/{invoice_id}/submit-zatca"
```

## 🏗️ Architecture

### Microservices
- **Auth Service** (Port 8001): Authentication & authorization
- **Finance Service** (Port 8002): Financial management & ZATCA
- **HR Service** (Coming soon): HR, payroll, GOSI
- **CRM Service** (Coming soon): Customer relationship management
- **AI Service** (Coming soon): Claude Opus 4.5 powered intelligence

### Tech Stack
- **Backend**: Python (FastAPI)
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Containers**: Docker + Docker Compose
- **API Docs**: Swagger/OpenAPI

## 🎯 Key Differentiators vs REST ERP

1. **Superior AI**: Claude Opus 4.5 vs basic Eltrion AI
2. **Modern Architecture**: Microservices vs monolith
3. **API-First**: Comprehensive, well-documented APIs
4. **Cloud-Native**: Built for scale from day one
5. **Developer-Friendly**: Great documentation, SDKs

## 📊 Development Roadmap

### Phase 1: Foundation (Current)
- ✅ Auth Service
- ✅ Finance Service with ZATCA
- ⏳ Database integration (PostgreSQL)
- ⏳ React frontend

### Phase 2: Core Modules
- HR & Payroll Service (GOSI integration)
- CRM Service
- Inventory Service
- Project Management Service

### Phase 3: AI Integration
- OUTA AI Service (Claude Opus 4.5)
- Conversational interface
- Predictive analytics
- Automated workflows

### Phase 4: Government Integrations
- ZATCA Phase 2 certification
- GOSI automated submissions
- Nafath authentication
- Muqeem integration

## 🔐 Security

- JWT-based authentication
- Password hashing (bcrypt)
- HTTPS/TLS in production
- SQL injection prevention
- CORS configuration
- Environment-based secrets

## 📝 License

Proprietary - OUTA ERP © 2026

## 🤝 Contributing

Internal development only. Contact dev@outa.sa for access.

---

**Built with ❤️ in Saudi Arabia for Vision 2030**
