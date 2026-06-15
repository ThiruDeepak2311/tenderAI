// src/app/api/qualify/route.ts
// Backend API route that calls Google Gemini to generate a real qualification analysis.

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Free-tier model as of 2026. If this returns quota-0 errors, try "gemini-2.5-flash-lite"
// or "gemini-3-flash" as the next-best alternatives.
const GEMINI_MODEL = "gemini-2.5-flash";

const SYSTEM_PROMPT = `You are an expert Oil & Gas Bid Qualification Agent for McDermott International, working on Landfill Gas-to-Energy (LFGTE) opportunities. Analyze the provided RFP and bidder profile, then assess bid viability.

Respond ONLY in raw JSON (no markdown, no backticks, no preamble). Use this exact structure:

{
  "verdict": {
    "decision": "GO" or "NO-GO" or "CONDITIONAL GO",
    "confidence": <integer 0-100>,
    "overallScore": <integer 0-100>,
    "winProbability": <integer 0-100>,
    "estimatedContractValue": "<USD range, e.g. $20M - $30M>",
    "marginPotential": "<percentage range, e.g. 10% - 14%>"
  },
  "criteria": [
    {"name": "Technical Capability", "score": <int>, "rationale": "<1-2 sentences>"},
    {"name": "Past Project Experience", "score": <int>, "rationale": "<1-2 sentences>"},
    {"name": "Capacity & Bandwidth", "score": <int>, "rationale": "<1-2 sentences>"},
    {"name": "Commercial Fit", "score": <int>, "rationale": "<1-2 sentences>"},
    {"name": "Risk Exposure", "score": <int>, "rationale": "<1-2 sentences>"},
    {"name": "Competitive Landscape", "score": <int>, "rationale": "<1-2 sentences>"},
    {"name": "Strategic Alignment", "score": <int>, "rationale": "<1-2 sentences>"},
    {"name": "Local Content & Compliance", "score": <int>, "rationale": "<1-2 sentences>"}
  ],
  "strengths": ["<5 strengths, each one sentence>"],
  "risks": ["<5 risks, each one sentence>"],
  "conditions": ["<3 conditions to satisfy before bid>"],
  "bidStrategy": "<a 4-5 sentence paragraph recommending the bid approach>",
  "competitors": [
    {"name": "<company>", "strength": "<one phrase>", "threat": "high" or "medium" or "low"}
  ]
}

Be specific and grounded. Reference actual standards (NSPS Subpart WWW, TCEQ, Title V, NACE MR0175) and realistic LFGTE economics.`;

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { tenderContext, bidderProfile } = body;

    if (!tenderContext || !bidderProfile) {
      return NextResponse.json(
        { error: "Missing tenderContext or bidderProfile in request body." },
        { status: 400 }
      );
    }

    const userPrompt = `TENDER CONTEXT:
${tenderContext}

BIDDER PROFILE:
${bidderProfile}

Generate the qualification analysis now.`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        temperature: 0.4,
        responseMimeType: "application/json",
      },
    });

    const result = await model.generateContent(userPrompt);
    const text = result.response.text();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      return NextResponse.json(
        {
          error: "Model returned non-JSON output.",
          raw: text.slice(0, 500),
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ data: parsed, model: GEMINI_MODEL });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Gemini call failed: ${message}` },
      { status: 500 }
    );
  }
}