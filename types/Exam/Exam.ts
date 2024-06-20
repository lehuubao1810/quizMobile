export type Exam = {
  _id: string;
  title: string;
  teacher_id: string;
  teacher_name: string;
  course_id: string;
  course_name: string;
  total_time: number;
  time_remaining: number;
  max_score?: number;
  time_begin: Date;
  time_end: Date;
  score?: number;
  status?: string;
};
