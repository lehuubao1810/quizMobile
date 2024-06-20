import { Exam } from "./Exam";

export type Essay = Exam & {
  content: string;
  total_time_left: number;
  files?: string[];
  isFirst?: boolean;
};
