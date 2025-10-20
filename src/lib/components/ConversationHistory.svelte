<script>
    import { conversation } from '$lib/history/chat.js';
</script>

<section class="panel history-panel" aria-labelledby="conversation-heading">
    <h2 id="conversation-heading">💬 Conversation History</h2>
    <div role="log" aria-live="polite" class="conversation-list">
        {#if $conversation.length === 0}
            <div class="empty-state">
                <p>No messages yet</p>
                <small>Start a conversation to see history here</small>
            </div>
        {:else}
            {#each $conversation as msg, index (index)}
                <div class="message {msg.role}" role="article">
                    <strong>{msg.role === 'user' ? '👤 You' : '🤖 AI'}:</strong> 
                    <span>{msg.content}</span>
                </div>
            {/each}
        {/if}
    </div>
</section>

<style>
    .empty-state {
        text-align: center;
        padding: 2rem;
        color: var(--gray-500);
    }
    
    .empty-state p {
        margin: 0 0 0.5rem 0;
        font-weight: 500;
    }
    
    .empty-state small {
        font-size: 0.75rem;
    }
    
    .conversation-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
</style>