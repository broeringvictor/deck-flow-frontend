import { ReviewInfo } from './review-info.model';

export interface CardQuestion {
  id: string;
  question: string;
  correctAnswers: string;
  incorrectAnswersA: string;
  incorrectAnswersB: string;
  incorrectAnswersC: string;
  incorrectAnswersD: string;
  image: string | null;
  lastUpdated: Date;
  createDate: Date;
  categoryId: string;
  reviewInfo: ReviewInfo;
}
