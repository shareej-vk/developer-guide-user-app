<script lang="ts">
  import { page } from '$app/state';
  import { lessonStateDB } from '$lib/db/lessonStateDB';
  import { courseDataStore } from "$lib/stores/courseStore.svelte";

  import LoginPopup from '$lib/components/LoginPopup.svelte';
  import "./page.css"


import { codeToHtml } from "shiki";
import LiveCodeEditorModal from '$lib/components/LiveCodeEditorModal.svelte';
  import { onMount, onDestroy, tick } from 'svelte';
  import IntroSlides from '$lib/components/IntroSlides.svelte';
    import { goto } from '$app/navigation';
    import { derived } from 'svelte/store';
    import { BASE_PATH, API_URL } from '$lib/app.config.js';
  interface LessonContent {
    id: string;
    title: string;
    content: string;
    duration?: string;
    order?: number;
    description?: string;
    intros?: string;
    questions?: string[];
    exercises?: string[];
  }
  
  interface PageData {
    board: string;
    class: string;
    subject: string;
    lessonId: string;
    lesson: LessonContent | null;
    error: string | null;
  }

  function onClose() {
    showEditorModal = false;
    editorHtml = '';
    editorCss = '';
    editorJs = '';
  }
  
  // Use $props() to get the data from the parent component
  let { data } = $props<{ data: PageData }>();
  console.log(data, "FULL DATA");
  localStorage.setItem('selectedLessonId', page.params.id);
  console.log(courseDataStore.courseData, "COURSE DATA");
  
  let activeTab = $state('content');
  let isModalOpen = $state(true);
  console.log("LESSSON", page)
let nextPrevLessons = $derived.by(()=>{
  console.log(page.params.id);
  let currentUnit = courseDataStore.courseData?.units.find(unit => unit.id === parseInt(localStorage.getItem('selectedUnitId')));
  for (const [index, value] of currentUnit?.lessons.entries()) {
 if(value.id === parseInt(page.params.id)){
  let obj = {
    next: currentUnit?.lessons[index + 1] || {},
    prev: currentUnit?.lessons[index - 1] || {}
  }
  return obj;
 }
}


})
let isLoading = $state(false);
let gameFrameHtml = $state(null);

async function updateIframeStyles(){
  let iframe = document.getElementById('game-frame');
 if(iframe){
  let startBtn = iframe.contentDocument?.querySelector('#start-btn');
  if(startBtn){
    startBtn.click();
  }
 const style = iframe.contentDocument?.createElement('style');
     if(style){
     style.textContent = `
     .instructions-list li{
      display:block !important;
     }`;
     iframe.contentDocument?.head.appendChild(style);
     }
}
}

setTimeout(() => {
showAnswers();
}, 100);

async function openGameFrame(gameId: string) {
  try {
    let res = await fetch(`/data/games/${gameId}.html`);
    gameFrameHtml = await res.text();
        // Create iframe container if it doesn't exist
    let iframeContainer = document.getElementById('game-frame-container');
    if (!iframeContainer) {
     
      iframeContainer = document.createElement('div');
      iframeContainer.id = 'game-frame-container';
      iframeContainer.className = 'fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4';
      iframeContainer.style.backdropFilter = 'blur(4px)';
      
      // Create close button
      const closeButton = document.createElement('button');
      closeButton.className = 'absolute top-8 right-8 z-50 bg-red-600 hover:bg-red-700 text-white rounded-full w-16 h-16 flex items-center justify-center text-4xl font-bold shadow-lg transition-colors duration-200 cursor-pointer';
      closeButton.style.cssText = 'right: 5px; width: 43px; height: 43px; top: 8px;';
      closeButton.innerHTML = '&times;';
      closeButton.onclick = (e) => {
        e.stopPropagation();
        document.body.removeChild(iframeContainer);
        document.body.style.overflow = 'auto';
      };
      
      // Create iframe
      const iframe = document.createElement('iframe');
      iframe.id = 'game-frame';
      iframe.className = 'w-[95%] h-[95vh] bg-white rounded-lg shadow-2xl';
      iframe.sandbox = 'allow-scripts allow-same-origin';
     
     // iframe.srcdoc = gameFrameHtml;
     iframe.src = `/data/games/${gameId}.html`;
    
    //  iframe.querySelector('style.instructions-list li').style.cssText = `
    //  display:block !important;`;



iframeContainer.appendChild(iframe);
iframeContainer.appendChild(closeButton);
      document.body.appendChild(iframeContainer);
      document.body.style.overflow = 'hidden';
      await tick();
      setTimeout(() => {
      updateIframeStyles();
    }, 100);
    }
  } catch (error) {
    console.error('Error loading game frame:', error);
    alert('Failed to load the game. Please try again later.');
  }
}

let codeMap = $state({});

let showEditorModal = $state(false);
let editorHtml = $state('');
let editorCss = $state('');
let editorJs = $state('');
let editorLangs = $state([]);


async function hilightCode(){
  var codes = document.querySelectorAll('.prose pre');
  let idx = 0;
  for (const code of codes) {
    if(code.textContent.length > 20){
      // Store code content in codeMap with a unique key
      codeMap[`block_${idx}`] = code.textContent;
      // Create Run Code button
      const codeOrder = code.getAttribute('code-order');
      if(codeOrder !== null && codeOrder !== undefined){
         const runBtn = document.createElement('button');
      runBtn.textContent = '▶ Run Code';
      runBtn.className = 'run-code-btn';
      runBtn.style.cssText = `
        display: inline-flex;
        align-items: center;
        gap: 0.5em;
        background: #2563eb;
        color: #fff;
        border: none;
        border-radius: 5px;
        padding: 6px 18px;
        margin: 12px 0 12px 0;
        font-size: 1rem;
        font-weight: 600;
        box-shadow: 0 2px 8px rgba(37,99,235,0.08);
        cursor: pointer;
        transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
      `;
      runBtn.onmouseover = () => {
        runBtn.style.background = '#1e40af';
        runBtn.style.boxShadow = '0 4px 16px rgba(37,99,235,0.15)';
        runBtn.style.transform = 'scale(1.04)';
      };
      runBtn.onmouseout = () => {
        runBtn.style.background = '#2563eb';
        runBtn.style.boxShadow = '0 2px 8px rgba(37,99,235,0.08)';
        runBtn.style.transform = 'scale(1)';
      };
      runBtn.onclick = () => {
        // Find all code blocks with the same code-order
        const codeOrder = code.getAttribute('code-order');
        if (!codeOrder) return;
        const allBlocks = Array.from(document.querySelectorAll('.prose pre'));
        let htmlCode = '', cssCode = '', jsCode = '';
        for (const block of allBlocks) {
          if (block.getAttribute('code-order') === codeOrder) {
            const lang = (block.getAttribute('code-lang') || '').toLowerCase();
            if (lang === 'html') htmlCode += block.textContent + '\n';
            else if (lang === 'css') cssCode += block.textContent + '\n';
            else if (lang === 'js' || lang === 'javascript') jsCode += block.textContent + '\n';
          }
        }
        const event = new CustomEvent('run-code', {
          detail: {
            codeOrder,
            html: htmlCode.trim(),
            css: cssCode.trim(),
            js: jsCode.trim()
          }
        });
        window.dispatchEvent(event);
      };
      // Insert after code block
      code.insertAdjacentElement('afterend', runBtn);

      }  // Skip if no code-order attribute is present
     
      idx++;
      
      let codeHtml = await codeToHtml(code.textContent, {
        lang: 'javascript',
        theme: 'dark-plus',
        meta:{
          "code-order": code.getAttribute('code-order'),
          "code-lang": code.getAttribute('code-lang')
        }
      });
      code.outerHTML = codeHtml;
    }
  }
  console.log(codeMap, "CODE MAP");
}


onMount(() => {
  const handler = (e: any) => {
    // If new multi-block event, use html/css/js directly
    if (e.detail && ('html' in e.detail || 'css' in e.detail || 'js' in e.detail)) {
      editorHtml = e.detail.html || '';
      editorCss = e.detail.css || '';
      editorJs = e.detail.js || '';
      // Set editorLangs based on which code blocks are present (only if non-empty and actually present in e.detail)
      const langs = [];
      if (typeof e.detail.html === 'string' && e.detail.html.trim() !== '') langs.push('html');
      if (typeof e.detail.css === 'string' && e.detail.css.trim() !== '') langs.push('css');
      if (typeof e.detail.js === 'string' && e.detail.js.trim() !== '') langs.push('js');
      editorLangs = langs;
      showEditorModal = true;
      return;
    }
    // fallback: old single-block logic
    const { code, blockId } = e.detail;
    let html = '', css = '', js = '';
    if (/</.test(code)) {
      const cssMatch = code.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
      if (cssMatch) css = cssMatch[1];
      const jsMatch = code.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
      if (jsMatch) js = jsMatch[1];
      html = code.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    } else {
      js = code;
    }
    editorHtml = html.trim();
    editorCss = css.trim();
    editorJs = js.trim();
    // Set editorLangs based on which code blocks are present
    const langs = [];
    if (editorHtml) langs.push('html');
    if (editorCss) langs.push('css');
    if (editorJs) langs.push('js');
    editorLangs = langs;
    showEditorModal = true;
  };
  window.addEventListener('run-code', handler);
  return () => window.removeEventListener('run-code', handler);
});

$effect(()=>{
  if(page.params.id){
    loadGames(localStorage.getItem('selectedUnitId')); 
    setTimeout(async() => {
    isLoading = false;
    await tick();
    hilightCode();   
  }, 600);
  }
   
  })



  let gamesList = $state(null);
  let lessonGameList = [];

async function loadGames(unitId:any) {
 let gamesListData = await fetch(`${BASE_PATH}/data/games/units/${unitId}.json`);
  gamesList = await gamesListData.json();
  console.log(page.params.id, gamesList.units[0].lessons);
lessonGameList = gamesList.units[0].lessons.find((lesson:any) => parseInt(lesson.id) === parseInt(page.params.id));
console.log(lessonGameList, "lessonGameList");
}










function gotoNextLesson(){
isLoading = true; 
if(nextPrevLessons.next.id){  
goto(`${BASE_PATH}/courses/${data.board}/${data.class}/${data.subject}/lesson/${nextPrevLessons.next.id}`)
}
  
}





function gotoPreviousLesson(){
isLoading = true; 
if(nextPrevLessons.prev.id){
goto(`${BASE_PATH}/courses/${data.board}/${data.class}/${data.subject}/lesson/${nextPrevLessons.prev.id}`)
}

}



  // Hide body overflow when modal is open
  $effect(() => {
    if(page.params.id){
      localStorage.setItem('selectedLessonId', page.params.id);
    }
  
    
    return () => {     
     
    };
  });
  
  // Set the active tab to 'content' if there's no introduction content
  $effect(() => {
    if (data.lesson && !data.lesson.intros) {
      activeTab = 'content';
      isModalOpen = false;    
    }
  });
  

  
  // Cleanup on component destroy
  onDestroy(() => {  
   
  });

  // Handle button click effect
  function createRipple(event: MouseEvent) {
    const button = event.currentTarget as HTMLElement;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.style.position = 'absolute';
    circle.style.borderRadius = '50%';
    circle.style.transform = 'scale(0)';
    circle.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
    circle.style.background = 'rgba(0, 0, 0, 0.1)';
    circle.style.pointerEvents = 'none';
    
    button.appendChild(circle);
    
    // Trigger the animation
    setTimeout(() => {
      circle.style.transform = 'scale(4)';
      circle.style.opacity = '0';
    }, 10);
    
    // Clean up
    setTimeout(() => {
      circle.remove();
    }, 600);
  }

//   function handleQuestionsShowHide(){
// console.log(page.params.id);


//     document.querySelectorAll('.question-answer-container').forEach(container => {
//   const button = container.querySelector('.show-answer-button');
//   const answer = container.querySelector('.answer-container');

//   button.addEventListener('click', () => {
//     const isVisible = answer.style.display === 'block';
//     answer.style.display = isVisible ? 'none' : 'block';
//     button.textContent = isVisible ? 'Show Answer' : 'Hide Answer';
//   });
// });
//   }




  async function handleQuestionsShowHide() {
  const lessonId = page.params.id;
  if (!lessonId) return;

  // Get the current state from IndexedDB
  const state = await lessonStateDB.getLessonState(lessonId);
  
  document.querySelectorAll('.question-answer-container').forEach((container, index) => {
    const button = container.querySelector('.show-answer-button');
    const answer = container.querySelector('.answer-container');
    
    // Initialize visibility from saved state or default to false
    const isVisible = state?.questions?.[index] === true;
    if (answer) {
      answer.style.display = isVisible ? 'block' : 'none';
    }
    if (button) {
      button.textContent = isVisible ? 'Hide Answer' : 'Show Answer';
    }

    // Update click handler to save state
    button?.addEventListener('click', async () => {
      const newIsVisible = answer.style.display !== 'block';
      
      // Update UI
      answer.style.display = newIsVisible ? 'block' : 'none';
      button.textContent = newIsVisible ? 'Hide Answer' : 'Show Answer';
      
      // Save to IndexedDB
      await lessonStateDB.updateQuestionState(lessonId, index, newIsVisible);
    });
  });
}


//  function handleExercisesShowHide(){
//     document.querySelectorAll('.exercise-container').forEach(container => {
//   const button = container.querySelector('.show-answer-button');
//   const answer = container.querySelector('.answer-container');

//   button.addEventListener('click', () => {
//     const isVisible = answer.style.display === 'block';
//     answer.style.display = isVisible ? 'none' : 'block';
//     button.textContent = isVisible ? 'Show Answer' : 'Hide Answer';
//   });
// });
//   }


async function handleExercisesShowHide() {
  const lessonId = page.params.id;
  if (!lessonId) return;

  // Get the current state from IndexedDB
  const state = await lessonStateDB.getLessonState(lessonId);
  
  document.querySelectorAll('.exercise-container').forEach((container, index) => {
    const button = container.querySelector('.show-answer-button');
    const answer = container.querySelector('.answer-container');
    
    // Initialize visibility from saved state or default to false
    const isVisible = state?.exercises?.[index] === true;
    if (answer) {
      answer.style.display = isVisible ? 'block' : 'none';
    }
    if (button) {
      button.textContent = isVisible ? 'Hide Solution' : 'Show Solution';
    }

    // Update click handler to save state
    button?.addEventListener('click', async () => {
      const newIsVisible = answer.style.display !== 'block';
      
      // Update UI
      answer.style.display = newIsVisible ? 'block' : 'none';
      button.textContent = newIsVisible ? 'Hide Solution' : 'Show Solution';
      
      // Save to IndexedDB
      await lessonStateDB.updateExerciseState(lessonId, index, newIsVisible);
    });
  });
}


async function goToSegment(segment: string) {

  let targetElement = document.getElementById(segment);
  if (targetElement) {
    targetElement.scrollIntoView({ behavior: 'smooth' });
  }
}
  


  async function selectTab(tab: string) {    
    activeTab = tab;
    isModalOpen = false;
    window.scrollTo({ top: 0 });
    await tick();
   // hilightCode();
    if(tab === 'questions') {
      handleQuestionsShowHide();
    }
    if(tab === 'exercises') {
      handleExercisesShowHide();
    }    
  }
  
  // Format text by replacing underscores with spaces and capitalizing words
  function formatText(text: string): string {
    if (!text) return '';
    return text
      .replace(/[_-]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  

  
  // Generate the back URL to the subject page
  const backToChaptersUrl = $derived(`${BASE_PATH}/courses/${data.board}/${data.class}/${data.subject}`);
</script>


<svelte:head>
    <link rel="stylesheet" href="{BASE_PATH}/css/tabs.css"> 
  <script src="{BASE_PATH}/js/custom.js"></script>    
</svelte:head>

{#if data.isAuthorized === false}
  <LoginPopup />
{:else}

<div class="min-h-screen bg-white" style="margin:0 auto;">
<!-- <h1>IS LOADING  {courseDataStore.isLoading}</h1> -->
  <div class="container mx-auto px-4 max-w-6xl py-6">
    <!-- Removed standalone back button as it's now in the tabs -->

    {#if data.error}
      <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700">
              {data.error}
            </p>
          </div>
        </div>
      </div>
    {:else if data.lesson}
      <!-- Lesson Header -->
      <header class="mb-8">
      
        <div class="flex items-center text-sm text-gray-500 space-x-4">
          {#if data.lesson.duration}
            <span class="flex items-center">
              <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {data.lesson.duration}
            </span>
          {/if}
        </div>
      </header>

      <!-- Tabs - Fixed at the top -->
      <div class="fixed top-0 left-0 right-0 z-30 bg-white shadow-sm">
        <div class="container mx-auto px-4 max-w-6xl">
          <nav class="flex items-center justify-between -mb-px" aria-label="Tabs">
            <div class="flex">
            <a
              href={backToChaptersUrl}
              class="px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 cursor-pointer border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 flex items-center"
              title="Go to Chapters"
            >
              <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Chapters
            </a>
            
            <!-- <button
              class="px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 cursor-pointer {activeTab === 'introduction' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
              onclick={()=>{selectTab('introduction')}}
            >
              <span class="flex items-center">
                <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Thoughts
              </span>
            </button>
             -->
            <button
              class="px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 cursor-pointer {activeTab === 'content' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
              onclick={()=>{selectTab('content')}}
            >
              <span class="flex items-center">
                <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Notes
              </span>
            </button>
            
            <button
              class="px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 cursor-pointer {activeTab === 'questions' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
              onclick={()=>{goToSegment('questions-and-answers')}}
            >
              <span class="flex items-center">
                <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Questions
              </span>
            </button>
            
            <button
              class="px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 cursor-pointer {activeTab === 'exercises' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
              onclick={()=>{goToSegment('exercises')}}
            >
              <span class="flex items-center">
                <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Exercises
              </span>
            </button>

            <button 
            class="px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 cursor-pointer {activeTab === 'summary' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
            onclick={()=>{goToSegment('summary')}}
          >
            <span class="flex items-center">
              <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Summary
            </span>
          </button>
            </div>
            
            <div class="flex items-center space-x-3 min-w-max">
              {#if nextPrevLessons.prev.id}
              <button disabled={isLoading} 
              class="px-4 py-2 text-sm font-medium text-white {isLoading ? 'bg-gray-400' : 'bg-blue-500'} rounded-md {isLoading ? 'hover:bg-gray-400' : 'hover:bg-blue-600'} transition-all duration-200 flex items-center whitespace-nowrap cursor-pointer active:scale-95 active:bg-blue-700 transform"
                 onclick={() => gotoPreviousLesson()}
              >
                <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              {/if}
              {#if nextPrevLessons.next.id}
              <button disabled={isLoading} 
                class="px-4 py-2 text-sm font-medium text-white {isLoading ? 'bg-gray-400' : 'bg-blue-500'} rounded-md  {isLoading ? 'hover:bg-gray-400' : 'hover:bg-blue-600'} transition-all duration-200 flex items-center whitespace-nowrap cursor-pointer active:scale-95 active:bg-blue-700 transform"
                onclick={() => gotoNextLesson()}
              >
                Next Lesson
                <svg class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              {/if}
              </div>
          </nav>
        </div>
      </div>
      
      <!-- Spacer to push content below fixed tabs -->
       
      <!-- Tab Content -->
       {#if isLoading}
       <div class="flex items-center justify-center h-screen">
  <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
</div>
       {/if}
       {#if !isLoading}
        <div class="p-6 bg-white" style="margin-top:34px; padding-bottom:50px; max-height: calc(100vh - 140px);">
         
        
         
         
          {#if activeTab === 'introduction'}
            <div class="prose max-w-none intro-container">
              <IntroSlides slides={data.lesson.slides} />
            </div>
          
          {:else if activeTab === 'content'}
          <div class="prose max-w-none" style="height: calc(100vh - 60px);">          
            {@html data.lesson.content}
          </div>
          
          {:else if activeTab === 'questions'}
          <div class="prose max-w-none">
            {@html data.lesson.questions}
          </div>
          
          {:else if activeTab === 'exercises'}
          <div class="prose max-w-none">
            <div><h2>LESSON GAMES</h2></div> 
            {#each lessonGameList.games as game (game.id)}
            <button class="btn btn-secondary game-btn" onclick={()=>{openGameFrame(game.id)}}>{game.name}</button>
            {/each}
            {@html data.lesson.exercises}
          </div>
       

          {:else if activeTab === 'summary'}
          <div class="prose max-w-none">
            {@html data.lesson.summary}
          </div>
          {/if}
        </div>
      
    {/if}
    {/if}
  </div>
  
</div>
{/if}
<style>
  .container{
    width:85%;
  }

  /* Hide main header when modal is open */
  :global(html.modal-open) header {
    display: none !important;
  }
 
  
  /* Scoped styles for the tab content */
  :global(.prose) {
    line-height: 1.75;
  }
  
  /* Larger typography for the modal content */
  :global(.prose-lg) {
    font-size: 1.125rem;
    line-height: 1.7777778;
  }
  
  :global(.prose-lg h1) {
    font-size: 2.25rem;
    margin-top: 0;
    margin-bottom: 1.5rem;
    line-height: 1.1111111;
    font-weight: 700;
  }
  
  :global(.prose-lg h2) {
    font-size: 1.875rem;
    margin-top: 2.5rem;
    margin-bottom: 1.25rem;
    line-height: 1.3333333;
    font-weight: 600;
  }
  
  :global(.prose-lg p) {
    margin-top: 1.3333333em;
    margin-bottom: 1.3333333em;
  }
  :global(.prose h2) {
    font-size: 1.5rem;
    font-weight: 600;
    color: #111827;
    margin-top: 1.5rem;
    margin-bottom: 1rem;
  }
  :global(.prose h3) {
    font-size: 1.25rem;
    font-weight: 500;
    color: #111827;
    margin-top: 1.25rem;
    margin-bottom: 0.75rem;
  }
  :global(.prose p) {
    color: #374151;
    margin-bottom: 1rem;
  }
  :global(.prose ul),
  :global(.prose ol) {
    list-style-type: disc;
    padding-left: 1.25rem;
    margin-bottom: 1rem;
  }
  :global(.prose li) {
    margin-bottom: 0.5rem;
  }
  :global(.prose a) {
    color: #2563eb;
    text-decoration: none;
  }
  :global(.prose a:hover) {
    text-decoration: underline;
  }
 
  
  /* Ensure content doesn't get hidden behind fixed tabs */
  .pt-16 {
    padding-top: 4rem;
  }

  .game-btn{
    background-color: #2563eb;
    color: white;
    border-radius: 5px;
    padding: 10px 20px;
    margin: 10px;
    text-decoration: none;
    font-weight: bold;
    transition: all 0.3s ease;
  }




</style>

<LiveCodeEditorModal
  show={showEditorModal}
  html={editorHtml}
  css={editorCss}
  js={editorJs}
  langs={editorLangs}
  onClose={onClose}
/>
