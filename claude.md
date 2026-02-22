1. Three-Layer Software Architecture

The project follows the "Vibe Coding" architecture to ensure the AI agent builds with structure and logic:

Layer 1: Directives: This layer provides instructions on where to store specific files (backend, frontend, execution logs) to keep the project organized as it scales.

Layer 2: Orchestration: This layer defines the "thinking" process, instructing the AI on how to handle logic, such as how to parse a PDF before sending it to the LLM for analysis.

Layer 3: Execution: These are the specific instructions for the AI to perform tasks, such as "integrate the PDF-parsing library" or "connect the Firebase database".

2. Operational Architecture (Tech Stack)

This architecture ensures the app is production-ready and scalable:

Frontend: React or Next.js (via Antigravity) for a responsive, fast user interface.

Backend & Persistence: Firebase for real-time data storage, ensuring resume analysis history is saved between sessions.

Authentication: Firebase Auth (Model Context Protocol) to handle Google Sign-In and email/password accounts.

AI Engine: Gemini 3 Pro or Claude 4.5 Opus to perform the heavy lifting of semantic analysis and resume-to-job-description matching.

Hosting: Firebase Hosting for a live, public URL.

3. Functional Features

Smart Parsing: Extracts text from .pdf and .docx files accurately.

Match Scoring: Provides a percentage score based on how well the resume matches the specific job description provided.

Skill Gap Analysis: Highlights missing hard skills or certifications found in the job description but not in the resume.

Bullet-Point Optimizer: Generates AI-suggested rewrites for existing bullet points to make them more impactful and "keyword-rich."

History Dashboard: Allows logged-in users to revisit previous analyses and track their improvement over time.

4. User Interface (UI) Components

The UI is designed to be minimal and professional, focusing on clear calls to action:

Landing/Login Page: A clean entry point with "Sign in with Google" or email options.

Upload Zone: A drag-and-drop area for resumes and a text area for pasting job descriptions.

Analysis Dashboard: A split-screen view showing the original resume on one side and the AI's "Resume Score" and "Improvement Suggestions" on the other.

Visual Indicators: Color-coded status bars (Red/Yellow/Green) for match percentages to provide immediate feedback.