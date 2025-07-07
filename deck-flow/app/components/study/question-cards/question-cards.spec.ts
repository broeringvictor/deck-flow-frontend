import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionCards } from './question-cards';

describe('QuestionCards', () => {
  let component: QuestionCards;
  let fixture: ComponentFixture<QuestionCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionCards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
