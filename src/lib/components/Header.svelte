<script>
    import { layout } from '$lib/history/chat.js';
    
    export let apiKey = '';
    export let onApiModalOpen;
    
    function toggleLayout() {
        layout.update(v => v === "horizontal" ? "vertical" : "horizontal");
    }
</script>

<div class="header">
    <button 
        class="api-btn" 
        on:click={onApiModalOpen}
        aria-label={apiKey ? "Change API Key" : "Add API Key"}
        type="button"
    >
        {apiKey ? "Change API Key" : "Add API Key"}
    </button>
    <h1>Conception AI – Svelte Page Generator</h1>
    <div class="header-controls">
        <button 
            class="layout-btn {$layout}" 
            on:click={toggleLayout}
            aria-label={$layout === "horizontal" ? "Switch to vertical layout" : "Switch to horizontal layout"}
            type="button"
        >
            {#if $layout === "horizontal"}
                ≡
            {:else}
                <span class="vertical-layout-icon">lll</span>
            {/if}
        </button>
    </div>
</div>