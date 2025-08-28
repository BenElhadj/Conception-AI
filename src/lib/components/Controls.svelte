<script>
    import { historyStack } from '$lib/history/chat.js';
    
    export let loading = false;
    export let onGenerate;
    export let onUndo;
  </script>
  
  <div class="controls">
    <button on:click={onGenerate} disabled={loading}>
      {loading ? "Generation..." : "Generate new"}
    </button>
    <button on:click={onUndo} disabled={$historyStack.length === 0}>Undo</button>
  </div>
  