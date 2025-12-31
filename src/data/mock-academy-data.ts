// Mock data for Academy Dashboard

export interface Student {
  id: string;
  name: string;
  avatar: string;
  email: string;
  class: string;
  grade: number;
  attendanceRate: number;
  overallRating: number;
  subjects: {
    [key: string]: {
      grade: number;
      attendance: number;
    };
  };
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  avatar: string;
  subjects: string[];
  classes: string[];
}

export interface ClassInfo {
  id: string;
  name: string;
  grade: number;
  subject: string;
  teacher: string;
  students: string[];
  schedule: {
    day: string;
    startTime: string;
    endTime: string;
    room: string;
  }[];
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  notes?: string;
}

export interface Homework {
  id: string;
  title: string;
  description: string;
  subject: string;
  classId: string;
  dueDate: string;
  assignedDate: string;
  status: "todo" | "on-review" | "completed";
  totalStudents: number;
  submittedCount: number;
  gradedCount: number;
  maxPoints: number;
  attachments?: string[];
}

export interface HomeworkSubmission {
  id: string;
  homeworkId: string;
  studentId: string;
  submittedDate?: string;
  grade?: number;
  feedback?: string;
  status: "not-submitted" | "submitted" | "graded";
  attachments?: string[];
}

export interface CurriculumTopic {
  id: string;
  subject: string;
  unit: string;
  topics: string[];
  status: "not-started" | "in-progress" | "completed";
  progress: number;
  targetDate: string;
  standards?: string[];
}

export interface SchoolEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: "meeting" | "exam" | "event" | "professional-development";
  location?: string;
  image?: string;
}

// Alias for UpcomingEvent (used in academy components)
export type UpcomingEvent = SchoolEvent;

// Alias for HomeworkItem (used in academy components)
export type HomeworkItem = Homework;

// Mock Students Data
export const mockStudents: Student[] = [
  {
    id: "S001",
    name: "Emma Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    email: "emma.j@school.edu",
    class: "10A",
    grade: 10,
    attendanceRate: 95,
    overallRating: 88,
    subjects: {
      Mathematics: { grade: 92, attendance: 96 },
      Physics: { grade: 85, attendance: 94 },
      Chemistry: { grade: 88, attendance: 95 },
    },
  },
  {
    id: "S002",
    name: "Liam Smith",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liam",
    email: "liam.s@school.edu",
    class: "10A",
    grade: 10,
    attendanceRate: 88,
    overallRating: 82,
    subjects: {
      Mathematics: { grade: 78, attendance: 85 },
      Physics: { grade: 85, attendance: 90 },
      Chemistry: { grade: 84, attendance: 89 },
    },
  },
  {
    id: "S003",
    name: "Sophia Williams",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia",
    email: "sophia.w@school.edu",
    class: "10A",
    grade: 10,
    attendanceRate: 98,
    overallRating: 95,
    subjects: {
      Mathematics: { grade: 98, attendance: 100 },
      Physics: { grade: 94, attendance: 97 },
      Chemistry: { grade: 93, attendance: 97 },
    },
  },
  {
    id: "S004",
    name: "Noah Brown",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Noah",
    email: "noah.b@school.edu",
    class: "10A",
    grade: 10,
    attendanceRate: 92,
    overallRating: 86,
    subjects: {
      Mathematics: { grade: 88, attendance: 93 },
      Physics: { grade: 82, attendance: 91 },
      Chemistry: { grade: 88, attendance: 92 },
    },
  },
  {
    id: "S005",
    name: "Olivia Davis",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
    email: "olivia.d@school.edu",
    class: "10A",
    grade: 10,
    attendanceRate: 85,
    overallRating: 79,
    subjects: {
      Mathematics: { grade: 75, attendance: 82 },
      Physics: { grade: 80, attendance: 86 },
      Chemistry: { grade: 82, attendance: 87 },
    },
  },
  {
    id: "S006",
    name: "Ava Martinez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ava",
    email: "ava.m@school.edu",
    class: "10B",
    grade: 10,
    attendanceRate: 94,
    overallRating: 90,
    subjects: {
      Biology: { grade: 91, attendance: 95 },
      English: { grade: 89, attendance: 93 },
    },
  },
  {
    id: "S007",
    name: "Ethan Garcia",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan",
    email: "ethan.g@school.edu",
    class: "10B",
    grade: 10,
    attendanceRate: 90,
    overallRating: 84,
    subjects: {
      Biology: { grade: 83, attendance: 89 },
      English: { grade: 85, attendance: 91 },
    },
  },
  {
    id: "S008",
    name: "Isabella Rodriguez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella",
    email: "isabella.r@school.edu",
    class: "10B",
    grade: 10,
    attendanceRate: 96,
    overallRating: 92,
    subjects: {
      Biology: { grade: 94, attendance: 97 },
      English: { grade: 90, attendance: 95 },
    },
  },
];

// Mock Teacher Data
export const mockTeacher: Teacher = {
  id: "T001",
  name: "James Dean",
  email: "james.dean@school.edu",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
  subjects: ["Mathematics", "Physics", "Chemistry"],
  classes: ["10A", "10B", "11A"],
};

// Mock Classes Data
export const mockClasses: ClassInfo[] = [
  {
    id: "C001",
    name: "10A",
    grade: 10,
    subject: "Mathematics",
    teacher: "T001",
    students: ["S001", "S002", "S003", "S004", "S005"],
    schedule: [
      { day: "Mon", startTime: "08:00", endTime: "09:00", room: "Room 101" },
      { day: "Wed", startTime: "09:00", endTime: "10:00", room: "Room 101" },
      { day: "Thu", startTime: "09:00", endTime: "10:00", room: "Room 101" },
      { day: "Fri", startTime: "10:00", endTime: "11:00", room: "Room 101" },
    ],
  },
  {
    id: "C002",
    name: "10A",
    grade: 10,
    subject: "Physics",
    teacher: "T001",
    students: ["S001", "S002", "S003", "S004", "S005"],
    schedule: [
      { day: "Tue", startTime: "10:00", endTime: "11:00", room: "Lab 201" },
      { day: "Thu", startTime: "08:00", endTime: "09:00", room: "Lab 201" },
    ],
  },
  {
    id: "C003",
    name: "10A",
    grade: 10,
    subject: "Chemistry",
    teacher: "T001",
    students: ["S001", "S002", "S003", "S004", "S005"],
    schedule: [
      { day: "Mon", startTime: "10:00", endTime: "11:00", room: "Lab 301" },
      { day: "Thu", startTime: "10:00", endTime: "11:00", room: "Lab 301" },
    ],
  },
  {
    id: "C004",
    name: "10A",
    grade: 10,
    subject: "English",
    teacher: "T003",
    students: ["S001", "S002", "S003", "S004", "S005"],
    schedule: [
      { day: "Tue", startTime: "08:00", endTime: "09:00", room: "Room 205" },
      { day: "Thu", startTime: "13:00", endTime: "14:00", room: "Room 205" },
    ],
  },
  {
    id: "C005",
    name: "10A",
    grade: 10,
    subject: "History",
    teacher: "T004",
    students: ["S001", "S002", "S003", "S004", "S005"],
    schedule: [
      { day: "Wed", startTime: "08:00", endTime: "09:00", room: "Room 110" },
      { day: "Thu", startTime: "14:00", endTime: "15:00", room: "Room 110" },
    ],
  },
  {
    id: "C006",
    name: "10A",
    grade: 10,
    subject: "Physical Education",
    teacher: "T005",
    students: ["S001", "S002", "S003", "S004", "S005"],
    schedule: [
      { day: "Tue", startTime: "14:00", endTime: "15:00", room: "Gymnasium" },
      { day: "Thu", startTime: "15:00", endTime: "16:00", room: "Gymnasium" },
    ],
  },
];

// Mock Attendance Records (last 30 days)
export const mockAttendanceRecords: AttendanceRecord[] = [
  // Today's attendance
  { id: "A001", studentId: "S001", classId: "C001", date: "2024-03-28", status: "present" },
  { id: "A002", studentId: "S002", classId: "C001", date: "2024-03-28", status: "present" },
  { id: "A003", studentId: "S003", classId: "C001", date: "2024-03-28", status: "present" },
  { id: "A004", studentId: "S004", classId: "C001", date: "2024-03-28", status: "late" },
  { id: "A005", studentId: "S005", classId: "C001", date: "2024-03-28", status: "absent", notes: "Sick" },
  // Previous days...
  { id: "A006", studentId: "S001", classId: "C001", date: "2024-03-27", status: "present" },
  { id: "A007", studentId: "S002", classId: "C001", date: "2024-03-27", status: "present" },
  { id: "A008", studentId: "S003", classId: "C001", date: "2024-03-27", status: "present" },
  { id: "A009", studentId: "S004", classId: "C001", date: "2024-03-27", status: "present" },
  { id: "A010", studentId: "S005", classId: "C001", date: "2024-03-27", status: "absent" },
];

// Mock Homework Data
export const mockHomework: Homework[] = [
  {
    id: "H001",
    title: "Rational Inequalities: AI Assessment #5",
    description: "Complete problems 1-15 on rational inequalities. Show all work and explain your reasoning.",
    subject: "Mathematics",
    classId: "C001",
    dueDate: "2024-03-30",
    assignedDate: "2024-03-23",
    status: "todo",
    totalStudents: 25,
    submittedCount: 18,
    gradedCount: 12,
    maxPoints: 100,
  },
  {
    id: "H002",
    title: "All about Homestas: Quiz",
    description: "Study chapters 5-7 and complete the online quiz on homeostasis.",
    subject: "Biology",
    classId: "C003",
    dueDate: "2024-03-29",
    assignedDate: "2024-03-22",
    status: "todo",
    totalStudents: 22,
    submittedCount: 20,
    gradedCount: 15,
    maxPoints: 50,
  },
  {
    id: "H003",
    title: "Shapes and Structures",
    description: "Geometry project: Create 3D models of different polyhedrons.",
    subject: "Mathematics",
    classId: "C001",
    dueDate: "2024-04-03",
    assignedDate: "2024-03-20",
    status: "todo",
    totalStudents: 25,
    submittedCount: 8,
    gradedCount: 3,
    maxPoints: 150,
  },
  {
    id: "H004",
    title: "Word Wonders: Unraveling Language",
    description: "Write a 500-word essay on the evolution of the English language.",
    subject: "English",
    classId: "C003",
    dueDate: "2024-04-03",
    assignedDate: "2024-03-25",
    status: "todo",
    totalStudents: 22,
    submittedCount: 5,
    gradedCount: 0,
    maxPoints: 100,
  },
  {
    id: "H005",
    title: "Historical Chronicles: Exploring the Past",
    description: "Research project on the Industrial Revolution.",
    subject: "History",
    classId: "C004",
    dueDate: "2024-03-30",
    assignedDate: "2024-03-15",
    status: "on-review",
    totalStudents: 28,
    submittedCount: 28,
    gradedCount: 20,
    maxPoints: 200,
  },
  {
    id: "H006",
    title: "Epoch Explorations: Unraveling Timelines",
    description: "Create a timeline of major events in World War II.",
    subject: "History",
    classId: "C004",
    dueDate: "2024-03-30",
    assignedDate: "2024-03-18",
    status: "on-review",
    totalStudents: 28,
    submittedCount: 25,
    gradedCount: 25,
    maxPoints: 100,
  },
  {
    id: "H007",
    title: "Physics Phantoms: Unraveling the Laws of Nature",
    description: "Newton's Laws lab report and analysis.",
    subject: "Physics",
    classId: "C002",
    dueDate: "2024-03-25",
    assignedDate: "2024-03-10",
    status: "completed",
    totalStudents: 25,
    submittedCount: 25,
    gradedCount: 25,
    maxPoints: 100,
  },
  {
    id: "H008",
    title: "Language Landscapes: Exploring Vocabulary",
    description: "Vocabulary quiz on chapters 8-10.",
    subject: "English",
    classId: "C003",
    dueDate: "2024-03-22",
    assignedDate: "2024-03-15",
    status: "completed",
    totalStudents: 22,
    submittedCount: 22,
    gradedCount: 22,
    maxPoints: 50,
  },
];

// Mock Curriculum Data
export const mockCurriculum: CurriculumTopic[] = [
  {
    id: "CU001",
    subject: "Mathematics",
    unit: "Algebra II",
    topics: ["Rational Equations", "Rational Inequalities", "Complex Numbers", "Polynomial Functions"],
    status: "in-progress",
    progress: 70,
    targetDate: "2024-04-15",
    standards: ["CCSS.MATH.HSA-REI.A.2", "CCSS.MATH.HSA-REI.B.4"],
  },
  {
    id: "CU002",
    subject: "Mathematics",
    unit: "Geometry",
    topics: ["3D Shapes", "Surface Area", "Volume", "Spatial Reasoning"],
    status: "in-progress",
    progress: 45,
    targetDate: "2024-05-01",
    standards: ["CCSS.MATH.HSG-GMD.A.3", "CCSS.MATH.HSG-MG.A.1"],
  },
  {
    id: "CU003",
    subject: "Physics",
    unit: "Classical Mechanics",
    topics: ["Newton's Laws", "Forces and Motion", "Energy and Work", "Momentum"],
    status: "completed",
    progress: 100,
    targetDate: "2024-03-20",
    standards: ["NGSS.HS-PS2-1", "NGSS.HS-PS2-2"],
  },
  {
    id: "CU004",
    subject: "Physics",
    unit: "Electricity and Magnetism",
    topics: ["Electric Fields", "Circuits", "Magnetic Fields", "Electromagnetic Induction"],
    status: "not-started",
    progress: 0,
    targetDate: "2024-05-30",
    standards: ["NGSS.HS-PS2-4", "NGSS.HS-PS2-5"],
  },
  {
    id: "CU005",
    subject: "Chemistry",
    unit: "Chemical Reactions",
    topics: ["Reaction Types", "Stoichiometry", "Balancing Equations", "Limiting Reactants"],
    status: "in-progress",
    progress: 60,
    targetDate: "2024-04-10",
    standards: ["NGSS.HS-PS1-7", "NGSS.HS-PS1-4"],
  },
];

// Helper function to create dates relative to today
const getRelativeDate = (daysFromNow: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split("T")[0];
};

// Mock School Events
export const mockSchoolEvents: SchoolEvent[] = [
  {
    id: "E001",
    title: "Science Museum Excursion",
    description: "Field trip to the National Science Museum for Year 10 students.",
    date: getRelativeDate(3),
    time: "09:00",
    type: "event",
    location: "National Science Museum",
    image: "https://images.unsplash.com/photo-1564325724739-bae0bd08762c?w=400&h=250&fit=crop",
  },
  {
    id: "E002",
    title: "Weekly School Assembly",
    description: "Whole school assembly with special guest speaker.",
    date: getRelativeDate(5),
    time: "08:30",
    type: "meeting",
    location: "Main Hall",
  },
  {
    id: "E003",
    title: "Easter Holidays Begin",
    description: "School closes for Easter break. Enjoy your holidays!",
    date: getRelativeDate(10),
    time: "15:30",
    type: "event",
  },
  {
    id: "E004",
    title: "English accents workshop",
    description: "Interactive workshop on different English accents and pronunciation.",
    date: getRelativeDate(15),
    time: "12:00",
    type: "professional-development",
    location: "Main Hall",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=250&fit=crop",
  },
  {
    id: "E005",
    title: "Sports Day",
    description: "Annual sports competition between houses.",
    date: getRelativeDate(20),
    time: "10:00",
    type: "event",
    location: "Sports Field",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=250&fit=crop",
  },
  {
    id: "E006",
    title: "Art Exhibition Opening",
    description: "Student art exhibition showcasing work from all year groups.",
    date: getRelativeDate(28),
    time: "18:00",
    type: "event",
    location: "Art Gallery",
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=250&fit=crop",
  },
  {
    id: "E007",
    title: "RoboFest",
    description: "Annual robotics competition and showcase for students.",
    date: getRelativeDate(42),
    time: "16:00",
    type: "event",
    location: "Science Building",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop",
  },
  {
    id: "E008",
    title: "Zoo Excursion - Biology Class",
    description: "Year 10 Biology students visit the city zoo.",
    date: getRelativeDate(50),
    time: "09:00",
    type: "event",
    location: "City Zoo",
    image: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400&h=250&fit=crop",
  },
  {
    id: "E009",
    title: "AI Introduction Seminar",
    description: "Seminar on integrating AI tools in education.",
    date: getRelativeDate(65),
    time: "14:30",
    type: "professional-development",
    location: "Computer Lab",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop",
  },
  {
    id: "E010",
    title: "Summer Fair",
    description: "End of year summer fair with games, food stalls and entertainment.",
    date: getRelativeDate(72),
    time: "12:00",
    type: "event",
    location: "School Grounds",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=250&fit=crop",
  },
  {
    id: "E011",
    title: "Engineering Careers Talk",
    description: "Career talk about engineering professions and opportunities.",
    date: getRelativeDate(80),
    time: "15:00",
    type: "event",
    location: "Auditorium",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=250&fit=crop",
  },
  {
    id: "E005",
    title: "Parent-Teacher Conference",
    description: "Quarterly parent-teacher meetings to discuss student progress.",
    date: "2024-04-05",
    time: "14:00",
    type: "meeting",
    location: "Classrooms",
  },
  {
    id: "E006",
    title: "Mid-Term Examinations",
    description: "Mid-term exams for all subjects.",
    date: "2024-04-15",
    time: "09:00",
    type: "exam",
    location: "Exam Hall",
  },
];

// Helper function to get today's attendance
export function getTodayAttendance(classId: string): { present: number; total: number } {
  const today = "2024-03-28";
  const classInfo = mockClasses.find((c) => c.id === classId);
  if (!classInfo) return { present: 0, total: 0 };

  const todayRecords = mockAttendanceRecords.filter((r) => r.classId === classId && r.date === today);

  const present = todayRecords.filter((r) => r.status === "present" || r.status === "late").length;
  const total = classInfo.students.length;

  return { present, total };
}

// Helper function to get overall attendance rate
export function getOverallAttendanceRate(): number {
  const totalRecords = mockAttendanceRecords.length;
  const presentRecords = mockAttendanceRecords.filter((r) => r.status === "present" || r.status === "late").length;
  return Math.round((presentRecords / totalRecords) * 100);
}

// Helper function to get homework stats
export function getHomeworkStats(): { assigned: number; reviewed: number; graded: number } {
  return {
    assigned: mockHomework.filter((h) => h.status === "todo").length,
    reviewed: mockHomework.filter((h) => h.status === "on-review").length,
    graded: mockHomework.filter((h) => h.status === "completed").length,
  };
}

// Helper function to get average class rating
export function getAverageClassRating(classId: string): number {
  const classInfo = mockClasses.find((c) => c.id === classId);
  if (!classInfo) return 0;

  const students = mockStudents.filter((s) => classInfo.students.includes(s.id));
  const totalRating = students.reduce((sum, student) => sum + student.overallRating, 0);
  return Math.round(totalRating / students.length);
}
