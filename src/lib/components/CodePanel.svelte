<script>
    import { generatedCode } from '$lib/history/chat.js';
    
    export let onDownload;
</script>

<section class="panel code-panel">
    <div class="panel-header">
        <h2>Generated Code</h2>
        <div class="panel-actions">
            {#if $generatedCode}
                <button 
                    class="btn-icon success"
                    on:click={onDownload}
                    title="Download"
                >
                    📥
                </button>
            {/if}
        </div>
    </div>
    <div class="panel-content">
        <pre class="scrollable" aria-live="polite" aria-atomic="true">
            {#if $generatedCode}
                <code>{$generatedCode}</code>
            {:else}
                <code class="no-code">// Your generated code will appear here</code>
            {/if}
        </pre>
    </div>
</section>