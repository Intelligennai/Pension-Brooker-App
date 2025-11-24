import { GoogleGenAI } from "@google/genai";
import { SearchResult, GroundingChunk, Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeCompany = async (companyName: string, language: Language): Promise<SearchResult> => {
  try {
    const model = 'gemini-2.5-flash';
    
    const languageInstruction = language === 'da' 
      ? "IMPORTANT: Output the entire response (Analysis and Script) in DANISH." 
      : "Output the response in English.";

    // Context about Ensure to tailor the script
    const callerContext = `
      CONTEXT - CALLER IDENTITY:
      The user is an appointment setter calling on behalf of "Ensure" (ensure.dk), a leading independent insurance and pension broker in Denmark.
      
      Ensure's Key Value Propositions (Use these in Script & Rebuttals):
      1. **Total Independence (Uvildighed)**: We represent the client, not the pension provider (like PFA, Danica, Velliv). We ensure the company gets the best market terms.
      2. **Market Tenders (Udbud)**: We run tenders to force providers to compete, lowering administration fees and insurance premiums.
      3. **360-Degree Overview**: We handle the complexity so the company doesn't have to.
      
      When scripting:
      - The goal is to book a "Pension Review Meeting" or "Market Benchmark".
      - Emphasize that we are NOT a pension provider, but a partner that optimizes their current setup.
    `;

    // Prompt designed to extract specific broker-relevant info and a script
    const prompt = `
      ${languageInstruction}
      ${callerContext}
      
      Act as an elite corporate profiler and pension intelligence analyst.
      Conduct a deep dive research on the company: "${companyName}".
      
      I need you to output a report in Markdown format.
      
      CRITICAL FORMATTING INSTRUCTIONS:
      - Use "### " (H3) headers for every distinct section.
      - Do NOT use "Part 1" or "Part 2" text headers, just use the Separator for the script.
      - Format Key-Value data as "**Key**: Value" (on a new line).

      STRUCTURE:

      ### Executive Summary & Deal Estimate
      - Industry & HQ.
      - **Estimated Employees**: [Number].
      - **Potential Pension Volume**: Estimate the annual pension contribution volume based on employee count * average salary for this industry * 5-10%. Show the math briefly. (e.g. "100 employees x avg 50k salary x 8% = 400k/year volume"). 
      
      ### Key Decision Makers
      Identify specific names and titles of the CEO, CFO, and CHRO/Head of HR.
      **Contact Intelligence**: actively SEARCH for their **public LinkedIn profile URL** or a public business email address.
      Format:
      **Title**: Name (LinkedIn URL / Email if found)

      ### Psychological Profile (C-Level)
      Select the most prominent decision maker found above. Analyze their public presence (LinkedIn style, quotes, interviews).
      - **Likely Personality**: Classify as "Driver (Direct)", "Analytical (Data-focus)", "Expressive (Visionary)", or "Amiable (People-first)".
      - **Recommended Approach**: How to speak to them? (e.g., "Be brief and focus on ROI" or "Build rapport and talk about employee wellbeing").
      
      ### The Golden Hook (Icebreaker)
      Find ONE specific, non-business fact about the company leaders or recent company achievement that proves you did research. 
      (e.g., "CEO recently ran the Copenhagen Marathon", "Company won a specific CSR award", "CFO was on a podcast about Fintech").
      *If nothing specific is found, use a recent specific news article.*

      ### Pension & Benefits Intelligence
      - **Collective Agreement vs. Independent**: Investigate if the company follows a Collective Bargaining Agreement (CBA) or uses independent solutions. Look for keywords in job postings like "Union benefits", "Collective agreement", or specific plan names.
      - **Current Provider Signals**: Attempt to identify who holds their pensions today (e.g., looking for "401k via Fidelity", "Pension via Alecta/Allianz" in careers pages or annual reports).
      
      ### Pain Point Hypothesis
      Specific to their likely pension setup. (e.g., "If Collective: Hard to offer competitive perks to top talent. If Independent: High administrative burden/fees").

      ---SCRIPT_SECTION---
      
      ### Tailored Call Script (Representing Ensure)
      
      **The "Golden Hook" Opener**: Start the script referencing the specific "Golden Hook" identified above to break the ice immediately.
      
      **The Bridge**: Connect the hook to Ensure's value (Independence/Overview). "We help companies like [Company Name] ensure they aren't overpaying..."
      
      **The Pitch**: Briefly mention how Ensure runs market tenders to optimize terms without changing the underlying need for a pension.
      
      **Call to Action**: A low-friction ask for a "Market Benchmark Meeting" to see if they are competitive.
      
      Tone: Match the "Recommended Approach" identified in the Psychological Profile.

      ### Objection Handling (Ensure Strategy)
      Identify 3 likely objections specifically tailored to the identified pension setup (e.g., Collective Agreement vs. Independent).
      
      - If **Collective Agreement**: Focus on objections like "We are locked into a union agreement." 
        - *Rebuttal Strategy*: Ensure can still optimize the "Executive Top-Up" or "Health Insurance" layers that sit *outside* the collective agreement.
      - If **Independent**: Focus on objections like "We are happy with Danica/Velliv."
        - *Rebuttal Strategy*: "That's great, but when was the last time you had an independent broker benchmark their fees against the market? We often find savings of 10-20%."
      
      Format:
      **Objection**: [Objection wording]
      **Rebuttal**: [What to say]
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const fullText = response.text || "No analysis generated.";
    
    // Split insights and script
    const parts = fullText.split('---SCRIPT_SECTION---');
    const insights = parts[0].trim();
    const script = parts.length > 1 ? parts[1].trim() : "Script generation failed. Please try again.";

    // Extract grounding chunks for citations
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const validChunks: GroundingChunk[] = chunks.filter((c: any) => c.web && c.web.uri && c.web.title);

    return {
      insights,
      script,
      groundingChunks: validChunks,
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze company. Please check your API key and try again.");
  }
};