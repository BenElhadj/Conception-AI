<script>
    import { conversation } from '$lib/history/chat.js';
  </script>
  
  <section class="panel">
    <h2>Conversation History</h2>
    {#if $conversation.length === 0}
      <p style="text-align:center; color:#777;">No messages yet</p>
    {:else}
      {#each $conversation as msg}
        <div>
          <strong>{msg.role}:</strong> {msg.content}
        </div>
      {/each}
    {/if}
  </section>
  