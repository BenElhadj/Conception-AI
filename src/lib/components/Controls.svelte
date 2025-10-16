<script>
    import { historyStack } from '$lib/history/chat.js';
    
    export let loading = false;
    export let onGenerate;
    export let onUndo;
</script>

<div class="controls">
    <button 
        type="button" 
        on:click={onGenerate} 
        disabled={loading}
        aria-label={loading ? "Generating code..." : "Generate new code"}
    >
        {loading ? "Generation..." : "Generate new"}
    </button>
    <button 
        type="button" 
        on:click={onUndo} 
        disabled={$historyStack.length === 0}
        aria-label="Undo last generation"
    >
        Undo
    </button>
</div>