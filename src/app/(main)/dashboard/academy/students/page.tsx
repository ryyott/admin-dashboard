"use client";

import { useState } from "react";

import { Users, TrendingUp, TrendingDown, Award, AlertTriangle, Search, Filter, Download } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useAcademyStore } from "@/stores/use-academy-store";

export default function StudentsPage() {
  const students = useAcademyStore((state) => state.students);
  const classes = useAcademyStore((state) => state.classes);

  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [performanceFilter, setPerformanceFilter] = useState<"all" | "high" | "medium" | "low">("all");

  // Filter students
  const filteredStudents = students.filter((student) => {
    const matchesClass =
      selectedClass === "all" || classes.find((c) => c.id === selectedClass)?.students.includes(student.id);
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesPerformance = true;
    if (performanceFilter === "high") matchesPerformance = student.overallRating >= 85;
    else if (performanceFilter === "medium")
      matchesPerformance = student.overallRating >= 70 && student.overallRating < 85;
    else if (performanceFilter === "low") matchesPerformance = student.overallRating < 70;

    return matchesClass && matchesSearch && matchesPerformance;
  });

  // Calculate stats
  const avgRating = Math.round(students.reduce((sum, s) => sum + s.overallRating, 0) / students.length);
  const avgAttendance = Math.round(students.reduce((sum, s) => sum + s.attendanceRate, 0) / students.length);
  const highPerformers = students.filter((s) => s.overallRating >= 85).length;
  const atRiskStudents = students.filter((s) => s.overallRating < 70 || s.attendanceRate < 85).length;

  // Mock performance trend data
  const performanceTrendData = [
    { month: "Jan", average: 78 },
    { month: "Feb", average: 82 },
    { month: "Mar", average: 85 },
    { month: "Apr", average: avgRating },
  ];

  const getPerformanceLabel = (rating: number) => {
    if (rating >= 90) return { label: "Excellent", color: "text-green-600", bg: "bg-green-500/10" };
    if (rating >= 85) return { label: "Very Good", color: "text-green-500", bg: "bg-green-500/10" };
    if (rating >= 70) return { label: "Good", color: "text-blue-500", bg: "bg-blue-500/10" };
    if (rating >= 60) return { label: "Fair", color: "text-orange-500", bg: "bg-orange-500/10" };
    return { label: "Needs Attention", color: "text-red-500", bg: "bg-red-500/10" };
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Student Performance</h1>
          <p className="text-muted-foreground">Track and analyze student progress and performance</p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{students.length}</div>
                <div className="text-muted-foreground text-sm">Total Students</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{avgRating}%</div>
                <div className="text-muted-foreground text-sm">Avg Performance</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                <Award className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{highPerformers}</div>
                <div className="text-muted-foreground text-sm">High Performers</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{atRiskStudents}</div>
                <div className="text-muted-foreground text-sm">At Risk</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={performanceTrendData}>
              <defs>
                <linearGradient id="colorAverage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="average"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorAverage)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative min-w-[200px] flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map((classInfo) => (
                  <SelectItem key={classInfo.id} value={classInfo.id}>
                    {classInfo.name} - {classInfo.subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={performanceFilter} onValueChange={(v: any) => setPerformanceFilter(v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Performance</SelectItem>
                <SelectItem value="high">High (85%+)</SelectItem>
                <SelectItem value="medium">Medium (70-84%)</SelectItem>
                <SelectItem value="low">Low (&lt;70%)</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-muted-foreground ml-auto text-sm">
              {filteredStudents.length} of {students.length} students
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student List */}
      <div className="grid gap-4">
        {filteredStudents.map((student) => {
          const performanceLabel = getPerformanceLabel(student.overallRating);
          const subjects = Object.entries(student.subjects);

          return (
            <Card key={student.id} className="transition-all hover:shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={student.avatar} alt={student.name} />
                    <AvatarFallback>{student.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>

                  {/* Student Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{student.name}</h3>
                        <p className="text-muted-foreground text-sm">{student.email}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge variant="outline">Class {student.class}</Badge>
                          <Badge variant="outline">Grade {student.grade}</Badge>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Overall Performance</span>
                          <Badge className={cn(performanceLabel.bg, performanceLabel.color)}>
                            {performanceLabel.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={student.overallRating} className="h-2 flex-1" />
                          <span className="text-sm font-semibold">{student.overallRating}%</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Attendance Rate</span>
                          {student.attendanceRate < 85 && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={student.attendanceRate}
                            className={cn("h-2 flex-1", student.attendanceRate < 85 && "[&>div]:bg-orange-500")}
                          />
                          <span className="text-sm font-semibold">{student.attendanceRate}%</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-muted-foreground text-sm">Subject Performance</span>
                        <div className="flex flex-wrap gap-1">
                          {subjects.map(([subject, data]) => (
                            <div
                              key={subject}
                              className="bg-muted flex items-center gap-1 rounded-md px-2 py-1 text-xs"
                            >
                              <span className="font-medium">{subject.substring(0, 4)}:</span>
                              <span className={cn(data.grade >= 85 ? "text-green-600" : "")}>{data.grade}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredStudents.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 text-6xl opacity-20">🎓</div>
              <h3 className="mb-2 text-lg font-semibold">No Students Found</h3>
              <p className="text-muted-foreground text-sm">Try adjusting your filters or search query.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
