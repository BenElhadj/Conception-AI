<script>
    import { generatedCode } from '$lib/history/chat.js';
    
    export let onDownload;
  </script>
  
  <section class="panel">
    <h2>Generated Code</h2>
    <pre>
      {#if $generatedCode}
        <code>{$generatedCode}</code>
      {/if}
    </pre>
    {#if $generatedCode}
      <button on:click={onDownload}>Download .svelte</button>
    {/if}
  </section>
  