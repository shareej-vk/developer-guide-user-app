<script lang="ts">
  // Define a more specific type for our person object
  type Person = {
    name: string;
    age: number;
    address: {
      city: string;
      country: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  
  // Type guard to check if a value is a record
  function isRecord(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }
  
  // Type guard to check if a value is an array
  function isArray<T>(value: unknown): value is T[] {
    return Array.isArray(value);
  }

  // Initial person object with explicit type
  let person: Person = $state({
    name: "Zara",
    age: 28,
    address: {
      city: "New York",
      country: "USA"
    }
  });

  // Form state
  let propertyExpression = $state('person.name = "John"');
  
  // Search state
  let searchQuery = $state('');
  let searchResult = $state('');
  
  // Get formatted JSON of the person object with 'person = ' prefix
  let objectJson = $derived(`person = ${JSON.stringify(person, null, 2)}`);

  // Update a property in the person object using eval
  function updateProperty() {
    try {
      if (!propertyExpression) return;
      
      // Simple validation to prevent arbitrary code execution
      if (!/^\s*person\.[a-zA-Z0-9_$\[\]\."']+\s*=\s*[\s\S]*$/.test(propertyExpression)) {
        searchResult = 'Error: Invalid expression format. Use: person.property = value';
        return;
      }
      
      // Create a safe context for evaluation
      const evalContext = {
        person: JSON.parse(JSON.stringify(person)) // Deep clone
      };
      
      // Try to evaluate the expression
      try {
        // This is a simplified approach - in production, you'd want a more robust solution
        // that doesn't use eval() for security reasons
        const result = (() => {
          // Extract the right-hand side of the assignment
          const match = propertyExpression.match(/=\s*([\s\S]*)$/);
          if (!match) throw new Error('Invalid assignment');
          
          const rhs = match[1].trim();
          // Parse the value (handling strings, numbers, booleans, etc.)
          let value;
          if (rhs.startsWith('"') || rhs.startsWith("'")) {
            // String value
            value = rhs.slice(1, -1);
          } else if (rhs === 'true') {
            value = true;
          } else if (rhs === 'false') {
            value = false;
          } else if (rhs === 'null') {
            value = null;
          } else if (!isNaN(Number(rhs))) {
            value = Number(rhs);
          } else {
            value = rhs;
          }
          
          // Get the property path (left side of the assignment)
          const propertyPath = propertyExpression.split('=')[0].replace(/^\s*person\.?/, '').trim();
          
          // Update the property
          const path = propertyPath.split('.');
          let current = person;
          
          // Navigate to the parent object
          for (let i = 0; i < path.length - 1; i++) {
            const key = path[i];
            if (current[key] === undefined || current[key] === null) {
              // Create nested objects if they don't exist
              current[key] = {};
            }
            const next = current[key];
            if (!isRecord(next)) {
              // If the next value isn't an object, we can't set properties on it
              searchResult = `Error: Cannot set property on non-object at ${path.slice(0, i + 1).join('.')}`;
              return;
            }
            current = next;
          }
          
          // Handle array indices (e.g., hobbies[0])
          const lastKey = path[path.length - 1];
          if (lastKey.includes('[') && lastKey.endsWith(']')) {
            const [arrayKey, indexStr] = lastKey.split('[');
            const index = parseInt(indexStr.replace(']', ''));
            if (arrayKey && !isNaN(index)) {
              if (!Array.isArray(current[arrayKey])) {
                current[arrayKey] = [];
              }
              current[arrayKey][index] = value;
            }
          } else {
            // Handle regular properties
            current[lastKey] = value;
          }
          
          return value;
        })();
        
        searchResult = `Updated: ${JSON.stringify(result, null, 2)}`;
      } catch (e) {
        searchResult = `Error: ${(e as Error).message}`;
      }
    } catch (error) {
      console.error('Error updating property:', error);
      searchResult = 'Error: ' + (error as Error).message;
    }
  }

  // Search for a property in the object
  function searchProperty() {
    try {
      const query = searchQuery?.trim() || '';
      
      // If empty query or just 'person', return the whole object
      if (!query || query === 'person') {
        searchResult = JSON.stringify(person, null, 2);
        return;
      }
      
      // Remove 'person.' prefix if it exists
      const propertyPath = query.startsWith('person.') ? query.slice(7) : query;
      
      // If only 'person.' was entered, return the whole object
      if (!propertyPath) {
        searchResult = JSON.stringify(person, null, 2);
        return;
      }
      
      const path = propertyPath.split('.');
      let result: unknown = person;
      
      for (const key of path) {
        if (result === undefined || result === null || typeof result !== 'object') {
          searchResult = 'undefined';
          return;
        }
        
        // Handle array indices (e.g., hobbies[0])
        if (key.includes('[') && key.endsWith(']')) {
          const [arrayKey, indexStr] = key.split('[');
          const index = parseInt(indexStr.replace(']', ''));
          const array = (result as Record<string, unknown>)[arrayKey];
          if (arrayKey && !isNaN(index) && Array.isArray(array)) {
            result = array[index];
          } else {
            result = 'undefined';
            break;
          }
        } else {
          result = (result as Record<string, unknown>)[key];
        }
      }
      
      searchResult = JSON.stringify(result, null, 2) || 'undefined';
    } catch (error) {
      searchResult = 'Error: ' + (error as Error).message;
    }
  }
  
  // Auto-update search when query changes
  $effect(() => {
    searchProperty();
  });
</script>

<div class="container mx-auto p-6 max-w-6xl">
  <h1 class="text-3xl font-bold mb-8 text-gray-800">Modify person Object</h1>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <!-- Left Column -->
    <div class="space-y-6">
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4 text-gray-700">Current Object</h2>
        <div class="bg-gray-50 p-4 rounded border border-gray-200">
          <pre class="text-sm text-gray-800 overflow-auto max-h-96"><code>{objectJson}</code></pre>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4 text-gray-700">Modify Object</h2>
        <div class="space-y-4">
          <div>
        
            <div class="flex gap-2">
              <input 
                id="propertyExpression"
                type="text" 
                class="flex-1 font-mono text-sm px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder='e.g., person.name = "John" or person.hobbies[0] = "Swimming"'
                bind:value={propertyExpression}
                onkeydown={(e) => e.key === 'Enter' && updateProperty()}
              />
              <button 
                class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors whitespace-nowrap"
                onclick={updateProperty}
              >
                Update
              </button>
            </div>
          </div>
          
          <div class="text-sm text-gray-600 p-3 bg-blue-50 rounded-md">
            <p class="font-medium text-blue-800">Examples:</p>
            <ul class="list-disc pl-5 space-y-1 mt-1 text-blue-700">
              <li><code class="bg-blue-100 px-1 rounded">person.name = "John"</code></li>
              <li><code class="bg-blue-100 px-1 rounded">person.age = 30</code></li>
              <li><code class="bg-blue-100 px-1 rounded">person.address.city = "London"</code></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Right Column -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4 text-gray-700">Search Object</h2>
      <div class="space-y-4">
        <div>
          <div class="relative">
           
            <input 
              type="text" 
              class="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="person.name, person.address.city"
              bind:value={searchQuery}
            />
          </div>
        </div>
        
        <div>
          <h3 class="text-md font-medium text-gray-700 mb-2">Result:</h3>
          <div class="bg-gray-50 p-4 rounded border border-gray-200 min-h-32">
            {#if searchQuery}
              <pre class="text-sm text-gray-800 overflow-auto"><code>{searchResult || 'No results found'}</code></pre>
            {:else}
              <p class="text-gray-500 text-sm">Enter a property path to search</p>
            {/if}
          </div>
        </div>
        
        <div class="text-sm text-gray-600 mt-4 p-3 bg-gray-50 rounded-md">
          <p class="font-medium text-gray-800">Search Examples:</p>
          <ul class="list-disc pl-5 space-y-1 mt-1">
            <li><code class="bg-gray-100 px-1 rounded">person.name</code> - Get the name</li>
            <li><code class="bg-gray-100 px-1 rounded">person.address.city</code> - Get nested property</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>