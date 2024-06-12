import { Exam } from "./Exam";
import { Question } from "./Question";

export type ResultQuiz = {
  quizId: string;
  num_true_answer: string;
  ten_point_scale: string;
  total_exam: number; // total answer selected
  total_score_all_questions: number;
  total_true_answer: number;
};

export type Quiz = Exam & {
  dataExam: Question[];
  quiz_answer_id: string;
  quiz_exam_id: string;
  timeStart: Date;
  status?: string;
};

export type Answer = {
  question_id?: string;
  answer: number;
};
