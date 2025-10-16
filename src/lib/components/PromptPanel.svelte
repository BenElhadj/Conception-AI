<script>
    export let prompt = '';
    export let loading = false;
    
    // ID unique pour ce composant
    const textareaId = 'prompt-textarea-main';
    
    // Événement pour la soumission
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    
    function handleKeydown(event) {
        if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
            // Ctrl+Enter ou Cmd+Enter pour soumettre
            event.preventDefault();
            if (!loading && prompt.trim()) {
                dispatch('submit');
            }
        } else if (event.key === 'Enter' && !event.shiftKey) {
            // Enter seul pour soumettre (sans Shift)
            event.preventDefault();
            if (!loading && prompt.trim()) {
                dispatch('submit');
            }
        }
        // Shift+Enter permet d'aller à la ligne normalement
    }
</script>

<section class="panel">
    <h2>Prompt</h2>
    <label for={textareaId} class="sr-only">Enter your prompt to generate Svelte code</label>
    <textarea 
        id={textareaId}
        name="user_prompt"
        bind:value={prompt} 
        placeholder="Describe or refine the page... (e.g., 'Add a red button') - Press Enter to generate"
        autocomplete="off"
        rows="4"
        on:keydown={handleKeydown}
        disabled={loading}
    ></textarea>
    <div class="help-text">
        <small>Press Enter to generate • Shift+Enter for new line</small>
    </div>
</section>
