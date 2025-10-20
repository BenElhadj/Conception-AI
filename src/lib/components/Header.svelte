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

<style>
    .layout-btn {
        background: var(--white);
        border: 1px solid var(--gray-300);
        border-radius: var(--radius);
        padding: 0.5rem;
        cursor: pointer;
        transition: var(--transition);
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.5rem;
        height: 2.5rem;
    }
    
    .layout-btn:hover {
        background: var(--gray-50);
        border-color: var(--gray-400);
        transform: scale(1.05);
    }
    
    .layout-btn.horizontal::before {
        content: '☰';
        font-size: 1.2rem;
    }
    
    .layout-btn.vertical::before {
        content: '≡';
        font-size: 1.2rem;
        transform: rotate(90deg);
        display: block;
    }
</style>