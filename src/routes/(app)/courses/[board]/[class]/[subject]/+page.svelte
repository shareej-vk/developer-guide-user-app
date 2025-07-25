<script lang="ts">
  import { page } from "$app/state";
  import type { PageData } from "./$types";
  import { onMount } from "svelte";
import { BASE_PATH } from '$lib/app.config.js';
  // Define interfaces for our data structures
  interface Lesson {
    id: string;
    title: string;
    order: number;
    duration?: string;
    description?: string;
  }

  interface Unit {
    id: string;
    name: string;
    order: number;
    lessons: Lesson[];
  }

  interface CourseData {
    subject: {
      id: string;
      name: string;
    };
    units: Unit[];
    totalLessons: number;
  }

  // The data prop contains the values returned from the load function
  let { data } = $props<{
    data: PageData & {
      courseData: CourseData | null;
      error?: string | null;
    };
  }>();
  let selectedUnitId = $state("");
  let selectedLessonId = $state("");
  let selectedUnit = $state(null);

  $effect(() => {
    if (page.params) {
      if (localStorage.getItem("selectedLessonId")) {
        setTimeout(() => {
          selectedLessonId = parseInt(
            localStorage.getItem("selectedLessonId"),
          );
          window.scrollTo({
            top: parseInt(localStorage.getItem("scrollTop")),
          });
        }, 200);
      }
    }
  });

  // Format text by replacing underscores and dashes with spaces and capitalizing words
  function formatText(text: string, isUnitLabel = false): string {
    if (!text) return "";

    // For unit labels, remove the 'Unit X: ' prefix if it exists
    if (isUnitLabel) {
      text = text.replace(/^Unit\s+\d+:\s*/i, "");
    }

    return text
      .replace(/[_-]/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }
  function selectUnit(unitId: string) {
    localStorage.setItem("selectedUnitId", unitId);
    selectedUnitId = unitId;    
    selectedLessonId = "";
    selectedUnit =
      data.courseData?.units.find((unit: Unit) => unit.id === unitId) || null;
   
  }


  function setScrollTop() {
    localStorage.setItem("scrollTop", window.scrollY.toString());
  }

  onMount(() => {
    console.log(
      data.courseData?.units[0].id,
      "deault id",
      localStorage.getItem("selectedUnitId"),
      "from seesiosn",
    );
    if (localStorage.getItem("selectedUnitId")) {
      selectUnit(parseInt(localStorage.getItem("selectedUnitId")));
    } else {
      selectUnit(data.courseData?.units[0].id);
    }
  });
</script>

<div class="min-h-screen bg-gray-50">
  <div class="container mx-auto px-4 py-6 max-w-6xl">
    {#if data.error}
      <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg
              class="h-5 w-5 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700">
              {data.error}
            </p>
          </div>
        </div>
      </div>
    {/if}

    <div class="flex flex-col md:flex-row gap-6">
      <!-- Units List (Left Sidebar) -->
      <div class="md:w-72 lg:w-80 flex-shrink-0">
        <div class="sticky top-4">
          <aside
            class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden max-h-[calc(100vh-2rem)] flex flex-col"
          >
            <div class="p-4 border-b border-gray-200 bg-gray-50">
              <h2 class="text-lg font-semibold text-gray-800">Chapters</h2>
            </div>
            <div class="flex-1 overflow-y-auto p-2">
              <ul class="space-y-1">
                {#if data.courseData?.units?.length > 0}
                  {#each data.courseData.units as unit ,unitIndex (unit.id)}
                    <li>
                     
                      <button
                        class="w-full text-left p-0 rounded-md hover:bg-gray-100 transition-colors duration-200 cursor-pointer flex items-center justify-between {selectedUnitId ===
                        unit.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700'}"
                        onclick={() => selectUnit(unit.id)}
                        aria-current={selectedUnitId === unit.id
                          ? "true"
                          : "false"}
                        aria-label={`${unit.order}: ${unit.name}`}
                      >
                      <img  class="rounded-md chapter-thumb {selectedUnitId ===
                        unit.id
                          ? 'selected-invert'
                          : ''}" src={`${BASE_PATH}/data/svgs/ch-${unit.id}.svg`} alt="" />                        <!-- <span class="font-medium text-sm truncate">
                          <span class="text-gray-500 mr-2">{unit.order}</span>
                        {unitIndex + 1}.  {formatText(unit.label || unit.name, true)}
                        </span>
                        <span
                          class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full shrink-0"
                        >
                          {unit.lessons?.length || 0}
                        </span> -->
                      </button>
                    </li>
                  {/each}
                {:else}
                  <li class="p-4 text-center text-gray-500 text-sm">
                    No units available
                  </li>
                {/if}
              </ul>
            </div>
          </aside>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1 min-w-0">
        <div class="max-w-4xl mx-auto">
          <div class="bg-white rounded-xl shadow-sm overflow-hidden mb-8 p-0">
            <div class="p-2 sm:p-8" style="padding: 6px;">
              <div
                class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 p-4"
              >
                <div>
                 
                  <h3 class="text-gray-500 mt-1">
                    {selectedUnit
                      ? formatText(selectedUnit.name)
                      : "Select a unit to view lessons"}
                  </h3>
                </div>
                <div class="flex items-center space-x-2">
                  <span
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {selectedUnit?.lessons?.length || 0}
                    {selectedUnit?.lessons?.length === 1 ? "Lesson" : "Lessons"}
                  </span>
                </div>
              </div>

              {#if selectedUnit?.lessons?.length > 0}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {#each selectedUnit.lessons as lesson, i (lesson.id)}
                    <div 
                      role="button"
                      tabindex="0"
                      onmouseover={setScrollTop}
                      onfocus={setScrollTop}
                      class="group outline-none"
                    >
                      <a
                        href={`${BASE_PATH}/courses/${data.board}/${data.class}/${data.subject}/lesson/${lesson.id}`}
                        class={`block h-full p-4 rounded-lg border transition-colors duration-150 ${
                          selectedLessonId === lesson.id
                            ? "border-blue-300 bg-blue-50 lesson-select"
                            : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                        }`}
                        data-lesson-id={lesson.id}
                      >
                       
                       <!-- <img style="width:100%     border: 1px solid #eae6e6;
    border-radius: 6px;
    box-shadow: 1px 3px 11px -2px #c9c9c9;" src={`/front-end/data/svgs/${lesson.id}.webp`} alt="" /> -->

    <img  style="width:100%     border: 1px solid #eae6e6;
    border-radius: 6px;
    box-shadow: 1px 3px 11px -2px #c9c9c9;" src={`${BASE_PATH}/data/svgs/${lesson.id}.webp`} alt="" />
                      </a>
                    </div>
                  {/each}
                </div>
              {/if}
              {#if selectedUnit?.lessons?.length === 0}
                <div class="text-center py-12">
                  <svg
                    class="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 class="mt-2 text-sm font-medium text-gray-900">
                    No lessons available
                  </h3>
                  <p class="mt-1 text-sm text-gray-500">
                    This unit doesn't have any lessons yet. Please check back
                    later.
                  </p>
                </div>
              {:else}
                <!-- <div class="text-center py-12">
                  <svg
                    class="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 class="mt-2 text-sm font-medium text-gray-900">
                    No chapters available
                  </h3>
                  <p class="mt-1 text-sm text-gray-500">
                    This course doesn't have any content yet. Please check back
                    later.
                  </p>
                </div> -->
              {/if}
            </div>
          </div>
          <!-- <div class="bg-white rounded-xl shadow-sm overflow-hidden mt-6">
            <div class="p-6 sm:p-8">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">
                About This Course
              </h2>
              <div class="prose max-w-none text-gray-600">
                {#if data.courseData?.about}
                  <p>{data.courseData.about}</p>
                {:else}
                  <p>
                    This course follows the {formatText(data.board)} Board curriculum
                    for Class {data.class}
                    {formatText(data.subject)}. It covers all the essential
                    topics and concepts to help students excel in their studies.
                  </p>
                {/if}
              </div>
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  /* Custom styles can be added here if needed */
  :global(body) {
    background-color: #ffffff;
    overflow-y: auto;
  }

  .prose {
    line-height: 1.625;
  }

  .prose p:not(:last-child) {
    margin-bottom: 1em;
  }
  .selected-invert{
    filter: invert(100%);
    transition: all 0.3s ease-in-out;
  }

  .lesson-select{
    border: 3px solid #000000;
  }
  .chapter-thumb:hover{
    box-shadow: 0px 1px 9px 0px #FF5722;
    transition: all 0.2s ease-in-out;
  }
  .chapter-thumb:hover{
   box-sizing: border-box;
  }
</style>
