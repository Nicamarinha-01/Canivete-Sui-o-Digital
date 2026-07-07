window.Tools = window.Tools || {};

window.Tools.calculadora = {
  render(main) {
    main.innerHTML = `
      <div class="tool">
        <div class="tool-header">
          <span class="eyebrow">Cálculos</span>
          <h2>Calculadora</h2>
          <p>Operações básicas com teclado ou clique.</p>
        </div>

        <div class="panel calc-panel">
          <div class="calc-display" id="calcDisplay">0</div>
          <div class="calc-grid" id="calcGrid">
            <button data-key="C" class="calc-btn calc-btn--muted">C</button>
            <button data-key="(" class="calc-btn calc-btn--muted">(</button>
            <button data-key=")" class="calc-btn calc-btn--muted">)</button>
            <button data-key="/" class="calc-btn calc-btn--accent">÷</button>

            <button data-key="7" class="calc-btn">7</button>
            <button data-key="8" class="calc-btn">8</button>
            <button data-key="9" class="calc-btn">9</button>
            <button data-key="*" class="calc-btn calc-btn--accent">×</button>

            <button data-key="4" class="calc-btn">4</button>
            <button data-key="5" class="calc-btn">5</button>
            <button data-key="6" class="calc-btn">6</button>
            <button data-key="-" class="calc-btn calc-btn--accent">−</button>

            <button data-key="1" class="calc-btn">1</button>
            <button data-key="2" class="calc-btn">2</button>
            <button data-key="3" class="calc-btn">3</button>
            <button data-key="+" class="calc-btn calc-btn--accent">+</button>

            <button data-key="0" class="calc-btn calc-btn--wide">0</button>
            <button data-key="." class="calc-btn">.</button>
            <button data-key="=" class="calc-btn calc-btn--equal">=</button>
          </div>
        </div>
      </div>

      <style>
        .calc-panel { max-width: 340px; }
        .calc-display {
          background: var(--bg-1);
          border: 1px solid var(--line);
          border-radius: 8px;
          padding: 18px 16px;
          font-family: var(--font-mono);
          font-size: 28px;
          text-align: right;
          color: var(--text-0);
          margin-bottom: 16px;
          overflow-x: auto;
          white-space: nowrap;
        }
        .calc-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }
        .calc-btn {
          background: var(--bg-1);
          border: 1px solid var(--line);
          color: var(--text-0);
          font-size: 16px;
          padding: 14px 0;
          border-radius: 8px;
          transition: background 0.15s ease;
        }
        .calc-btn:hover { background: var(--bg-3); }
        .calc-btn--muted { color: var(--text-1); }
        .calc-btn--accent { color: var(--accent); }
        .calc-btn--wide { grid-column: span 2; }
        .calc-btn--equal {
          background: var(--accent);
          color: #1a1400;
          border-color: var(--accent);
          font-weight: 600;
        }
        .calc-btn--equal:hover { filter: brightness(1.08); }
      </style>
    `;

    const display = main.querySelector("#calcDisplay");
    const grid = main.querySelector("#calcGrid");
    let expr = "";

    function safeEval(str) {
      // Só permite dígitos, operadores básicos, parênteses, ponto e espaço.
      if (!/^[0-9+\-*/(). ]*$/.test(str)) throw new Error("Expressão inválida");
      // eslint-disable-next-line no-new-func
      return Function(`"use strict"; return (${str})`)();
    }

    function update() {
      display.textContent = expr || "0";
    }

    function handleKey(key) {
      if (key === "C") {
        expr = "";
      } else if (key === "=") {
        try {
          const result = safeEval(expr);
          expr = String(result);
        } catch {
          expr = "Erro";
        }
      } else {
        expr = expr === "Erro" ? key : expr + key;
      }
      update();
    }

    function onGridClick(e) {
      const btn = e.target.closest("[data-key]");
      if (!btn) return;
      handleKey(btn.getAttribute("data-key"));
    }

    function onKeydown(e) {
      if (/[0-9+\-*/.()]/.test(e.key)) {
        handleKey(e.key);
      } else if (e.key === "Enter") {
        handleKey("=");
      } else if (e.key === "Backspace") {
        expr = expr.slice(0, -1);
        update();
      } else if (e.key === "Escape") {
        handleKey("C");
      }
    }

    grid.addEventListener("click", onGridClick);
    document.addEventListener("keydown", onKeydown);

    // Cleanup: remove listener global de teclado ao sair da ferramenta
    return function cleanup() {
      document.removeEventListener("keydown", onKeydown);
    };
  }
};
