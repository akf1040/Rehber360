export interface ExamAnxietyQuestion {
  id: number;
  text: string;
}

export interface ExamAnxietyCategory {
  id: string;
  title: string;
  questions: number[];
  interpretations: {
    high: {
      range: string;
      text: string;
    };
    low: {
      range: string;
      text: string;
    };
  };
}

export interface ExamAnxietyAnswer {
  questionId: number;
  answer: boolean;
}

export interface ExamAnxietyResult {
  categoryId: string;
  score: number;
  interpretation: string;
}


export interface StudentInfo {
  school: string;
  fullName: string;
  class: string;
  gender: string;
  date: string;
}

// Firestore'da anket atama ve cevap için kullanılacak tipler
export interface AssignedSurvey {
  id: string; // Firestore doc id
  studentId: string;
  teacherId: string;
  surveyType: 'examAnxiety';
  status: 'assigned' | 'answered' | 'reviewed';
  assignedAt: string; // ISO date
  answeredAt?: string;
  reviewedAt?: string;
}

export interface ExamAnxietySurveyResponse {
  id: string; // Firestore doc id
  assignedSurveyId: string;
  studentId: string;
  answers: ExamAnxietyAnswer[];
  results: ExamAnxietyResult[];
  submittedAt: string;
}
