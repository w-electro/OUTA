"""
OUTA ERP - Finance Service
Handles financial management and ZATCA compliance
"""
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date
from decimal import Decimal
from enum import Enum
import uuid

# FastAPI app
app = FastAPI(
    title="OUTA ERP - Finance Service",
    description="Financial management and ZATCA e-invoicing service",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Enums
class InvoiceStatus(str, Enum):
    DRAFT = "draft"
    PENDING = "pending"
    APPROVED = "approved"
    SUBMITTED_ZATCA = "submitted_zatca"
    PAID = "paid"
    CANCELLED = "cancelled"

class InvoiceType(str, Enum):
    STANDARD = "standard"  # B2B (requires ZATCA clearance)
    SIMPLIFIED = "simplified"  # B2C (requires ZATCA reporting)

class PaymentStatus(str, Enum):
    PENDING = "pending"
    PAID = "paid"
    PARTIAL = "partial"
    OVERDUE = "overdue"

# Pydantic models
class InvoiceLineItem(BaseModel):
    description: str
    quantity: Decimal
    unit_price: Decimal
    tax_rate: Decimal = Decimal("0.15")  # 15% VAT (Saudi Arabia)
    discount: Decimal = Decimal("0.00")

    @property
    def subtotal(self) -> Decimal:
        return self.quantity * self.unit_price

    @property
    def tax_amount(self) -> Decimal:
        return (self.subtotal - self.discount) * self.tax_rate

    @property
    def total(self) -> Decimal:
        return self.subtotal - self.discount + self.tax_amount

class InvoiceCreate(BaseModel):
    customer_name: str
    customer_email: str
    customer_vat_number: Optional[str] = None
    customer_address: Optional[str] = None
    invoice_type: InvoiceType = InvoiceType.STANDARD
    invoice_date: date
    due_date: date
    line_items: List[InvoiceLineItem]
    notes: Optional[str] = None

class Invoice(BaseModel):
    id: str
    invoice_number: str
    customer_name: str
    customer_email: str
    customer_vat_number: Optional[str]
    customer_address: Optional[str]
    invoice_type: InvoiceType
    status: InvoiceStatus
    payment_status: PaymentStatus
    invoice_date: date
    due_date: date
    line_items: List[InvoiceLineItem]
    subtotal: Decimal
    total_tax: Decimal
    total_amount: Decimal
    notes: Optional[str]
    zatca_uuid: Optional[str] = None
    zatca_qr_code: Optional[str] = None
    zatca_submitted_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

class ZATCASubmission(BaseModel):
    invoice_id: str
    zatca_uuid: str
    qr_code: str
    submission_status: str
    submitted_at: datetime

# In-memory storage (replace with database)
invoices_db = {}
invoice_counter = 1000

# Helper functions
def generate_invoice_number() -> str:
    """Generate unique invoice number"""
    global invoice_counter
    invoice_counter += 1
    return f"INV-{invoice_counter:06d}"

def calculate_invoice_totals(line_items: List[InvoiceLineItem]):
    """Calculate invoice totals"""
    subtotal = sum(item.subtotal for item in line_items)
    total_discount = sum(item.discount for item in line_items)
    total_tax = sum(item.tax_amount for item in line_items)
    total_amount = sum(item.total for item in line_items)

    return {
        "subtotal": subtotal,
        "total_tax": total_tax,
        "total_amount": total_amount
    }

def generate_zatca_qr_code(invoice: dict) -> str:
    """Generate ZATCA-compliant QR code (simplified version)"""
    import base64

    # This is a simplified version. Real implementation requires TLV encoding
    # with 9 tags as per ZATCA Phase 2 requirements
    qr_data = f"{invoice['invoice_number']}|{invoice['total_amount']}|{invoice['invoice_date']}"
    qr_code = base64.b64encode(qr_data.encode()).decode()

    return qr_code

# API Endpoints
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "OUTA ERP - Finance Service",
        "version": "1.0.0",
        "status": "operational",
        "features": ["Invoicing", "ZATCA Phase 2 Compliance", "VAT Management"]
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/invoices", response_model=Invoice, status_code=status.HTTP_201_CREATED)
async def create_invoice(invoice_data: InvoiceCreate):
    """Create a new invoice"""
    # Generate invoice ID and number
    invoice_id = str(uuid.uuid4())
    invoice_number = generate_invoice_number()

    # Calculate totals
    totals = calculate_invoice_totals(invoice_data.line_items)

    # Create invoice
    invoice = {
        "id": invoice_id,
        "invoice_number": invoice_number,
        "customer_name": invoice_data.customer_name,
        "customer_email": invoice_data.customer_email,
        "customer_vat_number": invoice_data.customer_vat_number,
        "customer_address": invoice_data.customer_address,
        "invoice_type": invoice_data.invoice_type,
        "status": InvoiceStatus.DRAFT,
        "payment_status": PaymentStatus.PENDING,
        "invoice_date": invoice_data.invoice_date,
        "due_date": invoice_data.due_date,
        "line_items": [item.dict() for item in invoice_data.line_items],
        "subtotal": totals["subtotal"],
        "total_tax": totals["total_tax"],
        "total_amount": totals["total_amount"],
        "notes": invoice_data.notes,
        "zatca_uuid": None,
        "zatca_qr_code": None,
        "zatca_submitted_at": None,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }

    invoices_db[invoice_id] = invoice

    return Invoice(**invoice)

@app.get("/invoices", response_model=List[Invoice])
async def list_invoices(
    status: Optional[InvoiceStatus] = None,
    skip: int = 0,
    limit: int = 100
):
    """List all invoices"""
    invoices = list(invoices_db.values())

    # Filter by status if provided
    if status:
        invoices = [inv for inv in invoices if inv["status"] == status]

    # Apply pagination
    invoices = invoices[skip:skip + limit]

    return [Invoice(**inv) for inv in invoices]

@app.get("/invoices/{invoice_id}", response_model=Invoice)
async def get_invoice(invoice_id: str):
    """Get invoice by ID"""
    invoice = invoices_db.get(invoice_id)

    if not invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invoice not found"
        )

    return Invoice(**invoice)

@app.put("/invoices/{invoice_id}/approve")
async def approve_invoice(invoice_id: str):
    """Approve invoice"""
    invoice = invoices_db.get(invoice_id)

    if not invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invoice not found"
        )

    if invoice["status"] != InvoiceStatus.DRAFT:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only draft invoices can be approved"
        )

    invoice["status"] = InvoiceStatus.APPROVED
    invoice["updated_at"] = datetime.utcnow()

    return {"message": "Invoice approved successfully", "invoice": Invoice(**invoice)}

@app.post("/invoices/{invoice_id}/submit-zatca", response_model=ZATCASubmission)
async def submit_to_zatca(invoice_id: str):
    """
    Submit invoice to ZATCA for clearance (B2B) or reporting (B2C)
    This is a simplified implementation. Real integration requires:
    - Cryptographic Stamp Identifier (CSID) from ZATCA
    - Proper XML format (UBL 2.1)
    - Digital signature
    - API integration with ZATCA systems
    """
    invoice = invoices_db.get(invoice_id)

    if not invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invoice not found"
        )

    if invoice["status"] != InvoiceStatus.APPROVED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only approved invoices can be submitted to ZATCA"
        )

    # Generate ZATCA UUID
    zatca_uuid = str(uuid.uuid4())

    # Generate QR code
    qr_code = generate_zatca_qr_code(invoice)

    # Update invoice
    invoice["status"] = InvoiceStatus.SUBMITTED_ZATCA
    invoice["zatca_uuid"] = zatca_uuid
    invoice["zatca_qr_code"] = qr_code
    invoice["zatca_submitted_at"] = datetime.utcnow()
    invoice["updated_at"] = datetime.utcnow()

    submission = ZATCASubmission(
        invoice_id=invoice_id,
        zatca_uuid=zatca_uuid,
        qr_code=qr_code,
        submission_status="success",
        submitted_at=invoice["zatca_submitted_at"]
    )

    return submission

@app.post("/invoices/{invoice_id}/payment")
async def record_payment(
    invoice_id: str,
    amount: Decimal,
    payment_date: date,
    payment_method: str,
    reference: Optional[str] = None
):
    """Record payment for invoice"""
    invoice = invoices_db.get(invoice_id)

    if not invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invoice not found"
        )

    # Update payment status
    if amount >= invoice["total_amount"]:
        invoice["payment_status"] = PaymentStatus.PAID
        invoice["status"] = InvoiceStatus.PAID
    else:
        invoice["payment_status"] = PaymentStatus.PARTIAL

    invoice["updated_at"] = datetime.utcnow()

    return {
        "message": "Payment recorded successfully",
        "invoice": Invoice(**invoice),
        "payment": {
            "amount": amount,
            "payment_date": payment_date,
            "payment_method": payment_method,
            "reference": reference
        }
    }

@app.get("/reports/revenue")
async def revenue_report(
    start_date: date,
    end_date: date
):
    """Generate revenue report"""
    # Filter invoices by date range
    filtered_invoices = [
        inv for inv in invoices_db.values()
        if start_date <= inv["invoice_date"] <= end_date
    ]

    total_revenue = sum(
        inv["total_amount"] for inv in filtered_invoices
        if inv["payment_status"] == PaymentStatus.PAID
    )

    total_tax = sum(
        inv["total_tax"] for inv in filtered_invoices
        if inv["payment_status"] == PaymentStatus.PAID
    )

    pending_amount = sum(
        inv["total_amount"] for inv in filtered_invoices
        if inv["payment_status"] in [PaymentStatus.PENDING, PaymentStatus.PARTIAL]
    )

    return {
        "period": {
            "start_date": start_date,
            "end_date": end_date
        },
        "metrics": {
            "total_invoices": len(filtered_invoices),
            "total_revenue": float(total_revenue),
            "total_tax_collected": float(total_tax),
            "pending_amount": float(pending_amount),
            "paid_invoices": sum(1 for inv in filtered_invoices if inv["payment_status"] == PaymentStatus.PAID)
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
