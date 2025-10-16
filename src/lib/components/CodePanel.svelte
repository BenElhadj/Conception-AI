<script>
    import { generatedCode } from '$lib/history/chat.js';
    
    export let onDownload;
</script>

<section class="panel">
    <h2>Generated Code</h2>
    <pre aria-live="polite" aria-atomic="true">
        {#if $generatedCode}
            <code>{$generatedCode}</code>
        {:else}
            <code class="no-code">No code generated yet</code>
        {/if}
    </pre>
    {#if $generatedCode}
        <button 
            type="button" 
            on:click={onDownload}
            aria-label="Download generated Svelte component"
            class="btn btn-primary"
        >
            Download .svelte
        </button>
    {/if}
</section>