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
            # In a real scenario, you might want to chunk the text if it's too long,
            # but for this MVP, we'll send a truncated version if it exceeds limits.
            truncated_text = text[:15000] # roughly 3000-4000 tokens
            
            prompt = f"""
            You are an expert legal AI assistant. Analyze the following legal document and provide a structured JSON response.
            
            Document Text:
            {truncated_text}
            
            Tasks:
            1. Provide an overall summary of the document in plain English (2-3 sentences).
            2. Give an overall risk score from 1 (lowest risk) to 10 (highest risk) for a typical individual signing this.
            3. Identify the 3 to 5 most important clauses. For each clause provide:
                - title (e.g., "Non-Compete", "Termination")
                - risk_level ("low", "medium", or "high")
                - explanation (A simple, plain-English explanation of what this clause means and why it matters)
                
            Respond ONLY with a valid JSON object matching this schema:
            {{
                "summary": "...",
                "risk_score": 5,
                "clauses": [
                    {{"title": "...", "risk_level": "...", "explanation": "..."}}
                ]
            }}
            """

            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                response_format={ "type": "json_object" },
                temperature=0.2
            )
            
            result = json.loads(response.choices[0].message.content)
            return result
            
        except Exception as e:
            print(f"Error in AI analysis: {e}")
            raise Exception("AI analysis failed.")

ai_agent = AIAgent()
