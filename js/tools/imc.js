/* ============================================
   Ferramenta: IMC (Índice de Massa Corporal)
   Registrada em window.Tools.imc
   ============================================ */
window.Tools = window.Tools || {};

window.Tools.imc = {
  render(main) {
    main.innerHTML = `
      <div class="tool">
        <div class="tool-header">
          <span class="eyebrow">Cálculos</span>
          <h2>IMC</h2>
          <p>Índice de Massa Corporal a partir de peso e altura.</p>
        </div>

        <div class="panel">
          <div class="field">
            <label for="imcPeso">Peso (kg)</label>
            <input type="number" id="imcPeso" placeholder="Ex: 70" step="0.1" min="0">
          </div>
          <div class="field">
            <label for="imcAltura">Altura (m)</label>
            <input type="number" id="imcAltura" placeholder="Ex: 1.75" step="0.01" min="0">
          </div>
          <button class="btn" id="imcCalcular">Calcular</button>

          <div class="result" id="imcResultado" style="display:none;"></div>
          <p id="imcClassificacao" style="color: var(--text-1); font-size: 13.5px; margin-top: 6px;"></p>
        </div>
      </div>
    `;

    const pesoInput = main.querySelector("#imcPeso");
    const alturaInput = main.querySelector("#imcAltura");
    const btn = main.querySelector("#imcCalcular");
    const resultado = main.querySelector("#imcResultado");
    const classificacao = main.querySelector("#imcClassificacao");

    function classificar(imc) {
      if (imc < 18.5) return "Abaixo do peso";
      if (imc < 25) return "Peso normal";
      if (imc < 30) return "Sobrepeso";
      if (imc < 35) return "Obesidade grau I";
      if (imc < 40) return "Obesidade grau II";
      return "Obesidade grau III";
    }

    function calcular() {
      const peso = parseFloat(pesoInput.value);
      const altura = parseFloat(alturaInput.value);

      if (!peso || !altura || altura <= 0) {
        resultado.style.display = "block";
        resultado.textContent = "Preencha peso e altura válidos.";
        classificacao.textContent = "";
        return;
      }

      const imc = peso / (altura * altura);
      resultado.style.display = "block";
      resultado.textContent = imc.toFixed(1);
      classificacao.textContent = classificar(imc);
    }

    btn.addEventListener("click", calcular);

    // Enter em qualquer campo também calcula
    function onEnter(e) {
      if (e.key === "Enter") calcular();
    }
    pesoInput.addEventListener("keydown", onEnter);
    alturaInput.addEventListener("keydown", onEnter);

    return function cleanup() {
      btn.removeEventListener("click", calcular);
      pesoInput.removeEventListener("keydown", onEnter);
      alturaInput.removeEventListener("keydown", onEnter);
    };
  }
};
