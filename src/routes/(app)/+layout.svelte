<script lang="ts">
	import '../../app.css';
	import { onMount } from 'svelte';
	import { BASE_PATH, API_URL } from '$lib/app.config.js';
	
	let { children, data } = $props();
	
	let isScrolled = $state(false);

  import init, { decrypt_json } from "$lib/pkg/wasm_encryptor.js";
  let user_email = $state("");
  let password = $state("");
  let isShowLogin = $state(false);
  let isAuthorized = $state(false);
 



  function validateUser() {
    let studentToken = localStorage.getItem("studentToken");
    if (!studentToken) {
      return false;
    } else {
      // Decrypt the token
      try {
        let token: any = decrypt_json(studentToken);
        const now = new Date(token.nowDate);
        const expiry = new Date(token.expiryDate);
        const isExpired = now > expiry;
        if (isExpired) {        
          return false;
        } else {		  
          return true;
        }
      } catch (error) {
        return false;
      }
    }
  }



function logoutUser(){
	  localStorage.removeItem("studentToken");
  localStorage.removeItem("userData"); 
  location.href = "/home"; // Redirect to home page
	}




  async function handleSubmit(event) {
    let lessonId = localStorage.getItem("selectedLessonId");
    event.preventDefault();
    const response = await fetch(API_URL+"/api/tempUserLogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_email, password }),
    });

    const result = await response.json();

    if (result.status === "success") {
      console.log("Login successful:", result);
      if (result.userData) {
        localStorage.setItem("userData", JSON.stringify(result.userData));
      }

      if (result.token) {
        localStorage.setItem("studentToken", result.token);
      }

     let isAuthorized = validateUser();  
      if( isAuthorized ) {
        location.href = "/home";
      } else {
        alert("Login failed, please try again.");
      }



    } else {
      alert("Login failed");
    }
  }



async function initWasm() {
	await init();  
	setTimeout(() => {
		isAuthorized = validateUser();		
	}, 1);
}

	
	onMount(() => {
		initWasm();
		
		const handleScroll = () => {
			isScrolled = window.scrollY > 10;
		};
		
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<svelte:head>
    <link rel="stylesheet" href="{BASE_PATH}/css/tabs.css"> 
	<!-- <script src="/js/custom.js"></script>     -->
</svelte:head>



{#if isShowLogin}
<div class="login-popup fixed z-50 inset-0 flex items-center justify-center">
  <div class="relative border p-8 rounded-lg shadow-xl w-full max-w-md bg-white bg-opacity-75">
    <button
      onclick={() => isShowLogin = false}
      class="absolute top-2 right-3 text-red-600 hover:text-red-800 text-4xl font-bold cursor-pointer"
      aria-label="Close"
    >
      &times;
    </button>
    <h3 class="text-2xl font-bold mb-6 text-center text-gray-900">
      Login
    </h3>
    <form onsubmit={handleSubmit} class="space-y-6">
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
          class="cursor-pointer w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Login
        </button>
      </div>
    </form>
  </div>
</div>
{/if}

<header class:scrolled={isScrolled}>
	<nav>
		<div class="container">
			<div class="logo">
				<a href="/home" class="brand">Svelte School</a>
			</div>
			
			<div class="nav-links">
				<a href="#" class="nav-link">Placement Support</a>
				<a href="#" class="nav-link">Interview Prep</a>
				<a href="#" class="nav-link">Agentic AI Full Stack</a>
				<a href="#" class="nav-link">About Us</a>
			</div>
			{#if data.isAuthorized}
				<div class="auth-buttons">
					<span>Hi {data.userData?.user_name || data.user_email} !	</span>			
					<button onclick={logoutUser} class="btn btn-primary">Logout</button>
				</div>
			{:else}
			<div class="auth-buttons">				
				<button onclick={() => isShowLogin = true} class="btn btn-primary">Login</button>
				<a href="/#" class="btn btn-primary">Sign Up</a>
			</div>
			{/if}
		</div>
	</nav>
</header>

<main>
	{@render children()}
</main>

<footer>
	<div class="flex gap-4 footer-content">
				<h5>Svelte School</h5>
				
			<p>&copy; {new Date().getFullYear()} www.svelte-school.com. All rights reserved.</p>
	
			</div>
</footer>

<style>
	:global(html, body) {
		background: #ffffff;
		margin: 0;
		padding: 0;
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
	}

	header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1000;
		transition: all 0.3s ease;
		background: transparent;
	}

	header.scrolled {
		background: rgba(255, 255, 255, 0.95);
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}

	nav {
		display: flex;
		align-items: center;
		height: 70px;
	}

	.container {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.logo .brand {
		font-size: 1.5rem;
		font-weight: 700;
		color: #4f46e5;
		text-decoration: none;
	}

	.nav-links {
		display: flex;
		gap: 2rem;
	}

	.nav-link {
		text-decoration: none;
		color: #1f2937;
		font-weight: 500;
		transition: color 0.2s;
	}

	.nav-link:hover {
		color: #4f46e5;
	}

	.auth-buttons {
		display: flex;
		gap: 1rem;
	}

	.btn {
		padding: 0.5rem 1.25rem;
		border-radius: 0.375rem;
		font-weight: 500;
		text-decoration: none;
		transition: all 0.2s;
	}

	.btn-outline {
		border: 1px solid #4f46e5;
		color: #4f46e5;
	}

	.btn-outline:hover {
		background-color: #eef2ff;
	}

	.btn-primary {
		background-color: #4f46e5;
		color: white;
	}

	.btn-primary:hover {
		background-color: #4338ca;
	}

	main {
		margin-top: 70px;
	}

	footer {
		background-color: #1f2937;
		color: #f9fafb;
		padding: 20px;
	}

	.footer-content > p, .footer-content > h5 {
		color:silver;
		align-items: center;
		height: 10px;
	}

	.footer-section h3 {
		font-size: 1.25rem;
		margin-bottom: 1rem;
		color: white;
	}

	.footer-section h4 {
		font-size: 1rem;
		margin-bottom: 1rem;
		color: white;
	}

	.footer-section a {
		display: block;
		color: #d1d5db;
		text-decoration: none;
		margin-bottom: 0.5rem;
		transition: color 0.2s;
	}

	.footer-section a:hover {
		color: #ffffff;
	}

	.social-links {
		display: flex;
		gap: 1rem;
	}

	.social-links a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background-color: #374151;
		color: white;
		transition: background-color 0.2s;
	}

	.social-links a:hover {
		background-color: #4f46e5;
	}

	.footer-bottom {
		text-align: center;
		padding-top: 2rem;
		border-top: 1px solid #374151;
	}

	.footer-bottom p {
		margin: 0;
		color: #9ca3af;
		font-size: 0.875rem;
	}

	@media (max-width: 768px) {
		.nav-links {
			display: none;
		}

		.auth-buttons {
			display: none;
		}
	}
</style>
