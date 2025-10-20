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
        class="btn-icon"
        on:click={onApiModalOpen}
        data-tooltip={apiKey ? "Change API Key" : "Add API Key"}
        title="API Key"
    >
        {#if apiKey}
            🔑
        {:else}
            🔐
        {/if}
    </button>
    <h1>Conception AI</h1>
    <div class="header-controls">
        <button 
            class="btn-icon"
            on:click={toggleLayout}
            data-tooltip={$layout === "horizontal" ? "Switch to vertical layout" : "Switch to horizontal layout"}
            title="Change view"
        >
            {#if $layout === "horizontal"}
                ⤢
            {:else}
                ⤡
            {/if}
        </button>
    </div>
</div>