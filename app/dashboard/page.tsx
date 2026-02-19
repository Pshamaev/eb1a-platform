"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Circle, FileText, Upload, Users, Send } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const caseProgress = 45 // 0-100

  const eb1aCriteria = [
    { name: "Awards", completed: true, strength: "strong" },
    { name: "Membership", completed: true, strength: "medium" },
    { name: "Published Material", completed: false, strength: "none" },
    { name: "Judging", completed: false, strength: "none" },
    { name: "Original Contributions", completed: true, strength: "strong" },
    { name: "Scholarly Articles", completed: true, strength: "strong" },
    { name: "Critical Employment", completed: true, strength: "medium" },
    { name: "High Remuneration", completed: false, strength: "none" },
    { name: "Commercial Success", completed: false, strength: "none" },
    { name: "Artistic Exhibition", completed: false, strength: "none" },
  ]

  const completedCriteria = eb1aCriteria.filter(c => c.completed).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">CaseBuilder</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">John Doe</span>
            <Button variant="outline" size="sm">Logout</Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My EB1A Case</h1>
          <p className="text-gray-600">Track your progress and complete your petition</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overall Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Case Progress</CardTitle>
                <CardDescription>Complete all steps to generate your petition</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Overall Completion</span>
                    <span className="text-sm font-medium text-blue-600">{caseProgress}%</span>
                  </div>
                  <Progress value={caseProgress} className="h-3" />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{completedCriteria}/10</div>
                    <div className="text-sm text-gray-600">Criteria Completed</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">72</div>
                    <div className="text-sm text-gray-600">Case Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Continue building your case</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/questionnaire">
                  <Button variant="outline" className="w-full justify-start" size="lg">
                    <FileText className="w-5 h-5 mr-3" />
                    Continue Questionnaire
                  </Button>
                </Link>
                <Link href="/evidence">
                  <Button variant="outline" className="w-full justify-start" size="lg">
                    <Upload className="w-5 h-5 mr-3" />
                    Upload Evidence
                  </Button>
                </Link>
                <Link href="/letters">
                  <Button variant="outline" className="w-full justify-start" size="lg">
                    <Users className="w-5 h-5 mr-3" />
                    Generate Letters
                  </Button>
                </Link>
                <Link href="/petition">
                  <Button variant="outline" className="w-full justify-start" size="lg">
                    <Send className="w-5 h-5 mr-3" />
                    Generate Petition
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* EB1A Criteria Checklist */}
            <Card>
              <CardHeader>
                <CardTitle>EB1A Criteria Status</CardTitle>
                <CardDescription>You need at least 3 criteria to qualify</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {eb1aCriteria.map((criterion, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        criterion.completed ? 'bg-green-50' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {criterion.completed ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400" />
                        )}
                        <span className={`font-medium ${
                          criterion.completed ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {criterion.name}
                        </span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        criterion.strength === 'strong' ? 'bg-green-100 text-green-700' :
                        criterion.strength === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {criterion.strength}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Complete Judging Section</p>
                    <p className="text-sm text-gray-600">Add evidence of peer review activities</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Upload More Evidence</p>
                    <p className="text-sm text-gray-600">Strengthen your case with additional documents</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gray-300 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Generate Letters</p>
                    <p className="text-sm text-gray-400">Create recommendation letters (unlocked at 70%)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Case Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Case Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Case Type</span>
                  <span className="font-medium">EB1A</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created</span>
                  <span className="font-medium">Jan 15, 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="font-medium">Today</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Documents</span>
                  <span className="font-medium">12 uploaded</span>
                </div>
              </CardContent>
            </Card>

            {/* Upgrade CTA */}
            <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
              <CardHeader>
                <CardTitle className="text-white">Upgrade to Pro</CardTitle>
                <CardDescription className="text-blue-100">
                  Get expert review and filing services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="secondary" className="w-full">
                  View Plans
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
