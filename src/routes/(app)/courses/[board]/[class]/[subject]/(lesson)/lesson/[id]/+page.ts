import type { PageLoad } from './$types';
import init, { decrypt_json } from "$lib/pkg/wasm_encryptor.js";
import { courseDataStore } from "$lib/stores/courseStore.svelte";
    import { codeToHtml , } from "shiki";

interface ParsedContent {
  type: string;
  content: string;
  children?: ParsedContent[];
  attributes?: Record<string, string>;
}

interface LessonContent {
  id: string;
  title: string;
  content: string;
  duration?: string;
  order?: number;
  description?: string;
  intros?: string;
  slides?: ParsedContent[];
  introset1?: any;
  introset2?: any;
  questions?: string;
  exercises?: string;
  summary?: string;
  // Add other lesson properties as needed
}


function stripHighlight(htmlString, { escape = true } = {}) {
  // 1. Parse off-DOM so we don’t touch the live page.
  const tpl = document.createElement('template');
  tpl.innerHTML = htmlString;

  // 2. Helper that turns "<" → "&lt;", "&" → "&amp;" … via the DOM.
  const encode = (raw) => {
    if (!escape) return raw;
    const div = document.createElement('div');
    div.textContent = raw;
    return div.innerHTML;
  };

  // 3. For every <pre><code> block…
  tpl.content.querySelectorAll('pre > code').forEach(codeEl => {
    const cleaned = codeEl.textContent;   // ← strips spans, comments, etc.
    codeEl.innerHTML = encode(cleaned);
  });

  // 4. Hand back the whole (cleaned) HTML fragment as a string.
  return tpl.innerHTML;
}







function encode(str) {
  return str.replace(/[&<>"']/g, function (ch) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[ch];
  });
}

function strip(str) {
  return str.replace(/<span[^>]*>|<\/span>|<!--[\s\S]*?-->/g, '');
}

function cleanHighlightedCode(html) {
  return html.replace(/<code[^>]*>([\s\S]*?)<\/code>/g, function (match, code) {


let encodedHtml = encode(strip(code))

    return '<code>' + encodedHtml + '</code>';
  });
}


function markdownToHtml(markdown) {
  return markdown  
    .replace(/\*\*(.*?)\*\*/gim, '<span class="strong">$1</span>').
    replace(/\*(.*?)\*/gim, '<span class="strong">$1</span>')
    .replace(/__(.*?)__/gim, '<span class="strong">$1</span>')  
}

function wrapQuotesInSpan(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${htmlString}</div>`, 'text/html');

  const walker = document.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
  const textNodes = [];

  // ✅ Step 1: Collect text nodes
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const isInsideSVG = node.parentNode.closest('svg') !== null;
    if (!isInsideSVG) {
      textNodes.push(node);
    }
  }

  // ✅ Step 2: Modify nodes outside SVG
  for (const node of textNodes) {
    const original = node.nodeValue;
    if (!original.includes('"')) continue;

    const replaced = original.replace(/"([^"]+?)"/g, '<span class="quoted">$1</span>');
    if (replaced !== original) {
      const wrapper = document.createElement('span');
      wrapper.innerHTML = replaced;
      node.replaceWith(...wrapper.childNodes);
    }
  }

  return doc.body.firstElementChild.innerHTML;
}



function encodeHtmlInTextNodes(str: string | undefined): string {
   let prsedString = cleanHighlightedCode(str);
  let prsedString2 = prsedString.
    replaceAll("`", "").
    replaceAll("&lt;<", "&lt;").
    replaceAll("<script", "&lt;script").
    replaceAll("</script>", "&lt;/script>").
    replaceAll("<style", "&lt;style").
    replaceAll("</style>", "&lt;/style>").
    replaceAll(">&gt;", "&gt;").
    replaceAll('<head>', '&lt;head&gt;').
    replaceAll('</head>', '&lt;/head&gt;').
    replaceAll('<body>', '&lt;body&gt;').
    replaceAll('</body>', '&lt;/body&gt;').
    replaceAll('<html>', '&lt;html&gt;').
    replaceAll('</html>', '&lt;/html&gt;').
    replaceAll('<h1>', '&lt;h1&gt;');

    let parsedString3 = markdownToHtml(prsedString2);
    let parsedString4 = wrapQuotesInSpan(parsedString3);
    
  return parsedString4;
 // return str;

}
 


function parseHtmlContent(html: string): any {
let slides:any = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html').body.firstChild as HTMLElement;
 
 console.log(doc, "DOC")
  let lessonTitle = doc.querySelector(".tabs-container > h2")?.textContent;
  
  doc.querySelectorAll('.tab-content').forEach((slide:any) => {
    console.log(slide)
    let slideObj:any = {
        
    };
    try{
    slideObj.lessonTitle = lessonTitle || "";
    slideObj.introTitle = slide.querySelector('.intro-title').textContent || "";
    slideObj.introQuestion = slide.querySelector('.intro-question').textContent || "";
    slideObj.svg = slide.querySelector('svg').outerHTML || "";
    slideObj.introExplanation = slide.querySelectorAll('.intro-explanation')[0].textContent || "";
    slideObj.introExplanation2 = slide.querySelectorAll('.intro-explanation')[1]?.textContent || "";
    slideObj.introTagline = slide.querySelector('.intro-tagline').textContent || "";
    
    
    
    slides.push(slideObj);
  }catch(e){
    console.log(e, "SLIDE ERROR")
  }
  }); 
  
  console.log(slides, "SLIDES HERE")
  return slides;
}

export const load: PageLoad = async ({ params, fetch }) => {
  await init();
  

  try {

if(courseDataStore.courseData == null){

    const jsonFilePath = `/data/${params.board}-${params.class}-${params.subject}.json`;
    // console.log('Loading data from:', jsonFilePath);
     
     // Fetch the JSON file
     const res = await fetch(jsonFilePath);
     
     if (!res.ok) {
       throw new Error(`Failed to load data: ${res.status} ${reressresponse.statusText}`);
     }
     
     // Parse the JSON data
     const courseDataRaw: any = await res.text()
     const courseData: CourseData = JSON.parse(decrypt_json(courseDataRaw));
     courseDataStore.setCourseData(courseData);
   

    }


    courseDataStore.isLoading = true;
    // Construct the path to the lesson JSON file
    const lessonPath = `/data/lessons/${params.id}.json`;
    console.log('Loading lesson from:', lessonPath);    
    // Fetch the lesson data
    const response = await fetch(lessonPath);    
    if (!response.ok) {
      throw new Error(`Failed to load lesson: ${response.status} ${response.statusText}`);
    }
    
    // Parse the JSON data
    const lessonDataRaw: any = await response.text();
    let lessonDataDecrypted = decrypt_json(lessonDataRaw);
    let lessonData = JSON.parse(lessonDataDecrypted);
    //  console.log(lessonData.content, "BEFORE SANITIZE LESSON CONTENT");

    lessonData.content = encodeHtmlInTextNodes(lessonData.content);

    lessonData.questions = encodeHtmlInTextNodes(lessonData.questions);
 //   console.log(lessonData.content, "AFTER SANITIZE LESSON CONTENT");
    lessonData.exercises = encodeHtmlInTextNodes(lessonData.exercises);
    lessonData.summary = encodeHtmlInTextNodes(lessonData.summary);
    
    
    // Parse HTML content if intros exist
    if (lessonData.intros) {
      const parsedIntros = parseHtmlContent(lessonData.intros);
      lessonData.slides = parsedIntros;
    }
    //let introset1Response = await fetch(`/data/intros/lesson-${params.id}-intros-intros-set1.json`);
    //let introset2Response = await fetch(`/data/intros/lesson-${params.id}-intros-intros-set2.json`);

    //let introset1Data = await introset1Response.json();
    //let introset2Data = await introset2Response.json();
   // lessonData.introset1 = JSON.parse(introset1Data.intros);
    //console.log("Intro Set 1",lessonData.introset1)
  //  lessonData.introset2 = introset2Data;
    
    // Return the data to be used in the Svelte component
    return {
      board: params.board,
      class: params.class,
      subject: params.subject,
      lessonId: params.id,
      lesson: lessonData,
      error: null
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load lesson data';
    console.error('Error loading lesson:', errorMessage);
    
    return {
      board: params.board,
      class: params.class,
      subject: params.subject,
      lessonId: params.id,
      lesson: null,
      error: errorMessage
    };
  }
};

// This tells SvelteKit that this is a client-side only component
export const ssr = false;
export const csr = true;