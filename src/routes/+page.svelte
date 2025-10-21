<script>
  // @ts-nocheck
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { generateCode } from '$lib/api.js';
  import { conversation, historyStack, generatedCode, layout, futureStack } from '$lib/history/chat.js';
  import { browser } from '$app/environment';
  
  // Import des composants
  import Header from '$lib/components/Header.svelte';
  import ApiModal from '$lib/components/ApiModal.svelte';
  import PromptPanel from '$lib/components/PromptPanel.svelte';
  import CodePanel from '$lib/components/CodePanel.svelte';
  import PreviewPanel from '$lib/components/PreviewPanel.svelte';
  import ConversationHistory from '$lib/components/ConversationHistory.svelte';
  
  // Import des styles
  import '$lib/styles/app.css';

  let apiKey = '';
  let prompt = '';
  let error = '';
  let errorLink = '';
  let loading = false;
  let showApiModal = false;

  onMount(() => {
    apiKey = localStorage.getItem('openai_api_key') || '';
    let hydrated = false;
    const unsubscribe = generatedCode.subscribe((code) => {
      if (code) {
        compileAndRender(code);
        hydrated = true;
      } else if (hydrated) {
        const last = localStorage.getItem('generated_code');
        if (last) compileAndRender(JSON.parse(last));
      }
    });
  });

  function openApiModal() {
    showApiModal = true;
  }

  function saveApiKey(newKey) {
    if (!newKey) return;
    apiKey = newKey;
    localStorage.setItem('openai_api_key', apiKey);
    showApiModal = false;
    error = '';
    errorLink = '';
    alert('API Key saved.');
  }

  function closeApiModal() {
    showApiModal = false;
  }

  async function handleGenerate() {
    if (!apiKey) {
      error = 'Please set your OpenAI API key first.';
      errorLink = 'https://platform.openai.com/account/api-keys';
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

      historyStack.update((stack) => [...stack, { code: get(generatedCode), chat: get(conversation) }]);
      generatedCode.set(code);
      conversation.update((hist) => [...hist, { role: "user", content: prompt }, { role: "assistant", content: code }]);

      compileAndRender(code);
      prompt = '';
    } catch (e) {
      error = e.message;
      if (error.includes("Incorrect API key provided")) {
        error = 'Erreur API: Incorrect API key provided.';
        errorLink = 'https://platform.openai.com/account/api-keys';
        openApiModal();
      }
    } finally {
      loading = false;
    }
  }

  function undo() {
    const stack = get(historyStack);
    if (stack.length === 0) return;

    // On sauvegarde l'état courant dans futureStack pour redo
    const current = { code: get(generatedCode), chat: get(conversation) };
    futureStack.update(fut => [...fut, current]);

    const prev = stack[stack.length - 1];
    historyStack.set(stack.slice(0, -1));
    generatedCode.set(prev.code || '');
    conversation.set(prev.chat || []);
    compileAndRender(prev.code || '');
  }

  function redo() {
    const fut = get(futureStack);
    if (fut.length === 0) return;

    // On sauvegarde l'état courant dans l'historique pour pouvoir annuler le redo
    const current = { code: get(generatedCode), chat: get(conversation) };
    historyStack.update(stack => [...stack, current]);

    const next = fut[fut.length - 1];
    futureStack.set(fut.slice(0, -1));
    generatedCode.set(next.code || '');
    conversation.set(next.chat || []);
    compileAndRender(next.code || '');
  }

  // Pour activer/désactiver le bouton redo
  import { derived } from 'svelte/store';
  const canRedo = derived(futureStack, $fut => $fut.length > 0);

  function compileAndRender(code) {
    try {
      const cleanCode = code
        .replace(/<!DOCTYPE[^>]*>/gi, '')
        .replace(/<\/?(html|head|body)[^>]*>/gi, '');

      const styleMatch = cleanCode.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
      const scriptMatch = cleanCode.match(/<script[^>]*>([\s\S]*?)<\/script>/i);

      let htmlOnly = cleanCode
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

      // Ajoute autocomplete="off" à tous les champs de formulaire sans autocomplete
      htmlOnly = htmlOnly.replace(/<(input|textarea|select)([^>]*\b(?:id|name)=[^>]*)(?![^>]*\bautocomplete=)[^>]*>/gi,
      (match, tag, attrs) => {
        // Ajoute autocomplete="off" juste avant la fin de la balise
        return match.replace(/>$/, ' autocomplete="off">');
      }
      );

      // Créer un document HTML complet mais isolé
      const srcdoc = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            /* Reset minimal pour éviter les interférences */
            body { 
              margin: 0; 
              padding: 0;
              font-family: inherit;
              background: white;
            }
            /* Les styles générés par l'IA s'appliqueront normalement */
          </style>
          ${styleMatch ? `<style>${styleMatch[1]}</style>` : ""}
        </head>
        <body>
          ${htmlOnly}
          ${scriptMatch ? `<script>${scriptMatch[1]}<\/script>` : ""}
        </body>
      </html>
      `;

      const iframe = document.getElementById("preview-iframe");
      if (iframe) {
        iframe.srcdoc = srcdoc;
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
</script>

<Header {apiKey} onApiModalOpen={openApiModal} />

<ApiModal 
  show={showApiModal} 
  {apiKey} 
  {error} 
  onSave={saveApiKey} 
  onCancel={closeApiModal} 
/>

{#if error}
  <p class="text-error">
    {error}
    {#if errorLink}
      <br />
      <a href={errorLink} target="_blank" rel="noopener noreferrer">{errorLink}</a>
    {/if}
  </p>
{/if}

<div class="container {$layout}">
  <div class="panel prompt-panel">
  <PromptPanel 
    bind:prompt 
    onGenerate={handleGenerate} 
    onUndo={undo}
    onRedo={redo}
    {loading}
    canUndo={$historyStack.length > 0}
    canRedo={$canRedo}
  />
  </div>
  <div class="panel code-panel">
    <CodePanel onDownload={downloadSvelte} />
  </div>
  <div class="panel preview-panel">
    <PreviewPanel />
  </div>
  <div class="panel history-panel">
    <ConversationHistory />
  </div>
</div>
