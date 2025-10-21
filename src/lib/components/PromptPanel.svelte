<script lang="ts">
    export let prompt: string = '';
    export let loading: boolean = false;
    export let onGenerate: () => void;
    export let onUndo: () => void;
    export let canUndo: boolean = false;
    export let onRedo: () => void;
    export let canRedo: boolean = false;
    
    // ID unique pour ce composant
    const textareaId: string = 'prompt-textarea-main';
    
    function handleKeydown(event: KeyboardEvent): void {
        if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
            // Ctrl+Enter ou Cmd+Enter pour soumettre
            event.preventDefault();
            if (!loading && prompt.trim()) {
                onGenerate();
            }
        } else if (event.key === 'Enter' && !event.shiftKey) {
            // Enter seul pour soumettre (sans Shift)
            event.preventDefault();
            if (!loading && prompt.trim()) {
                onGenerate();
            }
        }
        // Shift+Enter permet d'aller à la ligne normalement
    }
    
    function handleGenerate(): void {
        if (!loading && prompt.trim()) {
            onGenerate();
        }
    }
</script>

<section class="panel prompt-panel">
    <div class="prompt-container">
        <div class="prompt-header">
            <h2>Prompt</h2>
            <div class="prompt-actions">
                <button 
                    class="btn-icon"
                    on:click={onUndo}
                    disabled={!canUndo || loading}
                    data-tooltip="Undo last generation"
                    title="Undo"
                    >
                    ↩️
                </button>
                <button 
                    class="btn-icon accent {loading || !prompt.trim() ? 'disabled-btn' : ''}"
                    on:click={handleGenerate}
                    disabled={loading || !prompt.trim()}
                    data-tooltip="Generate code (Enter)"
                    title="Generate code"
                >
                    ⚡
                </button>
                <button 
                    class="btn-icon"
                    on:click={onRedo}
                    disabled={!canRedo || loading}
                    data-tooltip="Redo (rendo)"
                    title="Redo"
                >
                    ↪️
                </button>
            </div>
        </div>
        
        <div class="prompt-textarea-container">
            <label for={textareaId} class="sr-only">Enter your prompt to generate Svelte code</label>
            <textarea 
                id={textareaId}
                name="user_prompt"
                bind:value={prompt} 
                placeholder="Describe what you want to create... (e.g., 'Create a login form with email and password fields')"
                autocomplete="off"
                rows="3"
                on:keydown={handleKeydown}
                disabled={loading}
                class="prompt-textarea scrollable"
            ></textarea>
        </div>
        
        {#if loading}
            <div class="loading-indicator">
                <div class="spinner"></div>
                <span>Generating code...</span>
            </div>
        {/if}
        
        <div class="help-text">
            <small>Describe your component and press Enter to generate</small>
            <div class="enter-hint">
                <span>Press</span>
                <span class="enter-icon">Enter</span>
                <span>to generate</span>
            </div>
        </div>
    </div>
</section>