<script>
  // @ts-nocheck
    import { onMount } from 'svelte';
    import { get } from 'svelte/store';
    import { generateCode } from '$lib/api.js';
  
    import { conversation, historyStack, generatedCode, layout } from '$lib/chat.js';
  
    let apiKey = '';
    let prompt = '';
    let error = '';
    let loading = false;
  
    // Modal state
    let showApiModal = false;
    let tempKey = '';
  
    onMount(() => {
      apiKey = localStorage.getItem('openai_api_key') || '';
  
      // Restaurer le rendu si un code existe déjà
      const codeNow = get(generatedCode);
      if (codeNow) {
        compileAndRender(codeNow);
      }
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
        error = 'Please set your OpenAI API key first You can find your API key at https://platform.openai.com/account/api-keys.';
        openApiModal();
        return;
      }
      if (!prompt) return;
  
      loading = true;
      error = '';
      try {
        const newMessages = [...get(conversation), { role: "user", content: prompt }];
  
        const code = await generateCode(newMessages);
        if (code.includes('Erreur')) throw new Error(code);
  
        // Sauvegarde pour undo
        historyStack.update((stack) => [...stack, { code: get(generatedCode), chat: get(conversation) }]);
  
        // Mettre à jour les stores persistés
        generatedCode.set(code);
        conversation.update((hist) => [...hist, { role: "user", content: prompt }, { role: "assistant", content: code }]);
  
        compileAndRender(code);
        prompt = '';
      } catch (e) {
        error = e.message;
        if (error.includes("Incorrect API key provided")) {
          error = 'Erreur API: Incorrect API key provided You can find your API key at https://platform.openai.com/account/api-keys.';
          openApiModal();
        }
      } finally {
        loading = false;
      }
    }
  
    function undo() {
      const stack = get(historyStack);
      if (stack.length === 0) return;
  
      const prev = stack[stack.length - 1];
      historyStack.set(stack.slice(0, -1));
  
      generatedCode.set(prev.code || '');
      conversation.set(prev.chat || []);
  
      compileAndRender(prev.code || '');
    }
  
    function compileAndRender(code) {
      try {
        const previewTarget = document.getElementById("preview-target");
        previewTarget.innerHTML = "";
  
        // Extraire style et HTML
        const styleMatch = code.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
        const htmlOnly = code
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  
        // Appliquer style
        let style = document.getElementById("dynamic-style");
        if (style) style.remove();
        if (styleMatch) {
          style = document.createElement("style");
          style.id = "dynamic-style";
          style.textContent = styleMatch[1];
          document.head.appendChild(style);
        }
  
        // Injecter HTML
        previewTarget.innerHTML = htmlOnly;
  
        // Exécuter script en sandbox
        const scriptMatch = code.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
        if (scriptMatch) {
          const scriptFunc = new Function(scriptMatch[1]);
          scriptFunc();
        }
  
      } catch (e) {
        error = `Render error: ${e.message}`;
      }
    }
  
    function downloadSvelte() {
      const code = get(generatedCode);
      if (!code) return;
      const blob = new Blob([code], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "GeneratedPage.svelte";
      a.click();
      URL.revokeObjectURL(url);
    }
  
    function toggleLayout() {
      layout.update(v => v === "horizontal" ? "vertical" : "horizontal");
    }
  </script>
  
  <!-- Header -->
  <div class="header">
    <button class="api-btn" on:click={openApiModal}>
      {apiKey ? "Change API Key" : "Add API Key"}
    </button>
    <h1>Conception AI – Svelte Page Generator</h1>
    <button class="layout-btn" on:click={toggleLayout}>
      {#if $layout === "horizontal"}
        <img src="/src/lib/assets/horizontal_menu_burger.png" alt="Toggle Layout" style="width: 24px; height: 24px;" />
      {:else}
        <img src="/src/lib/assets/vertical_menu_burger.png" alt="Toggle Layout" style="width: 24px; height: 24px;" />
      {/if}
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
      {loading ? "Generation..." : "Generate new"}
    </button>
    <button on:click={undo} disabled={$historyStack.length === 0}>Undo</button>
  </div>
  
  {#if error}
    <p class="error">{error}</p>
  {/if}
  
  <!-- Layout -->
  <div class="container {$layout}">
    <section class="panel">
      <h2>Prompt</h2>
      <textarea bind:value={prompt} placeholder="Describe or refine the page... (e.g., 'Add a red button')"></textarea>
    </section>
  
    <section class="panel">
      <h2>Generated Code</h2>
      <pre>
        {#if $generatedCode}
          <code>{$generatedCode}</code>
        {/if}
      </pre>
      {#if $generatedCode}
        <button on:click={downloadSvelte}>Download .svelte</button>
      {/if}
    </section>
  
    <section class="panel">
      <h2>Preview</h2>
      <div id="preview-target" class="preview"></div>
    </section>
  </div>
  
  <!-- Conversation History -->
  <section class="panel">
    <h2>Conversation History</h2>
    {#if $conversation.length === 0}
      <p style="text-align:center; color:#777;">No messages yet</p>
    {:else}
      {#each $conversation as msg}
        <div>
          <strong>{msg.role}:</strong> {msg.content}
        </div>
      {/each}
    {/if}
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
  
    /* Controls */
    .controls {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin: 15px 0;
    }
  
    /* Container & Panels */
    .container {
      display: flex;
      width: 100%;
      height: calc(100vh - 200px);
      gap: 20px;
      padding: 10px;
      box-sizing: border-box;
      transition: all 0.3s ease;
    }
    .container.horizontal { flex-direction: row; }
    .container.vertical { flex-direction: column; }
  
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
      border: 1px solid  #ccc;
      background: #fff;
    }
  
    /* Responsive */
    @media (max-width: 900px) {
      .container { flex-direction: column !important; }
      textarea, pre, .preview {
        flex: 1;
        margin-bottom: 10px;
      }
    }
  
    #preview-target {
      min-height: 200px;
      border: 1px solid  #ccc;
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
  
    .error { color: red; text-align: center; }
  </style>
  