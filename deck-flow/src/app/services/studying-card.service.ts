import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {startStudyingInterface, updateReviewInterface} from '../model/start-studying.interface';
import {Observable} from 'rxjs';
import {CardQuestion} from '../model/card-question.model';

@Injectable({
  providedIn: 'root'
})
export class StudyingCardService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7203/api/v1/studying';

  /**
   * Atualiza a revisão de um card.
   * @returns Um Observable que completa quando a requisição é bem-sucedida.
   */
  startStuyding(request: startStudyingInterface): Observable<CardQuestion[]> {
    const url = `${this.apiUrl}/start`;
    return this.http.post<CardQuestion[]>(url, request);
  }

  updateReview(request: updateReviewInterface): Observable<void> {
    const url = `${this.apiUrl}/update-review`;
    return this.http.put<void>(url, request);
  }


}
