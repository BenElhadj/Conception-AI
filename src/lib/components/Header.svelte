<script>
    import { layout } from '$lib/history/chat.js';
    
    export let apiKey = '';
    export let onApiModalOpen;
    
    function toggleLayout() {
      layout.update(v => v === "horizontal" ? "vertical" : "horizontal");
    }
  </script>
  
  <div class="header">
    <button class="api-btn" on:click={onApiModalOpen}>
      {apiKey ? "Change API Key" : "Add API Key"}
    </button>
    <h1>Conception AI – Svelte Page Generator</h1>
    <button 
      class="layout-btn { $layout }" 
      on:click={toggleLayout}>
      {#if $layout === "horizontal"}
        ≡
      {:else}
        <span style="font-size: 1.3rem;">lll</span>
      {/if}
    </button>
  </div>
  