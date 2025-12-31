export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "event";
  time: string;
  read: boolean;
  icon?: string;
}

// Helper function to create time relative to now
const getRelativeTime = (minutesAgo: number): string => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - minutesAgo);
  return date.toISOString();
};

export const mockNotifications: Notification[] = [
  {
    id: "N001",
    title: "New Homework Submission",
    message: 'Sophia Williams submitted "Rational Inequalities: AI Assessment #5"',
    type: "success",
    time: getRelativeTime(5),
    read: false,
    icon: "📝",
  },
  {
    id: "N002",
    title: "Upcoming Class",
    message: "Mathematics class starts in 15 minutes - Room 101",
    type: "info",
    time: getRelativeTime(10),
    read: false,
    icon: "⏰",
  },
  {
    id: "N003",
    title: "Student Absence Alert",
    message: "Olivia Davis marked absent today - 3rd absence this week",
    type: "warning",
    time: getRelativeTime(45),
    read: false,
    icon: "⚠️",
  },
  {
    id: "N004",
    title: "Science Museum Excursion",
    message: "Reminder: Field trip permission slips due tomorrow",
    type: "event",
    time: getRelativeTime(120),
    read: true,
    icon: "🎒",
  },
  {
    id: "N005",
    title: "Grade Submission Reminder",
    message: "Physics lab reports need to be graded by Friday",
    type: "warning",
    time: getRelativeTime(180),
    read: true,
    icon: "📊",
  },
  {
    id: "N006",
    title: "New Message",
    message: "Parent of Noah Brown requested a meeting",
    type: "info",
    time: getRelativeTime(240),
    read: true,
    icon: "💬",
  },
  {
    id: "N007",
    title: "Curriculum Update",
    message: 'You completed "Classical Mechanics" unit - Great job!',
    type: "success",
    time: getRelativeTime(360),
    read: true,
    icon: "✅",
  },
  {
    id: "N008",
    title: "Staff Meeting",
    message: "Weekly staff meeting tomorrow at 3:30 PM",
    type: "event",
    time: getRelativeTime(480),
    read: true,
    icon: "👥",
  },
];

// Helper function to format relative time
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
