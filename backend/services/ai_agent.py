import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

class AIAgent:
    def __init__(self):
        self.mock_mode = False
        if not OPENAI_API_KEY or OPENAI_API_KEY == "your-openai-api-key":
            print("Missing OpenAI API Key. Running in mock mode.")
            self.mock_mode = True
        else:
            self.client = OpenAI(api_key=OPENAI_API_KEY)

    def _call_llm(self, prompt: str, retries: int = 1) -> dict:
        for attempt in range(retries + 1):
            try:
                response = self.client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[{"role": "user", "content": prompt}],
                    response_format={ "type": "json_object" },
                    temperature=0.2
                )
                return json.loads(response.choices[0].message.content)
            except json.JSONDecodeError as e:
                print(f"JSON parsing failed on attempt {attempt + 1}: {e}")
                if attempt == retries:
                    raise Exception("Failed to parse AI response into valid JSON after retries. Please try again.")
            except Exception as e:
                print(f"AI API call failed on attempt {attempt + 1}: {e}")
                if attempt == retries:
                    raise Exception("Failed to communicate with AI provider after retries. Please check your API key and connection.")

    def classify_document(self, text: str) -> str:
        print("[Agent Step 1] Classifying document...")
        prompt = f"""
        Analyze the following text and determine the type of legal document it is.
        Respond ONLY with a valid JSON object matching this schema: {{"document_type": "type"}}
        Example types: "Non-Disclosure Agreement (NDA)", "Employment Contract", "Lease Agreement", "Service Contract".
        
        Text excerpt:
        {text[:5000]}
        """
        result = self._call_llm(prompt)
        print(f"  -> Identified as: {result.get('document_type')}")
        return result.get("document_type", "Unknown Document")

    def extract_clauses(self, text: str, doc_type: str) -> list:
        print("[Agent Step 2] Extracting key clauses...")
        # TODO(Architecture): For large documents (>15k tokens), implement a map-reduce chunking strategy here.
        # Split text into 10k token chunks, extract clauses concurrently, then merge and deduplicate results.
        # Currently using simple truncation for the hackathon MVP.
        prompt = f"""
        You are analyzing a {doc_type}. Extract the 3 to 5 most critical clauses from this document.
        Respond ONLY with a valid JSON object matching this schema: 
        {{"clauses": ["raw text of clause 1", "raw text of clause 2", ...]}}
        
        Text excerpt:
        {text[:15000]}
        """
        result = self._call_llm(prompt)
        clauses = result.get("clauses", [])
        print(f"  -> Extracted {len(clauses)} critical clauses.")
        return clauses

    def analyze_clauses(self, clauses: list) -> list:
        print("[Agent Step 3] Analyzing risks and explaining clauses...")
        analyzed = []
        for i, clause_text in enumerate(clauses):
            prompt = f"""
            Analyze the following legal clause.
            1. Provide a short title for it (e.g., "Non-Compete", "Confidentiality").
            2. Assign a risk level: "low", "medium", or "high".
            3. Provide a plain-English explanation of what this clause means and why it matters.
            
            Clause Text:
            {clause_text}
            
            Respond ONLY with a valid JSON object matching this schema:
            {{"title": "...", "risk_level": "...", "explanation": "..."}}
            """
            result = self._call_llm(prompt)
            analyzed.append(result)
            print(f"  -> Analyzed clause {i+1}: {result.get('title')} ({result.get('risk_level')} risk)")
        return analyzed

    def generate_summary(self, text: str, doc_type: str, analyzed_clauses: list) -> dict:
        print("[Agent Step 4] Generating final summary and overall risk score...")
        clauses_json_str = json.dumps(analyzed_clauses)
        prompt = f"""
        You have analyzed a {doc_type}. The key clauses and their risks are:
        {clauses_json_str}
        
        Based on these clauses and the overall document context, provide:
        1. An overall summary of the document in plain English (2-3 sentences).
        2. An overall risk score from 1 (lowest risk) to 10 (highest risk) for a typical individual signing this.
        
        Respond ONLY with a valid JSON object matching this schema:
        {{"summary": "...", "risk_score": 5}}
        """
        result = self._call_llm(prompt)
        print(f"  -> Final summary generated with risk score {result.get('risk_score')}/10.")
        return result

    def analyze_document(self, text: str) -> dict:
        if self.mock_mode:
            # Return mock analysis
            return {
                "summary": "This is a mocked summary of the legal document. It appears to be a standard employment contract with standard confidentiality and termination clauses.",
                "risk_score": 3,
                "clauses": [
                    {
                        "title": "Confidentiality",
                        "risk_level": "low",
                        "explanation": "Standard confidentiality agreement. You cannot share company secrets."
                    },
                    {
                        "title": "Non-Compete",
                        "risk_level": "high",
                        "explanation": "You are prohibited from working for a competitor for 2 years after termination. This is a high-risk clause."
                    }
                ]
            }

        try:
            print("--- Starting Agentic Workflow ---")
            
            # Step 1: Classify
            doc_type = self.classify_document(text)
            
            # Step 2: Extract
            raw_clauses = self.extract_clauses(text, doc_type)
            
            # Step 3: Analyze each clause
            analyzed_clauses = self.analyze_clauses(raw_clauses)
            
            # Step 4: Final Summary
            final_assessment = self.generate_summary(text, doc_type, analyzed_clauses)
            
            print("--- Agentic Workflow Complete ---")
            
            return {
                "summary": final_assessment.get("summary", "Summary unavailable."),
                "risk_score": final_assessment.get("risk_score", 5),
                "clauses": analyzed_clauses
            }
            
        except Exception as e:
            print(f"Error in AI analysis: {e}")
            raise Exception("AI analysis failed.")

ai_agent = AIAgent()
