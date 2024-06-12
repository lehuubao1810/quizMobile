type Answer = {
  content: string;
};

export type Question = {
  _id: string;
  question: string;
  answer: Answer[];
  selectedAnswer?: Answer;
};
