export enum AppStatus {
  DASHBOARD = 'DASHBOARD',
  GENERATING = 'GENERATING',
  TESTING = 'TESTING',
  REVIEW = 'REVIEW',
}

export interface Question {
  id: number;
  questionText: string;
  codeSnippet?: string; // Optional HCL code block
  options: string[];
  correctAnswerIndices: number[]; // Supports multiple select
  explanation: string;
  domain: string; // Exam objective domain
}

export interface UserAnswer {
  questionId: number;
  selectedIndices: number[];
}

export interface TestResult {
  testId: number;
  score: number;
  totalQuestions: number;
  passed: boolean;
  dateTaken: string;
  userAnswers: UserAnswer[];
  questions: Question[];
}

export interface TopicConfig {
  id: string;
  name: string;
  weight: number; // Percentage 0-1
  questionCount: number; // Target questions per 57-question exam
}

// Official HashiCorp Terraform Associate 003 Exam Objectives & Weightage
// Total Questions: 57
export const EXAM_TOPIC_CONFIG: TopicConfig[] = [
  { id: "iac-concepts", name: "1. Understand infrastructure as code (IaC) concepts", weight: 0.10, questionCount: 6 },
  { id: "terraform-purpose", name: "2. Understand the purpose of Terraform (vs other IaC)", weight: 0.07, questionCount: 4 },
  { id: "terraform-basics", name: "3. Understand Terraform basics (providers, resources, data sources)", weight: 0.10, questionCount: 6 },
  { id: "terraform-cli", name: "4. Use Terraform CLI (init, plan, apply, destroy, fmt, validate)", weight: 0.10, questionCount: 6 },
  { id: "terraform-modules", name: "5. Interact with Terraform modules (inputs, outputs, source)", weight: 0.13, questionCount: 7 },
  { id: "terraform-workflow", name: "6. Navigate Terraform workflow (write -> plan -> create)", weight: 0.25, questionCount: 14 },
  { id: "terraform-state", name: "7. Implement and maintain state (backend, locking, remote)", weight: 0.13, questionCount: 7 },
  { id: "terraform-config", name: "8. Read, generate, and modify configuration (variables, locals, loops)", weight: 0.08, questionCount: 5 },
  { id: "terraform-cloud", name: "9. Understand Terraform Cloud capabilities", weight: 0.04, questionCount: 2 }
];

export const EXAM_DURATION_SECONDS = 60 * 60; // 60 Minutes