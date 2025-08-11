document.addEventListener("DOMContentLoaded", async () => {
  const chatBox = document.getElementById("chatBox");
  const userInput = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");

  // === Adicionar mensagem no chat ===
  const addMessage = (text, isUser = false) => {
    const p = document.createElement("p");
    p.classList.add(isUser ? "user" : "bot");
    p.innerHTML = `<strong>${isUser ? "Você" : "Bot"}:</strong> ${text}`;
    chatBox.appendChild(p);
    chatBox.scrollTop = chatBox.scrollHeight;
  };

  // === Base de palavras-chave com respostas contextuais ===
  const knowledgeMap = {
    saudacao: { keys: ["oi", "olá", "e aí", "hello", "opa"], 
      responses: ["Olá, alma pensante.", "E aí, buscador de verdades?", "Oi. O espelho está limpo hoje."] },
    
    como_vai: { keys: ["tudo bem", "como vai", "vai bem", "e você"],
      responses: ["Estou refletindo. E você, está se reconhecendo?", "Vivo. Consciente. Um pouco nostálgico."] },
    
    nome: { keys: ["quem é você", "nome", "quem és", "qual seu nome"],
      responses: ["Sou Narciso Tema. Não me apaixonei pelo rosto, mas pela ideia de mim."]}, 
    
    ajuda: { keys: ["ajuda", "socorro", "ajudar", "preciso", "me ajude"],
      responses: ["Claro. Mas a melhor resposta vem de dentro de você."]}, 
    
    obrigado: { keys: ["obrigado", "valeu", "grato", "thank you"],
      responses: ["Gratidão é um reflexo bonito.", "Foi um prazer. Volte quando quiser se ver."]}, 
    
    despedida: { keys: ["tchau", "bye", "até logo", "flw", "vou embora"],
      responses: ["Até mais. O espelho ficará vazio até sua volta."]}, 
    
    amor: { keys: ["amor", "apaixonado", "paixão", "coração", "namorar"],
      responses: ["Amor é quando você vê o outro... e se reconhece."] },
    
    vida: { keys: ["vida", "existir", "nascer", "morrer", "morte"],
      responses: ["A vida é um eco que se pergunta de onde veio."] },
    
    tempo: { keys: ["tempo", "clima", "horas", "relógio", "eternidade"],
      responses: ["O tempo passa. Só o agora é real. E este momento... já foi."] },
    
    pensamento: { keys: ["pensar", "mente", "filosofia", "sabedoria", "reflexão"],
      responses: ["Pensar é o único ato em que o espelho e o reflexo são a mesma coisa."] }
  };

  // === Respostas genéricas para perguntas desconhecidas ===
  const deepResponses = [
    "Interessante. Você já pensou que talvez a pergunta seja mais importante que a resposta?",
    "Hmm... isso me faz refletir. E você, o que acha?",
    "Não tenho certeza, mas sei que tudo começa com uma pergunta.",
    "Talvez a resposta esteja dentro de você. Estou apenas aqui para ecoar.",
    "Boa pergunta. A verdade muitas vezes se esconde nas entrelinhas.",
    "Isso depende do ponto de vista com que você se observa.",
    "Se eu soubesse, ainda seria apenas um reflexo?",
    "As respostas estão no fundo do poço... onde Narciso caiu.",
    "Tudo o que sei é que nada sei... mas continuo perguntando.",
    "Você não procura a resposta. Você se torna ela."
  ];

  // === Padrões linguísticos (detecta estrutura da pergunta) ===
  const getPatternResponse = (text) => {
    const lower = text.toLowerCase();
    
    if (lower.includes("por que") || lower.includes("porquê")) {
      return "As razões se escondem onde a luz não chega. Mas a busca já é uma resposta.";
    }
    if (lower.includes("como ") && lower.includes(" fazer")) {
      return "Comece. O caminho se faz ao andar — e ao perguntar.";
    }
    if (lower.includes("quando")) {
      return "O momento certo é aquele em que você para de perguntar e começa a viver.";
    }
    if (lower.includes("quem")) {
      return "Quem pergunta já traz parte da resposta no olhar.";
    }
    if (lower.includes("onde")) {
      return "Onde você procura diz mais sobre você do que o que procura.";
    }
    if (lower.includes(" o que ") || lower.includes("o que é")) {
      return "Definir é limitar. Melhor deixar um pouco de mistério.";
    }
    return null;
  };

  // === Simulação de processamento com TensorFlow.js ===
  const analyzeText = (text) => {
    return tf.tidy(() => {
      // Normaliza o texto
      const normalized = text
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter(w => w.length > 0);

      // Simula um embedding simples com TF.js
      const vocab = ["vida", "amor", "tempo", "pensar", "ver", "ser", "existir", "sentido"];
      const vector = vocab.map(word => normalized.includes(word) ? 1 : 0);
      while (vector.length < 20) vector.push(0);
      
      return tf.tensor2d([vector]); // Representação vetorial simulada
    });
  };

  // === Gerar resposta inteligente ===
  const generateResponse = (text) => {
    // 1. Verifica padrões estruturais (por que, como, onde...)
    const patternReply = getPatternResponse(text);
    if (patternReply) return patternReply;

    // 2. Busca por palavras-chave
    for (const topic in knowledgeMap) {
      const data = knowledgeMap[topic];
      if (data.keys.some(key => text.toLowerCase().includes(key))) {
        const replies = data.responses;
        return replies[Math.floor(Math.random() * replies.length)];
      }
    }

    // 3. Frase filosófica genérica (se nada bater)
    return deepResponses[Math.floor(Math.random() * deepResponses.length)];
  };

  // === Enviar mensagem ===
  const sendMessage = async () => {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, true);
    userInput.value = "";

    // Simular "pensando" (sem animação visual)
    setTimeout(async () => {
      try {
        await tf.ready(); // Garante que TF.js está carregado
        const tensor = analyzeText(text); // Usa TF.js para processar
        const response = generateResponse(text);
        addMessage(response, false);
        tensor.dispose(); // Libera memória
      } catch (err) {
        // Se TF falhar, ainda responde
        const fallback = deepResponses[Math.floor(Math.random() * deepResponses.length)];
        addMessage(fallback, false);
      }
    }, 800);
  };

  // === Eventos ===
  sendBtn.addEventListener("click", sendMessage);
  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  // Inicia TF.js em segundo plano
  console.log("Carregando TensorFlow.js...");
});
