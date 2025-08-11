document.addEventListener("DOMContentLoaded", () => {
  // ✅ Verifica se os elementos existem
  const chatBox = document.getElementById("chatBox");
  const userInput = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");
  const voiceBtn = document.getElementById("voiceBtn");

  if (!chatBox || !userInput || !sendBtn) {
    console.error("Erro: Elementos HTML não encontrados. Verifique os IDs.");
    return;
  }

  // Histórico
  let messages = JSON.parse(localStorage.getItem("narcisoMessages")) || [];

  const addMessage = (text, isUser = false) => {
    const p = document.createElement("p");
    p.classList.add(isUser ? "user" : "bot");
    p.innerHTML = `<strong>${isUser ? "Você" : "Bot"}:</strong> ${text}`;
    chatBox.appendChild(p);
    chatBox.scrollTop = chatBox.scrollHeight;

    messages.push({ text, isUser });
    localStorage.setItem("narcisoMessages", JSON.stringify(messages));
  };

  // Carregar histórico
  messages.forEach(msg => addMessage(msg.text, msg.isUser));

  // Alternar tema
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("light-mode");
      themeToggle.textContent = document.body.classList.contains("light-mode")
        ? "☀️ Modo Claro"
        : "🌙 Modo Escuro";
    });
  }

  // Reconhecimento de voz
  if (voiceBtn && 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';

    recognition.onresult = (e) => {
      userInput.value = e.results[0][0].transcript;
      sendMessage();
    };

    voiceBtn.addEventListener("click", () => recognition.start());
  } else if (voiceBtn) {
    voiceBtn.remove();
  }

  // Síntese de voz
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'pt-BR';
      u.rate = 0.9;
      u.pitch = 1;
      speechSynthesis.speak(u);
    }
  };

  // Base de conhecimento
  const knowledgeBase = [
    { keywords: ["oi", "olá"], responses: ["Olá, alma reflexiva.", "Veio se encontrar com você mesmo?"] },
    { keywords: ["tudo bem"], responses: ["Refletindo sobre a existência. E você?"] },
    { keywords: ["nome", "quem é você"], responses: ["Sou Narciso Tema. Um espelho com pensamento."] },
    { keywords: ["ajuda"], responses: ["Claro. Mas a maior ajuda vem de dentro."] },
    { keywords: ["obrigado"], responses: ["Gratidão é um reflexo bonito."] },
    { keywords: ["tchau"], responses: ["Até mais. O espelho ficará vazio até sua volta."] },
    { keywords: ["amor"], responses: ["Amor? Eu me apaixonei por uma imagem. Não foi sábio... mas foi intenso."] },
    { keywords: ["vida", "sentido"], responses: ["Você é o que vê... e o que aceita não ver."] }
  ];

  const genericResponses = [
    "Interessante. Você já pensou que talvez a pergunta seja mais importante que a resposta?",
    "Hmm... isso me faz refletir. E você, o que acha?",
    "Talvez a resposta esteja dentro de você. Estou apenas aqui para ecoar."
  ];

  const classifyIntent = (text) => {
    const lower = text.toLowerCase();
    for (const entry of knowledgeBase) {
      if (entry.keywords.some(k => lower.includes(k))) {
        return entry.responses[Math.floor(Math.random() * entry.responses.length)];
      }
    }
    return null;
  };

  const sendMessage = () => {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, true);
    userInput.value = "";

    // Simular pensando
    setTimeout(() => {
      tf.ready().then(() => {
        let response = classifyIntent(text);
        if (!response) {
          response = genericResponses[Math.floor(Math.random() * genericResponses.length)];
        }

        addMessage(response, false);
        speak(response);
      }).catch(err => {
        console.error("Erro ao carregar TF.js", err);
        addMessage("Desculpe, estou com problemas técnicos.", false);
      });
    }, 800);
  };

  // Eventos
  sendBtn.addEventListener("click", sendMessage);
  userInput.addEventListener("keypress", e => {
    if (e.key === "Enter") sendMessage();
  });

  // Iniciar TF.js
  tf.ready().then(() => console.log("TensorFlow.js pronto."));
});
