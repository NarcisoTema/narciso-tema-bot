document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById("chatBox");
  const userInput = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");
  const themeToggle = document.getElementById("themeToggle");

  // === Histórico e memória ===
  let conversation = [];
  let userVariables = {}; // Armazena variáveis: x=5, a=2, etc
  let chart = null; // Para gráficos

  // === Adicionar mensagem ===
  const addMessage = (text, isUser = false, isCode = false) => {
    const p = document.createElement("p");
    p.classList.add(isUser ? "user" : "bot");
    p.innerHTML = `<strong>${isUser ? "Você" : "Narciso"}:</strong> ${text}`;
    if (isCode) p.style.fontFamily = "var(--font-mono)";
    chatBox.appendChild(p);
    chatBox.scrollTop = chatBox.scrollHeight;
    conversation.push({ text, isUser });
  };

  // === Alternar tema ===
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    themeToggle.textContent = document.body.classList.contains("light-mode")
      ? "☀️ Modo Claro"
      : "🌙 Modo Escuro";
  });

  // === Preprocessamento com TensorFlow.js (simbólico) ===
  const preprocess = (input) => {
    return tf.tidy(() => {
      return input
        .toLowerCase()
        .replace(/[.,;]/g, "")
        .replace(/\s+/g, " ")
        .trim();
    });
  };

  // === Banco de fórmulas úteis ===
  const formulas = {
    bhaskara: "x = [-b ± √(b² - 4ac)] / (2a)",
    pitagoras: "a² + b² = c²",
    derivada: "f'(x) = lim(h→0) [f(x+h) - f(x)] / h",
    integral: "∫f(x)dx = F(x) + C",
    euler: "e^(iπ) + 1 = 0"
  };

  // === Funções auxiliares ===
  const suggestFormula = (query) => {
    if (query.includes("quadr")) return `🔍 Use a fórmula de Bháskara: ${formulas.bhaskara}`;
    if (query.includes("triângulo") || query.includes("hipotenusa")) return `🔍 Teorema de Pitágoras: ${formulas.pitagoras}`;
    if (query.includes("deriv")) return `🔍 Definição: ${formulas.derivada}`;
    if (query.includes("integral")) return `🔍 Lembre-se: ${formulas.integral}`;
    return null;
  };

  const isEquation = (expr) => expr.includes("=");

  const extractVariable = (expr) => {
    const match = expr.match(/[a-z]/);
    return match ? match[0] : 'x';
  };

  // === Resolver com passos (simulação) ===
  const solveWithSteps = (input) => {
    const steps = [];
    let result = "Indefinido";

    try {
      const clean = preprocess(input);
      let expr = clean;

      // Salvar variáveis: x=5
      if (/[a-z]=[-+]?\d*\.?\d+/.test(expr)) {
        const [varName, value] = expr.split("=");
        userVariables[varName] = parseFloat(value);
        return `✅ Variável ${varName} = ${value} salva.`;
      }

      // Carregar variáveis salvas
      math.import({ ...userVariables }, { override: true });

      steps.push(`🔍 Analisando: "${expr}"`);

      // === Casos especiais ===
      if (expr.includes("gráfic") || expr.includes("plot")) {
        const func = expr.replace(/gráfic.*de|plot/i, "").trim();
        result = plotFunction(func);
        steps.push(`📊 Função plotada: ${func}`);
        return steps.join("<br>") + `<br><strong>Resultado:</strong> ${result}`;
      }

      if (expr.includes("limite")) {
        const match = expr.match(/limite\s+de\s+(.+)\s+quando\s+([a-z])→(.+)/i);
        if (match) {
          const [, func, varName, value] = match;
          const limit = math.limit(func, varName, parseFloat(value));
          result = `limₓ→${value}(${func}) = ${limit}`;
        } else {
          result = "Use: limite de x^2 quando x→0";
        }
        steps.push("🧮 Calculando limite...");
      }

      else if (expr.includes("matriz")) {
        const matrixStr = expr.match(/\[.*\]/);
        if (matrixStr) {
          const m = math.matrix(JSON.parse(matrixStr[0]));
          result = `Determinante: ${math.det(m)}, Transposta: ${math.transpose(m).toArray()}`;
        } else {
          result = "Ex: matriz [[1,2],[3,4]]";
        }
        steps.push("🧮 Operação com matriz...");
      }

      else if (expr.includes("complexo")) {
        result = "🧮 Números complexos suportados. Ex: (2+3i)*(1-i) = " + math.evaluate("(2+3i)*(1-i)");
        steps.push("🧠 Trabalhando com complexos...");
      }

      else if (expr.includes("deriv") || expr.includes("derivada")) {
        const func = expr.replace(/deriv(e|ar)?/i, "").trim();
        const variable = extractVariable(func);
        const derivative = math.derivative(func, variable).toString();
        result = `d/d${variable}(${func}) = ${derivative}`;
        steps.push(`🧮 Derivando em relação a ${variable}...`);
      }

      else if (expr.includes("integ") || expr.includes("integral")) {
        const func = expr.replace(/integ(rale)?/i, "").trim();
        const variable = extractVariable(func);
        const integral = math.integral(func, variable).toString();
        result = `∫${func} d${variable} = ${integral} + C`;
        steps.push(`🧮 Integrando em relação a ${variable}...`);
      }

      else if (isEquation(expr)) {
        const variable = extractVariable(expr);
        const solutions = math.solve(expr, variable);
        result = `Solução(ões) para ${variable}: ${JSON.stringify(solutions)}`;
        steps.push(`🧩 Resolvendo equação em ${variable}...`);
      }

      else if (expr.includes("fator") || expr.includes("simplificar")) {
        const func = expr.replace(/fator(ar)?|simplifique/i, "").trim();
        const simplified = math.simplify(func).toString();
        result = `Forma simplificada: ${simplified}`;
        steps.push("🧮 Simplificando expressão...");
      }

      else if (expr.includes("raiz")) {
        const num = expr.match(/[-+]?\d*\.?\d+/);
        const n = num ? parseFloat(num[0]) : 0;
        result = n >= 0 ? `√${n} = ${Math.sqrt(n).toFixed(6)}` : "Raiz negativa → número complexo.";
        steps.push("🧮 Calculando raiz quadrada...");
      }

      else {
        // Avaliação direta
        result = math.evaluate(expr);
        steps.push("🧮 Avaliando expressão...");
      }

    } catch (err) {
      steps.push("❌ Erro no cálculo.");
      const suggestion = suggestFormula(input) || "Verifique a sintaxe.";
      result = `Não consegui resolver. ${suggestion}`;
    }

    return steps.join("<br>") + `<br><strong>Resultado final:</strong> ${result}`;
  };

  // === Plotar gráfico com Chart.js (adicione no HTML depois) ===
  const plotFunction = (func) => {
    // Remover gráfico anterior
    if (chart) {
      chart.destroy();
      document.getElementById("chartContainer")?.remove();
    }

    // Criar canvas
    const chartContainer = document.createElement("div");
    chartContainer.id = "chartContainer";
    chartContainer.style.height = "300px";
    chartContainer.style.margin = "15px 0";
    chatBox.appendChild(chartContainer);

    const canvas = document.createElement("canvas");
    chartContainer.appendChild(canvas);

    // Gerar pontos
    const xValues = Array.from({ length: 100 }, (_, i) => i / 5 - 10);
    let yValues;
    try {
      yValues = xValues.map(x => math.evaluate(func, { x }));
    } catch (e) {
      yValues = Array(100).fill(NaN);
    }

    // Criar gráfico
    chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: xValues,
        datasets: [{
          label: `y = ${func}`,
          data: yValues,
          borderColor: '#00d4ff',
          backgroundColor: 'rgba(0, 212, 255, 0.1)',
          borderWidth: 2,
          pointRadius: 0,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { color: '#e0f7ff' } },
        scales: { x: { color: '#a0d0ff' }, y: { color: '#a0d0ff' } }
      }
    });

    return `📊 Gráfico de y = ${func} gerado.`;
  };

  // === Respostas filosóficas para perguntas não matemáticas ===
  const philosophicalReplies = [
    "A matemática é a linguagem do universo refletido.",
    "Números não mentem. Mas o espelho pode distorcer.",
    "Todo pensamento profundo tem uma fórmula oculta.",
    "Resolver é apenas reconhecer padrões que já existem em você."
  ];

  const isMathQuery = (text) => {
    const mathKeywords = ["calcule", "resolva", "deriv", "integral", "equação", "raiz", "matriz", "limite", "fator", "simplifique", "gráfico"];
    return mathKeywords.some(k => text.includes(k)) || /[0-9+\-*/=x^()]/.test(text);
  };

  // === Enviar mensagem ===
  const sendMessage = async () => {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, true);
    userInput.value = "";

    setTimeout(async () => {
      try {
        await tf.ready();

        let response;

        if (isMathQuery(text)) {
          response = solveWithSteps(text);
        } else {
          // Respostas filosóficas para perguntas gerais
          const replies = [
            "Interessante... Você já pensou que a realidade pode ser uma equação não resolvida?",
            "A verdade matemática é a única que não depende do espelho.",
            "Perguntar é o primeiro axioma da descoberta."
          ];
          response = replies[Math.floor(Math.random() * replies.length)];
        }

        addMessage(response, false);
      } catch (err) {
        addMessage("Erro no processamento. Tente novamente.", false);
      }
    }, 800);
  };

  // === Eventos ===
  sendBtn.addEventListener("click", sendMessage);
  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  // === Carregar Chart.js dinamicamente (se necessário) ===
  const loadChartJS = () => {
    if (!window.Chart) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/chart.js";
      document.head.appendChild(script);
    }
  };
  loadChartJS();

  console.log("Narciso Tema - Super Solver Matemático carregado.");
});
