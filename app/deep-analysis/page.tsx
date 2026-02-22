"use client"
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs"
import { useState, useEffect } from "react"

export default function DeepAnalysisPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { user } = useUser()

  // CV upload states
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [cvParsing, setCvParsing] = useState(false)
  const [cvParsed, setCvParsed] = useState(false)
  const [cvText, setCvText] = useState("")

  // Form states
  const [form, setForm] = useState({
    current_status: "",
    us_plans: "",
    target_visa: "",
    timeline: "",
    strongest_evidence: "",
    weakest_area: "",
    previous_applications: "",
    additional_info: "",
  })

  // Analysis states
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("success") === "true") setSuccess(true)
  }, [])

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

  const handleCvUpload = async (file: File) => {
    setCvFile(file)
    setCvParsing(true)
    try {
      const formData = new FormData()
      formData.append("cv", file)
      formData.append("lang", "en")
      const res = await fetch("/api/parse-cv", { method: "POST", body: formData })
      if (res.ok) {
        const data = await res.json()
        if (data.summary) setCvText(data.summary)
        setCvParsed(true)
      }
    } catch (e) {}
    setCvParsing(false)
  }

  const handleAnalyze = async () => {
    setAnalyzing(true)
    try {
      const res = await fetch("/api/deep-assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form, cvText, userId: user?.id }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setResult(data)
    } catch (e) {
      setError(true)
    }
    setAnalyzing(false)
  }

  const formOk = form.current_status && form.us_plans && form.target_visa && form.strongest_evidence

  // LANDING PAGE (before payment)
  if (!success) return (
    <div className="min-h-screen bg-slate-50">
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
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Deep AI Analysis</h1>
          <p className="text-slate-600 leading-relaxed">A comprehensive AI-powered evaluation of your immigration case — going far beyond the basic assessment.</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-4">What's included</h2>
          <div className="space-y-4">
            {[
              { icon: "📄", title: "CV Analysis", desc: "Upload your CV — our AI reads your full professional history and extracts relevant evidence" },
              { icon: "📋", title: "Extended Questionnaire", desc: "Deeper questions tailored to your specific field and immigration goals" },
              { icon: "⚖️", title: "Full EB1A Criteria Breakdown", desc: "Detailed analysis of all 10 EB1A criteria and all 3 NIW prongs with specific evidence recommendations" },
              { icon: "📊", title: "Case Strength Report", desc: "Honest assessment of your chances, what's missing, and what to do next" },
              { icon: "🗺️", title: "Immigration Strategy", desc: "Recommended visa pathway, timeline, and whether to file now or build your case further" },
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
                <li>✓ Saved to your dashboard</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
          <p className="text-xs text-amber-800 leading-relaxed">⚠️ This analysis is generated by AI and is for informational purposes only. It does not constitute legal advice. Always consult a licensed US immigration attorney before filing.</p>
        </div>

        <div className="space-y-3">
          <SignedIn>
            <button onClick={handleCheckout} disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-md text-lg disabled:opacity-50">
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
          <a href="/assessment" className="block text-center text-slate-400 text-sm py-2 hover:text-slate-600">← Back to free assessment</a>
        </div>
      </div>
    </div>
  )

  // AFTER PAYMENT — show form or result
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <a href="/assessment" className="font-bold text-slate-800 text-sm hover:text-blue-600">CaseBuilder</a>
        </div>
        <a href="/dashboard" className="text-xs text-blue-600 hover:text-blue-700 font-medium">My Dashboard</a>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {!result ? (
          <>
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-8 flex items-center gap-3">
              <span className="text-green-600 text-xl">✓</span>
              <div>
                <p className="font-semibold text-green-800 text-sm">Payment successful!</p>
                <p className="text-green-700 text-xs">Complete the form below to get your Deep AI Analysis</p>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-2">Deep AI Analysis</h1>
            <p className="text-slate-500 text-sm mb-8">Answer these questions as thoroughly as possible — the more detail you provide, the better the analysis.</p>

            {/* CV Upload */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-5 shadow-sm">
              <h2 className="font-bold text-slate-900 mb-1">Step 1 — Upload Your CV</h2>
              <p className="text-sm text-slate-500 mb-4">Our AI will extract your professional history and evidence automatically</p>
              {cvParsing ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                  <span className="text-slate-600 text-sm">Reading your CV...</span>
                </div>
              ) : cvParsed ? (
                <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-green-700 text-sm font-medium">CV uploaded and analyzed — {cvFile?.name}</span>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <div className="border-2 border-dashed border-slate-200 rounded-xl px-6 py-6 hover:border-blue-400 hover:bg-blue-50 transition-all text-center">
                    <p className="text-slate-500 text-sm">📎 Click to upload CV</p>
                    <p className="text-slate-400 text-xs mt-1">PDF or DOCX · Max 10MB</p>
                  </div>
                  <input type="file" accept=".pdf,.docx" className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) handleCvUpload(f) }} />
                </label>
              )}
            </div>

            {/* Extended Form */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-5 shadow-sm">
              <h2 className="font-bold text-slate-900 mb-4">Step 2 — Your Immigration Profile</h2>
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-bold text-slate-700 block mb-2">Current immigration status in the US *</label>
                  <select value={form.current_status} onChange={e => setForm(p => ({ ...p, current_status: e.target.value }))}
                    className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-400">
                    <option value="">Select...</option>
                    <option>F-1 (Student)</option>
                    <option>H-1B (Work)</option>
                    <option>L-1 (Intracompany)</option>
                    <option>O-1 (Extraordinary)</option>
                    <option>J-1 (Exchange)</option>
                    <option>Green Card holder</option>
                    <option>Outside the US</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700 block mb-2">Target visa / green card *</label>
                  <select value={form.target_visa} onChange={e => setForm(p => ({ ...p, target_visa: e.target.value }))}
                    className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-400">
                    <option value="">Select...</option>
                    <option>EB-1A (Extraordinary Ability)</option>
                    <option>EB-2 NIW (National Interest Waiver)</option>
                    <option>Both — not sure which</option>
                    <option>O-1A first, then EB-1A</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700 block mb-2">Describe your planned work or contribution in the US *</label>
                  <textarea value={form.us_plans} onChange={e => setForm(p => ({ ...p, us_plans: e.target.value }))}
                    placeholder="What will you do in the US? What impact will it have? Be as specific as possible..."
                    rows={4} className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:border-blue-400" />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700 block mb-2">Your strongest evidence *</label>
                  <textarea value={form.strongest_evidence} onChange={e => setForm(p => ({ ...p, strongest_evidence: e.target.value }))}
                    placeholder="List your strongest achievements — awards, publications, patents, media coverage, key roles..."
                    rows={4} className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:border-blue-400" />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700 block mb-2">Weakest area / what's missing</label>
                  <textarea value={form.weakest_area} onChange={e => setForm(p => ({ ...p, weakest_area: e.target.value }))}
                    placeholder="What evidence do you feel is weak or missing? Any concerns about your case?"
                    rows={3} className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:border-blue-400" />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700 block mb-2">Previous immigration applications</label>
                  <textarea value={form.previous_applications} onChange={e => setForm(p => ({ ...p, previous_applications: e.target.value }))}
                    placeholder="Any previous visa applications, RFEs, denials? Current employer sponsorship plans?"
                    rows={2} className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:border-blue-400" />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700 block mb-2">Preferred filing timeline</label>
                  <select value={form.timeline} onChange={e => setForm(p => ({ ...p, timeline: e.target.value }))}
                    className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-400">
                    <option value="">Select...</option>
                    <option>ASAP — as soon as possible</option>
                    <option>3–6 months</option>
                    <option>6–12 months</option>
                    <option>1–2 years</option>
                    <option>Not sure</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700 block mb-2">Anything else you want the AI to know</label>
                  <textarea value={form.additional_info} onChange={e => setForm(p => ({ ...p, additional_info: e.target.value }))}
                    placeholder="Any additional context, unique circumstances, or specific questions..."
                    rows={3} className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:border-blue-400" />
                </div>
              </div>
            </div>

            {analyzing ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-600 font-medium">AI is analyzing your case...</p>
                <p className="text-slate-400 text-sm mt-1">This takes about 30 seconds</p>
              </div>
            ) : (
              <button onClick={handleAnalyze} disabled={!formOk}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-md text-lg disabled:opacity-40 disabled:cursor-not-allowed">
                Analyze My Case
              </button>
            )}

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-700">Analysis failed. Please try again or contact support.</p>
              </div>
            )}
          </>
        ) : (
          // RESULT
          <div>
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
              <span className="text-green-600 text-xl">✓</span>
              <p className="font-semibold text-green-800 text-sm">Your Deep AI Analysis is ready!</p>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-6">Deep Analysis Result</h1>

            {/* Scores */}
            <div className="grid gap-3 mb-5">
              {[{ label: "EB1A", level: result.eb1a_level, explanation: result.eb1a_score_explanation },
                { label: "NIW", level: result.niw_level, explanation: result.niw_score_explanation }].map(item => {
                const lc = item.level === "strong" ? "text-emerald-700 bg-emerald-50 border-emerald-200" : item.level === "moderate" ? "text-amber-700 bg-amber-50 border-amber-200" : "text-red-600 bg-red-50 border-red-200"
                const lt = item.level === "strong" ? "Strong" : item.level === "moderate" ? "Moderate" : "Weak"
                return (
                  <div key={item.label} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-slate-800">{item.label}</p>
                      <span className={`text-sm font-bold px-4 py-1.5 rounded-full border ${lc}`}>{lt}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.explanation}</p>
                  </div>
                )
              })}
            </div>

            {/* Criteria breakdown */}
            {result.criteria_breakdown && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-5 shadow-sm">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">All 10 EB1A Criteria</p>
                <div className="space-y-3">
                  {Object.entries(result.criteria_breakdown).map(([k, v]: any) => (
                    <div key={k} className="flex items-start gap-3">
                      <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${v.level === "strong" ? "bg-emerald-500" : v.level === "moderate" ? "bg-amber-400" : "bg-red-400"}`} />
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{k}</p>
                        <p className="text-xs text-slate-500">{v.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendation */}
            {result.detailed_recommendation && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-5">
                <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-2">Recommendation</p>
                <p className="text-sm text-slate-700 leading-relaxed">{result.detailed_recommendation}</p>
              </div>
            )}

            {/* Strategy */}
            {result.strategy && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-5 shadow-sm">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Immigration Strategy</p>
                <p className="text-sm text-slate-700 leading-relaxed">{result.strategy}</p>
              </div>
            )}

            {/* Next steps */}
            {result.next_steps?.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-5 shadow-sm">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">Next Steps</p>
                <ol className="space-y-2">
                  {result.next_steps.map((step: string, i: number) => (
                    <li key={i} className="flex gap-3 text-sm text-slate-700">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Evidence gaps */}
            {result.evidence_gaps?.length > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-6">
                <p className="text-xs font-bold text-orange-700 uppercase tracking-wide mb-2">Missing Evidence</p>
                <ul className="space-y-1">
                  {result.evidence_gaps.map((g: string) => (
                    <li key={g} className="text-xs text-orange-800 flex gap-2"><span>•</span>{g}</li>
                  ))}
                </ul>
              </div>
            )}

            <a href="/dashboard" className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-md text-sm">
              View My Dashboard →
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
