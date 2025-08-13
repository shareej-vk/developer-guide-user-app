<script lang="ts">
  import { onMount } from 'svelte';
  import { EditorView, keymap } from '@codemirror/view';
  import { EditorState } from '@codemirror/state';
  import {page} from "$app/state"
  import { javascript } from '@codemirror/lang-javascript';
  import { defaultKeymap, indentWithTab } from '@codemirror/commands';
let codeId:string = page.params.id

let obejctData:any  = $state({
"blank":{"code":`
  object_name_here = { 
  
  }
`,
"instruction":``,
"place_holder":``
},


"array_basic":{"code":`
  person = {
  "name": "Zara",
  "age": 28,
  "hobbies": ["Reading", "Photography", "Hiking"],
  "languages": ["English", "Spanish", "French"]
}
`,
"instruction":``,
"place_holder":``
},


"array_2":{"code":`
  person = {
  "name": "Zara",
  "age": 28,
   "pets": ["Dog", "Cat", "Parrot", "Fish", "Hamster"]          
}
`,
"instruction":``,
"place_holder":``
},

"nested_object":{"code":`
  person = {
  "name": "Zara",
  "age": 28,
  "friend": {
    "name": "Samir",
    "age": 20,
    "city": "Delhi"
  }
}
`,
"instruction":``,
"place_holder":`person.friend.name`
},

"nested_object_2":{"code":`
pet = {
  type: "Dog",
  name: "Rufus",
  owner: { name: "Ayesha", city: "Chennai" }
}
`,
"instruction":``,
"place_holder":`pet.owner.city`
},


"array_of_object":{"code":`
 person = {
  name: "Zara",
  friends: [
    {name: "Samir", age: 20, },
    {name: "Emily", age: 22, }
  ]
}
`,
"instruction":``,
"place_holder":`person.friends[1].age`
},



"template":{"code":`
  object_name_here = { 
  
  }
`,
"instruction":``,
"place_holder":``
},


"calculator":{"code":`
 calculator  =  {
  add: function(a, b) {
    return a + b;
  },
  subtract: function(a, b) {
    return a - b;
  }
}
`,
"instruction":``,
"place_holder":``
},





"family_tree":{"code":`
 family = {
  father: "Thomas",
  mother: "Alice",
  children: [
    {
      name: "Danniel",
      age: 39,
      children: [
        { name: "Anjali", age: 7 },
        { name: "Rohan", age: 2 }
      ]
    },
    {
      name: "Anna",
      age: 32,
      children: [
        { name: "Sara", age: 6 },
        { name: "Albi", age: 1 }
      ]
    }
  ]
}
`,
"instruction":``,
"place_holder":``
},













"function_basic":{"code":`
  person = {
  name: "Ava",
  greet: function() {
    alert("Hello! How are you ?");
  }
}
`,
"instruction":``,
"place_holder":`person.greet()`
},


"function_this":{"code":`
  person = {
  name: "Ava",
  sayName: function() {
    alert("Hi, I’m " + this.name);
  }
}
`,
"instruction":``,
"place_holder":`person.sayName()`
},


"function_bark":{"code":`
 dog = {
  name: "Rufus",
  bark: function() { alert("Woof!"); }
}
`,
"instruction":``,
"place_holder":`dog.bark()`
},





"basic_example":{"code":`
  person = {
  "name": "Zara Johnson",
  "age": 28,
  "email": "zara@example.com",
  "bio": "Web developer and explorer"
}
`,
"instruction":`TYPE ABOVE person.name OR person["name"]`,
"place_holder":`person.name OR person["name"]`
}
})


  // Light theme configuration
  const lightTheme = EditorView.theme({
    '&': {
      color: '#333',
      backgroundColor: '#fff',
    },
    '.cm-gutters': {
      backgroundColor: '#f5f5f5',
      color: '#6e6e6e',
      border: 'none',
    },
    '.cm-activeLine': {
      backgroundColor: '#f0f0f0',
    },
    '.cm-activeLineGutter': {
      backgroundColor: '#e0e0e0',
    },
    '.cm-selectionMatch': {
      backgroundColor: '#d7d4f0',
    },
  }, { dark: false });

  
  // State for the editor
  let editor: EditorView | null = null;
  let editorContainer = $state<HTMLDivElement | null>(null);
  let searchQuery = $state('');
  let searchResult = $state<string | null>(null);
  let error = $state<string | null>(null);
  let dataObject = $state<Record<string, any> | null>(null);
  
  // Default object to start with
  const defaultCode = `  person = {
  "name": "Zara Johnson",
  "age": 28,
  "email": "zara@example.com",
  "bio": "Web developer and explorer"
}
`;
  
  // Initialize the editor
  onMount(() => {
    if (editorContainer) {
      const state = EditorState.create({
        doc: obejctData[codeId].code,
        extensions: [
          javascript(),
          lightTheme,
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              updateDataObject(update.state.doc.toString());
            }
          }),
          keymap.of([...defaultKeymap, indentWithTab])
        ]
      });

      editor = new EditorView({
        state,
        parent: editorContainer
      });
      
      // Initialize the data object with the default code
      updateDataObject(obejctData[codeId].code);
    }

    return () => {
      if (editor) {
        editor.destroy();
        editor = null;
      }
    };
  });
  
  // Update the data object when editor content changes
  function updateDataObject(code: string): void {
    try {
      // Create a clean scope to evaluate the code
      const scope: Record<string, any> = {};
      // Execute the code in the scope
      const execute = new Function('scope', `
        with(scope) {
          ${code}
          return scope;
        }
      `);
      
      const result = execute(scope);
      
      if (typeof result === 'object' && result !== null) {
        dataObject = result;
        error = null;
        // Update search result if there's an active query
        if (searchQuery) {
          searchData(searchQuery);
        }
      } else {
        error = 'Please define at least one variable with an object';
      }
    } catch (e) {
      error = 'Error parsing code: ' + (e as Error).message;
      dataObject = null;
    }
  }
  
  // Search the data object for a key path
  function searchData(query: string): void {
    searchQuery = query.trim();
    
    if (!searchQuery) {
      searchResult = null;
      return;
    }
    
    if (!dataObject) {
      searchResult = 'No valid data object to search';
      return;
    }
    
    try {
      // Try to evaluate the query against the data object
      const result = new Function('data', `return ${searchQuery}`)(dataObject);
      
      // Handle different result types
      if (result === undefined) {
        searchResult = 'undefined';
      } else if (result === null) {
        searchResult = 'null';
      } else if (typeof result === 'object') {
        searchResult = JSON.stringify(result, null, 2);
      } else {
        searchResult = String(result);
      }
    } catch (e) {
      searchResult = `Error: ${(e as Error).message}`;
    }
  }
  
  // Format the search result for display
  $effect(() => {
    if (searchQuery && dataObject) {
      searchData(searchQuery);
    }
  });
</script>

<div class="data-playground">
  <div class="editor-panel p-2">
    <h2 class="text-xl font-bold p-2">Data Object Editor</h2>
    <div class="editor-container" bind:this={editorContainer}></div>
    {#if error}
      <div class="error">{error}</div>
    {/if}
  </div>
  
  <div class="preview-panel">
    <div class="search-container p-2">
      <h2 class="text-xl font-bold p-2">Data Explorer</h2>
      <div class="search-box">
        <input 
          type="text" 
          placeholder={obejctData[codeId].place_holder} 
          bind:value={searchQuery}
          oninput={(e) => searchData(e.currentTarget.value)}
        />
      </div>
      
      <div class="result-container">
        <h3>Result:</h3>
        {#if searchResult !== null}
          <pre class="result">{searchResult}</pre>
        {:else}
          <div class="hint">
            <h3>{obejctData[codeId].instruction}</h3>      
           
          </div>
        {/if}
      </div>
    </div>
    

  </div>
</div>

<style>
  .data-playground {
    display: flex;
    height: calc(100vh - 60px);
    padding: 1rem;
    gap: 1rem;
    background-color: #f5f5f5;
  }
  
  .editor-panel, .preview-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
  
  .editor-container {
    flex: 1;
    overflow: auto;
    font-size: 14px;
  }
  
  .cm-editor {
    height: 100%;
    outline: none;
  }
  
  .search-container, .data-preview {
    padding: 1rem;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 6px;
    margin-bottom: 1rem;
  }
  
  .data-preview {
    flex: 1;
    overflow: auto;
  }
  
  .search-box {
    margin: 1rem 0;
  }
  
  input[type="text"] {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #444;
    border-radius: 4px;
    background: #f8f8f8;
    color: #333;
    font-family: 'Fira Code', monospace;
  }
  
  .result-container, .data-preview {
    background: #f8f8f8;
    border-radius: 4px;
    padding: 1rem;
    margin-top: 1rem;
    font-family: 'Fira Code', monospace;
    font-size: 14px;
    white-space: pre-wrap;
    overflow: auto;
    flex: 1;
  }
  
  .result, .data-object {
    margin: 0;
    padding: 0.5rem;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    max-height: 200px;
    overflow: auto;
  }
  
  .error {
    color: #ff6b6b;
    padding: 0.5rem;
    background: #fff5f5;
    border-left: 3px solid #ff6b6b;
    margin: 0.5rem;
    font-family: 'Fira Code', monospace;
    font-size: 13px;
  }
  
  .hint {
    color: #888;
    font-size: 0.9em;
    line-height: 1.5;
  }
  
  .hint code {
    background: #f8f8f8;
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-size: 0.9em;
  }
  
  h2, h3 {
    margin: 0 0 1rem 0;
    color: #333;
  }
  
  h2 {
    font-size: 1.2em;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #333;
  }
  
  h3 {
    font-size: 1em;
    color: #aaa;
  }
  
  ul {
    margin: 0.5rem 0 0 1.5rem;
    padding: 0;
  }
  
  li {
    margin: 0.3rem 0;
  }
</style>
