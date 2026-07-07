window.Tools = window.Tools || {};

window.Tools.geradorSenhas = {
  render(main) {
    main.innerHTML = `
      <div class="tool">
        <div class="tool-header">
          <span class="eyebrow">Utilidades</span>
          <h2>Gerador de senhas</h2>
          <p>Crie senhas aleatórias e seguras.</p>
        </div>

        <div class="panel">
          <div class="field">
            <label for="gsTamanho">Tamanho: <span id="gsTamanhoValor">16</span></label>
            <input type="range" id="gsTamanho" min="4" max="64" value="16">
          </div>

          <div class="field" style="flex-direction: row; align-items: center; gap: 8px;">
            <input type="checkbox" id="gsMaiusculas" checked style="width:auto;">
            <label for="gsMaiusculas" style="margin:0;">Letras maiúsculas (A-Z)</label>
          </div>
          <div class="field" style="flex-direction: row; align-items: center; gap: 8px;">
            <input type="checkbox" id="gsMinusculas" checked style="width:auto;">
            <label for="gsMinusculas" style="margin:0;">Letras minúsculas (a-z)</label>
          </div>
          <div class="field" style="flex-direction: row; align-items: center; gap: 8px;">
            <input type="checkbox" id="gsNumeros" checked style="width:auto;">
            <label for="gsNumeros" style="margin:0;">Números (0-9)</label>
          </div>
          <div class="field" style="flex-direction: row; align-items: center; gap: 8px;">
            <input type="checkbox" id="gsSimbolos" style="width:auto;">
            <label for="gsSimbolos" style="margin:0;">Símbolos (!@#$...)</label>
          </div>

          <button class="btn" id="gsGerar">Gerar senha</button>

          <div class="result" id="gsResultado" style="display:none; display:flex; align-items:center; gap:10px; word-break: break-all;"></div>
        </div>
      </div>
    `;

    const tamanho = main.querySelector("#gsTamanho");
    const tamanhoValor = main.querySelector("#gsTamanhoValor");
    const maiusculas = main.querySelector("#gsMaiusculas");
    const minusculas = main.querySelector("#gsMinusculas");
    const numeros = main.querySelector("#gsNumeros");
    const simbolos = main.querySelector("#gsSimbolos");
    const btn = main.querySelector("#gsGerar");
    const resultado = main.querySelector("#gsResultado");

    const SETS = {
      maiusculas: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      minusculas: "abcdefghijklmnopqrstuvwxyz",
      numeros: "0123456789",
      simbolos: "!@#$%^&*()_-+=?"
    };

    function onTamanhoInput() {
      tamanhoValor.textContent = tamanho.value;
    }

    function gerar() {
      let charset = "";
      if (maiusculas.checked) charset += SETS.maiusculas;
      if (minusculas.checked) charset += SETS.minusculas;
      if (numeros.checked) charset += SETS.numeros;
      if (simbolos.checked) charset += SETS.simbolos;

      if (!charset) {
        resultado.style.display = "flex";
        resultado.textContent = "Selecione ao menos um tipo de caractere.";
        return;
      }

      const len = parseInt(tamanho.value, 10);
      const array = new Uint32Array(len);
      crypto.getRandomValues(array);

      let senha = "";
      for (let i = 0; i < len; i++) {
        senha += charset[array[i] % charset.length];
      }

      resultado.style.display = "flex";
      resultado.innerHTML = `
        <span style="flex:1;">${senha}</span>
        <button class="btn secondary" id="gsCopiar" style="font-size:12px; padding:6px 10px;">Copiar</button>
      `;

      const copiarBtn = resultado.querySelector("#gsCopiar");
      copiarBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(senha).then(() => {
          copiarBtn.textContent = "Copiado!";
          setTimeout(() => (copiarBtn.textContent = "Copiar"), 1200);
        });
      });
    }

    tamanho.addEventListener("input", onTamanhoInput);
    btn.addEventListener("click", gerar);

    return function cleanup() {
      tamanho.removeEventListener("input", onTamanhoInput);
      btn.removeEventListener("click", gerar);
    };
  }
};
