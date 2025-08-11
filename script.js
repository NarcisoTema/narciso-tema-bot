document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById("chatBox");
  const userInput = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");
  const themeToggle = document.getElementById("themeToggle");

  // Adicionar mensagem
  const addMessage = (text, isUser = false) => {
    const p = document.createElement("p");
    p.classList.add(isUser ? "user" : "bot");
    p.innerHTML = `<strong>${isUser ? "Você" : "Narciso"}:</strong> ${text}`;
    chatBox.appendChild(p);
    chatBox.scrollTop = chatBox.scrollHeight;
  };

  // Alternar tema
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    themeToggle.textContent = document.body.classList.contains("light-mode")
      ? "☀️ Modo Claro"
      : "🌙 Modo Escuro";
  });

  // Processar com TF.js (simbólico)
  const preprocess = (expr) => {
    return tf.tidy(() => {
      return expr
        .toLowerCase()
        .replace(/resolver|calcule|simplifique|derive|integre/g, "")
        .trim();
    });
  };

  // Resolver problema matemático
  const solveMath = (input) => {
    try {
      const cleanInput = preprocess(input);

      // Casos especiais
      if (cleanInput.includes("raiz")) {
        const num = parseFloat(cleanInput.match(/[-+]?\d*\.?\d+/));
        return num >= 0 ? `√${num} = ${Math.sqrt(num).toFixed(4)}` : "Raiz de número negativo: número complexo.";
      }

      if (cleanInput.includes("deriv") || cleanInput.includes("derivada")) {
        const expr = cleanInput.replace(/deriv(e|ar)?/i, "").trim();
        const derivative = math.derivative(expr, 'x').toString();
        return `Derivada de ${expr} em relação a x: ${derivative}`;
      }

      if (cleanInput.includes("integ") || cleanInput.includes("integral")) {
        const expr = cleanInput.replace(/integ(rale)?/i, "").trim();
        const integral = math.integral(expr, 'x').toString();
        return `Integral de ${expr} em relação a x: ${integral} + C`;
      }

      if (cleanInput.includes("eq") || cleanInput.includes("=")) {
        const solutions = math.solve(cleanInput, 'x');
        return `Solução(ões) para x: ${JSON.stringify(solutions)}`;
      }

      if (cleanInput.includes("fator") || cleanInput.includes("fatorar")) {
        const expr = cleanInput.replace(/fator(ar)?/i, "").trim();
        const factored = math.simplify(expr).toString();
        return `Forma simplificada: ${factored}`;
      }

      // Avaliar expressão direta
      const result = math.evaluate(cleanInput);
      return typeof result === 'object' ? JSON.stringify(result) : `Resultado: ${result}`;

    } catch (err) {
      return "❌ Não consegui resolver. Verifique a sintaxe. Ex: 2+2, x^2=4, derivar x^2, integral de x.";
    }
  };

  // Enviar mensagem
  const sendMessage = () => {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, true);
    userInput.value = "";

    setTimeout(async () => {
      await tf.ready();
      const response = solveMath(text);
      addMessage(response, false);
    }, 600);
  };

  // Eventos
  sendBtn.addEventListener("click", sendMessage);
  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  console.log("Narciso Tema - Solver Matemático pronto.");
});
