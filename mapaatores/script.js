const app = document.getElementById('app');
const slides = Array.from(document.querySelectorAll('.slide'));
const agenda = document.getElementById('agenda');
const overview = document.getElementById('overview');
const overviewGrid = document.getElementById('overviewGrid');
const notesPanel = document.getElementById('notesPanel');
const notesText = document.getElementById('notesText');
const slideTitle = document.getElementById('slideTitle');
const slideKicker = document.getElementById('slideKicker');
const counter = document.getElementById('counter');
const progressBar = document.getElementById('progressBar');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const notesBtn = document.getElementById('notesBtn');
const closeNotes = document.getElementById('closeNotes');
const overviewBtn = document.getElementById('overviewBtn');
const closeOverview = document.getElementById('closeOverview');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const fullscreenSideBtn = document.getElementById('fullscreenSideBtn');

// Controles flutuantes de tela cheia
const floatPrevBtn = document.getElementById('floatPrevBtn');
const floatNextBtn = document.getElementById('floatNextBtn');
const floatCounter = document.getElementById('floatCounter');
const floatNotesBtn = document.getElementById('floatNotesBtn');
const floatExitBtn = document.getElementById('floatExitBtn');

let current = 0;

/* ==========================================================================
   LÓGICA DO JOGO: DESAFIO DOS ATORES SOCIAIS
   ========================================================================== */
const gameQuestions = [
  {
    text: '"O proprietário do terreno baldio abandonado onde o projeto propõe criar uma horta comunitária."',
    correct: 'satisfazer',
    verdictCorrect: '🎯 Exato! Alto Poder de Veto / Negociação.',
    verdictWrong: '❌ Cuidado! Ele possui Alto Poder de Veto.',
    explanation: 'Sem a anuência legal do proprietário, a intervenção física pode ser barrada judicialmente ou gerar despejo. Deve ser negociado com respaldo documental.'
  },
  {
    text: '"As mães e famílias moradoras vizinhas que sofrem com a falta de opções de alimentação saudável no bairro."',
    correct: 'parceria',
    verdictCorrect: '🎯 Perfeito! Alta Prioridade / Parceria Comunitária.',
    verdictWrong: '❌ Incorreto! Elas são o coração da intervenção.',
    explanation: 'Devem ser empoderadas e atuar como coprojetistas desde o primeiro dia. O projeto existe para e com elas.'
  },
  {
    text: '"A Vigilância Sanitária Municipal, responsável pelas regras de manipulação de alimentos."',
    correct: 'satisfazer',
    verdictCorrect: '🎯 Muito bem! Alto Poder / Satisfazer Requisitos.',
    verdictWrong: '❌ Atenção! Trata-se de órgão regulador de Alto Poder.',
    explanation: 'Não participará do plantio diário, mas suas normas técnicas precisam ser atendidas para que a feira ou distribuição funcione legalmente.'
  },
  {
    text: '"Um coletivo de artistas de outra cidade que elogiou a iniciativa nas redes sociais."',
    correct: 'ignorar',
    verdictCorrect: '🎯 Correto! Baixo Poder / Baixo Interesse Territorial.',
    verdictWrong: '❌ Não! É um ator periférico.',
    explanation: 'Pode ser apenas monitorado. O foco de energia da equipe de extensão deve permanecer nos sujeitos concretos do território.'
  },
  {
    text: '"A diretora da Escola Municipal ao lado da praça, disposta a incluir a horta nas aulas de ciências."',
    correct: 'parceria',
    verdictCorrect: '🎯 Brilhante! Parceria Estratégica Institucional.',
    verdictWrong: '❌ Errado! Trata-se de uma Parceria Estratégica.',
    explanation: 'Possui alto interesse pedagógico e forte legitimidade com as famílias do bairro, multiplicando o impacto do projeto.'
  }
];

let gameRound = 0;
let gameScore = 0;

const gameCaseText = document.getElementById('gameCaseText');
const gameRoundBadge = document.getElementById('gameRoundBadge');
const gameScoreEl = document.getElementById('gameScore');
const gameTotalEl = document.getElementById('gameTotal');
const gameFeedback = document.getElementById('gameFeedback');
const feedbackVerdict = document.getElementById('feedbackVerdict');
const feedbackText = document.getElementById('feedbackText');
const nextGameRoundBtn = document.getElementById('nextGameRoundBtn');
const gameButtons = document.querySelectorAll('.game-btn');

function initGame() {
  if (!gameCaseText) return;
  gameRound = 0;
  gameScore = 0;
  gameTotalEl.textContent = gameQuestions.length;
  renderGameRound();
}

function renderGameRound() {
  const q = gameQuestions[gameRound];
  gameRoundBadge.textContent = `Rodada ${gameRound + 1} de ${gameQuestions.length}`;
  gameCaseText.textContent = q.text;
  gameScoreEl.textContent = gameScore;
  gameFeedback.className = 'game-feedback';
  gameButtons.forEach(btn => {
    btn.disabled = false;
    btn.style.opacity = '1';
  });
}

function checkGameAnswer(choice) {
  const q = gameQuestions[gameRound];
  const isCorrect = (choice === q.correct);

  gameButtons.forEach(btn => btn.disabled = true);

  if (isCorrect) {
    gameScore += 1;
    gameScoreEl.textContent = gameScore;
    gameFeedback.className = 'game-feedback active correct';
    feedbackVerdict.textContent = q.verdictCorrect;
  } else {
    gameFeedback.className = 'game-feedback active wrong';
    feedbackVerdict.textContent = q.verdictWrong;
  }

  feedbackText.textContent = q.explanation;
  
  if (gameRound === gameQuestions.length - 1) {
    nextGameRoundBtn.textContent = 'Finalizar Desafio 🏆';
  } else {
    nextGameRoundBtn.textContent = 'Próximo Caso →';
  }
}

gameButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const choice = btn.dataset.choice;
    checkGameAnswer(choice);
  });
});

if (nextGameRoundBtn) {
  nextGameRoundBtn.addEventListener('click', () => {
    if (gameRound < gameQuestions.length - 1) {
      gameRound += 1;
      renderGameRound();
    } else {
      gameFeedback.className = 'game-feedback active correct';
      feedbackVerdict.textContent = `🎉 Desafio Concluído! Placar: ${gameScore}/${gameQuestions.length}`;
      feedbackText.textContent = 'A turma compreendeu que cada ator demanda um canal específico de escuta, pactuação ou parceria.';
      nextGameRoundBtn.style.display = 'none';
    }
  });
}

/* ==========================================================================
   NAVEGAÇÃO E INTERFACE
   ========================================================================== */
function buildNavigation() {
  agenda.innerHTML = '';
  overviewGrid.innerHTML = '';

  slides.forEach((slide, index) => {
    const title = slide.dataset.title || `Slide ${index + 1}`;

    const agendaBtn = document.createElement('button');
    agendaBtn.type = 'button';
    agendaBtn.innerHTML = `<span>${index + 1}</span><span>${title}</span>`;
    agendaBtn.addEventListener('click', () => goTo(index));
    agenda.appendChild(agendaBtn);

    const ovBtn = document.createElement('button');
    ovBtn.type = 'button';
    ovBtn.innerHTML = `<span>${slide.dataset.kicker || 'Slide'}</span><strong>${index + 1}. ${title}</strong>`;
    ovBtn.addEventListener('click', () => {
      goTo(index);
      toggleOverview(false);
    });
    overviewGrid.appendChild(ovBtn);
  });
}

function updateUI() {
  slides.forEach((slide, index) => slide.classList.toggle('active', index === current));
  Array.from(agenda.children).forEach((btn, index) => btn.classList.toggle('active', index === current));
  Array.from(overviewGrid.children).forEach((btn, index) => btn.classList.toggle('active', index === current));

  const slide = slides[current];
  const title = slide.dataset.title || `Slide ${current + 1}`;
  slideTitle.textContent = title;
  slideKicker.textContent = slide.dataset.kicker || 'Aula Expositiva';
  
  const countStr = `${current + 1} / ${slides.length}`;
  counter.textContent = countStr;
  floatCounter.textContent = countStr;
  
  progressBar.style.width = `${((current + 1) / slides.length) * 100}%`;
  notesText.textContent = slide.dataset.notes || 'Sem notas para este slide.';
  document.title = `${title} · Mapeamento de Atores`;
  history.replaceState(null, '', `#${current + 1}`);

  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === slides.length - 1;
  prevBtn.style.opacity = prevBtn.disabled ? '0.4' : '1';
  nextBtn.style.opacity = nextBtn.disabled ? '0.4' : '1';
}

function goTo(index, resetSteps = true) {
  current = Math.max(0, Math.min(index, slides.length - 1));
  const activeSlide = slides[current];

  if (resetSteps) {
    activeSlide.querySelectorAll('.step-item').forEach(el => el.classList.remove('revealed'));
  }
  updateUI();
}

function next() {
  const activeSlide = slides[current];
  const unrevealedItems = activeSlide.querySelectorAll('.step-item:not(.revealed)');

  if (unrevealedItems.length > 0) {
    unrevealedItems[0].classList.add('revealed');
    return;
  }

  if (current < slides.length - 1) {
    goTo(current + 1);
  }
}

function prev() {
  const activeSlide = slides[current];
  const revealedItems = activeSlide.querySelectorAll('.step-item.revealed');

  if (revealedItems.length > 0) {
    revealedItems[revealedItems.length - 1].classList.remove('revealed');
    return;
  }

  if (current > 0) {
    goTo(current - 1, false);
    slides[current].querySelectorAll('.step-item').forEach(el => el.classList.add('revealed'));
  }
}

function toggleNotes(force) {
  const shouldOpen = typeof force === 'boolean' ? force : !notesPanel.classList.contains('open');
  notesPanel.classList.toggle('open', shouldOpen);
}

function toggleOverview(force) {
  const shouldOpen = typeof force === 'boolean' ? force : !overview.classList.contains('open');
  overview.classList.toggle('open', shouldOpen);
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.().catch(() => {});
    app.classList.add('fullscreen-mode');
  } else {
    document.exitFullscreen?.().catch(() => {});
    app.classList.remove('fullscreen-mode');
  }
}

document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement) {
    app.classList.remove('fullscreen-mode');
  } else {
    app.classList.add('fullscreen-mode');
  }
  updateUI();
});

buildNavigation();

const initialHash = Number.parseInt(location.hash.replace('#', ''), 10);
if (!Number.isNaN(initialHash) && initialHash >= 1 && initialHash <= slides.length) {
  current = initialHash - 1;
}
updateUI();
initGame();

// Eventos de clique
prevBtn.addEventListener('click', prev);
nextBtn.addEventListener('click', next);
notesBtn.addEventListener('click', () => toggleNotes());
closeNotes.addEventListener('click', () => toggleNotes(false));
overviewBtn.addEventListener('click', () => toggleOverview());
closeOverview.addEventListener('click', () => toggleOverview(false));
fullscreenBtn.addEventListener('click', toggleFullscreen);
fullscreenSideBtn.addEventListener('click', toggleFullscreen);

// Controles Flutuantes
floatPrevBtn.addEventListener('click', prev);
floatNextBtn.addEventListener('click', next);
floatNotesBtn.addEventListener('click', () => toggleNotes());
floatExitBtn.addEventListener('click', toggleFullscreen);

// Clique no slide avança passos internos
slides.forEach(slide => {
  slide.addEventListener('click', (e) => {
    if (e.target.closest('button, a, table, .game-options, .game-feedback')) return;
    const unrevealedItems = slide.querySelectorAll('.step-item:not(.revealed)');
    if (unrevealedItems.length > 0) {
      unrevealedItems[0].classList.add('revealed');
    }
  });
});

// Teclado
document.addEventListener('keydown', (e) => {
  if (['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) return;

  if (['ArrowRight', 'PageDown', ' '].includes(e.key)) {
    e.preventDefault();
    next();
  } else if (['ArrowLeft', 'PageUp'].includes(e.key)) {
    e.preventDefault();
    prev();
  } else if (e.key === 'Home') {
    goTo(0);
  } else if (e.key === 'End') {
    goTo(slides.length - 1);
  } else if (e.key.toLowerCase() === 'n') {
    toggleNotes();
  } else if (e.key.toLowerCase() === 'o') {
    toggleOverview();
  } else if (e.key.toLowerCase() === 'f') {
    toggleFullscreen();
  } else if (e.key === 'Escape') {
    toggleNotes(false);
    toggleOverview(false);
  }
});
