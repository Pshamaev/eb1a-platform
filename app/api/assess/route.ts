import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { answers, lang } = await req.json()

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "No API key" }, { status: 500 })
    }

    const langNames: Record<string, string> = {
      en: "English", ru: "Russian", zh: "Chinese", hi: "Hindi", es: "Spanish", pt: "Portuguese"
    }

    const prompt = `You are an expert US immigration attorney specializing in EB-1A Extraordinary Ability and EB-2 NIW (National Interest Waiver) petitions. You have deep knowledge of USCIS Policy Manual Vol. 6 Part F, Matter of Kazarian two-step review, and the Dhanasar three-prong framework for NIW.

A potential client has completed an assessment questionnaire. Analyze their profile and provide a detailed, honest assessment.

CLIENT PROFILE:
- Field: ${answers.field_text || answers.field}
- Experience: ${answers.exp}
- Degree: ${answers.degree}
- Role: ${answers.role_text || answers.role}

EB-1A CRITERIA RESPONSES:
- Awards: ${answers.awards_text || answers.awards}
- Membership in elite associations: ${answers.membership_text || answers.membership}
- Media coverage: ${answers.media_text || answers.media}
- Judging/peer review: ${answers.judging_text || answers.judging}
- Original contributions: ${answers.contributions_text || answers.contributions}
- Publications: ${answers.articles_text || answers.articles}
- Exhibitions: ${answers.exhibitions_text || answers.exhibitions}
- Critical role: ${answers.critical_role_text || answers.critical_role}
- High salary: ${answers.salary}
- Commercial success: ${answers.commercial}

NIW (DHANASAR) RESPONSES:
- Planned US work/endeavor: ${answers.niw_merit_text || answers.niw_merit}
- National importance/beneficiaries: ${answers.niw_importance}
- US positioning evidence: ${answers.niw_positioned_text || answers.niw_positioned}
- Justification for waiver: ${answers.niw_justification_text || answers.niw_justification}

AVAILABLE EVIDENCE: ${answers.evidence}

Respond ONLY in ${langNames[lang] || "English"}.

Provide your analysis in this EXACT JSON format (no markdown, no backticks, pure JSON):
{
  "eb1a_level": "strong" or "moderate" or "weak",
  "niw_level": "strong" or "moderate" or "weak",
  "eb1a_score_explanation": "2-3 sentences explaining the EB1A assessment",
  "niw_score_explanation": "2-3 sentences explaining the NIW assessment",
  "strong_criteria": ["list", "of", "strong", "eb1a", "criteria"],
  "weak_criteria": ["list", "of", "criteria", "needing", "development"],
  "detailed_recommendation": "3-4 sentences with specific actionable advice for this person's situation",
  "next_steps": ["specific step 1", "specific step 2", "specific step 3"],
  "timeline": "Realistic timeline estimate e.g. '6-12 months to strengthen case' or 'Ready to file now'",
  "alternative_visas": ["O-1A" or "EB-2 standard" or "L-1A" or "E-2" etc - only if relevant],
  "evidence_gaps": ["what key evidence is missing"],
  "disclaimer_note": "Short note that this is AI analysis not legal advice"
}`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 1500 }
        })
      }
    )

    if (!response.ok) {
      const err = await response.text()
      console.error("Gemini error:", err)
      return NextResponse.json({ error: "Gemini API error" }, { status: 500 })
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ""

    // Clean and parse JSON
    const cleaned = text.replace(/```json|```/g, "").trim()
    const result = JSON.parse(cleaned)

    return NextResponse.json(result)

  } catch (error) {
    console.error("Assessment API error:", error)
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
  }
}

