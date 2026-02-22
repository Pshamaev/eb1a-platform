import { NextRequest, NextResponse } from "next/server"

const PRODUCTS = {
  build: {
    name: "CaseBuilder Platform — Full Access",
    amount: 49900, // $499
    description: "AI-powered EB1A/NIW petition builder with full case management",
  },
  expert: {
    name: "Attorney Review",
    amount: 29900, // $299
    description: "Professional review of your immigration case by a licensed attorney",
  },
  deep_analysis: {
    name: "Deep AI Analysis",
    amount: 4900, // $49
    description: "Comprehensive AI-powered analysis of your EB1A/NIW case with CV review and full strategy",
  },
}

export async function POST(req: NextRequest) {
  try {
    const { product } = await req.json()
    const secretKey = process.env.STRIPE_SECRET_KEY

    if (!secretKey) {
      return NextResponse.json({ error: "No Stripe key" }, { status: 500 })
    }

    const p = PRODUCTS[product as keyof typeof PRODUCTS]
    if (!p) {
      return NextResponse.json({ error: "Invalid product" }, { status: 400 })
    }

    const origin = req.headers.get("origin") || "https://casebuilder.online"

    const body = new URLSearchParams({
      "payment_method_types[0]": "card",
      "line_items[0][price_data][currency]": "usd",
      "line_items[0][price_data][product_data][name]": p.name,
      "line_items[0][price_data][product_data][description]": p.description,
      "line_items[0][price_data][unit_amount]": String(p.amount),
      "line_items[0][quantity]": "1",
      mode: "payment",
      success_url: product === "deep_analysis" ? `${origin}/deep-analysis?success=true` : `${origin}/assessment?success=true`,
      cancel_url: `${origin}/assessment?canceled=true`,
    })

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error("Stripe error:", err)
      return NextResponse.json({ error: "Stripe error" }, { status: 500 })
    }

    const session = await response.json()
    return NextResponse.json({ url: session.url })

  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 })
  }
}
