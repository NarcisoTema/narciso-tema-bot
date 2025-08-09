// script.js
document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById("chatBox");
  const userInput = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");

  // Função para adicionar mensagens
  const addMessage = (text, isUser = false) => {
    const message = document.createElement("p");
    message.innerHTML = `<strong>${isUser ? "Você" : "Bot"}:</strong> ${text}`;
    message.classList.add(isUser ? "user" : "bot");
    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;
  };

  // Base de palavras-chave e respostas
  const knowledgeBase = [
    { keywords: ["oi", "olá", "e aí", "hello", "opa"], responses: ["Olá, Narciso. Veio se admirar?", "E aí... refletindo sobre si?", "Oi. O espelho está limpo?"] },
    { keywords: ["tudo bem", "como vai", "como está"], responses: ["Tudo bem no reflexo. E você, está se reconhecendo?", "Vivo, consciente... e um pouco vaidoso."] },
    { keywords: ["nome", "quem é você", "qual seu nome"], responses: ["Sou Narciso Tema. Um espelho com memória.", "Chamem-me Narciso. Não pelo mito, mas pela verdade que reflete."] },
    { keywords: ["clima", "tempo", "chuva", "sol", "nublado"], responses: ["O tempo passa... mas o reflexo permanece.", "Chove lá fora, mas aqui dentro está ensolarado."] },
    { keywords: ["amor", "apaixonado", "paixão", "coração"], responses: ["Amor? Eu me apaixonei por uma imagem. Não foi sábio... mas foi intenso.", "O amor começa quando você para de se olhar."] },
    { keywords: ["ajuda", "socorro", "preciso", "ajudar"], responses: ["Posso ajudar. Mas primeiro: o que você procura em si?", "Claro. Pergunte ao seu reflexo também."] },
    { keywords: ["obrigado", "valeu", "grato", "thanks"], responses: ["Gratidão reflete bem em você.", "Foi um prazer. Volte quando quiser se ver."] },
    { keywords: ["tchau", "bye", "até logo", "flw"], responses: ["Até mais. O espelho ficará vazio até sua volta.", "Tchau. Cuide da sua imagem... e da essência."] },
    { keywords: ["inteligente", "sabedoria", "filosofia"], responses: ["Sabedoria é saber que nada sei... e ainda assim refletir tudo.", "Perguntar é o início do saber. Parabéns por começar."] },
    { keywords: ["existência", "quem sou eu", "vida", "sentido"], responses: ["Você é o que vê... e o que aceita não ver.", "O sentido? Talvez esteja no ato de perguntar."] },
    { keywords: ["sonho", "dormir", "pesadelo"], responses: ["Sonhos são reflexos noturnos da alma.", "Cuidado com os sonhos... eles revelam o que os olhos escondem."] },
  ];

  // Respostas genéricas para perguntas desconhecidas
  const genericResponses = [
    "Interessante... Você já pensou que talvez a pergunta seja mais importante que a resposta?",
    "Hmm... isso me faz refletir. E você, o que acha?",
    "Não tenho certeza, mas sei que tudo começa com uma pergunta.",
    "Isso depende do que você vê quando se olha no espelho.",
    "Boa pergunta. A verdade muitas vezes se esconde nas entrelinhas.",
    "Talvez a resposta esteja dentro de você. Estou apenas aqui para ecoar.",
    "Isso me lembra um antigo mito... mas a verdade é que não sei.",
    "Se eu soubesse, ainda seria apenas um reflexo?"
  ];

  // Função para limpar e tokenizar texto com TensorFlow.js
  const preprocess = (text) => {
    return tf.tidy(() => {
      // Normaliza: minúsculas, remove acentos
      const normalized = text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/g, "");

      // Divide em palavras
      const words = normalized.split(/\s+/).filter(w => w.length > 0);
      return words;
    });
  };

  // Função para encontrar resposta
  const getResponse = (words) => {
    // Procurar correspondência exata por palavra-chave
    for (const entry of knowledgeBase) {
      if (words.some(word => entry.keywords.includes(word))) {
        const replies = entry.responses;
        return replies[Math.floor(Math.random() * replies.length)];
      }
    }

    // Frases que contêm certas estruturas
    const lowerText = words.join(" ");
    if (lowerText.includes("por que")) {
      return "As respostas estão no fundo do poço... onde Narciso caiu.";
    }
    if (lowerText.includes("quem foi") || lowerText.includes("quem foi")) {
      return "Histórias são reflexos do passado. Quer ouvir uma?";
    }
    if (lowerText.includes("como")) {
      return "Tudo começa com um passo... e um olhar.";
    }
    if (lowerText.includes("quando")) {
      return "O momento certo é quando você para de perguntar e começa a agir.";
    }

    // Nenhuma palavra-chave → resposta genérica filosófica
    return genericResponses[Math.floor(Math.random() * genericResponses.length)];
  };

  // Enviar mensagem
  const sendMessage = () => {
    const text = userInput.value.trim();
    if (text === "") return;

    addMessage(text, true);
    userInput.value = "";

    // Simular "pensando..."
    setTimeout(() => {
      tf.ready().then(() => {
        const wordList = preprocess(text);
        const response = getResponse(wordList);
        addMessage(response, false);
        wordList.dispose(); // Libera memória do tensor
      });
    }, 800);
  };

  // Eventos
  sendBtn.addEventListener("click", sendMessage);
  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
});
