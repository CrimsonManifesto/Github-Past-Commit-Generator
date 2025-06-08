"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, Copy, Download, GitBranch } from "lucide-react"

interface ContributionDay {
  date: string
  count: number
  selected: boolean
}

export default function GitHubTimeTravelApp() {
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set())
  const [showScript, setShowScript] = useState(false)

  // Generate contribution graph data for the past year
  const contributionData = useMemo(() => {
    const data: ContributionDay[] = []
    const today = new Date()
    const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())

    for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0]
      data.push({
        date: dateStr,
        count: Math.floor(Math.random() * 5), // Random contribution count 0-4
        selected: selectedDates.has(dateStr),
      })
    }

    return data
  }, [selectedDates])

  // Group data by weeks for display
  const weeklyData = useMemo(() => {
    const weeks: ContributionDay[][] = []
    let currentWeek: ContributionDay[] = []

    contributionData.forEach((day, index) => {
      const dayOfWeek = new Date(day.date).getDay()

      if (index === 0) {
        // Fill empty days at the beginning of first week
        for (let i = 0; i < dayOfWeek; i++) {
          currentWeek.push({ date: "", count: 0, selected: false })
        }
      }

      currentWeek.push(day)

      if (currentWeek.length === 7) {
        weeks.push(currentWeek)
        currentWeek = []
      }
    })

    // Add remaining days to last week
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push({ date: "", count: 0, selected: false })
      }
      weeks.push(currentWeek)
    }

    return weeks
  }, [contributionData])

  const toggleDate = (date: string) => {
    if (!date) return

    const newSelected = new Set(selectedDates)
    if (newSelected.has(date)) {
      newSelected.delete(date)
    } else {
      newSelected.add(date)
    }
    setSelectedDates(newSelected)
  }

  const getContributionColor = (count: number, selected: boolean) => {
    if (selected) return "bg-purple-600 border-purple-700"
    if (count === 0) return "bg-gray-100 border-gray-200"
    if (count === 1) return "bg-green-200 border-green-300"
    if (count === 2) return "bg-green-300 border-green-400"
    if (count === 3) return "bg-green-500 border-green-600"
    return "bg-green-700 border-green-800"
  }

  const generateScript = () => {
    const sortedDates = Array.from(selectedDates).sort()

    const script = `#!/bin/bash
# GitHub Time Travel Script
# This script creates fake commits for selected dates

# Make sure you're in a git repository
if [ ! -d ".git" ]; then
    echo "Error: Not a git repository. Run 'git init' first."
    exit 1
fi

echo "Creating fake commits for ${sortedDates.length} selected dates..."

${sortedDates
  .map(
    (date) => `
# Commit for ${date}
echo "Fake commit for ${date}" > temp_file_${date.replace(/-/g, "")}.txt
git add temp_file_${date.replace(/-/g, "")}.txt
GIT_AUTHOR_DATE="${date}T12:00:00" GIT_COMMITTER_DATE="${date}T12:00:00" git commit -m "Time travel commit for ${date}"
rm temp_file_${date.replace(/-/g, "")}.txt`,
  )
  .join("\n")}

echo "✅ Created ${sortedDates.length} fake commits!"
echo "📝 Remember to push your changes: git push origin main"
echo "⚠️  Warning: This is for educational purposes only!"
`

    return script
  }

  const copyScript = async () => {
    await navigator.clipboard.writeText(generateScript())
  }

  const downloadScript = () => {
    const script = generateScript()
    const blob = new Blob([script], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "github-time-travel.sh"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GitBranch className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              GitHub Time Travel
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Click on the contribution graph squares to select dates, then generate a script to create fake GitHub commit
            history. Perfect for filling gaps in your contribution timeline!
          </p>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-4">
          <Badge variant="secondary" className="px-4 py-2">
            <Calendar className="h-4 w-4 mr-2" />
            {selectedDates.size} dates selected
          </Badge>
        </div>

        {/* Contribution Graph */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
              Contribution Graph
            </CardTitle>
            <CardDescription>
              Click on squares to select dates for fake commits. Purple squares are selected.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Month labels */}
              <div className="flex justify-between text-xs text-gray-500 px-4">
                {months.map((month) => (
                  <span key={month}>{month}</span>
                ))}
              </div>

              <div className="flex gap-2">
                {/* Day labels */}
                <div className="flex flex-col gap-1 text-xs text-gray-500 pr-2">
                  {days.map((day, index) => (
                    <div key={day} className="h-3 flex items-center">
                      {index % 2 === 1 && <span>{day}</span>}
                    </div>
                  ))}
                </div>

                {/* Contribution squares */}
                <div className="flex gap-1">
                  {weeklyData.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-1">
                      {week.map((day, dayIndex) => (
                        <button
                          key={`${weekIndex}-${dayIndex}`}
                          onClick={() => toggleDate(day.date)}
                          className={`w-3 h-3 border rounded-sm transition-all hover:scale-110 ${
                            day.date ? "cursor-pointer" : "cursor-default"
                          } ${getContributionColor(day.count, day.selected)}`}
                          title={
                            day.date
                              ? `${day.date} - ${day.count} contributions${day.selected ? " (selected)" : ""}`
                              : ""
                          }
                          disabled={!day.date}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Less</span>
                <div className="flex gap-1 items-center">
                  <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded-sm"></div>
                  <div className="w-3 h-3 bg-green-200 border border-green-300 rounded-sm"></div>
                  <div className="w-3 h-3 bg-green-300 border border-green-400 rounded-sm"></div>
                  <div className="w-3 h-3 bg-green-500 border border-green-600 rounded-sm"></div>
                  <div className="w-3 h-3 bg-green-700 border border-green-800 rounded-sm"></div>
                  <div className="w-3 h-3 bg-purple-600 border border-purple-700 rounded-sm ml-2"></div>
                  <span className="ml-1">Selected</span>
                </div>
                <span>More</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => setShowScript(!showScript)}
            disabled={selectedDates.size === 0}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {showScript ? "Hide Script" : "Generate Script"}
          </Button>
          <Button variant="outline" onClick={() => setSelectedDates(new Set())} disabled={selectedDates.size === 0}>
            Clear Selection
          </Button>
        </div>

        {/* Generated Script */}
        {showScript && selectedDates.size > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Generated Time Travel Script</CardTitle>
              <CardDescription>
                Copy this bash script and run it in your git repository to create fake commits for the selected dates.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea value={generateScript()} readOnly className="font-mono text-sm min-h-[300px]" />
              <div className="flex gap-2">
                <Button onClick={copyScript} variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Script
                </Button>
                <Button onClick={downloadScript} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download Script
                </Button>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Important Notes:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Make sure you're in a git repository before running the script</li>
                  <li>• This creates real commits in your repository</li>
                  <li>• Use responsibly - this is for educational purposes</li>
                  <li>• Remember to push your changes after running the script</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
