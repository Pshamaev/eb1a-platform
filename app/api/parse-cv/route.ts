import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("cv") as File
    const lang = formData.get("lang") as string || "en"

    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "No API key" }, { status: 500 })
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString("base64")
    const mimeType = file.type || "application/pdf"

    const prompt = `You are an expert immigration attorney analyzing a CV/Resume for EB-1A and EB-2 NIW immigration petitions.

Extract information from this CV and map it to the assessment questionnaire fields below.

Return ONLY a JSON object with these exact keys (use null if information not found):

{
  "field": "index of best match: 0=Science/Research, 1=Tech/Engineering, 2=Business/Entrepreneurship, 3=Medical/Healthcare, 4=Arts/Creative, 5=Law/Policy, 6=Finance/Economics, 7=Education",
  "exp": "index: 0=1-3 years, 1=4-7 years, 2=8-15 years, 3=15+ years",
  "degree": "index: 0=Bachelor, 1=Master, 2=PhD/MD/JD, 3=No degree",
  "role": "index: 0=Employee/Specialist, 1=Manager/Team Lead, 2=Director/VP, 3=Founder/Co-Founder, 4=Independent Expert/Consultant",
  "awards": ["array of indices that apply: 0=International award, 1=National award, 2=Regional award, 3=Internal only, 4=None"],
  "membership": "index: 0=competitive/exclusive, 1=open/basic, 2=No, 3=Not sure",
  "media": ["array of indices: 0=National media, 1=International media, 2=Industry media, 3=Press release only, 4=None"],
  "judging": ["array of indices: 0=Journal reviewer, 1=Competition judge, 2=Grant reviewer, 3=Conference committee, 4=Not invited"],
  "contributions": ["array of indices: 0=Patents/standards, 1=Technology adopted, 2=Methodology cited, 3=Open source, 4=None"],
  "articles": ["array of indices: 0=Peer-reviewed journals, 1=Conference proceedings, 2=Industry publications, 3=Books/chapters, 4=No publications"],
  "critical_role": "index: 0=Senior leadership, 1=Director/Head, 2=Founder, 3=Critical technical role, 4=No significant role",
  "salary": "index: 0=Top 5%, 1=Top 10%, 2=Above average, 3=Average, 4=Not sure",
  "field_text": "brief description of their field in English",
  "role_text": "their actual job title from CV",
  "summary": "2-3 sentence summary of their profile for immigration purposes"
}`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64
                }
              },
              { text: prompt }
            ]
          }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 8000 }
        })
      }
    )

    if (!response.ok) {
      const err = await response.text()
      console.error("Gemini CV error:", err)
      return NextResponse.json({ error: "Gemini error" }, { status: 500 })
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ""
   console.log("Gemini raw response:", text.substring(0, 500))
const cleaned = text
    const cleaned = text
  .replace(/```json|```/g, "")
  .replace(/\/\/.*$/gm, "")
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .trim()
    console.log("Gemini raw response:", text.substring(0, 500))
if (!cleaned || cleaned.length < 10) {
  return NextResponse.json({ error: "Empty response" }, { status: 500 })
}
const result = JSON.parse(cleaned)

    return NextResponse.json(result)

  } catch (error) {
    console.error("CV parse error:", error)
    return NextResponse.json({ error: "Parse failed" }, { status: 500 })
  }
}

