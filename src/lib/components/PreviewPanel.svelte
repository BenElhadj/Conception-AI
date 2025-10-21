<script>
    import { generatedCode } from '$lib/history/chat.js';
    import { onMount } from 'svelte';
    let iframeEl;

    // Génère le srcdoc à partir du code généré
    function getSrcdoc(code) {
        if (!code) return '';
        const cleanCode = code
            .replace(/<!DOCTYPE[^>]*>/gi, '')
            .replace(/<\/?(html|head|body)[^>]*>/gi, '');
        const styleMatch = cleanCode.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
        const scriptMatch = cleanCode.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
        let htmlOnly = cleanCode
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
        return `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <style>
                        body { margin: 0; padding: 0; font-family: inherit; background: white; }
                    </style>
                    ${styleMatch ? `<style>${styleMatch[1]}</style>` : ""}
                </head>
                <body>
                    ${htmlOnly}
                    ${scriptMatch ? `<script>${scriptMatch[1]}<\/script>` : ""}
                </body>
            </html>
        `;
    }

    // Met à jour l'iframe à chaque changement de code
    $: if (iframeEl && $generatedCode) {
        iframeEl.srcdoc = getSrcdoc($generatedCode);
    }
</script>

<section class="panel preview-panel">
    <div class="panel-header">
        <h2>Preview</h2>
    </div>
    <div class="panel-content">
        {#if !$generatedCode}
            <div class="empty-state">
                <p>No preview available</p>
                <small>Generate code to see a live preview</small>
            </div>
        {:else}
            <div class="preview-iframe-container">
                <iframe 
                    bind:this={iframeEl}
                    id="preview-iframe" 
                    class="preview-iframe"
                    sandbox="allow-scripts allow-same-origin"
                    referrerpolicy="no-referrer"
                    title="Preview Generated Code"
                    aria-label="Live preview of generated Svelte code"
                    loading="lazy"
                ></iframe>
            </div>
        {/if}
    </div>
</section>