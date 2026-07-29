import io
import fitz  # PyMuPDF
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from services.db import db
from services.ai_agent import ai_agent

app = FastAPI(title="LegalEase AI Backend")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "LegalEase AI API is running"}

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
        
    try:
        # Read file content
        content = await file.read()
        
        # Extract text using PyMuPDF
        pdf_document = fitz.open(stream=content, filetype="pdf")
        text_content = ""
        for page_num in range(pdf_document.page_count):
            page = pdf_document.load_page(page_num)
            text_content += page.get_text()
            
        if not text_content.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from PDF. It might be scanned or empty.")

        # Save to database
        saved_doc = db.save_document(
            file_name=file.filename,
            file_type="pdf",
            text_content=text_content
        )
        
        return {"message": "Document uploaded successfully", "document_id": saved_doc["id"]}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

class AnalyzeRequest(BaseModel):
    document_id: str

@app.post("/analyze")
def analyze_document(req: AnalyzeRequest):
    # Fetch document
    doc = db.get_document(req.document_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    try:
        # Run AI analysis
        analysis_result = ai_agent.analyze_document(doc["text_content"])
        
        # Save analysis to DB
        saved_analysis = db.save_analysis(
            document_id=doc["id"],
            risk_score=analysis_result["risk_score"],
            summary=analysis_result["summary"]
        )
        
        # Save clauses to DB
        saved_clauses = db.save_clauses(
            analysis_id=saved_analysis["id"],
            clauses=analysis_result["clauses"]
        )
        
        return {
            "message": "Analysis complete",
            "analysis_id": saved_analysis["id"],
            "document_id": doc["id"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing document: {str(e)}")

@app.get("/history")
def get_history():
    history = db.get_history()
    return {"history": history}

@app.get("/analysis/{id}")
def get_analysis(id: str):
    # We query by document_id in our structure, so let's treat {id} as document_id
    data = db.get_analysis_by_doc(id)
    if not data:
        raise HTTPException(status_code=404, detail="Analysis not found for this document")
    return data
