import {AnswerQuality} from '../enums/answer-quality.enum';

export interface startStudyingInterface {
  count: number | 10;
  categoryId: string;
}

export interface updateReviewInterface {
  cardId: string
  quality: AnswerQuality
}


