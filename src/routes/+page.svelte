<script>
  import { onMount } from 'svelte';
  import { compile } from 'svelte/compiler';
  import { generateCode } from '$lib/api.js';

  let apiKey = '';
  let prompt = '';
  let chatHistory = [];  // Historique des messages pour itération
  let generatedCode = '';
  let compiledComponent = null;
  let error = '';
  let loading = false;
  let historyStack = [];  // Pour undo: stocke {code, chatHistory}
  let layout = "horizontal";

  onMount(() => {
    apiKey = localStorage.getItem('openai_api_key') || '';
  });

  function saveApiKey() {
    localStorage.setItem('openai_api_key', apiKey);
    alert('Clé API sauvegardée localement.');
  }

  async function handleGenerate() {
    if (!prompt) return;
    loading = true;
    error = '';
    try {
      // Ajoute le nouveau prompt à l'historique
      const newMessages = [...chatHistory, { role: "user", content: prompt }];
      const code = await generateCode(newMessages);
      if (code.includes('Erreur')) throw new Error(code);

      // Sauvegarde pour undo
      historyStack = [...historyStack, { code: generatedCode, chat: chatHistory }];

      generatedCode = code;
      chatHistory = newMessages.concat({ role: "assistant", content: code });  // Ajoute réponse à historique
      compileAndRender(code);
      prompt = '';  // Clear pour next itération
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }

  function undo() {
    if (historyStack.length === 0) return;
    const prev = historyStack.pop();
    generatedCode = prev.code;
    chatHistory = prev.chat;
    compileAndRender(generatedCode);
  }

  function compileAndRender(code) {
    try {
      const previewTarget = document.getElementById("preview-target");
      previewTarget.innerHTML = "";

      // Parser le code généré
      const parser = new DOMParser();
      const doc = parser.parseFromString(code, "text/html");

      // Nettoyer le style précédent
      const oldStyle = document.getElementById("dynamic-style");
      if (oldStyle) oldStyle.remove();

      // Ajouter le <style> du code généré
      const style = doc.querySelector("style");
      if (style) {
        style.id = "dynamic-style";
        document.head.appendChild(style);
      }

      // Ajouter le HTML (hors <html>/<body>)
      const bodyContent = Array.from(doc.body.childNodes)
        .filter((n) => n.tagName !== "SCRIPT" && n.tagName !== "STYLE")
        .map((n) => n.outerHTML || n.textContent)
        .join("");
      previewTarget.innerHTML = bodyContent;

      // Exécuter le <script> (si présent)
      const script = doc.querySelector("script");
      if (script) {
        const newScript = document.createElement("script");
        newScript.textContent = script.textContent;
        previewTarget.appendChild(newScript);
      }

    } catch (e) {
      error = `Erreur de rendu: ${e.message}`;
    }
  }



  function toggleLayout() {
    layout = layout === "horizontal" ? "vertical" : "horizontal";
  }
</script>

<h1>Conception AI – Générateur de Pages Svelte</h1>

<!-- Input pour API Key -->
<section class="panel">
  <h2>Clé API OpenAI (stockée localement)</h2>
  <input type="text" bind:value={apiKey} placeholder="sk-...">
  <button on:click={saveApiKey}>Sauvegarder</button>
</section>

<div class="controls">
  <button on:click={handleGenerate} disabled={loading}>
    {loading ? "Génération..." : "Générer/Itérer"}
  </button>
  <button on:click={undo} disabled={historyStack.length === 0}>Undo</button>
  <button on:click={toggleLayout}>
    Basculer en {layout === "horizontal" ? "vertical" : "horizontal"}
  </button>
</div>

{#if error}
  <p class="error">{error}</p>
{/if}

<div class="container {layout}">
  <section class="panel">
    <h2>Prompt (pour itération)</h2>
    <textarea bind:value={prompt} placeholder="Décris ou raffine la page... (e.g., 'Ajoute un bouton rouge')"></textarea>
  </section>

  <section class="panel">
    <h2>Code Généré</h2>
    {#if generatedCode}
      <pre><code>{generatedCode}</code></pre>
    {/if}
  </section>

  <section class="panel">
    <h2>Aperçu</h2>
    <div id="preview-target" class="preview"></div>
  </section>
</div>

<!-- Historique conversation -->
<section class="panel">
  <h2>Historique Conversation</h2>
  {#each chatHistory as msg}
    <p><strong>{msg.role}:</strong> {msg.content}</p>
  {/each}
</section>

<style>
  :global(body) {
    margin: 0;
    font-family: sans-serif;
  }

  h1 {
    text-align: center;
    margin: 20px 0;
  }

  .controls {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 10px;
  }

  .container {
    display: flex;
    width: 100%;
    height: calc(100vh - 120px);
    gap: 20px;
    padding: 10px;
    box-sizing: border-box;
    transition: all 0.3s ease;
  }

  .container.horizontal {
    flex-direction: row;
  }

  .container.vertical {
    flex-direction: column;
  }

  .panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    overflow: hidden;
    transition: all 0.3s ease;
  }

  h2 {
    margin: 0 0 10px 0;
    text-align: center;
    color: #444;
  }

  textarea, pre, .preview {
    flex: 1;
    min-height: 100px;
    padding: 10px;
    border-radius: 6px;
    border: 1px solid #ccc;
    box-sizing: border-box;
    font-size: 1rem;
    margin-bottom: 10px;
    overflow: auto;
    transition: all 0.3s ease;
  }

  pre {
    background: #f4f4f4;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .preview {
    border: 1px solid #a9ffae;
    background: #fff;
  }

  /* Responsive */
  @media (max-width: 900px) {
    .container {
      flex-direction: column !important;
    }
    textarea, pre, .preview {
      flex: 1;
      margin-bottom: 10px;
    }
  }

  .error { color: red; text-align: center; }
  #preview-target { min-height: 200px; border: 1px solid #a9ffae; padding: 10px; }
</style>
