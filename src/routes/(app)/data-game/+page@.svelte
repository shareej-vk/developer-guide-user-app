<script lang="ts">
  import { onMount } from 'svelte';
  import { EditorView, keymap } from '@codemirror/view';
  import { EditorState } from '@codemirror/state';
  import { json } from '@codemirror/lang-json';
  import { defaultKeymap, indentWithTab } from '@codemirror/commands';
  import { oneDark } from '@codemirror/theme-one-dark';
  import CharacterRenderer from '$lib/components/CharacterRenderer.svelte';
  
  // Import types and levels
  import type { Character, Level } from './types';
  import { levels } from './levels';
  import  './page.css'
  
  // State for the editor
  let editor: EditorView | null = null;
  let editorContainer = $state<HTMLDivElement | null>(null);
  
  // Game state using Svelte 5 runes
  let currentLevel = $state(1);
  let levelComplete = $state(false);
  let showHints = $state(false);
  let character = $state<Character>({});
  let showLevelSelect = $state(true);

  // Track completed levels
  let completedLevels = $state<number[]>([]);

  // Persist completed levels to localStorage
  onMount(() => {
    const saved = localStorage.getItem('completedLevels');
    if (saved) {
      completedLevels = JSON.parse(saved);
    }
  });

  $effect(() => {
    // The effect runs on initialization, so we check if there's anything to save.
    if (completedLevels.length > 0) {
        localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
    }
  });
  
  // Get current level data
  const level = $derived(levels.find(l => l.id === currentLevel) || levels[0]);
  const targetCharacter = $derived(level?.target || {});
  
  // Initialize the editor
  $effect(() => {
    if (!showLevelSelect && editorContainer && !editor) {
      const state = EditorState.create({
        doc: level.initialCode,
        extensions: [
          json(),
          oneDark,
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              handleCodeChange(update.state.doc.toString());
            }
          }),
          keymap.of([...defaultKeymap, indentWithTab])
        ]
      });

      editor = new EditorView({
        state,
        parent: editorContainer
      });
    }

    return () => {
      if (editor) {
        editor.destroy();
        editor = null;
      }
    };
  });
  
  // Handle code changes from the editor
  function handleCodeChange(code: string): void {
    try {
      const parsed = JSON.parse(code) as Character;
      character = parsed;
      
      // Check if the solution is correct
      if (checkSolution()) {
        levelComplete = true;

        // Add to completed levels if not already there
        if (!completedLevels.includes(currentLevel)) {
          completedLevels = [...completedLevels, currentLevel];
        }
      } else {
        levelComplete = false;
      }
    } catch (e) {
      // Invalid JSON - we'll handle this silently while typing
      levelComplete = false;
    }
  }
  
  // Check if the current solution matches the target
  function checkSolution(): boolean {
    if (!targetCharacter) return false;
    
    try {
      // Get all keys from the target character
      const targetKeys = Object.keys(targetCharacter);
      
      // Check if all target keys exist in the solution
      const hasAllKeys = targetKeys.every(key => key in character);
      if (!hasAllKeys) return false;
      
      // Check if all values match
      return targetKeys.every(key => {
        return JSON.stringify(character[key as keyof Character]) === 
               JSON.stringify(targetCharacter[key as keyof Character]);
      });
    } catch (e) {
      return false;
    }
  }
  
  // Go to the next level
  // Start a specific level
  function startLevel(levelId: number) {
    currentLevel = levelId;
    levelComplete = false;
    showHints = false;
    showLevelSelect = false;

    // Use a short delay to ensure the editor element is in the DOM
    setTimeout(() => {
      if (editor) {
        const newLevel = levels.find(l => l.id === levelId);
        if (newLevel) {
          editor.dispatch({
            changes: {
              from: 0,
              to: editor.state.doc.length,
              insert: newLevel.initialCode
            }
          });
        }
      }
    }, 0);
  }

  // Go back to level select
  function backToLevelSelect() {
    showLevelSelect = true;
  }

  // Toggle hints
  function toggleHints() {
    showHints = !showHints;
  }

  // Reset the current level
  function resetLevel() {
    startLevel(currentLevel);
  }
  
  // Go to the next level
  function nextLevel() {
    const nextLevelId = currentLevel + 1;
    if (nextLevelId <= levels.length) {
      startLevel(nextLevelId);
    } else {
      // If all levels are complete, go back to level select
      backToLevelSelect();
    }
  }
  
  // Handle click events
  function handleClick(event: MouseEvent, action: 'hint' | 'reset' | 'next') {
    event.preventDefault();
    if (action === 'hint') toggleHints();
    else if (action === 'reset') resetLevel();
    else if (action === 'next') nextLevel();
  }

  function isCurrent(index: number): boolean {
    return index + 1 === currentLevel;
  }

  function isCompleted(index: number): boolean {
    return completedLevels.includes(index + 1);
  }

  function isUnlocked(index: number): boolean {
    // A level is unlocked if it's the first one, or the previous one is complete.
    return index === 0 || completedLevels.includes(index);
  }
</script>

{#if showLevelSelect}
  <div class="level-selection-container">
    <h2>Select a Level</h2>
    <div class="level-grid">
      {#each levels as level, i}
        <button
          class="level-card"
          class:current={isCurrent(i)}
          class:completed={isCompleted(i)}
          class:locked={!isUnlocked(i)}
          disabled={!isUnlocked(i)}
          onclick={() => startLevel(i + 1)}
        >
          <span class="level-number">Level {i + 1}</span>
          <div class="status-icon">
            {#if !isUnlocked(i)}
              <span>🔒</span>
            {:else if isCompleted(i)}
              <span>✔️</span>
            {/if}
          </div>
        </button>
      {/each}
    </div>
  </div>
{:else}
  <div class="game-container">
    <button class="back-button" onclick={backToLevelSelect}>← Back to Levels</button>

    <div class="target-preview">
      <h3>Target Character</h3>
      <div class="character-container">
        <div class="character-wrapper">
          <CharacterRenderer character={targetCharacter} isTarget={true} />
          {#if targetCharacter.isTalkEnabled && targetCharacter.talk}
            <button class="talk-btn" onclick={(e) => { e.stopPropagation(); targetCharacter.talk?.(); }}>
              🗣️
            </button>
          {/if}
        </div>
      </div>
      <div class="character-json">
        <h4>Target Data:</h4>
        <pre>{JSON.stringify(targetCharacter, null, 2)}</pre>
      </div>
    </div>

    <div class="editor-container">
      <div class="editor-header">
        <h2>Data Editor</h2>
      </div>
      <div class="editor" bind:this={editorContainer}></div>
      <div class="editor-footer">
        <div class="editor-actions">
          <button class="hint-btn" onclick={(e) => handleClick(e, 'hint')}>
            {showHints ? 'Hide Hints' : 'Show Hints'}
          </button>
          <button class="reset-btn" onclick={(e) => handleClick(e, 'reset')}>Reset Level</button>
        </div>
        {#if showHints}
          <div class="hints">
            <h3>Hints</h3>
            <p>{level.hints}</p>
          </div>
        {/if}
      </div>
    </div>

    <div class="character-preview">
      <h3>Your Character</h3>
      <div class="character-container">
        <div class="character-wrapper">
          <CharacterRenderer character={character} isTarget={false} />
          {#if character.isTalkEnabled && character.talk}
            <button class="talk-btn" onclick={(e) => { e.stopPropagation(); character.talk?.(); }}
                    disabled={!character.talk}>
              🗣️
            </button>
          {/if}
        </div>
      </div>
      <div class="character-json">
        <h4>Your Data:</h4>
        <pre>{JSON.stringify(character, null, 2)}</pre>
      </div>
    </div>

    <div class="level-info">
      <h3>Level {currentLevel}</h3>
      <p>{level.instructions}</p>

      {#if levelComplete}
        <div class="level-complete">
          <h3>Level Complete! 🎉</h3>
          <button onclick={(e) => handleClick(e, 'next')} class="next-level-btn">
            {currentLevel < levels.length ? 'Next Level' : 'Play Again'}
          </button>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  /* Level Selection Screen */
  .level-selection-container {
    max-width: 900px;
    margin: 2rem auto;
    padding: 2rem;
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .level-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .level-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1.5rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    background-color: #f8fafc;
  }

  .level-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
    border-color: #4a90e2;
  }

  .level-card.current {
    border-color: #4a90e2;
    background-color: #ebf8ff;
    font-weight: bold;
  }

  .level-card.completed {
    background-color: #f0fff4;
    border-color: #c6f6d5;
  }

  .level-card.locked {
    background-color: #f1f5f9;
    cursor: not-allowed;
    opacity: 0.7;
  }

  .level-card.locked:hover {
    transform: none;
    box-shadow: none;
  }

  .level-number {
    font-size: 1.1rem;
  }

  .status-icon {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    font-size: 1rem;
  }

  /* Main Layout */
  .game-container {
    display: grid;
    grid-template-columns: 1fr 1.2fr 1fr; /* Adjust column ratios */
    grid-template-rows: auto 1fr auto;
    height: calc(100vh - 4rem);
    gap: 1rem;
    padding: 1rem;
    box-sizing: border-box;
  }

  .back-button,
  .level-info {
    grid-column: 1 / -1; /* Span all columns */
  }

  /* General Pane Styles */
  .editor-container {
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    overflow: hidden; /* Keep overflow hidden for editor */
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
  }

  .character-preview,
  .target-preview {
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    /* overflow: hidden; <-- REMOVED to prevent clipping */
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
  }

  /* Pane Headers */
  .editor-header h2,
  .character-preview h3,
  .target-preview h3 {
    padding: 0.75rem 1rem;
    margin: 0;
    background-color: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
    flex-shrink: 0;
    font-size: 1.1rem;
    font-weight: 600;
  }

  /* Editor Specifics */
  .editor {
    flex-grow: 1;
    overflow: auto;
    height: 100%; /* Ensure it fills the space */
  }

  .editor-footer {
    padding: 0.5rem 1rem;
    background-color: #f8fafc;
    border-top: 1px solid #e2e8f0;
  }

  .hints {
    margin-top: 0.5rem;
    padding: 1rem;
    background-color: #fffbeb;
    border: 1px solid #fef3c7;
    border-radius: 0.25rem;
  }

  /* Character Panes */
  .character-container {
    padding: 1rem;
    background-color: #fdfdff;
    /* The container now simply wraps the character, which has a fixed size */
  }

  .character-json {
    background: #f8fafc;
    padding: 1rem;
    font-family: monospace;
    font-size: 0.9rem;
    max-height: 200px;
    overflow-y: auto;
    border-top: 1px solid #e2e8f0;
  }

  .character-json pre {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-all;
  }

  /* Buttons and Actions */
  .next-level-btn,
  .hint-btn,
  .reset-btn {
    background-color: #4a90e2;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 8px;
    transition: background-color 0.2s;
  }

  .next-level-btn:hover,
  .hint-btn:hover,
  .reset-btn:hover {
    background-color: #357abd;
  }

  .back-button {
    margin-bottom: 1rem;
    background-color: #e2e8f0;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
  }

  /* Level Info Box */
  .level-info {
    padding: 1.25rem;
    background: #f8fafc;
    border-radius: 0.5rem;
    border: 1px solid #e2e8f0;
  }

  .level-complete {
    margin-top: 1rem;
    padding: 1rem;
    background-color: #f0fff4;
    border: 1px solid #9ae6b4;
    border-radius: 0.25rem;
  }


  /* Level Selection Screen */
  .level-selection-container {
    max-width: 900px;
    margin: 2rem auto;
    padding: 2rem;
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .level-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .level-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1.5rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    background-color: #f8fafc;
  }

  .level-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
    border-color: #4a90e2;
  }

  .level-card.current {
    border-color: #4a90e2;
    background-color: #ebf8ff;
    font-weight: bold;
  }

  .level-card.completed {
    background-color: #f0fff4;
    border-color: #c6f6d5;
  }

  .level-card.locked {
    background-color: #f1f5f9;
    cursor: not-allowed;
    opacity: 0.7;
  }

  .level-card.locked:hover {
    transform: none;
    box-shadow: none;
  }

  .level-number {
    font-size: 1.1rem;
  }

  .status-icon {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    font-size: 1rem;
  }


  /* Level Selection Screen */
  .level-selection-container {
    padding: 2rem;
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }

  .level-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .level-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1.5rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    background-color: #f8fafc;
  }

  .level-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.08);
    border-color: #4a90e2;
  }

  .level-card.current {
    border-color: #4a90e2;
    background-color: #ebf8ff;
    font-weight: bold;
  }

  .level-card.completed {
    background-color: #f0fff4;
    border-color: #c6f6d5;
  }

  .level-card.locked {
    background-color: #f1f5f9;
    cursor: not-allowed;
    opacity: 0.7;
  }

  .level-card.locked:hover {
    transform: none;
    box-shadow: none;
  }

  .level-number {
    font-size: 1.1rem;
  }

  .status-icon {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    font-size: 1rem;
  }
  
  
  .level-complete {
    text-align: center;
    margin: 20px 0;
    padding: 20px;
    background-color: #f0f8ff;
    border-radius: 8px;
  }
  
  h2 {
    margin: 0 0 1rem 0;
    color: #1e293b;
  }
  
  h3 {
    margin: 0 0 0.5rem 0;
    color: #334155;
  }
  
  p {
    margin: 0.5rem 0;
    color: #475569;
  }

  .level-selection-container {
    width: 100%;
    max-width: 800px;
    margin: 2rem auto;
    padding: 2rem;
    text-align: center;
  }

  .level-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
  }

  .level-card {
    background-color: white;
    border: 2px solid #e5e7eb;
    border-radius: 0.75rem;
    padding: 1.5rem 1rem;
    font-size: 1.25rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .level-card:hover:not(:disabled) {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    border-color: #4a90e2;
  }

  .level-card.completed {
    border-color: #22c55e;
    background-color: #f0fdf4;
    color: #166534;
  }

  .level-card.locked {
    background-color: #f1f5f9;
    color: #94a3b8;
    cursor: not-allowed;
    opacity: 0.7;
  }

  .level-card.locked:hover {
    transform: none;
    box-shadow: none;
    border-color: #e5e7eb;
  }

  .status-icon {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 1rem;
  }

</style>