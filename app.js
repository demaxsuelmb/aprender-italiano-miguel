document.addEventListener('DOMContentLoaded', () => {
  // Navigation & Tab Switching
  const navBtns = document.querySelectorAll('.nav-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const currentTabTitle = document.getElementById('currentTabTitle');
  const currentTabDesc = document.getElementById('currentTabDesc');

  const tabMeta = {
    'fonetica': {
      title: '1. Fonética e Pronúncia Italiana',
      desc: 'Aprenda as regras fundamentais de sons, combinação de consoantes e entonação.'
    },
    'artigos': {
      title: '2. Artigos e Gêneros dos Substantivos',
      desc: 'Regras para gênero (o/a/e), plural e escolha precisa dos artigos il, lo, la, l\', i, gli, le.'
    },
    'pronomes-verbos': {
      title: '3. Pronomes Pessoais e Verbos Auxiliares',
      desc: 'Conjugação e uso essencial de Essere (Ser/Estar) e Avere (Ter/Haver).'
    },
    'conjugacoes': {
      title: '4. Conjugações Verbaism Regulares',
      desc: 'Padrão de terminações do Presente Indicativo para verbos em -ARE, -ERE e -IRE.'
    },
    'estrutura': {
      title: '5. Estrutura de Frases & Sintaxe',
      desc: 'Regra de omissão do sujeito e negação com "NON".'
    },
    'flashcards': {
      title: 'Cards de Memorização Teórica',
      desc: 'Pratique a recordação ativa das regras gramaticais chave.'
    },
    'quiz': {
      title: 'Quiz de Fixação da Teoria',
      desc: 'Valide seu conhecimento gramatical respondendo a questões interativas.'
    }
  };

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      navBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(targetTab);
      if (targetPane) targetPane.classList.add('active');

      if (tabMeta[targetTab]) {
        currentTabTitle.textContent = tabMeta[targetTab].title;
        currentTabDesc.textContent = tabMeta[targetTab].desc;
      }
    });
  });

  // Web Speech API - Italian Text to Speech
  const speedRateInput = document.getElementById('speedRate');
  const speedValText = document.getElementById('speedVal');

  let currentSpeed = parseFloat(speedRateInput.value);

  speedRateInput.addEventListener('input', (e) => {
    currentSpeed = parseFloat(e.target.value);
    speedValText.textContent = `${currentSpeed.toFixed(1)}x`;
  });

  function speakItalian(text) {
    if (!('speechSynthesis' in window)) {
      alert('Seu navegador não suporta pronúncia por áudio (SpeechSynthesis).');
      return;
    }

    window.speechSynthesis.cancel(); // Stop any ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'it-IT';
    utterance.rate = currentSpeed;

    // Try to pick an Italian voice if available
    const voices = window.speechSynthesis.getVoices();
    const italianVoice = voices.find(v => v.lang.includes('it') || v.lang.includes('IT'));
    if (italianVoice) {
      utterance.voice = italianVoice;
    }

    window.speechSynthesis.speak(utterance);
  }

  // Attach speak handlers dynamically
  document.addEventListener('click', (e) => {
    const speakBtn = e.target.closest('.btn-speak');
    if (speakBtn) {
      const textToSpeak = speakBtn.getAttribute('data-text');
      if (textToSpeak) {
        speakItalian(textToSpeak);
      }
    }
  });

  // FLASHCARDS DATA & LOGIC
  const flashcardsData = [
    {
      category: 'Fonética - Regra do C',
      front: 'Como pronuncia a palavra "CIAO"?',
      back: 'Pronuncia-se [TCHÁO].',
      desc: 'O C seguido de I forma o som de "tch". Exemplo: Ciao (Tcháo), Cena (Tchêna).',
      audioText: 'Ciao, Cena'
    },
    {
      category: 'Fonética - H "Duro"',
      front: 'Qual é o efeito do H em palavras como "PERCHÉ" e "CHIAVE"?',
      back: 'O H torna o som DURO (Quê / Quî).',
      desc: 'Diferente do português, o H entre C/G e E/I serve para manter o som duro. Ex: Perché [perquê], Chiave [quiáve].',
      audioText: 'Perché, Chiave'
    },
    {
      category: 'Fonética - Som GLI',
      front: 'Como se pronuncia a combinação "GLI" em palavras como "FAMIGLIA"?',
      back: 'Equivale ao som de "LH" em Português.',
      desc: 'Pronuncia-se Fa-mí-lhia. Ex: Figlio (filho), Tagliatelle.',
      audioText: 'Famiglia, Figlio'
    },
    {
      category: 'Artigos Masculinos',
      front: 'Quando devemos usar o artigo "LO" em vez de "IL"?',
      back: 'Antes de S+Consoante, Z, GN, PS ou X/Y.',
      desc: 'Exemplos: Lo studente, Lo zaino, Lo psicologo. No plural vira GLI (Gli studenti).',
      audioText: 'Lo studente, Lo zaino, Gli studenti'
    },
    {
      category: 'Verbos Auxiliares',
      front: 'Qual é a particularidade fonética da conjugação do verbo AVERE (ho, hai, ha, hanno)?',
      back: 'O H é 100% MUDO!',
      desc: 'Pronuncia-se exatamente "ó", "ái", "á", "án-no". O H serve apenas para diferenciar na escrita de outras palavras (ex: o = ou, ho = eu tenho).',
      audioText: 'Io ho, Tu hai, Lui ha, Loro hanno'
    },
    {
      category: 'Sintaxe',
      front: 'Como é feita a negação simples em italiano?',
      back: 'Coloca-se "NON" antes do verbo principal.',
      desc: 'Exemplo: "Non parlo italiano" (Não falo italiano).',
      audioText: 'Non parlo italiano'
    },
    {
      category: 'Gênero e Plural',
      front: 'Qual é o plural de substantivos masculinos ou femininos terminados em -E?',
      back: 'Muda SEMPRE para -I no plural.',
      desc: 'Exemplos: Il ristorante -> I ristoranti / La chiave -> Le chiavi.',
      audioText: 'Il ristorante, I ristoranti, La chiave, Le chiavi'
    },
    {
      category: 'Conjugação -ARE',
      front: 'Quais são as terminações do presente para os verbos em -ARE?',
      back: '-o, -i, -a, -iamo, -ate, -ano',
      desc: 'Exemplo com PARLARE: parlo, parli, parla, parliamo, parlate, parlano.',
      audioText: 'Io parlo, tu parli, lui parla, noi parliamo, voi parlate, loro parlano'
    }
  ];

  let fcCurrentIdx = 0;
  const mainFlashcard = document.getElementById('mainFlashcard');
  const fcCategory = document.getElementById('fcCategory');
  const fcFrontText = document.getElementById('fcFrontText');
  const fcBackText = document.getElementById('fcBackText');
  const fcBackDesc = document.getElementById('fcBackDesc');
  const fcSpeakBtn = document.getElementById('fcSpeakBtn');
  const fcIndex = document.getElementById('fcIndex');
  const fcTotal = document.getElementById('fcTotal');

  fcTotal.textContent = flashcardsData.length;

  function loadFlashcard(idx) {
    mainFlashcard.classList.remove('flipped');
    setTimeout(() => {
      const card = flashcardsData[idx];
      fcCategory.textContent = card.category;
      fcFrontText.textContent = card.front;
      fcBackText.textContent = card.back;
      fcBackDesc.textContent = card.desc;
      fcSpeakBtn.setAttribute('data-text', card.audioText);
      fcIndex.textContent = idx + 1;
    }, 200);
  }

  mainFlashcard.addEventListener('click', () => {
    mainFlashcard.classList.toggle('flipped');
  });

  document.getElementById('btnPrevFc').addEventListener('click', () => {
    if (fcCurrentIdx > 0) {
      fcCurrentIdx--;
      loadFlashcard(fcCurrentIdx);
    }
  });

  document.getElementById('btnNextFc').addEventListener('click', () => {
    if (fcCurrentIdx < flashcardsData.length - 1) {
      fcCurrentIdx++;
      loadFlashcard(fcCurrentIdx);
    } else {
      fcCurrentIdx = 0;
      loadFlashcard(fcCurrentIdx);
    }
  });

  // QUIZ DATA & LOGIC
  const quizQuestions = [
    {
      question: 'Qual é o artigo definido singular correto para a palavra "STUDENTE" (começa com S+consoante)?',
      options: ['Il studente', 'Lo studente', 'La studente', 'Un studente'],
      correct: 1,
      explanation: 'Usa-se "LO" para palavras masculinas que começam com S + consoante (ex: lo studente, lo spagnolo).'
    },
    {
      question: 'Como se pronuncia o verbo "PERCHÉ"?',
      options: ['Per-tché', 'Per-quê', 'Per-xé', 'Per-sé'],
      correct: 1,
      explanation: 'A combinação CHE forma o som de "QUÊ" (som duro).'
    },
    {
      question: 'Qual é a 1ª pessoa do plural (Noi) do verbo ESSERE (Ser/Estar)?',
      options: ['Noi siamo', 'Noi siete', 'Noi sono', 'Noi abbiamo'],
      correct: 0,
      explanation: 'A conjugação é: Io sono, Tu sei, Lui/Lei è, Noi siamo, Voi siete, Loro sono.'
    },
    {
      question: 'Qual é o plural correto do substantivo "LA CHIAVE" (a chave)?',
      options: ['Le chave', 'Le chiava', 'Le chiavi', 'I chiavi'],
      correct: 2,
      explanation: 'Substantivos terminados em -E (femininos ou masculinos) mudam para -I no plural. E o artigo "La" vira "Le".'
    },
    {
      question: 'Como se nega a frase "Parlo italiano"?',
      options: ['Parlo non italiano.', 'Non parlo italiano.', 'No parlo italiano.', 'Parlo italiano non.'],
      correct: 1,
      explanation: 'Em italiano, o advérbio de negação "NON" vem sempre imediatamente ANTES do verbo principal.'
    }
  ];

  let currentQuizIdx = 0;
  let score = 0;

  const quizProgress = document.getElementById('quizProgress');
  const quizQuestionCount = document.getElementById('quizQuestionCount');
  const quizScoreText = document.getElementById('quizScoreText');
  const quizQuestion = document.getElementById('quizQuestion');
  const quizOptions = document.getElementById('quizOptions');
  const quizExplanation = document.getElementById('quizExplanation');
  const btnNextQuestion = document.getElementById('btnNextQuestion');

  function renderQuizQuestion() {
    const q = quizQuestions[currentQuizIdx];
    quizQuestion.textContent = q.question;
    quizQuestionCount.textContent = `Questão ${currentQuizIdx + 1} de ${quizQuestions.length}`;
    quizProgress.style.width = `${((currentQuizIdx) / quizQuestions.length) * 100}%`;

    quizOptions.innerHTML = '';
    quizExplanation.classList.add('hidden');
    btnNextQuestion.classList.add('hidden');

    q.options.forEach((optText, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-opt';
      btn.textContent = optText;
      btn.addEventListener('click', () => selectAnswer(idx, q.correct, q.explanation));
      quizOptions.appendChild(btn);
    });
  }

  function selectAnswer(selectedIdx, correctIdx, explanationText) {
    const optionBtns = quizOptions.querySelectorAll('.quiz-opt');
    optionBtns.forEach(btn => btn.disabled = true);

    if (selectedIdx === correctIdx) {
      optionBtns[selectedIdx].classList.add('correct');
      score += 20;
      quizScoreText.textContent = `Pontuação: ${score}`;
    } else {
      optionBtns[selectedIdx].classList.add('wrong');
      optionBtns[correctIdx].classList.add('correct');
    }

    quizExplanation.textContent = explanationText;
    quizExplanation.classList.remove('hidden');
    btnNextQuestion.classList.remove('hidden');
  }

  btnNextQuestion.addEventListener('click', () => {
    currentQuizIdx++;
    if (currentQuizIdx < quizQuestions.length) {
      renderQuizQuestion();
    } else {
      // Quiz complete
      quizQuestion.textContent = `🎉 Parabéns! Quiz Concluído!`;
      quizProgress.style.width = `100%`;
      quizOptions.innerHTML = `<p style="font-size: 1.1rem; color: #4ADE80; font-weight: 600;">Sua pontuação final foi: ${score} de 100 pontos.</p>
      <p style="color: var(--text-muted); margin-top: 8px;">Você revisou todos os pilares teóricos fundamentais do italiano!</p>`;
      quizExplanation.classList.add('hidden');
      btnNextQuestion.classList.add('hidden');
    }
  });

  renderQuizQuestion();

  // Search Filter functionality
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();
    if (!term) return;

    // Search across cards and highlight matches
    const cards = document.querySelectorAll('.card, .sound-card');
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      if (text.includes(term)) {
        card.style.opacity = '1';
        card.style.transform = 'scale(1.01)';
        card.style.borderColor = 'var(--gold-ita)';
      } else {
        card.style.opacity = '0.4';
        card.style.transform = 'scale(1)';
        card.style.borderColor = 'var(--border-color)';
      }
    });
  });
});
