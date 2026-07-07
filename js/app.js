/* ============================================
   CANIVETE DIGITAL — app.js
   Núcleo: gerencia sidebar, roteamento de ferramentas
   e o ciclo de vida (mount/unmount) de cada uma.

   COMO FUNCIONA:
   - Cada ferramenta vive em js/tools/<nome>.js
   - Esse arquivo define uma função global em window.Tools.<nome>
     com a assinatura: { render(main) }
       -> render(main) recebe o elemento <main> e deve:
          1. Preencher main.innerHTML com o HTML da ferramenta
          2. Adicionar os listeners/lógica necessários
          3. (opcional) retornar uma função de "cleanup" que será
             chamada antes de trocar de ferramenta (para limpar
             intervals, timeouts, listeners globais, etc.)
   ============================================ */

(function () {
  "use strict";

  // Registro global onde cada tools/*.js vai se pendurar.
  window.Tools = window.Tools || {};

  const main = document.getElementById("main");
  const emptyState = document.getElementById("quandoVazio");
  const nav = document.getElementById("nav");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const menuToggle = document.getElementById("menuToggle");

  // Mantém referência da função de limpeza da ferramenta atual (se houver)
  let currentCleanup = null;
  let currentTool = null;

  // Cache de scripts já carregados, pra não injetar <script> duas vezes
  const loadedScripts = new Set();

  /* ---------- Accordion dos grupos do sidebar ---------- */
  document.querySelectorAll(".nav-group__title").forEach((btn) => {
    btn.addEventListener("click", () => {
      const group = btn.closest(".nav-group");
      group.classList.toggle("is-open");
    });
  });

  /* ---------- Menu mobile ---------- */
  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("is-open");
    overlay.classList.toggle("is-open");
  });
  overlay.addEventListener("click", () => {
    sidebar.classList.remove("is-open");
    overlay.classList.remove("is-open");
  });

  /* ---------- Carregamento dinâmico de js/tools/<nome>.js ---------- */
  function loadToolScript(toolName) {
    return new Promise((resolve, reject) => {
      if (loadedScripts.has(toolName)) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = `js/tools/${toolName}.js`;
      script.onload = () => {
        loadedScripts.add(toolName);
        resolve();
      };
      script.onerror = () => {
        reject(new Error(`Não foi possível carregar js/tools/${toolName}.js`));
      };
      document.body.appendChild(script);
    });
  }

  async function openTool(toolName, btnEl) {
    // Roda cleanup da ferramenta anterior, se existir
    if (typeof currentCleanup === "function") {
      try { currentCleanup(); } catch (e) { console.warn("Erro no cleanup:", e); }
    }
    currentCleanup = null;
    currentTool = toolName;

    // Marca item ativo no menu
    document.querySelectorAll(".nav-group__list li button").forEach((b) => {
      b.classList.remove("active");
    });
    if (btnEl) btnEl.classList.add("active");

    // Estado de carregamento simples
    main.innerHTML = `<div class="tool"><p style="color:var(--text-2)">Carregando…</p></div>`;

    try {
      await loadToolScript(toolName);

      const toolModule = window.Tools[toKey(toolName)];
      if (!toolModule || typeof toolModule.render !== "function") {
        throw new Error(`A ferramenta "${toolName}" não registrou um render() em window.Tools.`);
      }

      main.innerHTML = "";
      const cleanup = toolModule.render(main);
      if (typeof cleanup === "function") {
        currentCleanup = cleanup;
      }
    } catch (err) {
      console.error(err);
      main.innerHTML = `
        <div class="tool">
          <div class="tool-header">
            <span class="eyebrow">Erro</span>
            <h2>Ferramenta ainda não implementada</h2>
            <p>${err.message}</p>
          </div>
        </div>
      `;
    }

    // Fecha sidebar no mobile após escolher
    sidebar.classList.remove("is-open");
    overlay.classList.remove("is-open");
  }

  // Converte "regra-de-tres" -> "regraDeTres" para usar como chave de window.Tools
  function toKey(kebab) {
    return kebab.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  }

  /* ---------- Delegação de clique nos itens do menu ---------- */
  nav.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-tool]");
    if (!btn) return;
    const toolName = btn.getAttribute("data-tool");
    openTool(toolName, btn);
  });

  // Expondo utilitário caso alguma tool precise re-renderizar a si mesma
  window.CanivetteApp = { openTool };
})();
