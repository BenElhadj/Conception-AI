<script>
  import { generateCode } from '$lib/api.js';
  let prompt = "";
  let generatedCode = "";
  let loading = false;
  let layout = "horizontal"; // "horizontal" ou "vertical"

  async function handleGenerate() {
    if (!prompt) return;
    loading = true;
    generatedCode = await generateCode(prompt);
    loading = false;
  }

  function toggleLayout() {
    layout = layout === "horizontal" ? "vertical" : "horizontal";
  }
</script>

<h1>Conception AI – Générateur de Svelte</h1>

<div class="controls">
  <button on:click={handleGenerate} disabled={loading}>
    {loading ? "Génération en cours..." : "Générer"}
  </button>
  <button on:click={toggleLayout}>
    Basculer en {layout === "horizontal" ? "vertical" : "horizontal"}
  </button>
</div>

<div class="container {layout}">
  <section class="panel">
    <h2>Prompt</h2>
    <textarea bind:value={prompt} placeholder="Décris la page que tu veux générer..."></textarea>
  </section>

  <section class="panel">
    <h2>Code généré</h2>
    {#if generatedCode}
      <pre><code>{generatedCode}</code></pre>
    {/if}
  </section>

  <section class="panel">
    <h2>Aperçu</h2>
    {#if generatedCode}
      <div class="preview">
        {@html generatedCode}
      </div>
    {/if}
  </section>
</div>

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
</style>
