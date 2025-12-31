"use client";

import { useAcademyStore } from "@/stores/use-academy-store";

import { AttendanceCard } from "./_components/attendance-card";
import { HomeworkCard } from "./_components/homework-card";
import { HomeworkProgress } from "./_components/homework-progress";
import { RatingCard } from "./_components/rating-card";
import { TimetableProvider } from "./_components/timetable-context";
import { TimetableSection } from "./_components/timetable-section";
import { UpcomingEvents } from "./_components/upcoming-events";
import { WelcomeSection } from "./_components/welcome-section";

export default function AcademyDashboard() {
  const teacher = useAcademyStore((state) => state.teacher);

  return (
    <TimetableProvider>
      <div className="from-background via-background to-muted/20 bg-gradient-to-br">
        <div className="space-y-5 p-6 lg:p-8">
          {/* Compact Header with Timetable Trigger */}
          <WelcomeSection teacher={teacher} />

          {/* KPI Cards - Full Width Row */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <AttendanceCard />
            <HomeworkCard />
            <RatingCard />
          </div>

          {/* Events + Homework Side by Side */}
          <div className="grid gap-4 lg:grid-cols-2">
            <UpcomingEvents />
            <HomeworkProgress />
          </div>

          {/* Timetable Sheet */}
          <TimetableSection />
        </div>
      </div>
    </TimetableProvider>
  );
}
