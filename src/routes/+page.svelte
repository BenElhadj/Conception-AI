<script>
  import { onMount } from 'svelte';
  import { generateCode } from '$lib/api.js';

  let apiKey = '';
  let prompt = '';
  let chatHistory = [];
  let generatedCode = '';
  let error = '';
  let loading = false;
  let historyStack = [];
  let layout = "horizontal";

  // Modal state
  let showApiModal = false;
  let tempKey = '';

  onMount(() => {
    apiKey = localStorage.getItem('openai_api_key') || '';
  });

  function openApiModal() {
    tempKey = apiKey;
    showApiModal = true;
  }

  function saveApiKey() {
    apiKey = tempKey.trim();
    if (!apiKey) return;
    localStorage.setItem('openai_api_key', apiKey);
    showApiModal = false;
    error = '';
    alert('API Key saved.');
  }

  async function handleGenerate() {
    if (!apiKey) {
      error = 'You must provide a valid OpenAI API key.';
      openApiModal();
      return;
    }

    if (!prompt) return;
    loading = true;
    error = '';
    try {
      const newMessages = [...chatHistory, { role: "user", content: prompt }];
      const code = await generateCode(newMessages);

      if (code.includes('Erreur')) {
        throw new Error(code);
      }

      historyStack = [...historyStack, { code: generatedCode, chat: chatHistory }];
      generatedCode = code;
      chatHistory = newMessages.concat({ role: "assistant", content: code });
      compileAndRender(code);
      prompt = '';
    } catch (e) {
      error = 'You must provide a valid OpenAI API key.';
      openApiModal();
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

      const parser = new DOMParser();
      const doc = parser.parseFromString(code, "text/html");

      const oldStyle = document.getElementById("dynamic-style");
      if (oldStyle) oldStyle.remove();

      const style = doc.querySelector("style");
      if (style) {
        style.id = "dynamic-style";
        document.head.appendChild(style);
      }

      const bodyContent = Array.from(doc.body.childNodes)
        .filter((n) => n.tagName !== "SCRIPT" && n.tagName !== "STYLE")
        .map((n) => n.outerHTML || n.textContent)
        .join("");
      previewTarget.innerHTML = bodyContent;

      const script = doc.querySelector("script");
      if (script) {
        const newScript = document.createElement("script");
        newScript.textContent = script.textContent;
        previewTarget.appendChild(newScript);
      }
    } catch (e) {
      error = `Render error: ${e.message}`;
    }
  }

  function toggleLayout() {
    layout = layout === "horizontal" ? "vertical" : "horizontal";
  }
</script>

<!-- Header with title and actions -->
<div class="header">
  <button class="api-btn" on:click={openApiModal}>
    {apiKey ? "Change API Key" : "Add API Key"}
  </button>
  <h1>Conception AI – Svelte Page Generator</h1>
  <button class="layout-btn" on:click={toggleLayout}>
    {layout === "horizontal" ? "≡" : "⋮"}
  </button>
</div>

<!-- Modal -->
{#if showApiModal}
  <div class="modal-backdrop">
    <div class="modal">
      <h2>{apiKey ? "Change API Key" : "Add API Key"}</h2>

      <input type="text" bind:value={tempKey} placeholder="Enter your OpenAI API key (sk-...)" />

      {#if error}
        <p class="modal-error">{error}</p>
      {/if}

      <div class="modal-actions">
        <button on:click={saveApiKey}>Save</button>
        <button on:click={() => (showApiModal = false)}>Cancel</button>
      </div>
    </div>
  </div>
{/if}

<!-- Controls -->
<div class="controls">
  <button on:click={handleGenerate} disabled={loading}>
    {loading ? "Generating..." : "Generate / Iterate"}
  </button>
  <button on:click={undo} disabled={historyStack.length === 0}>Undo</button>
</div>

<!-- Layout -->
<div class="container {layout}">
  <section class="panel">
    <h2>Prompt</h2>
    <textarea bind:value={prompt} placeholder="Describe or refine the page... (e.g., 'Add a red button')"></textarea>
  </section>

  <section class="panel">
    <h2>Generated Code</h2>
    {#if generatedCode}
      <pre><code>{generatedCode}</code></pre>
    {/if}
  </section>

  <section class="panel">
    <h2>Preview</h2>
    <div id="preview-target" class="preview"></div>
  </section>
</div>

<section class="panel">
  <h2>Conversation History</h2>
  {#each chatHistory as msg}
    <p><strong>{msg.role}:</strong> {msg.content}</p>
  {/each}
</section>

<style>
  :global(body) {
    margin: 0;
    font-family: sans-serif;
  }

  /* Header */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    background: #f9f9f9;
    border-bottom: 1px solid #ddd;
  }

  .header h1 {
    flex: 1;
    text-align: center;
    margin: 0;
    font-size: 1.4rem;
  }

  .api-btn {
    background: #007BFF;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 6px 12px;
    cursor: pointer;
    font-size: 0.9rem;
  }

  .layout-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }

  .controls {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin: 15px 0;
  }

  .container {
    display: flex;
    width: 100%;
    height: calc(100vh - 200px);
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

  @media (max-width: 900px) {
    .container {
      flex-direction: column !important;
    }
    textarea, pre, .preview {
      flex: 1;
      margin-bottom: 10px;
    }
  }

  #preview-target {
    min-height: 200px;
    border: 1px solid #a9ffae;
    padding: 10px;
  }

  /* Modal */
  .modal-backdrop {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0,0,0,0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal {
    background: #fff;
    border-radius: 12px;
    padding: 25px;
    width: 400px;
    max-width: 95%;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .modal h2 {
    margin: 0;
    text-align: center;
    font-size: 1.3rem;
    color: #333;
  }

  .modal input {
    padding: 12px;
    border-radius: 6px;
    border: 1px solid #ccc;
    font-size: 1rem;
    width: 100%;
    text-align: center;
  }

  .modal-error {
    color: red;
    font-size: 0.9rem;
    text-align: center;
    margin: 0;
  }

  .modal-actions {
    display: flex;
    justify-content: space-between;
    gap: 10px;
  }

  .modal-actions button {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
  }

  .modal-actions button:first-child {
    background: #4CAF50;
    color: white;
  }

  .modal-actions button:last-child {
    background: #ddd;
  }
</style>
