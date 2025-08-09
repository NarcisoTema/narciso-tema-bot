// Simulação simples de modelo de palavras-chave com TF.js (sem treinamento real, mas usando TF para tokenização básica)
document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById("chatBox");
  const userInput = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");

  // Função para adicionar mensagens ao chat
  const addMessage = (text, isUser = false) => {
    const message = document.createElement("p");
    message.innerHTML = `<strong>${isUser ? "Você" : "Bot"}:</strong> ${text}`;
    message.classList.add(isUser ? "user" : "bot");
    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;
  };

  // Base de respostas por palavras-chave
  const responses = {
    saudacao: ["oi", "olá", "oi tudo bem", "e aí", "hello"],
    saudacaoResposta: ["Olá! Como posso ajudar?", "Oi! Tudo bem com você?", "E aí! Em que posso ajudar?"],

    saudacao2: ["tudo bem", "como vai", "como está"],
    saudacao2Resposta: ["Estou bem, obrigado por perguntar!", "Tudo ótimo! E você?"],

    ajuda: ["ajuda", "preciso de ajuda", "me ajude"],
    ajudaResposta: ["Claro! Diga o que você precisa.", "Estou aqui para ajudar. Pergunte!"],

    obrigado: ["obrigado", "valeu", "grato"],
    obrigadoResposta: ["De nada! Estou aqui para ajudar.", "Sempre à disposição!"],

    despedida: ["tchau", "até logo", "bye", "flw"],
    despedidaResposta: ["Até mais! Volte quando quiser.", "Tchau! Tenha um ótimo dia!"],

    clima: ["clima", "tempo", "chuva", "sol"],
    climaResposta: ["O clima é um tema interessante! Aqui não tenho acesso ao tempo real, mas posso conversar sobre isso."],

    amor: ["amor", "apaixonado", "coração"],
    amorResposta: ["Amor... um tema profundo. Narciso se apaixonou pelo reflexo. Cuidado com o espelho."],
  };

  // Função para processar entrada com TF.js (simulação de tokenização)
  const preprocessText = (text) => {
    return tf.tidy(() => {
      // Simples limpeza e tokenização
      const lowerText = text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const words = lowerText.split(/\s+/).filter(word => word.length > 0);
      return words;
    });
  };

  // Função para encontrar resposta
  const findResponse = (inputWords) => {
    for (const key in responses) {
      if (key.endsWith("Resposta")) continue; // Pula respostas

      const keywords = responses[key];
      const replyKey = key + "Resposta";

      for (const word of inputWords) {
        if (keywords.includes(word)) {
          const replies = responses[replyKey];
          return replies[Math.floor(Math.random() * replies.length)];
        }
      }
    }
    return "Desculpe, não entendi. Pode reformular?";
  };

  // Enviar mensagem
  const sendMessage = () => {
    const text = userInput.value.trim();
    if (text === "") return;

    addMessage(text, true);
    userInput.value = "";

    // Simular digitação do bot
    setTimeout(() => {
      tf.ready().then(() => {
        const words = preprocessText(text);
        const response = findResponse(words);
        addMessage(response, false);
        words.dispose(); // Limpeza de memória
      });
    }, 600);
  };

  // Eventos
  sendBtn.addEventListener("click", sendMessage);
  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
});
