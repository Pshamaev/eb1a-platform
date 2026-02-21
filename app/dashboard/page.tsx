"use client"

import { useUser, SignedOut, SignInButton } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const EB1A_CRITERIA = [
  { key: "awards", name: "Awards" },
  { key: "membership", name: "Membership" },
  { key: "media", name: "Published Material" },
  { key: "judging", name: "Judging" },
  { key: "contributions", name: "Original Contributions" },
  { key: "articles", name: "Scholarly Articles" },
  { key: "critical_role", name: "Critical Employment" },
  { key: "salary", name: "High Remuneration" },
  { key: "commercial", name: "Commercial Success" },
  { key: "exhibitions", name: "Artistic Exhibition" },
]

export default function Dashboard() {
  const { user, isLoaded } = useUser()
  const [assessments, setAssessments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any>(null)

  useEffect(() => {
    if (!user) return
    const fetchData = async () => {
      const { data } = await supabase
        .from("assessments")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
      setAssessments(data || [])
      if (data && data.length > 0) setSelected(data[0])
      setLoading(false)
    }
    fetchData()
  }, [user])

  if (!isLoaded) return null

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Please sign in to view your dashboard</p>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold">Sign In</button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    )
  }

  const r = selected?.ai_result
  const strongCriteria = r?.strong_criteria || []
  const weakCriteria = r?.weak_criteria || []

  const criteriaStatus = EB1A_CRITERIA.map(c => ({
    name: c.name,
    completed: strongCriteria.some((s: string) => s.toLowerCase().includes(c.name.toLowerCase().split(" ")[0])),
    strength: strongCriteria.some((s: string) => s.toLowerCase().includes(c.name.toLowerCase().split(" ")[0])) ? "strong" :
              weakCriteria.some((w: string) => w.toLowerCase().includes(c.name.toLowerCase().split(" ")[0])) ? "medium" : "none"
  }))

  const completedCount = criteriaStatus.filter(c => c.completed).length
  const caseProgress = selected ? Math.min(100, Math.round((completedCount / 10) * 100 + (r?.eb1a_level === "strong" ? 20 : r?.eb1a_level === "moderate" ? 10 : 0))) : 0

  const lc = (l: string) => l === "strong" ? "text-emerald-700 bg-emerald-50 border-emerald-200" :
    l === "moderate" ? "text-amber-700 bg-amber-50 border-amber-200" : "text-red-600 bg-red-50 border-red-200"
  const lt = (l: string) => l === "strong" ? "Strong" : l === "moderate" ? "Moderate" : "Weak"

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <a href="/assessment" className="text-xl font-bold text-gray-900 hover:text-blue-600">CaseBuilder</a>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{user.emailAddresses[0]?.emailAddress}</span>
            <a href="/assessment" className="text-sm text-blue-600 hover:text-blue-700 font-medium">+ New Assessment</a>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My EB1A Case</h1>
            <p className="text-gray-600">Track your progress and complete your petition</p>
          </div>
          {assessments.length > 1 && (
            <select
              className="text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-400"
              onChange={e => setSelected(assessments[parseInt(e.target.value)])}
            >
              {assessments.map((a, i) => (
                <option key={a.id} value={i}>
                  Assessment #{assessments.length - i} — {new Date(a.created_at).toLocaleDateString()}
                </option>
              ))}
            </select>
          )}
        </div>

        {loading ? (
          <div className="flex items-center gap-3 py-20 justify-center">
            <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            <span className="text-slate-500">Loading your data...</span>
          </div>
        ) : assessments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
            <p className="text-slate-600 font-medium mb-2">No assessments yet</p>
            <p className="text-slate-400 text-sm mb-6">Complete your first assessment to see results here</p>
            <a href="/assessment" className="bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-blue-700">
              Start Free Assessment
            </a>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h2 className="font-bold text-gray-900 mb-1">Case Progress</h2>
                <p className="text-sm text-gray-500 mb-4">Based on your latest assessment</p>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Overall Completion</span>
                    <span className="text-sm font-medium text-blue-600">{caseProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3">
                    <div className="bg-blue-600 h-3 rounded-full transition-all" style={{ width: `${caseProgress}%` }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">{completedCount}/10</div>
                    <div className="text-sm text-gray-600">Criteria Met</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl">
                    <div className="flex gap-2 flex-wrap mt-1">
                      {r?.eb1a_level && <span className={`text-xs font-bold px-2 py-1 rounded-full border ${lc(r.eb1a_level)}`}>EB1A: {lt(r.eb1a_level)}</span>}
                      {r?.niw_level && <span className={`text-xs font-bold px-2 py-1 rounded-full border ${lc(r.niw_level)}`}>NIW: {lt(r.niw_level)}</span>}
                    </div>
                    <div className="text-sm text-gray-600 mt-2">AI Assessment</div>
                  </div>
                </div>
              </div>

              {r?.detailed_recommendation && (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                  <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-2">AI Recommendation</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{r.detailed_recommendation}</p>
                </div>
              )}

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h2 className="font-bold text-gray-900 mb-1">EB1A Criteria Status</h2>
                <p className="text-sm text-gray-500 mb-4">You need at least 3 criteria to qualify</p>
                <div className="space-y-3">
                  {criteriaStatus.map((criterion, index) => (
                    <div key={index} className={`flex items-center justify-between p-3 rounded-xl ${criterion.completed ? "bg-green-50" : "bg-gray-50"}`}>
                      <div className="flex items-center gap-3">
                        {criterion.completed ? (
                          <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                          </svg>
                        )}
                        <span className={`font-medium text-sm ${criterion.completed ? "text-gray-900" : "text-gray-500"}`}>{criterion.name}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        criterion.strength === "strong" ? "bg-green-100 text-green-700" :
                        criterion.strength === "medium" ? "bg-yellow-100 text-yellow-700" :
                        "bg-gray-100 text-gray-400"}`}>
                        {criterion.strength}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {r?.next_steps?.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <h2 className="font-bold text-gray-900 mb-4">Next Steps</h2>
                  <div className="space-y-3">
                    {r.next_steps.slice(0, 3).map((step: string, i: number) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</div>
                        <p className="text-sm text-gray-700">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h2 className="font-bold text-gray-900 mb-4">Case Summary</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Assessments</span>
                    <span className="font-medium">{assessments.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Updated</span>
                    <span className="font-medium">{selected ? new Date(selected.created_at).toLocaleDateString() : "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Language</span>
                    <span className="font-medium uppercase">{selected?.lang || "—"}</span>
                  </div>
                  {r?.timeline && (
                    <div className="pt-2 border-t border-slate-100">
                      <p className="text-gray-500 mb-1">Timeline</p>
                      <p className="font-medium text-gray-700">{r.timeline}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
                <h2 className="font-bold text-white mb-1">Get Expert Review</h2>
                <p className="text-blue-100 text-sm mb-4">Have a licensed attorney review your case</p>
                <a href="/assessment" className="block w-full text-center bg-white text-blue-600 text-sm font-bold py-2.5 rounded-xl hover:bg-blue-50">
                  Attorney Review — $149
                </a>
              </div>

              <a href="/assessment" className="block w-full text-center bg-white border border-slate-200 text-slate-700 text-sm font-semibold py-3 rounded-xl hover:bg-slate-50 shadow-sm">
                + New Assessment
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
