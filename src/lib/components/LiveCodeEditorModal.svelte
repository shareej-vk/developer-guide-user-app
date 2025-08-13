<script lang="ts">
  // Svelte 5: No need for createEventDispatcher
import { onMount } from 'svelte';

  let { show, html, css, js, onClose, langs } = $props();

  // Compose a simple preview HTML as a data URL (no external scripts, just render HTML, CSS, JS)
  let iframeEl: HTMLIFrameElement | undefined;
  let htmlCode = $state(html || '');
  let cssCode = $state(css || '');
  let jsCode = $state(js || '');

  $effect(() => {
    htmlCode = html || '';
    cssCode = css || '';
    jsCode = js || '';
  });

  let editorSrc = $state('');
  $effect(() => {
    const doc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Live Preview</title>
  <style>${cssCode}</style>
</head>
<body>
  ${htmlCode}
  <script>${jsCode}<\/script>
</body>
</html>`;
    editorSrc = 'data:text/html;charset=utf-8,' + encodeURIComponent(doc);
  });

  // --- CodeMirror 5 Integration ---
  let htmlCM, cssCM, jsCM;
  let htmlTextarea, cssTextarea, jsTextarea;
  function setupCodeMirror() {
    // Clean up previous instances
    if (htmlCM) { htmlCM.toTextArea && htmlCM.toTextArea(); htmlCM = null; }
    if (cssCM) { cssCM.toTextArea && cssCM.toTextArea(); cssCM = null; }
    if (jsCM) { jsCM.toTextArea && jsCM.toTextArea(); jsCM = null; }
    // Only setup if modal is shown
    if (!show) return;
    setTimeout(() => {
      if (window.CodeMirror) {
        if (langs && langs.includes('html') && htmlTextarea) {
          htmlCM = window.CodeMirror.fromTextArea(htmlTextarea, {
            mode: 'htmlmixed',
            lineNumbers: true,
            theme: 'default',
            lineWrapping: true,
          });
          htmlCM.on('change', (cm) => {
            htmlCode = cm.getValue();
          });
        }
        if (langs && langs.includes('css') && cssTextarea) {
          cssCM = window.CodeMirror.fromTextArea(cssTextarea, {
            mode: 'css',
            lineNumbers: true,
            theme: 'default',
            lineWrapping: true,
          });
          cssCM.on('change', (cm) => {
            cssCode = cm.getValue();
          });
        }
        if (langs && langs.includes('js') && jsTextarea) {
          jsCM = window.CodeMirror.fromTextArea(jsTextarea, {
            mode: 'javascript',
            lineNumbers: true,
            theme: 'default',
            lineWrapping: true,
          });
          jsCM.on('change', (cm) => {
            jsCode = cm.getValue();
          });
        }
      }
    }, 0);
  }

  onMount(() => {
    setupCodeMirror();
  });

  $effect(() => {
    if (show) setupCodeMirror();
  });
</script>

{#if show}
  <div class="modal-backdrop" role="button" tabindex="0" aria-label="Close modal" onclick={onClose} onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && close()}></div>
  <div class="modal">
    <button class="close-btn" onclick={onClose} aria-label="Close">&times;</button>
    <div class="editor-layout">
      <div class="editor-areas">
        {#if langs && langs.includes('html')}
        <div class="editor-block">
          <label for="html-editor">HTML</label>
        <textarea id="html-editor" bind:this={htmlTextarea} spellcheck="false">{(langs && langs.length === 1) ? htmlCode + '\n\n\n\n\n' : htmlCode}</textarea>
        </div>
        {/if}
        {#if langs && langs.includes('css')}
        <div class="editor-block">
          <label for="css-editor">CSS</label>
        <textarea id="css-editor" bind:this={cssTextarea} spellcheck="false">{(langs && langs.length === 1) ? cssCode + '\n\n\n\n\n' : cssCode}</textarea>
        </div>
        {/if}
        {#if langs && langs.includes('js')}
        <div class="editor-block">
          <label for="js-editor">JS</label>
        <textarea id="js-editor" bind:this={jsTextarea} spellcheck="false">{(langs && langs.length === 1) ? jsCode + '\n\n\n\n\n' : jsCode}</textarea>
        </div>
        {/if}
      </div>
      <div class="preview-area">
        <iframe bind:this={iframeEl} src={editorSrc} allowfullscreen title="Live code preview"></iframe>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.4);
    z-index: 1000;
  }
  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border-radius: 10px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.25);
    z-index: 1001;
    width: 90vw;
    height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .editor-layout {
    display: flex;
    height: 100%;
    width: 100%;
  }
  .editor-areas {
    width: 45%;
    min-width: 260px;
    max-width: 690px;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    padding: 1.5rem 1rem 1.5rem 1.5rem;
    background: #f8fafc;
    border-right: 1px solid #e5e7eb;
    box-sizing: border-box;
    height: 100%;
    /* Removed overflow-y: auto to prevent extra scrollbars */
  }
  .editor-block {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1 1 0;
    min-height: 0;
  }
  .editor-block textarea {
    flex: 1 1 0;
    min-height: 0;
    height: 100%;
    /* rest of your styles remain */
    overflow: hidden;
    min-height: unset;
    max-height: unset;
  }
  /* Make CodeMirror fill the block and only show scrollbar inside the editor */
  :global(.CodeMirror) {
    height: 100% !important;
    min-height: 0 !important;
    max-height: unset !important;
    border-radius: 6px;
    box-sizing: border-box;
  }
  :global(.CodeMirror pre) {
    font-size: 1rem !important;
    font-family: 'Fira Mono', 'Consolas', 'Menlo', monospace !important;
  }

  
  .preview-area {
    flex: 1;
    display: flex;
    align-items: stretch;
    justify-content: stretch;
    height: 100%;
    background: #fff;
    box-sizing: border-box;
    padding: 1.5rem 1.5rem 1.5rem 1rem;
  }
  .preview-area iframe {
    width: 100%;
    height: 100%;
    border: none;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  }
  .editor-block label {
    font-weight: 600;
    color: #2563eb;
    margin-bottom: 0.25rem;
  }
  .editor-block textarea {
    min-height: 120px;
    font-family: 'Fira Mono', 'Consolas', 'Menlo', monospace;
    font-size: 1rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    padding: 0.5rem;
    background: #fff;
    resize: vertical;
    transition: border 0.2s;
  }
  .editor-block textarea:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px #2563eb22;
  }
  .close-btn {
    position: absolute;
    top: 10px;
    right: 20px;
    font-size: 2rem;
    background: none;
    border: none;
    color: #333;
    cursor: pointer;
    z-index: 10;
  }
  iframe {
    flex: 1;
    width: 100%;
    border: none;
    background: white;
  }
</style>