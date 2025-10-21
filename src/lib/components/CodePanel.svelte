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
        {#if !$generatedCode}
            <div class="empty-state">
                <p>No generated code yet</p>
                <small>Generate code to see it here</small>
            </div>
        {/if}
        {#if $generatedCode}
            <pre class="scrollable" aria-live="polite" aria-atomic="true">
                <code>{$generatedCode}</code>
            </pre>
        {/if}
    </div>
</section>