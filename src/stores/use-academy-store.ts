import { create } from "zustand";

import {
  mockStudents,
  mockTeacher,
  mockClasses,
  mockAttendanceRecords,
  mockHomework,
  mockCurriculum,
  mockSchoolEvents,
  type Student,
  type Teacher,
  type ClassInfo,
  type AttendanceRecord,
  type Homework,
  type CurriculumTopic,
  type SchoolEvent,
} from "@/data/mock-academy-data";

interface AcademyStore {
  // Data
  teacher: Teacher;
  students: Student[];
  classes: ClassInfo[];
  attendanceRecords: AttendanceRecord[];
  homework: Homework[];
  curriculum: CurriculumTopic[];
  events: SchoolEvent[];

  // Filters
  selectedClass: string | null;
  selectedSubject: string | null;
  homeworkFilter: "all" | "todo" | "on-review" | "completed";
  dateFilter: string;

  // Actions
  setSelectedClass: (classId: string | null) => void;
  setSelectedSubject: (subject: string | null) => void;
  setHomeworkFilter: (filter: "all" | "todo" | "on-review" | "completed") => void;
  setDateFilter: (date: string) => void;

  // Attendance actions
  markAttendance: (studentId: string, classId: string, status: AttendanceRecord["status"], notes?: string) => void;
  getAttendanceForDate: (classId: string, date: string) => AttendanceRecord[];

  // Homework actions
  addHomework: (homework: Omit<Homework, "id">) => void;
  updateHomework: (id: string, updates: Partial<Homework>) => void;
  deleteHomework: (id: string) => void;

  // Curriculum actions
  updateCurriculumProgress: (id: string, progress: number) => void;
  updateCurriculumStatus: (id: string, status: CurriculumTopic["status"]) => void;

  // Getters
  getStudentsByClass: (classId: string) => Student[];
  getHomeworkByClass: (classId: string) => Homework[];
  getCurriculumBySubject: (subject: string) => CurriculumTopic[];
  getUpcomingEvents: () => SchoolEvent[];
}

export const useAcademyStore = create<AcademyStore>((set, get) => ({
  // Initial data
  teacher: mockTeacher,
  students: mockStudents,
  classes: mockClasses,
  attendanceRecords: mockAttendanceRecords,
  homework: mockHomework,
  curriculum: mockCurriculum,
  events: mockSchoolEvents,

  // Initial filters
  selectedClass: null,
  selectedSubject: null,
  homeworkFilter: "all",
  dateFilter: new Date().toISOString().split("T")[0],

  // Filter actions
  setSelectedClass: (classId) => set({ selectedClass: classId }),
  setSelectedSubject: (subject) => set({ selectedSubject: subject }),
  setHomeworkFilter: (filter) => set({ homeworkFilter: filter }),
  setDateFilter: (date) => set({ dateFilter: date }),

  // Attendance actions
  markAttendance: (studentId, classId, status, notes) => {
    const date = get().dateFilter;
    const existingRecord = get().attendanceRecords.find(
      (r) => r.studentId === studentId && r.classId === classId && r.date === date,
    );

    if (existingRecord) {
      // Update existing record
      set({
        attendanceRecords: get().attendanceRecords.map((r) =>
          r.id === existingRecord.id ? { ...r, status, notes } : r,
        ),
      });
    } else {
      // Create new record
      const newRecord: AttendanceRecord = {
        id: `A${Date.now()}`,
        studentId,
        classId,
        date,
        status,
        notes,
      };
      set({ attendanceRecords: [...get().attendanceRecords, newRecord] });
    }
  },

  getAttendanceForDate: (classId, date) => {
    return get().attendanceRecords.filter((r) => r.classId === classId && r.date === date);
  },

  // Homework actions
  addHomework: (homework) => {
    const newHomework: Homework = {
      ...homework,
      id: `H${Date.now()}`,
    };
    set({ homework: [...get().homework, newHomework] });
  },

  updateHomework: (id, updates) => {
    set({
      homework: get().homework.map((h) => (h.id === id ? { ...h, ...updates } : h)),
    });
  },

  deleteHomework: (id) => {
    set({ homework: get().homework.filter((h) => h.id !== id) });
  },

  // Curriculum actions
  updateCurriculumProgress: (id, progress) => {
    set({
      curriculum: get().curriculum.map((c) => (c.id === id ? { ...c, progress } : c)),
    });
  },

  updateCurriculumStatus: (id, status) => {
    set({
      curriculum: get().curriculum.map((c) => (c.id === id ? { ...c, status } : c)),
    });
  },

  // Getters
  getStudentsByClass: (classId) => {
    const classInfo = get().classes.find((c) => c.id === classId);
    if (!classInfo) return [];
    return get().students.filter((s) => classInfo.students.includes(s.id));
  },

  getHomeworkByClass: (classId) => {
    return get().homework.filter((h) => h.classId === classId);
  },

  getCurriculumBySubject: (subject) => {
    return get().curriculum.filter((c) => c.subject === subject);
  },

  getUpcomingEvents: () => {
    const today = new Date();
    return get()
      .events.filter((e) => new Date(e.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 4);
  },
}));
