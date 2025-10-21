<script>
    import { conversation } from '$lib/history/chat.js';
</script>

<section class="panel history-panel" aria-labelledby="conversation-heading">
    <div class="panel-header">
        <h2 id="conversation-heading"><span class="msg-icon" aria-hidden="true">💬</span> <span class="panel-title">Conversation</span></h2>
    </div>
    <div class="panel-content scrollable">
        {#if $conversation.length === 0}
            <div class="empty-state">
                <p>No conversation yet</p>
                <small>Start chatting with AI to see history</small>
            </div>
        {:else}
            <div role="log" aria-live="polite" class="conversation-list">
                {#each $conversation as msg, index (index)}
                    <div class="message {msg.role}" role="article">
                        <strong>{msg.role === 'user' ? '👤 You' : '🤖 Assistant'}:</strong> 
                        <span>{msg.content}</span>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</section>