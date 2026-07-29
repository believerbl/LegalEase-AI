# Hackathon Submission Checklist & Guide 🏆

Before you click "Final Submit", ensure you have checked off everything on this list.

## 1. 🌐 Live Deployed Application
Your code is ready for deployment.
- **Backend**: Sign up for [Render](https://render.com), click "New Web Service", and link this GitHub repository. Render will automatically read the `render.yaml` file and deploy the FastAPI backend.
- **Frontend**: Sign up for [Vercel](https://vercel.com), click "Add New Project", and link this GitHub repository. Set the Framework Preset to Next.js. **Crucial:** In the Environment Variables section, add `NEXT_PUBLIC_API_URL` and set it to your deployed Render URL (e.g., `https://legalease-backend.onrender.com`).

## 2. 🐙 Public GitHub Repository
- Ensure your repository is set to **Public**.
- Ensure the `README.md` and `CODEX_USAGE.md` files are present at the root of the repository. (I have already generated these for you).
- **Important**: In the `README.md`, the Live Demo and Video links are currently hidden as HTML comments (`<!-- -->`). Remember to uncomment them and add your actual links once your deployment and video are ready!

## 3. 📄 Google Doc Template
Copy and paste this template into your final Google Doc submission:

> **Project Name:** LegalEase AI - Indian Legal Document Assistant
> 
> **Track:** [Insert Your Track Here, e.g., AI/Agentic, Legal Tech]
> 
> **Problem Statement:**
> Complex legal documents (like NDAs, employment contracts, and leases) are filled with dense legalese that average citizens cannot easily understand. This leads to people signing unfair terms without realizing the risks involved. There is a critical need for an accessible tool that can translate legal jargon into plain English and automatically flag high-risk clauses.
> 
> **Technical Stack:**
> - **Frontend:** Next.js 14, Tailwind CSS, Framer Motion
> - **Backend:** FastAPI (Python), PyMuPDF
> - **AI Engine:** OpenAI API (GPT-4o-mini)
> - **Database:** Supabase (PostgreSQL)
> - **Deployment:** Vercel & Render
> 
> **GitHub Repo:** [Insert Repo Link]
> **Live Demo:** [Insert Vercel Link]
> **Video Demo:** [Insert YouTube Link]

## 4. 🎥 3-Minute Demo Video Guide
A great demo video is critical. Follow this script outline to maximize your score:
1. **0:00 - 0:30 (The Pitch)**: Introduce yourself, the problem (legalese is confusing), and introduce LegalEase AI.
2. **0:30 - 1:30 (The Demo)**: Show the Live Frontend. Upload a sample document (like the SRS). Show how fast the UI reacts.
3. **1:30 - 2:15 (The Agentic Workflow)**: Explain *how* it works. Don't just say "it uses GPT." Explain the multi-step backend process: "Our AI agent first classifies the document, then strategically extracts clauses, analyzes them individually for risk, and finally synthesizes a summary." (This scores huge points).
4. **2:15 - 2:45 (Codex Usage)**: Show your code. Briefly explain how you used Codex (me!) to plan the architecture, generate the React components, and build the agentic pipeline. (Crucial for the 15% rubric).
5. **2:45 - 3:00 (Conclusion)**: Show the final risk score in the UI. Thank the judges.

## 5. 🛑 The Final Step
Go to the hackathon platform. Paste your Google Doc link, your GitHub link, and your Demo link. **Click "Final Submit"**. Do not leave it in draft mode!
