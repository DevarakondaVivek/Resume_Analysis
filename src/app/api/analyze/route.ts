import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(request: NextRequest) {
  try {
    const { resumeText, jobDescription } = await request.json();

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: 'Both resume text and job description are required.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI service is not configured. Please set GROQ_API_KEY.' },
        { status: 500 }
      );
    }

    const groq = new Groq({ apiKey });

    const prompt = `You are an expert career coach and resume analyst. Analyze the following resume against the provided job description.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Provide your analysis in the following JSON format ONLY:
{
  "matchScore": <number between 0-100>,
  "summary": "<2-3 sentence overview of the match quality>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "skillGaps": [
    {
      "skill": "<missing skill name>",
      "importance": "<high|medium|low>",
      "description": "<brief explanation of why this matters>"
    }
  ],
  "optimizedBullets": [
    {
      "original": "<original bullet point from resume>",
      "actionRequired": "<explicit instruction on what the user needs to do (e.g., 'Add a specific metric for X' or 'Specify the framework used for Y')>",
      "example": "<a brief example of how it might look after applying the action>"
    }
  ],
  "suggestions": ["<actionable suggestion 1>", "<actionable suggestion 2>"]
}

Be specific, actionable, and honest in your assessment. DO NOT just rewrite their resume for them. Explicitly tell the user WHAT they need to do from their side. Focus on the most impactful improvements.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
    });
    const text = chatCompletion.choices[0]?.message?.content || "";

    // Parse JSON from the response (handle potential markdown wrapping)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }

    const analysisResult = JSON.parse(jsonMatch[0]);
    return NextResponse.json(analysisResult);
  } catch (error: any) {
    console.error('Analysis error:', error);

    // Check if this is a Groq AI quota error
    if (error.status === 429 || (error.message && error.message.includes('429'))) {
      console.warn('API Quota Exceeded. Falling back to Demo Mode.');
      return NextResponse.json({
        matchScore: 68,
        summary: "[DEMO MODE - API Quota Exceeded] This is a sample analysis because your Groq API key has hit its limit. Your resume outlines good foundational experience, but tailoring it by adding quantifiable metrics and ensuring core skills explicitly match the job description will greatly improve your ATS ranking.",
        strengths: [
          "Clear chronological progression of roles",
          "Good foundational technical background"
        ],
        skillGaps: [
          {
            skill: "Specific Frameworks",
            importance: "high",
            description: "The job requires specific frameworks that are implied but not explicitly stated in your experience."
          },
          {
            skill: "Cloud Deployment",
            importance: "medium",
            description: "No mention of AWS, GCP, or Azure experience which is commonly required for this level."
          }
        ],
        optimizedBullets: [
          {
            original: "Worked on backend API development for the main product.",
            actionRequired: "Specify the exact frameworks, databases, and languages you used. Add a quantifiable metric showing the impact of your API (e.g., improved response time by X%, or handled Y requests per day).",
            example: "Architected scalable RESTful APIs using Node.js and PostgreSQL, improving system response time by 25%."
          },
          {
            original: "Helped fix bugs and maintain the database.",
            actionRequired: "Replace the passive verb 'Helped' with a strong action verb like 'Optimized' or 'Resolved'. State exactly what kind of bugs you fixed and what the result of that maintenance was (e.g., uptime percentage).",
            example: "Optimized complex SQL queries and resolved critical bottlenecks, ensuring 99.9% uptime."
          }
        ],
        suggestions: [
          "Add a 'Skills' section near the top filled with exact keyword matches from the job description.",
          "Quantify your achievements with numbers, percentages, or dollar amounts wherever possible.",
          "Ensure your most relevant experience is placed on the first page.",
          "(Note: To get real AI feedback, please use a working Groq API key.)"
        ]
      });
    }

    return NextResponse.json(
      { error: 'Failed to analyze resume. Please try again.' },
      { status: 500 }
    );
  }
}
