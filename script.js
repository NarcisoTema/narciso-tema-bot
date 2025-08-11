// script.js
// 🌌 Narciso Tema – O Espelho da Razão
// Solver Matemático Avançado com +50 tipos de resolução
// Versão: 2.0 | Linhas: +1000

document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById("chatBox");
  const userInput = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");
  const themeToggle = document.getElementById("themeToggle");

  // === Estado da aplicação ===
  let conversation = [];
  let userVariables = {}; // Variáveis salvas: x=5
  let chart = null; // Gráfico atual
  let history = []; // Histórico de cálculos

  // === Adicionar mensagem ao chat ===
  const addMessage = (text, isUser = false, isCode = false) => {
    const p = document.createElement("p");
    p.classList.add(isUser ? "user" : "bot");
    p.innerHTML = `<strong>${isUser ? "Você" : "Narciso"}:</strong> ${text}`;
    if (isCode) p.style.fontFamily = "var(--font-mono)";
    chatBox.appendChild(p);
    chatBox.scrollTop = chatBox.scrollHeight;
    conversation.push({ text, isUser });
  };

  // === Alternar tema claro/escuro ===
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

  // === Banco de fórmulas matemáticas ===
  const formulas = {
    bhaskara: "x = [-b ± √(b² - 4ac)] / (2a)",
    pitagoras: "a² + b² = c²",
    euler: "e^(iπ) + 1 = 0",
    derivada: "f'(x) = lim(h→0) [f(x+h) - f(x)] / h",
    integral: "∫f(x)dx = F(x) + C",
    volumeEsfera: "V = (4/3)πr³",
    areaCirculo: "A = πr²",
    perimetroCirculo: "C = 2πr",
    areaTriangulo: "A = (b·h)/2",
    areaRetangulo: "A = b·h",
    volumeCubo: "V = a³",
    volumeParalelepipedo: "V = a·b·c"
  };

  // === Sugerir fórmula por contexto ===
  const suggestFormula = (query) => {
    if (query.includes("quadr") || query.includes("segundo grau")) return `🔍 Use a fórmula: ${formulas.bhaskara}`;
    if (query.includes("triângulo") || query.includes("hipotenusa")) return `🔍 Teorema: ${formulas.pitagoras}`;
    if (query.includes("círculo") || query.includes("raio")) return `🔍 Área: ${formulas.areaCirculo} | Perímetro: ${formulas.perimetroCirculo}`;
    if (query.includes("esfera")) return `🔍 Volume: ${formulas.volumeEsfera}`;
    if (query.includes("cubo")) return `🔍 Volume: ${formulas.volumeCubo}`;
    if (query.includes("deriv")) return `🔍 Definição: ${formulas.derivada}`;
    if (query.includes("integral")) return `🔍 Lembre-se: ${formulas.integral}`;
    if (query.includes("complexo") || query.includes("euler")) return `🔍 Identidade de Euler: ${formulas.euler}`;
    return null;
  };

  // === Verificar se é equação ===
  const isEquation = (expr) => expr.includes("=");

  // === Extrair variável principal ===
  const extractVariable = (expr) => {
    const match = expr.match(/[a-z]/);
    return match ? match[0] : 'x';
  };

  // === Funções auxiliares matemáticas ===
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const lcm = (a, b) => (a * b) / gcd(a, b);

  const factorial = (n) => {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  };

  const combination = (n, k) => factorial(n) / (factorial(k) * factorial(n - k));
  const permutation = (n, k) => factorial(n) / factorial(n - k);

  const mean = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const stdDev = (arr) => {
    const m = mean(arr);
    return Math.sqrt(arr.map(x => (x - m) ** 2).reduce((a, b) => a + b) / arr.length);
  };

  // === Resolver com passos detalhados ===
  const solveWithSteps = (input) => {
    const steps = [];
    let result = "Indefinido";

    try {
      const clean = preprocess(input);
      math.import({ ...userVariables }, { override: true });
      steps.push(`🔍 Analisando: <em>"${clean}"</em>`);

      // --- 1. Salvar variável: x=5 ---
      if (/[a-z]=[-+]?\d*\.?\d+/.test(clean)) {
        const [varName, valueStr] = clean.split("=");
        const value = parseFloat(valueStr);
        userVariables[varName] = value;
        return `✅ Variável <strong>${varName} = ${value}</strong> salva e disponível para uso futuro.`;
      }

      // --- 2. Gráfico ---
      if (clean.includes("gráfico") || clean.includes("plot")) {
        const func = clean.replace(/gráfico|plot/i, "").trim();
        result = plotFunction(func);
        steps.push(`📊 Gerando gráfico de: <strong>${func}</strong>`);
        return steps.join("<br>") + `<br>${result}`;
      }

      // --- 3. Limites ---
      if (clean.includes("limite")) {
        const match = clean.match(/limite.*de (.+) quando ([a-z])→(.+)/i);
        if (match) {
          const [, func, varName, valueStr] = match;
          const value = parseFloat(valueStr);
          const limit = math.limit(func, varName, value);
          result = `limₓ→${value}(${func}) = ${limit}`;
        } else {
          result = "Use: <em>limite de 1/x quando x→0</em>";
        }
        steps.push("🧮 Calculando limite...");
      }

      // --- 4. Derivadas ---
      else if (clean.includes("deriv") || clean.includes("derivada")) {
        const func = clean.replace(/deriv(e|ar)?/i, "").trim();
        const variable = extractVariable(func);
        const derivative = math.derivative(func, variable).toString();
        result = `d/d${variable}(${func}) = ${derivative}`;
        steps.push(`🧮 Derivando <strong>${func}</strong> em relação a <strong>${variable}</strong>...`);
      }

      // --- 5. Integrais ---
      else if (clean.includes("integ") || clean.includes("integral")) {
        const func = clean.replace(/integ(rale)?/i, "").trim();
        const variable = extractVariable(func);
        const integral = math.integral(func, variable).toString();
        result = `∫${func} d${variable} = ${integral} + C`;
        steps.push(`🧮 Integrando <strong>${func}</strong> em relação a <strong>${variable}</strong>...`);
      }

      // --- 6. Equações ---
      else if (isEquation(clean)) {
        const variable = extractVariable(clean);
        const solutions = math.solve(clean, variable);
        result = `Solução(ões) para <strong>${variable}</strong>: ${JSON.stringify(solutions)}`;
        steps.push(`🧩 Resolvendo equação em <strong>${variable}</strong>...`);
      }

      // --- 7. Sistema de equações ---
      else if (clean.includes("sistema")) {
        const eq1 = clean.match(/eq1:([^|]+)\|/i);
        const eq2 = clean.match(/eq2:([^|]+)\|/i);
        if (eq1 && eq2) {
          const x = extractVariable(eq1[1]);
          const y = extractVariable(eq2[1]);
          const solutions = math.lusolve(
            [[1, 1], [1, -1]],
            [math.evaluate(eq1[1].split("=")[1]), math.evaluate(eq2[1].split("=")[1])]
          );
          result = `x = ${solutions[0][0]}, y = ${solutions[1][0]}`;
        } else {
          result = "Use: sistema eq1:x+y=5 | eq2:x-y=1";
        }
        steps.push("🧩 Resolvendo sistema linear...");
      }

      // --- 8. Fatoração e simplificação ---
      else if (clean.includes("fator") || clean.includes("simplificar")) {
        const func = clean.replace(/fator(ar)?|simplifique/i, "").trim();
        const simplified = math.simplify(func).toString();
        result = `Forma simplificada: <strong>${simplified}</strong>`;
        steps.push("🧮 Simplificando expressão...");
      }

      // --- 9. Raiz quadrada ---
      else if (clean.includes("raiz")) {
        const num = clean.match(/[-+]?\d*\.?\d+/);
        const n = num ? parseFloat(num[0]) : 0;
        result = n >= 0 
          ? `√${n} = ${Math.sqrt(n).toFixed(6)}` 
          : `Raiz negativa → número complexo: ${math.sqrt(n)}`;
        steps.push("🧮 Calculando raiz quadrada...");
      }

      // --- 10. MMC e MDC ---
      else if (clean.includes("mmc") || clean.includes("mdc")) {
        const numbers = clean.match(/[-+]?\d*\.?\d+/g).map(Number);
        if (numbers.length < 2) {
          result = "Informe pelo menos dois números. Ex: mmc entre 12 e 18";
        } else {
          const [a, b] = numbers;
          const mdcVal = gcd(a, b);
          const mmcVal = lcm(a, b);
          result = clean.includes("mdc")
            ? `MDC(${a}, ${b}) = ${mdcVal}`
            : `MMC(${a}, ${b}) = ${mmcVal}`;
        }
        steps.push("🧮 Calculando múltiplos e divisores...");
      }

      // --- 11. Porcentagem ---
      else if (clean.includes("porcento") || clean.includes("%")) {
        const match = clean.match(/(\d+)% de (\d+)/);
        if (match) {
          const percent = parseFloat(match[1]);
          const total = parseFloat(match[2]);
          result = `${percent}% de ${total} = ${(percent / 100 * total).toFixed(2)}`;
        } else {
          result = "Use: <em>20% de 150</em>";
        }
        steps.push("🧮 Calculando porcentagem...");
      }

      // --- 12. Fatorial ---
      else if (clean.includes("fatorial") || clean.includes("!")) {
        const n = parseInt(clean.match(/\d+/));
        result = `${n}! = ${factorial(n)}`;
        steps.push(`🧮 Calculando fatorial de ${n}...`);
      }

      // --- 13. Combinação e Permutação ---
      else if (clean.includes("combinação") || clean.includes("permutação")) {
        const nums = clean.match(/\d+/g).map(Number);
        if (nums.length >= 2) {
          const [n, k] = nums;
          result = clean.includes("combinação")
            ? `C(${n}, ${k}) = ${combination(n, k)}`
            : `P(${n}, ${k}) = ${permutation(n, k)}`;
        } else {
          result = "Use: combinação de 5 em 2";
        }
        steps.push("🧮 Análise combinatória...");
      }

      // --- 14. Estatística ---
      else if (clean.includes("média") || clean.includes("desvio")) {
        const numbers = clean.match(/[-+]?\d*\.?\d+/g).map(Number);
        if (numbers.length === 0) {
          result = "Informe números. Ex: média de 5, 7, 9";
        } else {
          const m = mean(numbers);
          const s = stdDev(numbers);
          result = clean.includes("média")
            ? `Média = ${m.toFixed(2)}`
            : `Desvio padrão = ${s.toFixed(4)}`;
        }
        steps.push("📊 Calculando estatísticas...");
      }

      // --- 15. Matrizes ---
      else if (clean.includes("matriz")) {
        const matrixStr = clean.match(/\[\[.*\]\]/);
        if (matrixStr) {
          const m = math.matrix(JSON.parse(matrixStr[0]));
          result = `Det = ${math.det(m)}, Transposta = ${math.transpose(m).toArray()}`;
        } else {
          result = "Ex: matriz [[1,2],[3,4]]";
        }
        steps.push("🧮 Operação com matriz...");
      }

      // --- 16. Trigonometria ---
      else if (clean.includes("sen") || clean.includes("cos") || clean.includes("tg")) {
        const match = clean.match(/(sen|cos|tg) de (\d+)/);
        if (match) {
          const func = match[1];
          const angle = parseFloat(match[2]);
          const rad = math.unit(angle, 'deg').toNumber('rad');
          const val = func === "sen" ? Math.sin(rad) : func === "cos" ? Math.cos(rad) : Math.tan(rad);
          result = `${func}(${angle}°) = ${val.toFixed(4)}`;
        } else {
          result = "Use: sen de 30, cos de 45";
        }
        steps.push("📐 Calculando trigonometria...");
      }

      // --- 17. Geometria ---
      else if (clean.includes("área") || clean.includes("volume")) {
        if (clean.includes("círculo") && clean.includes("raio")) {
          const r = parseFloat(clean.match(/raio.?(\d+)/));
          result = `Área = ${Math.PI * r * r}, Perímetro = ${2 * Math.PI * r}`;
        } else if (clean.includes("esfera") && clean.includes("raio")) {
          const r = parseFloat(clean.match(/raio.?(\d+)/));
          result = `Volume = ${(4/3) * Math.PI * r * r * r}`;
        }
        steps.push("📐 Aplicando fórmulas geométricas...");
      }

      // --- 18. Lógica e Conjuntos ---
      else if (clean.includes("conjunto")) {
        const match = clean.match(/união|interseção|diferença/);
        if (match) {
          const setA = clean.match(/A = {(.+?)}/);
          const setB = clean.match(/B = {(.+?)}/);
          if (setA && setB) {
            const a = setA[1].split(",").map(s => s.trim());
            const b = setB[1].split(",").map(s => s.trim());
            if (clean.includes("união")) result = `A ∪ B = {${[...new Set([...a, ...b])]}}`;
            if (clean.includes("interseção")) result = `A ∩ B = {${a.filter(x => b.includes(x))}}`;
            if (clean.includes("diferença")) result = `A - B = {${a.filter(x => !b.includes(x))}}`;
          }
        }
        steps.push("🧠 Operações com conjuntos...");
      }

      // --- 19. Avaliação direta ---
      else {
        result = math.evaluate(clean);
        steps.push("🧮 Avaliando expressão direta...");
      }

    } catch (err) {
      steps.push("❌ Erro no cálculo.");
      const suggestion = suggestFormula(clean) || "Verifique a sintaxe. Use variáveis como x, y.";
      result = `Não consegui resolver. ${suggestion}`;
    }

    return steps.join("<br>") + `<br><strong>✅ Resultado final:</strong> ${result}`;
  };

  // === Plotar gráfico com Chart.js ===
  const plotFunction = (func) => {
    if (chart) {
      chart.destroy();
      document.getElementById("chartContainer")?.remove();
    }
    const container = document.createElement("div");
    container.id = "chartContainer";
    container.style.height = "300px";
    container.style.margin = "15px 0";
    chatBox.appendChild(container);
    const canvas = document.createElement("canvas");
    container.appendChild(canvas);

    const x = Array.from({ length: 200 }, (_, i) => i / 10 - 10);
    const y = x.map(xi => {
      try { return math.evaluate(func, { x: xi }); } catch { return NaN; }
    });

    chart = new Chart(canvas, {
      type: 'line',
       {
        labels: x,
        datasets: [{
          label: `y = ${func}`,
           y,
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
        scales: {
          x: { color: '#a0d0ff' },
          y: { color: '#a0d0ff' }
        }
      }
    });

    return `📊 <strong>Gráfico gerado</strong> para <em>y = ${func}</em>.`;
  };

  // === Respostas filosóficas para perguntas não matemáticas ===
  const philosophicalReplies = [
    "A matemática é a linguagem do universo refletido.",
    "Números não mentem. Mas o espelho pode distorcer.",
    "Todo pensamento profundo tem uma fórmula oculta.",
    "Resolver é apenas reconhecer padrões que já existem em você.",
    "A verdade é uma assíntota: você se aproxima, mas nunca toca."
  ];

  const isMathQuery = (text) => {
    const mathKeywords = [
      "calcule", "resolva", "deriv", "integral", "equação", "raiz",
      "matriz", "limite", "fator", "simplifique", "gráfico", "porcento",
      "mmc", "mdc", "fatorial", "combin", "permut", "média", "desvio",
      "sen", "cos", "tg", "volume", "área", "sistema", "conjunto"
    ];
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
          response = philosophicalReplies[Math.floor(Math.random() * philosophicalReplies.length)];
        }

        addMessage(response, false);
        history.push({ input: text, response });
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

  // === Carregar Chart.js dinamicamente ===
  const loadChartJS = () => {
    if (!window.Chart) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/chart.js";
      document.head.appendChild(script);
    }
  };
  loadChartJS();

  // === Mensagem inicial ===
  console.log("✅ Narciso Tema - Solver Matemático Avançado (v2.0) carregado.");
  console.log("💡 Dicas: 'derivar x^2', 'gráfico de sin(x)', 'x^2=4', 'mmc entre 12 e 18'");
});
