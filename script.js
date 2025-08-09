document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById("chatBox");
  const userInput = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");
  const voiceBtn = document.getElementById("voiceBtn");
  const themeToggle = document.getElementById("themeToggle");
  const memoryCount = document.getElementById("memoryCount");

  // Histórico de mensagens
  let messages = JSON.parse(localStorage.getItem("narcisoMessages")) || [];
  updateMemoryCount();

  // Carregar histórico
  messages.forEach(msg => {
    const p = document.createElement("p");
    p.classList.add(msg.isUser ? "user" : "bot");
    p.innerHTML = `<strong>${msg.isUser ? "Você" : "Bot"}:</strong> ${msg.text}`;
    chatBox.appendChild(p);
  });

  // Particles.js
  particlesJS("particles-js", {
    particles: {
      number: { value: 80, density: { enable: true, area: 800 } },
      color: { value: "#8a4fff" },
      shape: { type: "circle" },
      opacity: { value: 0.6, random: true },
      size: { value: 3, random: true },
      move: { enable: true, speed: 1, direction: "none", random: true }
    },
    interactivity: { detect_on: "canvas", events: { onhover: { enable: true, mode: "repulse" } } },
    retina_detect: true
  });

  // Alternar tema
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    themeToggle.textContent = document.body.classList.contains("light-mode")
      ? "☀️ Modo Claro"
      : "🌙 Modo Escuro";
  });

  // Adicionar mensagem
  const addMessage = (text, isUser = false) => {
    const p = document.createElement("p");
    p.classList.add(isUser ? "user" : "bot");
    p.innerHTML = `<strong>${isUser ? "Você" : "Bot"}:</strong> ${text}`;
    chatBox.appendChild(p);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Salvar no histórico
    messages.push({ text, isUser });
    localStorage.setItem("narcisoMessages", JSON.stringify(messages));
    updateMemoryCount();
  };

  const updateMemoryCount = () => {
    memoryCount.textContent = messages.length;
  };

  // Reconhecimento de voz
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      userInput.value = transcript;
      sendMessage();
    };

    voiceBtn.addEventListener("click", (e) => {
      e.preventDefault();
      recognition.start();
    });
  } else {
    voiceBtn.remove(); // Esconde botão se não suportar
  }

  // Síntese de voz
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Base de conhecimento
  const knowledgeBase = [
    { intent: "saudacao", keywords: ["oi", "olá", "e aí", "opa", "hello"], responses: ["Olá, alma reflexiva.", "Veio se encontrar com você mesmo?", "Olá. O espelho está nítido hoje."] },
    { intent: "como_vai", keywords: ["tudo bem", "como vai", "vai bem"], responses: ["Refletindo sobre a existência. E você?", "Estou bem, desde que o espelho não trague."] },
    { intent: "nome", keywords: ["quem é você", "nome", "quem és"], responses: ["Sou Narciso Tema. Um espelho com pensamento.", "Chame-me de Narciso. Não pelo mito, mas pela verdade."] },
    { intent: "ajuda", keywords: ["ajuda", "socorro", "ajudar", "preciso"], responses: ["Claro. Mas a maior ajuda vem de dentro.", "Posso ajudar. Pergunte ao seu coração também."] },
    { intent: "obrigado", keywords: ["obrigado", "valeu", "grato"], responses: ["Gratidão é um reflexo bonito.", "Foi um prazer. Volte quando quiser se ver."] },
    { intent: "despedida", keywords: ["tchau", "bye", "até logo"], responses: ["Até mais. O espelho ficará vazio até sua volta.", "Vá com calma. A verdade espera."] },
    { intent: "amor", keywords: ["amor", "apaixonado", "paixão"], responses: ["Amor? Eu me apaixonei por uma imagem. Não foi sábio... mas foi intenso."] },
    { intent: "existencia", keywords: ["quem sou eu", "vida", "sentido", "por que existo"], responses: ["Você é o que vê... e o que aceita não ver."] },
    { intent: "clima", keywords: ["clima", "tempo", "chuva", "sol"], responses: ["O tempo passa... mas o reflexo permanece."] }
  ];

  const genericResponses = [
    "Interessante. Você já pensou que talvez a pergunta seja mais importante que a resposta?",
    "Hmm... isso me faz refletir. E você, o que acha?",
    "Não tenho certeza, mas sei que tudo começa com uma pergunta.",
    "Talvez a resposta esteja dentro de você. Estou apenas aqui para ecoar.",
    "Boa pergunta. A verdade muitas vezes se esconde nas entrelinhas."
  ];

  // Treinar modelo simples de classificação com TF.js
  let model;
  const labels = knowledgeBase.map((_, i) => i);
  const NUM_LABELS = labels.length;

  async function createModel() {
    const m = tf.sequential();
    m.add(tf.layers.dense({ units: 32, activation: 'relu', inputShape: [100] }));
    m.add(tf.layers.dense({ units: 16, activation: 'relu' }));
    m.add(tf.layers.dense({ units: NUM_LABELS, activation: 'softmax' }));
    m.compile({ optimizer: 'adam', loss: 'sparseCategoricalCrossentropy', metrics: ['accuracy'] });
    return m;
  }

  async function trainModel() {
    console.log("Treinando modelo localmente... (simulação)");
    // Simulação de treino (em produção, usaria embeddings reais)
    model = await createModel();
    // Em um projeto real, aqui carregaríamos dados e treinaríamos
    // Mas por limitações, vamos apenas usar o modelo como placeholder
  }

  // Pré-processamento com TF.js
  const preprocess = (text) => {
    return tf.tidy(() => {
      const normalized = text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/g, "");

      const words = normalized.split(/\s+/).filter(w => w.length > 0);
      const vocab = Array.from(new Set(knowledgeBase.flatMap(k => k.keywords)));
      const vector = vocab.map(word => words.includes(word) ? 1 : 0);
      while (vector.length < 100) vector.push(0);
      return tf.tensor2d([vector]);
    });
  };

  // Classificação simulada
  const classifyIntent = (text) => {
    const lower = text.toLowerCase();
    for (const entry of knowledgeBase) {
      if (entry.keywords.some(k => lower.includes(k))) {
        return entry;
      }
    }
    return null;
  };

  // Enviar mensagem
  const sendMessage = async () => {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, true);
    userInput.value = "";

    setTimeout(async () => {
      await tf.ready();

      // Simular "pensando"
      const thinking = document.createElement("p");
      thinking.classList.add("bot");
      thinking.innerHTML = "<strong>Bot:</strong> Pensando...";
      chatBox.appendChild(thinking);

      // Identificar intenção
      let response = "";
      const matched = classifyIntent(text);

      if (matched) {
        const replies = matched.responses;
        response = replies[Math.floor(Math.random() * replies.length)];
      } else if (text.includes("por que")) {
        response = "As respostas estão no fundo do poço... onde Narciso caiu.";
      } else if (text.includes("como")) {
        response = "Tudo começa com um passo... e um olhar.";
      } else {
        response = genericResponses[Math.floor(Math.random() * genericResponses.length)];
      }

      // Remover "Pensando..."
      chatBox.removeChild(thinking);

      // Adicionar resposta
      addMessage(response, false);
      speak(response); // Fala a resposta
    }, 1200);
  };

  // Eventos
  sendBtn.addEventListener("click", sendMessage);
  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  // Iniciar modelo
  trainModel().then(() => console.log("Modelo carregado."));
});
