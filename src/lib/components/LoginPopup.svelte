

<script lang="ts">
  let user_email = '';
  let password = '';
  let message = '';
  let success = false;
  import {goto} from '$app/navigation';
  import {API_URL} from '$lib/app.config.js';

  let gotoLocation = localStorage.getItem('gotoLocation') || '/';

  async function handleSubmit() {
    const response = await fetch(API_URL+'/api/tempUserLogin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user_email, password })
    });

    const result = await response.json();

    if (result.status === 'success') {
        console.log('Login successful:', result);
        if(result.userData){
            localStorage.setItem('userData', JSON.stringify(result.userData));
        }

        if(result.token){
            localStorage.setItem('studentToken', result.token);        }

       location.href = "/home"; // Redirect to the stored location
   
    } else {
      alert('Login failed');
    }
  }


</script>



<div class="flex items-center justify-center min-h-screen">
  <div class="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
    <h3 class="text-2xl font-bold mb-6 text-center text-gray-900">
      Login
    </h3>
   <form on:submit|preventDefault={handleSubmit} class="space-y-6">
      <div>
        <label for="email" class="text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          bind:value={user_email}
          class="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label for="password" class="text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          id="password"
          bind:value={password}
          class="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <button
          type="submit"
          class="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Login
        </button>
      </div>
    </form>
  </div>
</div>