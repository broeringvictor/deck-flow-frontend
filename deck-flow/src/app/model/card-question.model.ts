import { ReviewInfo } from './review-info.model';

export interface CardQuestion {
  id: string;
  question: string;
  correctAnswers: string;
  incorrectAnswersA?: string | null;
  incorrectAnswersB?: string | null;
  incorrectAnswersC?: string | null;
  incorrectAnswersD?: string | null;
  image?: string;
  lastUpdated: Date;
  createDate: Date;
  categoryId: string;
  reviewInfo: ReviewInfo;
}
