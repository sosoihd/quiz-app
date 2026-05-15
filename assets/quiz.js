class QuizApp {
  constructor(data) {
    this.questions = data.questions;
    this.current = 0;
    this.score = 0;
    this.answered = false;

    this.$progress     = document.getElementById('progress-bar');
    this.$progressLbl  = document.getElementById('progress-label');
    this.$questionText = document.getElementById('question-text');
    this.$optionsList  = document.getElementById('options-list');
    this.$feedback     = document.getElementById('feedback');
    this.$nextBtn      = document.getElementById('next-btn');
    this.$quizWrap     = document.getElementById('quiz-container');
    this.$scoreScreen  = document.getElementById('score-screen');
    this.$scoreNumber  = document.getElementById('score-number');
    this.$retryBtn     = document.getElementById('retry-btn');

    this.$nextBtn.addEventListener('click', () => this.next());
    this.$retryBtn.addEventListener('click', () => this.reset());

    this.render();
  }

  render() {
    const q = this.questions[this.current];
    const total = this.questions.length;

    const pct = (this.current / total) * 100;
    this.$progress.style.width = pct + '%';
    this.$progressLbl.textContent = `Question ${this.current + 1} / ${total}`;

    this.$questionText.textContent = q.question;
    this.$optionsList.innerHTML = '';
    this.$feedback.className = '';
    this.$feedback.textContent = '';
    this.$nextBtn.disabled = true;
    this.answered = false;

    q.options.forEach((opt, i) => {
      const li  = document.createElement('li');
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = opt;
      btn.addEventListener('click', () => this.select(i));
      li.appendChild(btn);
      this.$optionsList.appendChild(li);
    });
  }

  select(idx) {
    if (this.answered) return;
    this.answered = true;

    const q    = this.questions[this.current];
    const btns = this.$optionsList.querySelectorAll('.option-btn');

    btns.forEach(b => b.disabled = true);

    if (idx === q.correct) {
      btns[idx].classList.add('correct');
      this.score++;
      this.$feedback.textContent = q.explanation || '✓ Bonne réponse !';
      this.$feedback.className = 'show correct';
    } else {
      btns[idx].classList.add('wrong');
      btns[q.correct].classList.add('correct');
      this.$feedback.textContent = q.explanation
        ? `✗ ${q.explanation}`
        : `✗ La bonne réponse était : ${q.options[q.correct]}`;
      this.$feedback.className = 'show wrong';
    }

    this.$nextBtn.disabled = false;
    this.$nextBtn.textContent =
      this.current < this.questions.length - 1 ? 'Suivant →' : 'Voir le score';
  }

  next() {
    if (this.current < this.questions.length - 1) {
      this.current++;
      this.render();
    } else {
      this.showScore();
    }
  }

  showScore() {
    document.getElementById('quiz-wrap').style.display = 'none';
    this.$scoreScreen.classList.add('show');

    const pct = Math.round((this.score / this.questions.length) * 100);
    this.$scoreNumber.textContent = this.score;
    document.getElementById('score-total').textContent = `/ ${this.questions.length}`;

    let msg;
    if (pct >= 80)      msg = 'Excellent ! Tu maîtrises bien ce sujet. 🎉';
    else if (pct >= 50) msg = 'Pas mal ! Quelques révisions s\'imposent. 💪';
    else                msg = 'Continue à réviser, tu vas y arriver ! 📚';

    document.getElementById('score-message').textContent = msg;
    document.querySelector('#score-circle').style.borderColor =
      pct >= 80 ? 'var(--success)' : pct >= 50 ? 'var(--accent)' : 'var(--error)';
  }

  reset() {
    this.current = 0;
    this.score = 0;
    document.getElementById('quiz-wrap').style.display = 'block';
    this.$scoreScreen.classList.remove('show');
    this.$progress.style.width = '0%';
    this.render();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (typeof QUIZ_DATA !== 'undefined') {
    new QuizApp(QUIZ_DATA);
  }
});
