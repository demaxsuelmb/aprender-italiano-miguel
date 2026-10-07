document.addEventListener('DOMContentLoaded', () => {
  // Navigation & Tab Switching
  const navBtns = document.querySelectorAll('.nav-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const currentTabTitle = document.getElementById('currentTabTitle');
  const currentTabDesc = document.getElementById('currentTabDesc');

  const tabMeta = {
    'conversazione': {
      title: 'Modo Conversação Interativa (Voz & Chat)',
      desc: 'Pratique conversação em tempo real com voz nativa e reconhecimento de microfone no navegador.'
    },
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
      title: '4. Conjugações Verbais Regulares',
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

  // Web Speech API - Italian Text to Speech (TTS)
  const speedRateInput = document.getElementById('speedRate');
  const speedValText = document.getElementById('speedVal');
  let currentSpeed = parseFloat(speedRateInput.value);

  speedRateInput.addEventListener('input', (e) => {
    currentSpeed = parseFloat(e.target.value);
    speedValText.textContent = `${currentSpeed.toFixed(1)}x`;
  });

  function speakItalian(text) {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'it-IT';
    utterance.rate = currentSpeed;

    const voices = window.speechSynthesis.getVoices();
    const italianVoice = voices.find(v => v.lang.includes('it') || v.lang.includes('IT'));
    if (italianVoice) utterance.voice = italianVoice;

    window.speechSynthesis.speak(utterance);
  }

  document.addEventListener('click', (e) => {
    const speakBtn = e.target.closest('.btn-speak');
    if (speakBtn) {
      const textToSpeak = speakBtn.getAttribute('data-text');
      if (textToSpeak) speakItalian(textToSpeak);
    }
  });

  // --- BROWSER INTERACTIVE CONVERSATION CHAT ENGINE ---
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const btnSend = document.getElementById('btnSend');
  const btnMic = document.getElementById('btnMic');
  const partnerName = document.getElementById('partnerName');
  const feedbackPanel = document.getElementById('feedbackPanel');
  const feedbackContent = document.getElementById('feedbackContent');
  const autoAudioToggle = document.getElementById('autoAudioToggle');
  const scenarioCards = document.querySelectorAll('.scenario-card');

  let currentScenario = 'casual';

  const scenariosData = {
    'casual': {
      name: 'Luca - Tutor de Italiano',
      welcome: 'Ciao! Io sono Luca. Benvenuto! Come ti chiami e di dove sei?',
      responses: [
        {
          trigger: ['chiamo', 'sono', 'meu nome', 'mi chiamo', 'sou'],
          reply: 'Piacere di conoscerti! Che cosa fai di bello oggi? Lavori o studi?',
          feedback: '💡 **Dica**: Em italiano, usamos *"Piacere di conoscerti"* (Prazer em te conhecer) ou *"Piacere!"*.'
        },
        {
          trigger: ['lavoro', 'studio', 'trabalho', 'estudo', 'trabalhar', 'estudar'],
          reply: 'Molto interessante! E parli già un po\' di italiano o stai iniziando adesso?',
          feedback: '💡 **Vocabulário**: *"Lavoro"* = eu trabalho / *"Studio"* = eu estudo.'
        },
        {
          trigger: ['inizando', 'pouco', 'poco', 'aprendo', 'iniciante', 'começando'],
          reply: 'Perfetto! L\'italiano è una lingua bellissima e musicale. Vuoi fare una prova al ristorante o continuare a parlare?',
          feedback: '💡 **Dica de Gramática**: Lembre-se que o artigo de italiano é *"L\'italiano"* (com apóstrofo antes de vogal).'
        }
      ],
      defaultReply: 'Molto bene! Capisco perfettamente. Raccontami altro: ti piace la musica italiana o il cibo?',
      defaultFeedback: '💡 **Excelente tentativa!** Tente aplicar os verbos no presente (*mi piace...*, *io amo...*).'
    },
    'bar': {
      name: 'Marco - Barista (Roma)',
      welcome: 'Buongiorno Signore! Benvenuto al Bar Roma. Cosa posso portarle da bere o da mangiare?',
      responses: [
        {
          trigger: ['caffè', 'espresso', 'cappuccino', 'café', 'queria'],
          reply: 'Certamente! Un bel caffè espresso. Desidera anche un cornetto caldo alla crema?',
          feedback: '💡 **Dica de Ouro**: Na Itália, *"cornetto"* é o nome do croissant do café da manhã!'
        },
        {
          trigger: ['si', 'sim', 'cornetto', 'crema', 'conto', 'quanto costa', 'preço', 'quanto'],
          reply: 'Ecco a Lei! Un caffè e un cornetto fanno 3 Euro e 50 centesimi. Paga in contanti o con carta?',
          feedback: '💡 **Vocabulário**: *"Contanti"* = dinheiro vivo / *"Carta"* = cartão de crédito/débito.'
        }
      ],
      defaultReply: 'Subito! Preparo tutto in un momento. Vuoi accomodarti al tavolo o al banco?',
      defaultFeedback: '💡 **Cultura Italiana**: Beber o café no *"banco"* (balcão) é mais rápido e mais barato!'
    },
    'hotel': {
      name: 'Sofia - Recepção (Firenze)',
      welcome: 'Buonasera e benvenuto all\'Hotel Michelangelo! Ha una prenotazione a suo nome?',
      responses: [
        {
          trigger: ['prenotazione', 'reserva', 'si', 'sim', 'quarto', 'camera'],
          reply: 'Benissimo! Mi può mostrare un documento d\'identità, per favore?',
          feedback: '💡 **Vocabulário de Viagem**: *"Documento d\'identità"* = documento de identidade / passaporte.'
        },
        {
          trigger: ['ecco', 'aqui', 'passaporto', 'documento', 'chaves', 'chiave'],
          reply: 'Grazie mille! Ecco la chiave della camera 204 al secondo piano. L\'ascensore è a destra. Buon soggiorno!',
          feedback: '💡 **Gramática**: *"Secondo piano"* = segundo andar. Em italiano, o 1º andar é *"primo piano"*.'
        }
      ],
      defaultReply: 'Perfetto. La colazione è servita dalle 7:00 alle 10:00 al primo piano. Ha bisogno di altro?',
      defaultFeedback: '💡 **Vocabulário**: *"Colazione"* = café da manhã.'
    }
  };

  // Switch Scenario
  scenarioCards.forEach(card => {
    card.addEventListener('click', () => {
      scenarioCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      currentScenario = card.getAttribute('data-scenario');
      const scData = scenariosData[currentScenario];
      partnerName.textContent = scData.name;

      chatMessages.innerHTML = '';
      appendAIMessage(scData.welcome);
      feedbackPanel.classList.add('hidden');
    });
  });

  function appendUserMessage(text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'msg msg-user';
    msgDiv.innerHTML = `
      <div class="msg-bubble">${escapeHtml(text)}</div>
      <div class="msg-sub">Você</div>
    `;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function appendAIMessage(text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'msg msg-ai';
    msgDiv.innerHTML = `
      <div class="msg-bubble">
        ${escapeHtml(text)}
        <button class="btn-speak inline-speak" data-text="${escapeHtml(text)}"><i class="fa-solid fa-volume-high"></i></button>
      </div>
      <div class="msg-sub">${scenariosData[currentScenario].name}</div>
    `;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    if (autoAudioToggle.checked) {
      speakItalian(text);
    }
  }

  function processUserMessage(userText) {
    appendUserMessage(userText);
    const textLower = userText.toLowerCase();

    const sc = scenariosData[currentScenario];
    let matchedResponse = null;

    for (const item of sc.responses) {
      if (item.trigger.some(trig => textLower.includes(trig))) {
        matchedResponse = item;
        break;
      }
    }

    setTimeout(() => {
      if (matchedResponse) {
        appendAIMessage(matchedResponse.reply);
        showFeedback(matchedResponse.feedback);
      } else {
        appendAIMessage(sc.defaultReply);
        showFeedback(sc.defaultFeedback);
      }
    }, 600);
  }

  function showFeedback(content) {
    feedbackContent.innerHTML = content;
    feedbackPanel.classList.remove('hidden');
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    })[m]);
  }

  btnSend.addEventListener('click', () => {
    const text = chatInput.value.trim();
    if (text) {
      processUserMessage(text);
      chatInput.value = '';
    }
  });

  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const text = chatInput.value.trim();
      if (text) {
        processUserMessage(text);
        chatInput.value = '';
      }
    }
  });

  // Speech Recognition (Microphone Voice Input)
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'it-IT';
    recognition.continuous = false;
    recognition.interimResults = false;

    let isListening = false;

    btnMic.addEventListener('click', () => {
      if (isListening) {
        recognition.stop();
      } else {
        try {
          recognition.start();
          btnMic.classList.add('listening');
          isListening = true;
        } catch (err) {
          console.error(err);
        }
      }
    });

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      chatInput.value = transcript;
      btnMic.classList.remove('listening');
      isListening = false;
      processUserMessage(transcript);
      chatInput.value = '';
    };

    recognition.onerror = () => {
      btnMic.classList.remove('listening');
      isListening = false;
    };

    recognition.onend = () => {
      btnMic.classList.remove('listening');
      isListening = false;
    };
  } else {
    btnMic.title = 'Reconhecimento de voz não suportado neste navegador.';
    btnMic.style.opacity = '0.5';
  }

  // --- FLASHCARDS LOGIC ---
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
      desc: 'Diferente do português, o H entre C/G e E/I serve para manter o som duro.',
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
      desc: 'Exemplos: Lo studente, Lo zaino. No plural vira GLI (Gli studenti).',
      audioText: 'Lo studente, Lo zaino, Gli studenti'
    },
    {
      category: 'Verbos Auxiliares',
      front: 'Qual é a particularidade fonética da conjugação do verbo AVERE (ho, hai, ha, hanno)?',
      back: 'O H é 100% MUDO!',
      desc: 'Pronuncia-se exatamente "ó", "ái", "á", "án-no".',
      audioText: 'Io ho, Tu hai, Lui ha, Loro hanno'
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

  if (fcTotal) fcTotal.textContent = flashcardsData.length;

  function loadFlashcard(idx) {
    if (!mainFlashcard) return;
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

  if (mainFlashcard) {
    mainFlashcard.addEventListener('click', () => mainFlashcard.classList.toggle('flipped'));
    document.getElementById('btnPrevFc').addEventListener('click', () => {
      if (fcCurrentIdx > 0) { fcCurrentIdx--; loadFlashcard(fcCurrentIdx); }
    });
    document.getElementById('btnNextFc').addEventListener('click', () => {
      fcCurrentIdx = (fcCurrentIdx + 1) % flashcardsData.length;
      loadFlashcard(fcCurrentIdx);
    });
  }

  // --- QUIZ LOGIC ---
  const quizQuestions = [
    {
      question: 'Qual é o artigo definido singular correto para a palavra "STUDENTE"?',
      options: ['Il studente', 'Lo studente', 'La studente', 'Un studente'],
      correct: 1,
      explanation: 'Usa-se "LO" para palavras masculinas que começam com S + consoante.'
    },
    {
      question: 'Como se pronuncia a palavra "PERCHÉ"?',
      options: ['Per-tché', 'Per-quê', 'Per-xé', 'Per-sé'],
      correct: 1,
      explanation: 'A combinação CHE forma o som de "QUÊ" (som duro).'
    },
    {
      question: 'Qual é a 1ª pessoa do plural (Noi) do verbo ESSERE?',
      options: ['Noi siamo', 'Noi siete', 'Noi sono', 'Noi abbiamo'],
      correct: 0,
      explanation: 'A conjugação é: Io sono, Tu sei, Lui/Lei è, Noi siamo, Voi siete, Loro sono.'
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
    if (!quizQuestion) return;
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
      btn.addEventListener('click', () => {
        const optionBtns = quizOptions.querySelectorAll('.quiz-opt');
        optionBtns.forEach(b => b.disabled = true);
        if (idx === q.correct) {
          btn.classList.add('correct');
          score += 33;
          quizScoreText.textContent = `Pontuação: ${score}`;
        } else {
          btn.classList.add('wrong');
          optionBtns[q.correct].classList.add('correct');
        }
        quizExplanation.textContent = q.explanation;
        quizExplanation.classList.remove('hidden');
        btnNextQuestion.classList.remove('hidden');
      });
      quizOptions.appendChild(btn);
    });
  }

  if (btnNextQuestion) {
    btnNextQuestion.addEventListener('click', () => {
      currentQuizIdx++;
      if (currentQuizIdx < quizQuestions.length) {
        renderQuizQuestion();
      } else {
        quizQuestion.textContent = `🎉 Quiz Concluído! Pontuação Final: ${score} / 100`;
        quizOptions.innerHTML = '';
        quizExplanation.classList.add('hidden');
        btnNextQuestion.classList.add('hidden');
      }
    });
    renderQuizQuestion();
  }

  // Search Filter
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      if (!term) return;
      document.querySelectorAll('.card, .sound-card').forEach(card => {
        const match = card.textContent.toLowerCase().includes(term);
        card.style.opacity = match ? '1' : '0.4';
        card.style.borderColor = match ? 'var(--gold-ita)' : 'var(--border-color)';
      });
    });
  }
});
