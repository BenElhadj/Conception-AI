<script>
    import { conversation } from '$lib/history/chat.js';
</script>

<section class="panel" aria-labelledby="conversation-heading">
    <h2 id="conversation-heading">Conversation History</h2>
    <div role="log" aria-live="polite">
        {#if $conversation.length === 0}
            <p class="empty-message">No messages yet</p>
        {:else}
            {#each $conversation as msg, index (index)}
                <div class="message" role="article">
                    <strong>{msg.role}:</strong> 
                    <span>{msg.content}</span>
                </div>
            {/each}
        {/if}
    </div>
</section>