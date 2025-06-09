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
  const currentYear = new Date().getUTCFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedDates, setSelectedDates] = useState<Map<string, number>>(new Map());
  const [showScript, setShowScript] = useState(false);

  // Generate a list of years (e.g., last 10 years)
  const years = useMemo(() => {
    const arr = [];
    for (let y = currentYear; y >= currentYear - 9; y--) {
      arr.push(y);
    }
    return arr;
  }, [currentYear]);

  // Generate contribution graph data for the selected year
  const contributionData = useMemo(() => {
    const data: ContributionDay[] = [];
    const year = selectedYear;
    const start = new Date();
    start.setUTCFullYear(year, 0, 1);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date();
    end.setUTCFullYear(year, 11, 31);
    end.setUTCHours(0, 0, 0, 0);
    const d = new Date(start);

    while (d <= end) {
      const dateStr = d.toISOString().split('T')[0];
      const fake = selectedDates.get(dateStr) || 0;
      data.push({
        date: dateStr,
        count: fake,
        selected: fake > 0,
      });
      d.setUTCDate(d.getUTCDate() + 1);
    }

    return data;
  }, [selectedDates, selectedYear])

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

  // Update toggleDate to increment on left click, decrement on right click
  const toggleDate = (date: string, increment = 1) => {
    if (!date) return;
    const newSelected = new Map(selectedDates);
    const current = newSelected.get(date) || 0;
    if (increment > 0) {
      newSelected.set(date, current + 1);
    } else if (current > 1) {
      newSelected.set(date, current - 1);
    } else {
      newSelected.delete(date);
    }
    setSelectedDates(newSelected);
  }

  const getContributionColor = (count: number, selected: boolean, real: number, fake: number) => {
    // Only fake is used now
    if (fake === 0) return "bg-gray-100 border-gray-200";
    if (fake === 1) return "bg-blue-200 border-blue-300";
    if (fake === 2) return "bg-blue-300 border-blue-400";
    if (fake === 3) return "bg-blue-500 border-blue-600";
    return "bg-blue-700 border-blue-800"; // 4 or more
  }

  const generateScript = () => {
    const sortedDates = Array.from(selectedDates.entries()).sort(([a], [b]) => a.localeCompare(b));
    const script = `@echo off
REM GitHub Time Travel Batch Script
REM This script creates fake commits for selected dates

REM Make sure you're in a git repository
if not exist .git (
    echo Error: Not a git repository. Run 'git init' first.
    exit /b 1
)

echo Creating fake commits for ${sortedDates.reduce((a, [_, c]) => a + c, 0)} commits...

${sortedDates
      .map(
        ([date, count]) =>
          Array.from({ length: count })
            .map(
              (_, i) => `
REM Commit ${i + 1} for ${date}
echo Fake commit ${i + 1} for ${date} > temp_file_${date.replace(/-/g, "")}_${i + 1}.txt
git add temp_file_${date.replace(/-/g, "")}_${i + 1}.txt
set GIT_AUTHOR_DATE=${date}T12:00:00
set GIT_COMMITTER_DATE=${date}T12:00:00
git commit -m "Time travel commit ${i + 1} for ${date}"
del temp_file_${date.replace(/-/g, "")}_${i + 1}.txt`
            )
            .join("\r\n")
      )
      .join("\r\n")}

echo Remember to push your changes: git push origin main (or master)
`;
    return script;
  }

  const copyScript = async () => {
    await navigator.clipboard.writeText(generateScript())
  }

  const downloadScript = () => {
    const script = generateScript();
    const blob = new Blob([script], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "github-time-travel.bat";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="min-h-screen bg-gradient-to-br p-4 from-gray-600 to-gray-800">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GitBranch className="h-8 w-8 text-blue-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
              GitHub Time Travel
            </h1>
          </div>
          <p className="text-gray-200 max-w-2xl mx-auto">
            Click on the contribution graph squares to select dates, then generate a script to create fake GitHub commit
            history. Perfect for filling gaps in your contribution timeline!
          </p>
          <p className="text-blue-300 text-sm mt-2">
            Tip: <b>Left click</b> to add a commit, <b>right click</b> to undo.
          </p>
        </div>

        {/* Year Picker */}
        <div className="flex justify-center gap-4">
          <label htmlFor="year-select" className="text-gray-200 font-semibold flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Year:
            <select
              id="year-select"
              className="ml-2 px-2 py-1 rounded bg-gray-700 text-white border border-gray-500"
              value={selectedYear}
              onChange={e => {
                setSelectedYear(Number(e.target.value));
                setSelectedDates(new Map());
              }}
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </label>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-4">
          <Badge variant="secondary" className="px-4 py-2">
            <Calendar className="h-4 w-4 mr-2" />
            {Array.from(selectedDates.values()).reduce((a, b) => a + b, 0)} commits on {selectedDates.size} dates
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
              Click on squares to select dates for fake commits. Blue squares are selected.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 space-x-9">
              {/* Month labels */}
              <div className="flex justify-between text-xs text-gray-500 px-3 ps-9 pe-7">
                {months.map((month) => (
                  <span key={month}>{month}</span>
                ))}
              </div>

              <div className="flex gap-2">
                {/* Day labels */}
                <div className="flex flex-col gap-1 text-xs text-gray-500 pr-2 pt-0.5 space-y-1">
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
                      {week.map((day, dayIndex) => day.date ? (
                        <button
                          key={`${weekIndex}-${dayIndex}`}
                          onClick={e => {
                            if (e.type === "click" && !e.shiftKey) toggleDate(day.date, 1);
                          }}
                          onContextMenu={e => {
                            e.preventDefault();
                            toggleDate(day.date, -1);
                          }}
                          className={`w-4 h-4 border rounded-sm transition-all hover:scale-110 ${day.date ? "cursor-pointer" : "cursor-default"
                            } ${getContributionColor(day.count, day.selected, 0, selectedDates.get(day.date) || 0)}`}
                          title={
                            day.date
                              ? `${day.date} - ${day.count} commit${day.count !== 1 ? "s" : ""}${day.selected ? " (selected)" : ""}`
                              : ""
                          }
                        >
                          {day.count > 0 ? (
                            <span className="text-[10px] font-bold text-white">{day.count}</span>
                          ) : null}
                        </button>)

                        : (<div key={`${weekIndex}-${dayIndex}`} className="w-4 h-4" />)

                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Less</span>
                <div className="flex gap-1 items-center">
                  <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded-sm flex items-center justify-center">0</div>
                  <div className="w-3 h-3 bg-blue-200 border border-blue-300 rounded-sm flex items-center justify-center">1</div>
                  <div className="w-3 h-3 bg-blue-300 border border-blue-400 rounded-sm flex items-center justify-center">2</div>
                  <div className="w-3 h-3 bg-blue-500 border border-blue-600 rounded-sm flex items-center justify-center">3</div>
                  <div className="w-3 h-3 bg-blue-700 border border-blue-800 rounded-sm flex items-center justify-center">4+</div>
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
            className="bg-red-800 hover:bg-red-400"
          >
            {showScript ? "Hide Script" : "Generate Script"}
          </Button>
          <Button className="bg-green-600" onClick={() => setSelectedDates(new Map())} disabled={selectedDates.size === 0}>
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
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
