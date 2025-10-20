<script lang="ts">
    export let show: boolean = false;
    export let apiKey: string = '';
    export let error: string = '';
    export let onSave: (key: string) => void = () => {};
    export let onCancel: () => void = () => {};
    
    let tempKey: string = '';
    
    // ID unique pour ce composant
    const inputId = 'api-key-input-main';
    
    $: if (show) {
        tempKey = apiKey;
    }
    
    function handleSave() {
        onSave(tempKey.trim());
    }
    
    function handleCancel() {
        tempKey = '';
        onCancel();
    }
</script>

{#if show}
    <div class="modal-backdrop">
        <div class="modal">
            <h2>{apiKey ? "Change API Key" : "Add API Key"}</h2>
            <label for={inputId} class="sr-only">OpenAI API Key</label>
            <input 
                id={inputId}
                type="password" 
                bind:value={tempKey} 
                placeholder="Enter your OpenAI API key (sk-...)"
                name="api_key"
                autocomplete="new-password"
                aria-describedby={error ? 'api-error' : undefined}
            />
            {#if error}
                <p id="api-error" class="modal-error">{error}</p>
            {/if}
            <div class="modal-actions">
                <button type="button" on:click={handleSave}>Save</button>
                <button type="button" on:click={handleCancel}>Cancel</button>
            </div>
        </div>
    </div>
{/if}
