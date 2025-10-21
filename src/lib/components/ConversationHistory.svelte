<script lang="ts">
    import { conversation } from '$lib/history/chat.js';
    let expandedIndex: number | null = null;
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
                    {#if msg.role === 'assistant' && msg.content.split('\n').length > 6}
                        <div class="message assistant" role="article">
                            <strong>🤖 Assistant:</strong>
                            <pre class="assistant-preview {expandedIndex === index ? 'expanded' : ''}">
                                {#if expandedIndex === index}
                                    {msg.content}
                                {:else}
                                    {msg.content.split('\n').slice(0,6).join('\n')}
                                {/if}
                            </pre>
                            <button class="show-more-btn" on:click={() => expandedIndex = expandedIndex === index ? null : index}>
                                {expandedIndex === index ? 'Réduire' : 'Afficher plus'}
                            </button>
                        </div>
                    {:else}
                        <div class="message {msg.role}" role="article">
                            <strong>{msg.role === 'user' ? '👤 You' : '🤖 Assistant'}:</strong>
                            <span>{msg.content}</span>
                        </div>
                    {/if}
                {/each}
            </div>
        {/if}
    </div>
</section>

<style>
.assistant-preview {
  max-height: 8em;
  overflow: hidden;
  white-space: pre-wrap;
  background: var(--neutral-100);
  border-radius: 6px;
  padding: 0.5em 1em;
  margin: 0.5em 0;
  font-family: monospace;
  font-size: 0.95em;
  transition: max-height 0.2s;
}
.assistant-preview.expanded {
  max-height: none;
  overflow: auto;
}
.show-more-btn {
  background: var(--accent-500);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.2em 0.8em;
  margin-top: 0.3em;
  cursor: pointer;
  font-size: 0.9em;
}
.show-more-btn:hover {
  background: var(--accent-600);
}
</style>