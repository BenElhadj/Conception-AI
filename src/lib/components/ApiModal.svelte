<script>
    export let show = false;
    export let apiKey = '';
    export let error = '';
    export let onSave;
    export let onCancel;
    
    let tempKey = '';
    
    $: if (show) {
      tempKey = apiKey;
    }
    
    function handleSave() {
      onSave(tempKey.trim());
    }
  </script>
  
  {#if show}
    <div class="modal-backdrop">
      <div class="modal">
        <h2>{apiKey ? "Change API Key" : "Add API Key"}</h2>
        <input type="text" bind:value={tempKey} placeholder="Enter your OpenAI API key (sk-...)" />
        {#if error}
          <p class="modal-error">{error}</p>
        {/if}
        <div class="modal-actions">
          <button on:click={handleSave}>Save</button>
          <button on:click={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  {/if}
  