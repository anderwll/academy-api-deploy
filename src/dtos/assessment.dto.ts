export interface CreateAssessmentDto {
  title: string;
  description?: string;
  grade: number;
  studentId: string;
  studentLoggedId: string;
}

export interface UpdateDTO {
  title?: string;
  description?: string;
  grade?: number;
}
