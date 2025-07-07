export interface ReviewInfo {
  nextReviewDate: Date;
  easeFactor: number;
  intervalDays: number;
  status: 'New' | 'Learning' | 'Review' | 'Relearning';
  lapses: number;
}
