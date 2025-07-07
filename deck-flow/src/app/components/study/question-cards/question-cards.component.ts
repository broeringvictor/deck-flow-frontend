import {ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardQuestion } from '../../../model/card-question.model';
import { AnswerQuality } from '../../../enums/answer-quality.enum'; //
import { StudyingCardService } from '../../../services/studying-card.service';
import { updateReviewInterface } from '../../../model/start-studying.interface';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';

@Component({
  selector: 'app-question-card',
  standalone: true,

  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatSnackBarModule
  ],
  templateUrl: './question-cards.component.html', //
  styleUrl: './question-cards.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionCardComponent {
  // Entradas e Saídas
  questionCard = input.required<CardQuestion>();
  cardReviewed = output<void>();

  // Injeção de dependências
  private _snackBar = inject(MatSnackBar);
  private studyingCardService = inject(StudyingCardService);

  // Estado do Componente com Signals
  selectedAnswer = signal<string | undefined>(undefined);
  isSubmitting = signal(false);
  showFeedback = signal(false);
  correctAnswer = signal<string | undefined>(undefined);

  // Controle de formulário para o mat-select
  qualityControl = new FormControl(
    { value: null as AnswerQuality | null, disabled: true },
    Validators.required
  );



  readonly answerQualityOptions = Object.keys(AnswerQuality)
    .filter(key => isNaN(Number(key)))
    .map(key => ({
      label: key,
      value: AnswerQuality[key as keyof typeof AnswerQuality] as AnswerQuality,
    }));




  // Lógica de embaralhamento das respostas
  shuffledAnswers = computed(() => {
    const card = this.questionCard();
    if (!card) return [];

    const answers = [
      card.correctAnswers,
      card.incorrectAnswersA,
      card.incorrectAnswersB,
      card.incorrectAnswersC,
      card.incorrectAnswersD,
    ];

    const filteredAnswers = answers.filter(Boolean as any as (value: any) => value is string);

    // Algoritmo de Fisher-Yates para embaralhar
    for (let i = filteredAnswers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [filteredAnswers[i], filteredAnswers[j]] = [filteredAnswers[j], filteredAnswers[i]];
    }

    return filteredAnswers;
  });


  /**
   * Define a resposta selecionada pelo usuário.
   * @param answer A resposta escolhida.
   */
  constructor() {
    effect(() => {

      if (this.selectedAnswer() && !this.isSubmitting()) {
        this.qualityControl.enable();
      } else {
        this.qualityControl.disable();
      }
    });
  }

  selectAnswer(answer: string): void {
    this.selectedAnswer.set(answer);
  }

  onSubmit(): void {
    if (!this.qualityControl.valid || !this.selectedAnswer() || this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    const card = this.questionCard();
    // Armazena a resposta correta para usar no template
    this.correctAnswer.set(card.correctAnswers);
    let payload: updateReviewInterface;

    if (this.selectedAnswer() === card.correctAnswers) {
      this._snackBar.open('Resposta correta!', 'Fechar', { duration: 3000 });
      payload = { cardId: card.id, quality: this.qualityControl.value! };
    } else {
      this._snackBar.open(`Resposta incorreta! A resposta certa era: "${card.correctAnswers}"`, 'Fechar', { duration: 5000 });
      payload = { cardId: card.id, quality: AnswerQuality.Again };
    }

    // Mostra o feedback visual
    this.showFeedback.set(true);

    // Adiciona um delay antes de passar para o próximo card para o usuário ver o feedback
    setTimeout(() => {
      this.studyingCardService.updateReview(payload).subscribe({
        next: () => {
          this.cardReviewed.emit();
          this.resetState();
        },
        error: (err) => {
          console.error('Erro ao atualizar a revisão:', err);
          this.isSubmitting.set(false);
          this.showFeedback.set(false); // Esconde o feedback em caso de erro
        },
      });
    }, 1500); // Delay de 1.5 segundos
  }

  private resetState(): void {
    this.selectedAnswer.set(undefined);
    this.qualityControl.reset();
    this.isSubmitting.set(false);
    // Reseta os signals de feedback
    this.showFeedback.set(false);
    this.correctAnswer.set(undefined);
  }

  protected readonly String = String;
}
