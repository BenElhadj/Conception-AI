<script>
  // @ts-nocheck
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { generateCode } from '$lib/api.js';
  import { conversation, historyStack, generatedCode, layout } from '$lib/history/chat.js';
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
    // if (browser) {
    //   console.log('App mounted successfully');
    //   console.log('Current path:', window.location.pathname);
    //   console.log('Base URL:', import.meta.env.BASE_URL);
    // }
    apiKey = localStorage.getItem('openai_api_key') || '';
    const codeNow = get(generatedCode);
    if (codeNow) {
      compileAndRender(codeNow);
    }
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

    const prev = stack[stack.length - 1];
    historyStack.set(stack.slice(0, -1));
    generatedCode.set(prev.code || '');
    conversation.set(prev.chat || []);
    compileAndRender(prev.code || '');
  }

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
        {loading}
        canUndo={$historyStack.length > 0}
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
