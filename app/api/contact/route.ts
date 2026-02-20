import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { name, email, message, lang } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    // Send via email using a simple SMTP-free approach with Resend or similar
    // For now we use a simple fetch to a mail service
    const emailBody = `
New message from CaseBuilder.online

Name: ${name}
Email: ${email}
Language: ${lang || "unknown"}

Message:
${message}

---
Sent from casebuilder.online contact form
    `.trim()

    // Use Resend API (free tier: 3000 emails/month)
    const resendKey = process.env.RESEND_API_KEY
    
    if (!resendKey) {
      // Fallback: just log it
      console.log("Contact form submission:", { name, email, message })
      return NextResponse.json({ ok: true })
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "CaseBuilder <noreply@casebuilder.online>",
        to: ["platon@platon.law"],
        reply_to: email,
        subject: `CaseBuilder: New message from ${name}`,
        text: emailBody
      })
    })

    if (!res.ok) {
      console.error("Resend error:", await res.text())
    }

    return NextResponse.json({ ok: true })

  } catch (error) {
    console.error("Contact error:", error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

