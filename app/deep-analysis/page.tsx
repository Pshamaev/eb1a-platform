"use client"
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"
import { useState } from "react"

export default function DeepAnalysisPage() {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: "deep_analysis" }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch (e) {}
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <a href="/assessment" className="font-bold text-slate-800 text-sm hover:text-blue-600">CaseBuilder</a>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Deep AI Analysis</h1>
          <p className="text-slate-600 leading-relaxed">A comprehensive AI-powered evaluation of your immigration case — going far beyond the basic assessment.</p>
        </div>

        {/* What's included */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-4">What's included</h2>
          <div className="space-y-4">
            {[
              { icon: "📄", title: "CV Analysis", desc: "Upload your CV — our AI reads your full professional history and extracts relevant evidence for your case" },
              { icon: "📋", title: "Extended Questionnaire", desc: "Deeper questions tailored to your specific field and profile — far more detailed than the basic assessment" },
              { icon: "⚖️", title: "Full EB1A Criteria Breakdown", desc: "Detailed analysis of all 10 EB1A criteria and all 3 NIW prongs with specific evidence recommendations for each" },
              { icon: "📊", title: "Case Strength Report", desc: "Honest assessment of your chances, what's missing, and what to do next — with specific action items" },
              { icon: "🗺️", title: "Immigration Strategy", desc: "Recommended visa pathway, timeline, and whether to file now or wait until your case is stronger" },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="text-2xl flex-shrink-0">{item.icon}</div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{item.title}</p>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* vs Basic */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-6">
          <h2 className="font-bold text-blue-800 mb-3">Basic vs Deep Analysis</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-bold text-slate-500 uppercase text-xs tracking-wide mb-2">Basic (Free)</p>
              <ul className="space-y-1 text-slate-600">
                <li>✓ 15 questions</li>
                <li>✓ EB1A / NIW score</li>
                <li>✓ 3 next steps</li>
                <li className="text-slate-400">✗ No CV analysis</li>
                <li className="text-slate-400">✗ No detailed breakdown</li>
                <li className="text-slate-400">✗ No strategy</li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-blue-700 uppercase text-xs tracking-wide mb-2">Deep Analysis ($49)</p>
              <ul className="space-y-1 text-slate-700">
                <li>✓ CV upload + analysis</li>
                <li>✓ Extended questionnaire</li>
                <li>✓ All 10 criteria detailed</li>
                <li>✓ Full case strategy</li>
                <li>✓ Timeline & filing advice</li>
                <li>✓ Downloadable report</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
          <p className="text-xs text-amber-800 leading-relaxed">⚠️ This analysis is generated by AI and is for informational purposes only. It does not constitute legal advice. Always consult a licensed US immigration attorney before filing.</p>
        </div>

        {/* CTA */}
        <div className="space-y-3">
          <SignedIn>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-md text-lg disabled:opacity-50"
            >
              {loading ? "Redirecting..." : "Get Deep Analysis — $49"}
            </button>
          </SignedIn>
          <SignedOut>
            <div className="text-center">
              <p className="text-sm text-slate-500 mb-3">Create a free account to get started</p>
              <SignInButton mode="modal">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-md text-lg">
                  Sign Up & Get Deep Analysis — $49
                </button>
              </SignInButton>
            </div>
          </SignedOut>
          <a href="/assessment" className="block text-center text-slate-400 text-sm py-2 hover:text-slate-600">
            ← Back to free assessment
          </a>
        </div>
      </div>
    </div>
  )
}

