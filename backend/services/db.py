import os
import uuid
from dotenv import load_dotenv
from supabase import create_client, Client
from datetime import datetime

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

class DBService:
    def __init__(self):
        self.supabase: Client | None = None
        self.mock_mode = False
        
        if SUPABASE_URL and SUPABASE_KEY:
            try:
                self.supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
                print("Supabase client initialized.")
            except Exception as e:
                print(f"Failed to initialize Supabase: {e}")
                self.mock_mode = True
        else:
            print("Missing Supabase credentials. Running in mock mode.")
            self.mock_mode = True
            
        # Mock data storage for development
        self.mock_db = {
            "documents": [],
            "analyses": [],
            "clauses": []
        }

    def save_document(self, file_name: str, file_type: str, text_content: str) -> dict:
        doc_id = str(uuid.uuid4())
        doc_data = {
            "id": doc_id,
            "file_name": file_name,
            "file_type": file_type,
            "text_content": text_content,
            # "user_id": user_id  # Omitted for simplicity if not using auth
        }
        if self.mock_mode:
            self.mock_db["documents"].append(doc_data)
            return doc_data
            
        res = self.supabase.table("documents").insert(doc_data).execute()
        return res.data[0] if res.data else doc_data

    def get_document(self, doc_id: str) -> dict:
        if self.mock_mode:
            return next((doc for doc in self.mock_db["documents"] if doc["id"] == doc_id), None)
            
        res = self.supabase.table("documents").select("*").eq("id", doc_id).execute()
        return res.data[0] if res.data else None

    def save_analysis(self, document_id: str, risk_score: int, summary: str) -> dict:
        analysis_id = str(uuid.uuid4())
        analysis_data = {
            "id": analysis_id,
            "document_id": document_id,
            "risk_score": risk_score,
            "summary": summary
        }
        if self.mock_mode:
            self.mock_db["analyses"].append(analysis_data)
            return analysis_data
            
        res = self.supabase.table("analyses").insert(analysis_data).execute()
        return res.data[0] if res.data else analysis_data

    def save_clauses(self, analysis_id: str, clauses: list) -> list:
        clause_data = []
        for clause in clauses:
            clause_data.append({
                "id": str(uuid.uuid4()),
                "analysis_id": analysis_id,
                "title": clause.get("title", "Untitled Clause"),
                "risk_level": clause.get("risk_level", "low"),
                "explanation": clause.get("explanation", "")
            })
            
        if self.mock_mode:
            self.mock_db["clauses"].extend(clause_data)
            return clause_data
            
        res = self.supabase.table("clauses").insert(clause_data).execute()
        return res.data if res.data else clause_data

    def get_analysis_by_doc(self, doc_id: str) -> dict:
        if self.mock_mode:
            analysis = next((a for a in self.mock_db["analyses"] if a["document_id"] == doc_id), None)
            if not analysis: return None
            clauses = [c for c in self.mock_db["clauses"] if c["analysis_id"] == analysis["id"]]
            return {"analysis": analysis, "clauses": clauses}
            
        res = self.supabase.table("analyses").select("*").eq("document_id", doc_id).execute()
        if not res.data: return None
        analysis = res.data[0]
        
        clause_res = self.supabase.table("clauses").select("*").eq("analysis_id", analysis["id"]).execute()
        clauses = clause_res.data if clause_res.data else []
        return {"analysis": analysis, "clauses": clauses}

    def get_history(self) -> list:
        if self.mock_mode:
            return self.mock_db["documents"]
            
        # Simplified history retrieval, usually you filter by user_id
        res = self.supabase.table("documents").select("id, file_name, created_at").order('created_at', desc=True).execute()
        return res.data if res.data else []

db = DBService()
