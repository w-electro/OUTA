# OUTA ERP - System Architecture Design

**Document Version:** 1.0
**Date:** January 17, 2026
**Status:** Architecture Design Phase
**Prepared For:** OUTA ERP Development - Phase 1, Step 2

---

## Executive Summary

This document defines the technical architecture for OUTA ERP, a next-generation, AI-powered Enterprise Resource Planning system designed to surpass REST ERP and compete with global players while maintaining Saudi compliance excellence. OUTA will leverage modern microservices architecture, cloud-native design, and Claude Opus 4.5 AI to deliver superior performance, scalability, and user experience.

**Architecture Philosophy:**
- **Cloud-Native First:** Built for cloud from day one, with optional hybrid/on-premise support
- **Microservices Architecture:** Independent, scalable services for maximum flexibility
- **API-First Design:** Every function accessible via well-documented APIs
- **AI-Powered Core:** Claude Opus 4.5 integrated throughout the platform
- **Security by Design:** Enterprise-grade security at every layer
- **Mobile-First:** Responsive design with native mobile apps
- **Saudi Compliance Ready:** Built-in integration points for ZATCA, GOSI, Nafath, etc.

**Key Differentiators vs. REST ERP:**
- Modern microservices vs. likely monolithic architecture
- True cloud-native design with superior scalability
- Advanced AI integration (Claude Opus 4.5 vs. basic Eltrion AI)
- API-first with comprehensive developer ecosystem
- Global scalability from day one (multi-region, multi-language)

---

## Table of Contents

1. [High-Level Architecture Overview](#1-high-level-architecture-overview)
2. [Microservices Architecture](#2-microservices-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Data Architecture](#4-data-architecture)
5. [API Architecture](#5-api-architecture)
6. [Security Architecture](#6-security-architecture)
7. [Cloud Infrastructure](#7-cloud-infrastructure)
8. [AI Integration Architecture](#8-ai-integration-architecture)
9. [Integration Architecture](#9-integration-architecture)
10. [Scalability & Performance](#10-scalability--performance)
11. [Deployment Architecture](#11-deployment-architecture)
12. [Development & DevOps](#12-development--devops)

---

## 1. High-Level Architecture Overview

### 1.1 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            CLIENT LAYER                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│  Web App        Mobile Apps          API Clients        OUTA AI Assistant   │
│  (React)        (React Native)       (SDK/Direct)       (Conversational)    │
└────────┬────────────────┬──────────────────┬──────────────────┬─────────────┘
         │                │                  │                  │
         └────────────────┴──────────────────┴──────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CDN & EDGE LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  CloudFlare CDN  │  DDoS Protection  │  WAF  │  Edge Caching                │
└────────┬────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          API GATEWAY LAYER                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  • Request Routing                    • Authentication & Authorization       │
│  • Rate Limiting                      • API Versioning                       │
│  • Request/Response Transformation    • Logging & Monitoring                 │
│  • Circuit Breaking                   • Load Balancing                       │
└────────┬────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       MICROSERVICES LAYER                                    │
├──────────────┬──────────────┬──────────────┬──────────────┬─────────────────┤
│ Auth Service │ Finance Svc  │ HR/Payroll   │ CRM Service  │ Inventory Svc   │
│              │              │ Service      │              │                 │
├──────────────┼──────────────┼──────────────┼──────────────┼─────────────────┤
│ Project Svc  │ AI Service   │ Integration  │ Notification │ Document Svc    │
│              │ (OUTA AI)    │ Gateway Svc  │ Service      │                 │
├──────────────┼──────────────┼──────────────┼──────────────┼─────────────────┤
│ Analytics &  │ Compliance   │ Workflow     │ Search       │ Reporting Svc   │
│ Reporting    │ Service      │ Engine       │ Service      │                 │
└────────┬─────┴──────────────┴──────────────┴──────────────┴─────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DATA & MESSAGE LAYER                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│  PostgreSQL   │  MongoDB    │  Redis       │  RabbitMQ/   │  Elasticsearch  │
│  (Primary DB) │  (Documents)│  (Cache)     │  Kafka       │  (Search)       │
└─────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    EXTERNAL INTEGRATIONS LAYER                               │
├─────────────────────────────────────────────────────────────────────────────┤
│ ZATCA   │ GOSI    │ Nafath  │ Muqeem  │ Banks   │ Payment │ E-commerce      │
│         │         │         │         │         │ Gateway │ Platforms       │
├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────────────┤
│ Claude  │ Email   │ SMS/    │ Document│ Storage │ Third-  │ Custom          │
│ API     │ Service │ WhatsApp│ Signing │ (S3)    │ Party   │ Integrations    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Architecture Principles

#### **1. Separation of Concerns**
- Each microservice handles a specific business domain
- Clear boundaries between services
- Independent deployability and scalability

#### **2. Cloud-Native Design**
- Stateless services (state in databases/cache)
- Horizontal scalability
- Containerized workloads (Docker/Kubernetes)
- Resilient to failures (auto-recovery, circuit breakers)

#### **3. API-First Approach**
- All functionality exposed via APIs
- Well-documented (OpenAPI/Swagger)
- Versioned APIs for backward compatibility
- GraphQL for complex queries, REST for CRUD

#### **4. Security in Depth**
- Multiple layers of security
- Zero-trust architecture
- Encryption at rest and in transit
- Comprehensive audit logging

#### **5. Performance & Scalability**
- Sub-100ms API response times (p95)
- Support for 10 to 10,000+ concurrent users
- Auto-scaling based on demand
- Efficient caching strategies

#### **6. Developer Experience**
- Clear documentation
- SDKs in multiple languages (Python, JavaScript, PHP, .NET)
- Local development environment (Docker Compose)
- Comprehensive testing frameworks

---

## 2. Microservices Architecture

### 2.1 Service Catalog

#### **Core Services**

##### **1. Authentication & Authorization Service**
**Responsibility:** User authentication, authorization, session management

**Key Features:**
- Multi-factor authentication (SMS, Email, Authenticator apps)
- OAuth 2.0 / OpenID Connect support
- Nafath integration for Saudi national ID authentication
- JWT token issuance and validation
- Role-Based Access Control (RBAC)
- Permission-Based Access Control (PBAC)
- Session management
- Password policies and security
- Account lockout and rate limiting
- Audit logging

**Technology Stack:**
- Language: Node.js (NestJS) or Python (FastAPI)
- Database: PostgreSQL (user data), Redis (sessions, tokens)
- Authentication: Passport.js / Authlib

**API Endpoints:**
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh access token
- `POST /auth/mfa/enable` - Enable MFA
- `POST /auth/mfa/verify` - Verify MFA code
- `GET /auth/permissions` - Get user permissions
- `POST /auth/nafath/verify` - Nafath authentication

**Database Schema:**
```sql
users (id, email, password_hash, status, created_at, updated_at)
user_profiles (user_id, first_name, last_name, phone, preferences)
roles (id, name, description)
permissions (id, resource, action, description)
role_permissions (role_id, permission_id)
user_roles (user_id, role_id, tenant_id)
sessions (id, user_id, token, expires_at, ip_address)
mfa_settings (user_id, method, secret, enabled)
audit_logs (id, user_id, action, resource, ip_address, timestamp)
```

---

##### **2. Finance & Accounting Service**
**Responsibility:** Financial management, accounting, ZATCA compliance

**Key Features:**
- Chart of accounts management
- Journal entries (manual and automated)
- General ledger
- Accounts Payable (AP)
- Accounts Receivable (AR)
- Bank reconciliation
- Fixed assets management
- Multi-currency support
- Fiscal year management
- Financial statements (Balance Sheet, P&L, Cash Flow)
- ZATCA Phase 2 e-invoicing integration
- VAT calculations and reporting

**Technology Stack:**
- Language: Python (FastAPI) or Java (Spring Boot)
- Database: PostgreSQL (financial data)
- Caching: Redis
- Message Queue: RabbitMQ (for async processing)

**API Endpoints:**
- `POST /finance/accounts` - Create account
- `GET /finance/accounts` - List accounts
- `POST /finance/journal-entries` - Create journal entry
- `GET /finance/ledger` - Get general ledger
- `POST /finance/invoices` - Create invoice
- `GET /finance/invoices/{id}` - Get invoice
- `POST /finance/invoices/{id}/zatca-submit` - Submit to ZATCA
- `POST /finance/payments` - Record payment
- `GET /finance/reports/balance-sheet` - Balance sheet
- `GET /finance/reports/profit-loss` - P&L statement
- `POST /finance/bank-reconciliation` - Reconcile bank statement

**Database Schema:**
```sql
accounts (id, code, name, type, parent_id, balance, currency)
journal_entries (id, date, description, status, posted_by, posted_at)
journal_entry_lines (id, entry_id, account_id, debit, credit, description)
invoices (id, invoice_number, customer_id, date, due_date, total, status, zatca_uuid, qr_code)
invoice_lines (id, invoice_id, description, quantity, unit_price, tax_rate, total)
payments (id, invoice_id, amount, payment_date, method, reference)
fixed_assets (id, name, purchase_date, cost, accumulated_depreciation, salvage_value)
bank_accounts (id, bank_name, account_number, balance, currency)
bank_transactions (id, bank_account_id, date, description, amount, reconciled)
```

---

##### **3. HR & Payroll Service**
**Responsibility:** Human resources, payroll, attendance, Saudi labor law compliance

**Key Features:**
- Employee management (profiles, contracts, documents)
- Organizational structure
- Attendance and leave management
- Shift scheduling
- Overtime tracking
- Payroll processing (Saudi labor law compliant)
- GOSI calculations and integration
- End-of-service benefits
- Salary advances and loans
- Payslip generation
- WPS (Wage Protection System) integration
- Recruitment and onboarding
- Performance reviews
- Training and development

**Technology Stack:**
- Language: Python (FastAPI) or Node.js (NestJS)
- Database: PostgreSQL
- File Storage: S3 (for documents)
- Scheduling: Celery (for payroll processing)

**API Endpoints:**
- `POST /hr/employees` - Create employee
- `GET /hr/employees` - List employees
- `GET /hr/employees/{id}` - Get employee details
- `PUT /hr/employees/{id}` - Update employee
- `POST /hr/attendance/check-in` - Clock in
- `POST /hr/attendance/check-out` - Clock out
- `POST /hr/leave/request` - Request leave
- `GET /hr/leave/balance` - Get leave balance
- `POST /hr/payroll/run` - Process payroll
- `GET /hr/payroll/payslips/{employee_id}` - Get payslips
- `POST /hr/gosi/submit` - Submit GOSI data
- `POST /hr/wps/generate-file` - Generate WPS file

**Database Schema:**
```sql
employees (id, employee_number, first_name, last_name, nationality, iqama_number, hire_date, status)
employee_contacts (employee_id, email, phone, emergency_contact)
employment_contracts (id, employee_id, contract_type, start_date, end_date, salary, allowances)
departments (id, name, parent_id, manager_id)
positions (id, title, department_id, level)
attendance_records (id, employee_id, date, check_in, check_out, hours_worked, overtime)
leave_types (id, name, days_per_year, paid)
leave_requests (id, employee_id, leave_type_id, start_date, end_date, status, reason)
leave_balances (employee_id, leave_type_id, balance, used)
payroll_runs (id, period_start, period_end, status, processed_at)
payroll_items (id, payroll_run_id, employee_id, basic_salary, allowances, deductions, net_salary)
gosi_submissions (id, month, submitted_at, status, reference_number)
```

---

##### **4. CRM & Sales Service**
**Responsibility:** Customer relationship management, sales pipeline, marketing

**Key Features:**
- Contact and company management
- Lead capture and scoring (AI-powered)
- Opportunity pipeline management
- Quotation and proposal generation
- Sales order processing
- Customer support ticketing
- Email and SMS campaigns
- Marketing automation
- Sales forecasting
- Customer segmentation
- Activity tracking
- Reports and dashboards

**Technology Stack:**
- Language: Node.js (NestJS) or Python (FastAPI)
- Database: PostgreSQL (structured data), MongoDB (unstructured customer data)
- Search: Elasticsearch (for fast customer search)
- Email: SendGrid / AWS SES
- SMS: Twilio / local Saudi providers

**API Endpoints:**
- `POST /crm/contacts` - Create contact
- `GET /crm/contacts` - List contacts
- `POST /crm/leads` - Create lead
- `PUT /crm/leads/{id}/convert` - Convert lead to opportunity
- `POST /crm/opportunities` - Create opportunity
- `GET /crm/opportunities` - List opportunities
- `PUT /crm/opportunities/{id}/stage` - Update stage
- `POST /crm/quotes` - Create quote
- `POST /crm/tickets` - Create support ticket
- `POST /crm/campaigns` - Create campaign
- `GET /crm/reports/pipeline` - Pipeline report

**Database Schema:**
```sql
contacts (id, first_name, last_name, email, phone, company_id, source, tags)
companies (id, name, industry, size, revenue, website, address)
leads (id, contact_id, source, score, status, assigned_to)
opportunities (id, contact_id, company_id, title, value, stage, probability, close_date)
quotes (id, opportunity_id, quote_number, valid_until, total, status)
quote_lines (id, quote_id, product_id, quantity, unit_price, discount, total)
tickets (id, contact_id, subject, description, priority, status, assigned_to)
campaigns (id, name, type, status, target_audience, start_date, end_date)
activities (id, type, contact_id, subject, description, date, completed)
```

---

##### **5. Inventory & Procurement Service**
**Responsibility:** Inventory management, procurement, warehouse operations

**Key Features:**
- Multi-warehouse inventory management
- Product catalog management
- Stock movements and transfers
- Batch and serial number tracking
- Barcode/QR code scanning
- Stock level alerts and reordering
- Inventory valuation (FIFO, LIFO, Average)
- Cycle counting
- Purchase requisitions
- Purchase orders
- Supplier management
- Goods receipt and quality control
- 3-way matching (PO, GRN, Invoice)
- AI-powered demand forecasting

**Technology Stack:**
- Language: Python (FastAPI) or Java (Spring Boot)
- Database: PostgreSQL
- Caching: Redis (for real-time stock levels)
- ML: scikit-learn (demand forecasting)

**API Endpoints:**
- `POST /inventory/products` - Create product
- `GET /inventory/products` - List products
- `GET /inventory/stock` - Get stock levels
- `POST /inventory/movements` - Record stock movement
- `POST /inventory/transfer` - Transfer stock between warehouses
- `GET /inventory/valuation` - Get inventory valuation
- `POST /procurement/requisitions` - Create purchase requisition
- `POST /procurement/purchase-orders` - Create PO
- `POST /procurement/goods-receipt` - Record goods receipt
- `GET /procurement/suppliers` - List suppliers
- `GET /inventory/forecasting` - Get demand forecast

**Database Schema:**
```sql
products (id, sku, name, description, category_id, unit_of_measure, barcode)
warehouses (id, name, address, type)
stock (id, product_id, warehouse_id, quantity, reserved_quantity, available)
stock_movements (id, product_id, warehouse_id, type, quantity, date, reference)
batch_numbers (id, product_id, batch_number, manufacturing_date, expiry_date, quantity)
serial_numbers (id, product_id, serial_number, status, sold_date)
suppliers (id, name, contact, email, phone, address, payment_terms)
purchase_requisitions (id, requested_by, date, status, approved_by)
purchase_orders (id, supplier_id, order_date, delivery_date, status, total)
po_lines (id, po_id, product_id, quantity, unit_price, total)
goods_receipts (id, po_id, received_date, received_by, status)
gr_lines (id, gr_id, product_id, quantity_ordered, quantity_received)
```

---

##### **6. Project Management Service**
**Responsibility:** Project planning, task management, resource allocation, time tracking

**Key Features:**
- Project creation and templates
- Work breakdown structure
- Gantt charts and timelines
- Task assignment and tracking
- Dependencies and milestones
- Resource allocation
- Time tracking and timesheets
- Expense tracking
- Budget management
- Project costing and profitability
- Team collaboration
- File sharing
- Project reporting and dashboards

**Technology Stack:**
- Language: Node.js (NestJS) or Python (FastAPI)
- Database: PostgreSQL
- Real-time: WebSockets (for live collaboration)
- File Storage: S3

**API Endpoints:**
- `POST /projects` - Create project
- `GET /projects` - List projects
- `POST /projects/{id}/tasks` - Create task
- `PUT /tasks/{id}` - Update task
- `POST /tasks/{id}/time-entry` - Log time
- `GET /projects/{id}/gantt` - Get Gantt chart data
- `POST /projects/{id}/expenses` - Record expense
- `GET /projects/{id}/budget` - Get budget vs actual
- `GET /projects/{id}/profitability` - Profitability analysis

**Database Schema:**
```sql
projects (id, name, description, start_date, end_date, budget, status, manager_id)
tasks (id, project_id, name, description, parent_task_id, assigned_to, start_date, due_date, status, priority)
task_dependencies (task_id, depends_on_task_id, type)
milestones (id, project_id, name, date, status)
time_entries (id, task_id, user_id, date, hours, description, billable)
project_expenses (id, project_id, category, amount, date, description)
resource_allocation (id, project_id, user_id, role, allocation_percentage, start_date, end_date)
```

---

##### **7. OUTA AI Service** 🔥 **GAME CHANGER**
**Responsibility:** AI-powered intelligence, conversational interface, predictive analytics

**Key Features:**
- Conversational AI interface (natural language queries in Arabic/English)
- Financial intelligence (cash flow forecasting, expense optimization)
- HR intelligence (attrition risk, performance predictions)
- Sales intelligence (lead scoring, churn prediction, forecasting)
- Inventory intelligence (demand forecasting, optimal stock levels)
- Anomaly detection (fraud, unusual transactions)
- Automated workflows and recommendations
- Document processing (OCR + AI for invoice/expense automation)
- Sentiment analysis
- Proactive insights and alerts
- Learning from user interactions

**Technology Stack:**
- Language: Python (FastAPI)
- AI/ML: Claude API (Anthropic), scikit-learn, TensorFlow/PyTorch
- Vector Database: Pinecone or Weaviate (for semantic search)
- Database: PostgreSQL (training data, model metadata), MongoDB (conversation history)
- Message Queue: RabbitMQ (for async AI tasks)

**Architecture:**
```
User Query
    ↓
Natural Language Processing (Claude API)
    ↓
Intent Recognition & Entity Extraction
    ↓
Query Router (financial, HR, sales, inventory, etc.)
    ↓
Data Retrieval (from respective services)
    ↓
AI Processing (analysis, predictions, recommendations)
    ↓
Response Generation (natural language)
    ↓
User Response (with visualizations, actions)
```

**API Endpoints:**
- `POST /ai/chat` - Conversational query
- `POST /ai/analyze/financial` - Financial analysis
- `POST /ai/predict/sales` - Sales forecasting
- `POST /ai/predict/churn` - Customer churn prediction
- `POST /ai/predict/attrition` - Employee attrition risk
- `POST /ai/forecast/inventory` - Demand forecasting
- `POST /ai/detect/anomalies` - Anomaly detection
- `POST /ai/process/document` - Process document (OCR + extraction)
- `POST /ai/recommend/actions` - Get recommendations
- `GET /ai/insights/proactive` - Get proactive insights

**Database Schema:**
```sql
conversations (id, user_id, context, created_at)
messages (id, conversation_id, role, content, timestamp)
ai_models (id, name, type, version, accuracy, trained_at)
predictions (id, model_id, input_data, prediction, confidence, created_at)
insights (id, user_id, type, severity, description, data, dismissed, created_at)
ai_feedback (id, prediction_id, user_id, rating, comment)
```

**AI Capabilities:**

1. **Financial Intelligence:**
   - Cash flow forecasting (30, 60, 90 days)
   - Revenue predictions
   - Expense pattern analysis and optimization
   - Budget anomaly detection
   - Investment recommendations
   - Risk assessment

2. **HR Intelligence:**
   - Employee performance predictions
   - Attrition risk scoring
   - Recruitment optimization (best candidate matching)
   - Salary benchmarking
   - Training needs identification
   - Workforce planning

3. **Sales Intelligence:**
   - Lead scoring (conversion probability)
   - Customer churn prediction
   - Upsell/cross-sell recommendations
   - Sales forecasting
   - Price optimization
   - Win probability analysis

4. **Inventory Intelligence:**
   - Demand forecasting
   - Optimal stock level recommendations
   - Supplier performance analysis
   - Procurement optimization
   - Warehouse space optimization

5. **Automated Workflows:**
   - Smart approval routing (based on amount, type, risk)
   - Exception handling
   - Document classification
   - Data entry automation (invoice/expense OCR)
   - Intelligent notifications

**Competitive Advantage:**
This is OUTA's **primary differentiator** vs. REST ERP's Eltrion AI. While Eltrion appears to be rule-based with basic analytics, OUTA AI will be:
- **Truly conversational** (natural language, context-aware)
- **Proactive** (surfaces insights without being asked)
- **Continuously learning** (improves with usage)
- **Multilingual** (natural Arabic and English)
- **Deep integration** (across all modules, not bolted on)

---

##### **8. Integration Gateway Service**
**Responsibility:** External system integrations, API orchestration

**Key Features:**
- ZATCA e-invoicing integration
- GOSI integration
- Nafath authentication integration
- Muqeem (Iqama management) integration
- Bank integrations (Saudi banks)
- Payment gateway integrations
- E-commerce platform integrations (Salla, Zid, Shopify, WooCommerce)
- Shipping provider integrations (SMSA, Aramex, DHL)
- Email service integrations
- SMS/WhatsApp integrations
- Third-party app integrations
- Webhook management
- Integration monitoring and logging

**Technology Stack:**
- Language: Node.js (NestJS) or Python (FastAPI)
- Database: PostgreSQL (integration configs, logs)
- Message Queue: RabbitMQ (for async integration tasks)
- Scheduling: Cron / Celery (for scheduled syncs)

**API Endpoints:**
- `POST /integrations/zatca/submit-invoice` - Submit invoice to ZATCA
- `POST /integrations/gosi/submit-salaries` - Submit salary data to GOSI
- `POST /integrations/nafath/authenticate` - Nafath authentication
- `POST /integrations/muqeem/check-status` - Check Iqama status
- `POST /integrations/payment/process` - Process payment
- `POST /integrations/webhooks/register` - Register webhook
- `POST /integrations/webhooks/trigger` - Trigger webhook
- `GET /integrations/logs` - Integration logs

**Database Schema:**
```sql
integrations (id, type, name, status, config, credentials_encrypted, enabled)
integration_logs (id, integration_id, type, request, response, status, timestamp)
webhooks (id, user_id, url, events, secret, enabled)
webhook_deliveries (id, webhook_id, event, payload, response, status, timestamp)
scheduled_syncs (id, integration_id, frequency, last_run, next_run)
```

---

##### **9. Notification Service**
**Responsibility:** Multi-channel notifications, alerts, reminders

**Key Features:**
- Email notifications
- SMS notifications
- Push notifications (mobile apps)
- In-app notifications
- WhatsApp notifications (via Business API)
- Notification templates
- Notification preferences
- Scheduled notifications
- Notification delivery tracking

**Technology Stack:**
- Language: Node.js (NestJS)
- Database: PostgreSQL (notification logs, preferences)
- Message Queue: RabbitMQ (for async delivery)
- Email: SendGrid / AWS SES
- SMS: Twilio / Saudi providers
- Push: Firebase Cloud Messaging (FCM)

**API Endpoints:**
- `POST /notifications/send` - Send notification
- `POST /notifications/email` - Send email
- `POST /notifications/sms` - Send SMS
- `POST /notifications/push` - Send push notification
- `GET /notifications` - Get user notifications
- `PUT /notifications/{id}/read` - Mark as read
- `PUT /notifications/preferences` - Update preferences

---

##### **10. Document Management Service**
**Responsibility:** Document storage, versioning, search, e-signature

**Key Features:**
- File upload and storage
- Document versioning
- Access control and permissions
- Full-text search
- OCR for scanned documents
- Document preview
- E-signature integration
- Retention policies
- Document workflows
- Folder organization
- Tags and metadata

**Technology Stack:**
- Language: Python (FastAPI) or Node.js (NestJS)
- Storage: AWS S3 / Azure Blob Storage / MinIO
- Database: PostgreSQL (metadata), Elasticsearch (full-text search)
- OCR: Tesseract / Google Vision API

**API Endpoints:**
- `POST /documents/upload` - Upload document
- `GET /documents/{id}` - Get document
- `GET /documents/{id}/download` - Download document
- `POST /documents/{id}/version` - Create new version
- `GET /documents/search` - Search documents
- `POST /documents/{id}/share` - Share document
- `POST /documents/{id}/sign` - Request signature

---

##### **11. Analytics & Reporting Service**
**Responsibility:** Business intelligence, reports, dashboards

**Key Features:**
- Pre-built dashboards
- Custom dashboard builder
- Report builder (drag-and-drop)
- Scheduled reports
- Report templates
- Data export (PDF, Excel, CSV)
- Real-time data visualization
- Drill-down capabilities
- KPI tracking
- Comparative analysis

**Technology Stack:**
- Language: Python (FastAPI)
- Database: PostgreSQL (metadata), Data Warehouse (Redshift / BigQuery)
- BI: Metabase (embedded) or custom React dashboards
- Charting: Chart.js / D3.js

---

##### **12. Search Service**
**Responsibility:** Global search across all modules

**Key Features:**
- Full-text search
- Fuzzy matching
- Faceted search
- Autocomplete
- Search suggestions
- Search history
- Search analytics

**Technology Stack:**
- Search Engine: Elasticsearch
- Language: Python (FastAPI)

---

##### **13. Workflow Engine Service**
**Responsibility:** Automated workflows, approvals, business rules

**Key Features:**
- Visual workflow designer
- Conditional logic
- Approval workflows
- Automated actions
- Email/SMS triggers
- Webhook triggers
- Workflow templates
- Workflow monitoring

**Technology Stack:**
- Language: Node.js (NestJS)
- Workflow Engine: Camunda or custom
- Database: PostgreSQL

---

##### **14. Compliance Service**
**Responsibility:** Regulatory compliance management, audit trails

**Key Features:**
- Compliance checklist management
- Automated compliance checks
- Audit trail generation
- Compliance reporting
- Regulatory updates
- Data retention policies

**Technology Stack:**
- Language: Python (FastAPI)
- Database: PostgreSQL

---

### 2.2 Inter-Service Communication

**Communication Patterns:**

1. **Synchronous (REST/GraphQL):**
   - Used for: Real-time queries, user-facing operations
   - Protocol: HTTP/HTTPS
   - Example: Web app → API Gateway → Finance Service (get invoice)

2. **Asynchronous (Message Queue):**
   - Used for: Background tasks, event-driven workflows
   - Technology: RabbitMQ or Apache Kafka
   - Example: Invoice created → Queue → Email notification, AI analysis

3. **Service-to-Service (gRPC):**
   - Used for: High-performance internal communication
   - Protocol: gRPC (HTTP/2)
   - Example: Finance Service ↔ AI Service (for analysis)

**Event-Driven Architecture:**
- Services publish events to message broker
- Other services subscribe to relevant events
- Decoupled, scalable, resilient

**Example Event Flow:**
```
User creates invoice
    ↓
Finance Service publishes "invoice.created" event
    ↓
Event Bus (RabbitMQ/Kafka)
    ↓
Subscribers:
  - Notification Service → Send email to customer
  - AI Service → Analyze invoice for anomalies
  - Analytics Service → Update dashboard metrics
  - Integration Service → Submit to ZATCA (if applicable)
```

---

## 3. Technology Stack

### 3.1 Backend

**Primary Language Options:**
1. **Python (FastAPI)** - Recommended for AI-heavy services
2. **Node.js (NestJS)** - Recommended for real-time services
3. **Java (Spring Boot)** - Option for high-performance services

**Framework Selection by Service:**
- Auth Service: Node.js (NestJS) - excellent auth ecosystem
- Finance Service: Python (FastAPI) - financial calculations, ZATCA integration
- HR/Payroll: Python (FastAPI) - complex calculations, GOSI integration
- CRM: Node.js (NestJS) - real-time updates, email/SMS
- Inventory: Python (FastAPI) or Java (Spring Boot) - performance-critical
- Projects: Node.js (NestJS) - real-time collaboration
- AI Service: Python (FastAPI) - AI/ML ecosystem
- Integration Gateway: Node.js (NestJS) - async I/O for external calls
- Notifications: Node.js (NestJS) - async processing
- Documents: Python (FastAPI) - OCR integration
- Analytics: Python (FastAPI) - data processing
- Search: Python (FastAPI) - Elasticsearch integration
- Workflow: Node.js (NestJS) - event processing

**Shared Libraries:**
- Authentication middleware
- Database connection pooling
- Error handling
- Logging (structured)
- Monitoring (Prometheus metrics)
- API documentation (OpenAPI/Swagger)

---

### 3.2 Frontend

**Web Application:**
- **Framework:** React 18+ with TypeScript
- **State Management:** Zustand or Redux Toolkit
- **Styling:** Tailwind CSS + Headless UI
- **Build Tool:** Vite
- **Routing:** React Router
- **Forms:** React Hook Form + Zod validation
- **Data Fetching:** TanStack Query (React Query)
- **Charts:** Recharts or Chart.js
- **i18n:** react-i18next (Arabic/English)
- **Real-time:** Socket.io client

**Mobile Applications:**
- **Framework:** React Native
- **Navigation:** React Navigation
- **State:** Zustand
- **UI Components:** React Native Paper or custom
- **Offline Support:** Redux Persist + AsyncStorage
- **Push Notifications:** React Native Firebase

**Admin Dashboard:**
- Same tech stack as web app
- Additional: Admin-specific components

---

### 3.3 Databases

**Primary Database: PostgreSQL**
- **Use Cases:** Transactional data, relational data
- **Version:** PostgreSQL 15+
- **Features:** JSONB support, full-text search, partitioning
- **Extensions:** PostGIS (if location features needed), pg_trgm (fuzzy search)

**Document Database: MongoDB**
- **Use Cases:** Unstructured data, customer profiles, logs
- **Version:** MongoDB 6+

**Cache: Redis**
- **Use Cases:** Session storage, caching, rate limiting
- **Version:** Redis 7+
- **Features:** Cluster mode for HA

**Search Engine: Elasticsearch**
- **Use Cases:** Full-text search, log aggregation
- **Version:** Elasticsearch 8+

**Data Warehouse: (Optional)**
- **Options:** Amazon Redshift, Google BigQuery, or Snowflake
- **Use Cases:** Historical analytics, BI reporting

**Vector Database: (for AI)**
- **Options:** Pinecone, Weaviate, or Qdrant
- **Use Cases:** Semantic search, AI similarity matching

---

### 3.4 Message Broker

**Primary: RabbitMQ**
- **Use Cases:** Event-driven architecture, async tasks
- **Version:** RabbitMQ 3.12+
- **Features:** High availability, message persistence

**Alternative: Apache Kafka**
- **Use Cases:** High-throughput event streaming
- **Use if:** Need event sourcing, event replay, very high volume

---

### 3.5 DevOps & Infrastructure

**Containerization:**
- **Docker:** Container runtime
- **Docker Compose:** Local development

**Orchestration:**
- **Kubernetes:** Production orchestration
- **Helm:** Kubernetes package management

**CI/CD:**
- **GitHub Actions** or **GitLab CI**
- **ArgoCD:** GitOps for Kubernetes deployments

**Monitoring & Observability:**
- **Prometheus:** Metrics collection
- **Grafana:** Dashboards and visualization
- **Loki:** Log aggregation
- **Tempo:** Distributed tracing
- **Sentry:** Error tracking

**Infrastructure as Code:**
- **Terraform:** Cloud infrastructure provisioning
- **Ansible:** Configuration management (if needed)

**API Gateway:**
- **Kong** or **AWS API Gateway** or **NGINX**

---

## 4. Data Architecture

### 4.1 Database Strategy

**Database-per-Service Pattern:**
- Each microservice has its own database
- No direct database access between services
- Communication via APIs or events

**Multi-Tenancy Strategy:**
- **Approach:** Schema-per-tenant (PostgreSQL schemas)
- **Tenant Isolation:** Row-level security + tenant_id column
- **Benefits:** Strong data isolation, easier compliance

**Example:**
```sql
-- Tenant table (shared)
CREATE TABLE tenants (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Service database with tenant_id
CREATE TABLE invoices (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    invoice_number VARCHAR(100),
    customer_id UUID,
    total DECIMAL(15,2),
    ...
);

-- Row-level security
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_policy ON invoices
    USING (tenant_id = current_setting('app.current_tenant')::UUID);
```

### 4.2 Data Consistency

**Eventual Consistency:**
- Across services: Eventual consistency via events
- Within service: Strong consistency (ACID transactions)

**Saga Pattern:**
- For distributed transactions (e.g., order processing)
- Orchestration-based or choreography-based

**Example Saga (Order Processing):**
```
1. Create Order (Order Service)
2. Reserve Inventory (Inventory Service)
   → If fails, cancel order
3. Process Payment (Payment Service)
   → If fails, release inventory, cancel order
4. Confirm Order
   → If fails, refund payment, release inventory, cancel order
```

### 4.3 Data Backup & Recovery

**Backup Strategy:**
- **Frequency:** Daily full backups, continuous WAL archiving (PostgreSQL)
- **Retention:** 30 days point-in-time recovery
- **Storage:** Encrypted backups in S3 / Azure Blob
- **Testing:** Monthly restore drills

**Disaster Recovery:**
- **RTO:** 4 hours (Recovery Time Objective)
- **RPO:** 1 hour (Recovery Point Objective)
- **Multi-region:** Standby database in secondary region

---

## 5. API Architecture

### 5.1 API Design Principles

**RESTful APIs:**
- Resource-based URLs
- HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Stateless
- JSON format

**API Versioning:**
- URL-based: `/api/v1/invoices`, `/api/v2/invoices`
- Maintain v1 for backward compatibility

**GraphQL APIs:**
- For complex queries across multiple resources
- Reduces over-fetching and under-fetching
- Example: Dashboard with data from multiple services

**API Standards:**
```
GET    /api/v1/invoices          - List invoices
GET    /api/v1/invoices/{id}     - Get single invoice
POST   /api/v1/invoices          - Create invoice
PUT    /api/v1/invoices/{id}     - Update invoice (full)
PATCH  /api/v1/invoices/{id}     - Update invoice (partial)
DELETE /api/v1/invoices/{id}     - Delete invoice

Query params: ?page=1&limit=20&sort=-created_at&filter=status:draft
```

### 5.2 API Gateway

**Responsibilities:**
- Request routing
- Authentication & authorization
- Rate limiting
- Request/response transformation
- API versioning
- Logging and monitoring
- Circuit breaking
- Load balancing

**Technology:** Kong, AWS API Gateway, or NGINX

**Rate Limiting:**
```
Free tier: 100 requests/hour
Starter: 1,000 requests/hour
Professional: 10,000 requests/hour
Enterprise: Unlimited
```

### 5.3 API Documentation

**OpenAPI/Swagger:**
- Auto-generated from code
- Interactive documentation
- Try-it-out functionality
- Code examples in multiple languages

**Developer Portal:**
- API reference
- Getting started guides
- SDKs (Python, JavaScript, PHP, .NET)
- Webhooks documentation
- Changelog

---

## 6. Security Architecture

### 6.1 Security Layers

**1. Network Security:**
- VPC with private subnets for databases
- Security groups and NACLs
- DDoS protection (CloudFlare / AWS Shield)
- WAF (Web Application Firewall)

**2. Application Security:**
- Input validation and sanitization
- SQL injection prevention (parameterized queries, ORM)
- XSS prevention (output encoding, CSP headers)
- CSRF protection (tokens)
- Secure headers (HSTS, X-Frame-Options, etc.)

**3. Authentication & Authorization:**
- JWT tokens (short-lived access tokens, long-lived refresh tokens)
- Multi-factor authentication
- Role-based access control (RBAC)
- Permission-based access control (PBAC)
- OAuth 2.0 / OpenID Connect for third-party integrations

**4. Data Security:**
- Encryption at rest (AES-256)
- Encryption in transit (TLS 1.3)
- Database encryption
- Secrets management (HashiCorp Vault / AWS Secrets Manager)
- PII data masking in logs

**5. API Security:**
- API keys for server-to-server
- Rate limiting
- IP whitelisting (for sensitive operations)
- Request signing (for high-security integrations)

**6. Audit & Compliance:**
- Comprehensive audit logging
- Tamper-proof logs
- User activity tracking
- Compliance reporting (GDPR, Saudi PDPL)

### 6.2 Zero-Trust Architecture

**Principles:**
- Never trust, always verify
- Least privilege access
- Micro-segmentation
- Continuous verification

**Implementation:**
- Service-to-service authentication (mutual TLS)
- Short-lived credentials
- Network policies (Kubernetes NetworkPolicies)

### 6.3 Security Monitoring

**Tools:**
- **SIEM:** Splunk or ELK for security monitoring
- **Vulnerability Scanning:** Trivy (containers), OWASP Dependency-Check
- **Penetration Testing:** Quarterly external pentests
- **Bug Bounty:** (Phase 2) HackerOne or Bugcrowd

---

## 7. Cloud Infrastructure

### 7.1 Cloud Provider Strategy

**Multi-Cloud Ready:**
- Primary: AWS (most mature Saudi presence)
- Secondary: Azure or GCP
- Deployment: Kubernetes (cloud-agnostic)

**AWS Services:**
- **Compute:** EKS (Kubernetes), EC2 (if needed)
- **Database:** RDS (PostgreSQL), DocumentDB (MongoDB-compatible)
- **Cache:** ElastiCache (Redis)
- **Storage:** S3
- **CDN:** CloudFront
- **Networking:** VPC, Route 53
- **Secrets:** Secrets Manager
- **Monitoring:** CloudWatch (+ Prometheus/Grafana)

### 7.2 Regional Deployment

**Regions:**
- **Primary:** Middle East (Bahrain) - `me-south-1`
- **Secondary:** Europe (Frankfurt) - `eu-central-1` (for disaster recovery)
- **Future:** Saudi Arabia region when available

**Benefits:**
- Low latency for Saudi users
- Data residency compliance
- Disaster recovery

### 7.3 Infrastructure Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                       CLOUDFLARE CDN                              │
│  • DDoS Protection                                                │
│  • WAF                                                            │
│  • Edge Caching                                                   │
│  • SSL/TLS Termination                                            │
└────────────────────┬─────────────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────────────┐
│                    AWS REGION: ME-SOUTH-1                         │
├──────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                 AVAILABILITY ZONE 1                        │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │  EKS Cluster - Worker Nodes                          │  │  │
│  │  │  • API Gateway                                       │  │  │
│  │  │  • Microservices (Pods)                             │  │  │
│  │  │  • Auto-scaling                                      │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │  RDS PostgreSQL (Multi-AZ)                          │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                 AVAILABILITY ZONE 2                        │  │
│  │  • EKS Worker Nodes (replicas)                             │  │
│  │  • RDS Standby (automatic failover)                        │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │              SHARED SERVICES                               │  │
│  │  • S3 Buckets (documents, backups)                         │  │
│  │  • ElastiCache Redis (multi-AZ)                            │  │
│  │  • Elasticsearch                                           │  │
│  │  • RabbitMQ / MSK (Kafka)                                  │  │
│  │  • Secrets Manager                                         │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 8. AI Integration Architecture

### 8.1 Claude API Integration

**API Client:**
- Official Anthropic SDK (Python)
- Connection pooling
- Rate limiting compliance
- Error handling and retries
- Cost tracking

**Use Cases:**
1. **Conversational Interface:**
   - User asks question in natural language
   - Claude interprets intent
   - Retrieves data from services
   - Generates natural language response

2. **Document Processing:**
   - Upload invoice/receipt
   - Claude extracts data (OCR + understanding)
   - Auto-populate fields

3. **Predictive Analytics:**
   - Combine Claude with custom ML models
   - Claude for reasoning, custom models for forecasting

4. **Automated Responses:**
   - Customer support ticket auto-response
   - Email drafting

### 8.2 Custom ML Models

**Framework:** scikit-learn, TensorFlow, or PyTorch

**Models:**
1. **Demand Forecasting:** Time series forecasting (LSTM, Prophet)
2. **Lead Scoring:** Classification model (Random Forest, XGBoost)
3. **Churn Prediction:** Binary classification
4. **Anomaly Detection:** Isolation Forest, Autoencoders

**Training Pipeline:**
- Data extraction from services
- Feature engineering
- Model training
- Evaluation and validation
- Model deployment (MLflow or custom)
- A/B testing
- Monitoring (model drift)

---

## 9. Integration Architecture

### 9.1 Saudi Government Integrations

**ZATCA E-Invoicing:**
- **Integration Type:** REST API
- **Authentication:** Cryptographic stamps (CSID)
- **Features:**
  - Invoice clearance (B2B)
  - Invoice reporting (B2C)
  - QR code generation
  - UUID tracking
- **Compliance:** Phase 2 certified

**GOSI:**
- **Integration Type:** File upload + API (Mudad platform)
- **Features:**
  - Employee registration
  - Monthly salary reporting
  - Contribution calculations
  - Certificate retrieval

**Nafath:**
- **Integration Type:** Custom integration (not OIDC/SAML)
- **Features:**
  - User authentication
  - Biometric verification
  - Digital signatures

**Muqeem:**
- **Integration Type:** API via Elm
- **Features:**
  - Iqama status checking
  - Work permit management
  - Transfer requests
  - Exit/re-entry permits

### 9.2 Third-Party Integrations

**Payment Gateways:**
- Moyasar, PayTabs, HyperPay (Saudi-focused)
- Stripe (international)

**E-commerce Platforms:**
- Salla, Zid (Saudi)
- Shopify, WooCommerce (international)

**Shipping Providers:**
- SMSA, Aramex, DHL, FedEx

**Communication:**
- Email: SendGrid, AWS SES
- SMS: Twilio, Unifonic, MSEGAT (Saudi)
- WhatsApp: WhatsApp Business API

**Accounting:**
- QuickBooks, Xero (import/export)

---

## 10. Scalability & Performance

### 10.1 Scalability Strategy

**Horizontal Scaling:**
- Stateless services
- Auto-scaling based on CPU/memory/custom metrics
- Kubernetes HPA (Horizontal Pod Autoscaler)

**Database Scaling:**
- Read replicas for read-heavy workloads
- Connection pooling (PgBouncer)
- Caching (Redis)
- Database partitioning (by tenant, by date)

**Caching Strategy:**
- **Browser Cache:** Static assets (1 year)
- **CDN Cache:** Images, CSS, JS (1 hour - 1 day)
- **Application Cache (Redis):** Frequently accessed data (5-60 minutes)
- **Database Query Cache:** Expensive queries

**Content Delivery:**
- CloudFlare CDN for static assets
- Edge caching for API responses (where applicable)

### 10.2 Performance Targets

**API Response Times (p95):**
- Simple queries (get invoice): <50ms
- Complex queries (dashboard): <200ms
- Mutations (create invoice): <100ms
- AI queries: <2s (depending on complexity)

**Web Application:**
- First Contentful Paint: <1s
- Time to Interactive: <2s
- Lighthouse Score: >90

**Mobile Application:**
- App launch: <2s
- Screen navigation: <300ms

**Database:**
- Query response: <10ms (simple), <100ms (complex)
- Connection pool: 100-500 connections

### 10.3 Performance Optimization

**Backend:**
- Database indexing
- Query optimization
- N+1 query prevention
- Response compression (gzip)
- Pagination (cursor-based for large datasets)

**Frontend:**
- Code splitting
- Lazy loading
- Image optimization (WebP, lazy load)
- Service workers (PWA)
- Optimistic UI updates

---

## 11. Deployment Architecture

### 11.1 Environments

**Development:**
- Developer laptops (Docker Compose)
- Shared dev environment (Kubernetes cluster)

**Staging:**
- Production-like environment
- Continuous deployment from `develop` branch
- Used for testing before production

**Production:**
- Multi-AZ deployment
- Continuous deployment from `main` branch (after approval)
- Blue-green or canary deployments

### 11.2 Deployment Pipeline

```
Developer commits code
    ↓
GitHub / GitLab
    ↓
CI Pipeline (GitHub Actions):
  - Run tests (unit, integration)
  - Run linters (ESLint, Pylint)
  - Security scan (OWASP Dependency-Check, Trivy)
  - Build Docker images
  - Push to container registry
    ↓
CD Pipeline (ArgoCD):
  - Deploy to staging (automatic)
  - Run E2E tests
  - Manual approval gate
  - Deploy to production (blue-green)
  - Health checks
  - Rollback if needed
```

### 11.3 Rollback Strategy

**Automated Rollback:**
- Health check failures trigger rollback
- Error rate spikes trigger rollback

**Manual Rollback:**
- One-click rollback to previous version
- Database migrations reversible (down migrations)

---

## 12. Development & DevOps

### 12.1 Development Workflow

**Branching Strategy:**
- `main` - production
- `develop` - development
- `feature/*` - feature branches
- `hotfix/*` - hotfix branches

**Pull Request Process:**
- Code review required
- Tests must pass
- Security scan must pass
- Documentation updated

### 12.2 Code Quality

**Linting:**
- JavaScript/TypeScript: ESLint + Prettier
- Python: Pylint + Black
- Pre-commit hooks

**Testing:**
- Unit tests: >80% coverage
- Integration tests: Key user flows
- E2E tests: Critical paths
- Load testing: Apache JMeter or k6

**Code Review:**
- All code reviewed by peer
- Security-sensitive code reviewed by senior dev

### 12.3 Monitoring & Alerting

**Metrics (Prometheus):**
- Request rate, error rate, duration (RED metrics)
- CPU, memory, disk usage
- Database connections, query times
- Queue depth, message processing times

**Dashboards (Grafana):**
- Service health overview
- Business metrics (invoices created, users active, etc.)
- Infrastructure metrics

**Alerts:**
- Error rate >5% → Page on-call engineer
- API latency >500ms (p95) → Slack alert
- Database connections >80% → Slack alert
- Disk usage >85% → Email alert

**Logs (Loki or ELK):**
- Structured logging (JSON)
- Centralized log aggregation
- Log retention: 30 days

**Tracing (Tempo or Jaeger):**
- Distributed tracing for requests across services
- Performance bottleneck identification

---

## Appendix A: Architecture Decision Records (ADRs)

### ADR-001: Microservices vs Monolith

**Decision:** Microservices architecture

**Rationale:**
- Scalability: Scale services independently
- Team autonomy: Teams can work on services independently
- Technology flexibility: Use best tool for each service
- Fault isolation: Failure in one service doesn't bring down entire system
- Aligns with cloud-native best practices

**Trade-offs:**
- Increased complexity (distributed system)
- Need for robust monitoring and tracing
- Data consistency challenges (eventual consistency)

**Status:** Accepted

---

### ADR-002: Database per Service

**Decision:** Each microservice owns its database

**Rationale:**
- Loose coupling: Services don't depend on each other's schemas
- Independent scaling: Scale databases independently
- Technology choice: Can use different databases for different services

**Trade-offs:**
- Data duplication (acceptable for scalability)
- Need for event-driven architecture
- Complex queries across services (use GraphQL or API composition)

**Status:** Accepted

---

### ADR-003: Multi-Tenancy Strategy

**Decision:** Schema-per-tenant with row-level security

**Rationale:**
- Strong data isolation (regulatory compliance)
- Easier to backup/restore individual tenants
- Better security posture

**Trade-offs:**
- More complex than single schema
- Slight performance overhead (row-level security)

**Alternative considered:** Single schema with tenant_id column only
- Cheaper, simpler, but weaker isolation

**Status:** Accepted

---

### ADR-004: Primary Programming Languages

**Decision:** Python (FastAPI) and Node.js (NestJS)

**Rationale:**
- Python: Excellent for AI/ML, data processing, financial calculations
- Node.js: Excellent for real-time, I/O-heavy, event-driven workloads
- Both have strong ecosystems
- Team familiarity

**Status:** Accepted

---

### ADR-005: Cloud Provider

**Decision:** AWS as primary cloud provider

**Rationale:**
- Mature Middle East presence (Bahrain region)
- Comprehensive service offering
- Strong security and compliance certifications
- Best documentation and community support

**Multi-cloud consideration:**
- Use Kubernetes for cloud portability
- Can migrate to Azure/GCP if needed

**Status:** Accepted

---

## Appendix B: Glossary

- **API Gateway:** Entry point for all client requests, handles routing, auth, rate limiting
- **Circuit Breaker:** Pattern to prevent cascading failures in distributed systems
- **Event-Driven Architecture:** Services communicate via events (pub/sub)
- **Horizontal Scaling:** Adding more instances (vs vertical: bigger instances)
- **Microservices:** Architectural style where application is collection of loosely coupled services
- **Multi-Tenancy:** Single instance serves multiple customers (tenants)
- **RTO:** Recovery Time Objective - maximum acceptable downtime
- **RPO:** Recovery Point Objective - maximum acceptable data loss
- **Saga:** Pattern for managing distributed transactions
- **Service Mesh:** Infrastructure layer for service-to-service communication (e.g., Istio)

---

## Next Steps

With this architecture design complete, the next phases are:

1. **TECH_STACK.md** - Detailed technology choices with justifications
2. **DATABASE_SCHEMA.md** - Complete database schemas for all services
3. **API_SPECIFICATION.md** - Detailed API contracts (OpenAPI specs)
4. **SECURITY_DESIGN.md** - Comprehensive security implementation plan
5. **Implementation** - Begin building services

---

**Document Status:** ✅ Complete
**Next Document:** TECH_STACK.md
**Prepared By:** OUTA ERP Architecture Team
**Date:** January 17, 2026
