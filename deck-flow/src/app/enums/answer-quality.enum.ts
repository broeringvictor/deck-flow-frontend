export enum AnswerQuality {
  /**
   * O usuário não lembrou da resposta.
   * Reinicia o aprendizado do card.
   */
  Again = 0,

  /**
   * O usuário lembrou, mas com muita dificuldade.
   */
  Hard = 3,

  /**
   * O usuário lembrou corretamente.
   */
  Good = 4,

  /**
   * O usuário lembrou com facilidade.
   * Acelera o intervalo de aprendizado.
   */
  Easy = 5,
}
