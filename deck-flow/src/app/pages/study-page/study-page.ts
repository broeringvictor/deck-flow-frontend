// study-page.ts

import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

// Angular Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Componentes e Serviços da Aplicação
import { QuestionCardComponent } from '../../components/study/question-cards/question-cards.component';
import { StudyingCardService } from '../../services/studying-card.service';
import { CardQuestion } from '../../model/card-question.model';
import { startStudyingInterface } from '../../model/start-studying.interface';

// Mock de dados - Mova para um arquivo separado se crescer
interface Category {
  id: string;
  name: string;
}

@Component({
  selector: 'app-study-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    QuestionCardComponent,
  ],
  templateUrl: './study-page.html',
  styleUrl: './study-page.scss',
})
export class StudyPage {
  // Injeção de dependências
  private fb = inject(FormBuilder);
  private studyingCardService = inject(StudyingCardService);

  // Signals para gerenciamento de estado
  questions = signal<CardQuestion[]>([]);
  isLoading = signal(false);

  /** Signal para rastrear se uma busca foi realizada (para mostrar a mensagem de "nenhum card") */
  searchPerformed = signal(false);

  // Mock de categorias
  categories = signal<Category[]>([
    { id: '686bda899c195e722ede4b04', name: 'Geografia Mundial' },
    { id: '686bda8a9c195e722ede4b05', name: 'Ciência e Tecnologia' },
  ]);

  // Formulário reativo
  studyForm = this.fb.group({
    count: [10, [Validators.required, Validators.min(1), Validators.max(50)]],
    categoryId: ['', Validators.required],
  });

  /**
   * Inicia a busca pelas questões de estudo.
   */
  startStudying(): void {
    if (this.studyForm.invalid) {
      return;
    }

    this.isLoading.set(true);
    this.questions.set([]); // Limpa as questões anteriores
    this.searchPerformed.set(true); // Marca que a busca foi iniciada

    const request = this.studyForm.getRawValue() as startStudyingInterface;

    this.studyingCardService.startStuyding(request).subscribe({
      next: (cards) => {
        this.questions.set(cards);
        // O estado de isLoading será tratado no 'finalize'
      },
      error: (err) => {
        console.error('Falha ao buscar questões:', err);
        // Opcional: Adicionar um signal de erro para mostrar uma mensagem na UI
        this.questions.set([]); // Garante que a lista está vazia em caso de erro
      },
      complete: () => {
        this.isLoading.set(false); // Garante que o loading para ao completar ou dar erro
      }
    });
  }

  /**
   * Ouve o evento de um card revisado (opcional, mas bom para rastreamento).
   * @param cardId O ID do card que foi revisado.
   */
  onCardReviewed(cardId: string): void {
    console.log(`O card com ID: ${cardId} foi revisado pelo usuário.`);
    // Aqui você poderia, por exemplo, remover o card da lista ou marcar como concluído
  }
}
