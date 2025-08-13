<script lang="ts">
  import type { Character } from '../../routes/(app)/data-game/types';

  export let character: Character = {};
  export let isTarget = false;
</script>

<svg 
  viewBox="0 0 300 500" 
  class="character {isTarget ? 'target' : ''}"
>
  <!-- Face & Head -->
  <g class="face-and-head">
    <!-- Ears -->
    <path d="M98,155 C 90,145 90,175 98,165" fill="{character.skinColor || 'bisque'}" stroke="#444" stroke-width="1.5"/>
    <path d="M202,155 C 210,145 210,175 202,165" fill="{character.skinColor || 'bisque'}" stroke="#444" stroke-width="1.5"/>

    <!-- Face Shape -->
    <path d="M100,210 C 100,130 120,80 150,80 C 180,80 200,130 200,210 Q 150,225 100,210 Z" fill="{character.skinColor || 'bisque'}" stroke="#444" stroke-width="2"/>

    <!-- Eyes -->
    <g class="eyes" transform="translate(0, {character.eyeBrowRaised ? -2 : 0})">
      <circle cx="{130 + (character.lookDirection === 'left' ? -1 : character.lookDirection === 'right' ? 1 : 0)}" cy="150" r="3" fill="{character.eyeColor || '#444'}"/>
      <circle cx="{170 + (character.lookDirection === 'left' ? -1 : character.lookDirection === 'right' ? 1 : 0)}" cy="150" r="3" fill="{character.eyeColor || '#444'}"/>
    </g>

    <!-- Eyebrows -->
    <g class="eyebrows" transform="translate(0, {character.eyeBrowRaised ? -2 : 0})">
      <line x1="120" y1="135" x2="140" y2="135" stroke="{character.hairColor || '#444'}" stroke-width="3"/>
      <line x1="160" y1="135" x2="180" y2="135" stroke="{character.hairColor || '#444'}" stroke-width="3"/>
    </g>

    <!-- Hair -->
    {#if character.hairColor}
      <g class="hair">
        <path d="M150,50 C 120,50 100,70 100,100 C 110,90 120,85 130,85 C 140,85 150,95 150,105 C 150,95 160,85 170,85 C 180,85 190,90 200,100 C 200,70 180,50 150,50 Z" fill="{character.hairColor || 'black'}" stroke="#444" stroke-width="2"/>
      </g>
    {/if}
    
    <!-- Mouth -->
    <g class="mouth">
      {#if character.isHappy}
        <path d="M140,185 Q150,195 160,185" stroke="#444" stroke-width="1.5" fill="none"/>
      {:else}
        <line x1="145" y1="185" x2="155" y2="185" stroke="#444" stroke-width="1.5"/>
      {/if}
    </g>
  </g>

  <!-- Clothing & Body -->
  <g class="clothing-and-body">
    <!-- T-shirt -->
    <path d="M120,210 C 130,225 170,225 180,210 L 175,260 L 125,260 Z" fill="#333"/>

    <!-- Pants -->
    <rect x="110" y="260" width="80" height="140" fill="gray" stroke="#444" stroke-width="2"/>
    <line x1="150" y1="260" x2="150" y2="400" stroke="#BBB" stroke-width="1"/>

    <!-- Coat -->
    {#if character.accessories?.includes('coat')}
      <g class="coat" fill="#8B4513" stroke="#444" stroke-width="2">
        <!-- Body of the coat -->
        <path d="M90,210 L 80,400 L 220,400 L 210,210 C 190,230 110,230 90,210 Z"/>
        <!-- Lapels -->
        <path d="M150,210 L 120,210 L 135,240 Z"/>
        <path d="M150,210 L 180,210 L 165,240 Z"/>
        <!-- Sleeves -->
        <path d="M80,400 C 70,350 70,250 90,230" stroke-width="25" stroke-linecap="round" fill="none" stroke="#8B4513"/>
        <path d="M220,400 C 230,350 230,250 210,230" stroke-width="25" stroke-linecap="round" fill="none" stroke="#8B4513"/>
      </g>
    {/if}

    <!-- Shoes -->
    <path d="M100,400 L 140,400 L 145,415 L 100,415 Z" fill="#F5F5F5" stroke="#444" stroke-width="1.5"/>
    <path d="M160,400 L 200,400 L 200,415 L 155,415 Z" fill="#F5F5F5" stroke="#444" stroke-width="1.5"/>
    <line x1="110" y1="408" x2="135" y2="408" stroke="#FFD700" stroke-width="2"/>
    <line x1="165" y1="408" x2="190" y2="408" stroke="#FFD700" stroke-width="2"/>

    <!-- Hands (on top of coat sleeves) -->
    <circle cx="80" cy="320" r="10" fill="{character.skinColor || 'bisque'}" stroke="#444" stroke-width="1.5"/>
    <circle cx="220" cy="320" r="10" fill="{character.skinColor || 'bisque'}" stroke="#444" stroke-width="1.5"/>
  </g>

  <!-- Accessories (on top of everything) -->
  <g class="accessories">
    {#if character.accessories?.includes('glasses')}
      <g class="glasses" stroke="tan" stroke-width="3.5" fill="none">
        <circle cx="130" cy="150" r="12"/>
        <circle cx="170" cy="150" r="12"/>
        <line x1="142" y1="150" x2="158" y2="150"/>
      </g>
    {/if}
  </g>

  <!-- Pets -->
  {#if character.pet}
    {@const pet = character.pet}
    {#if pet.type === 'pigeon'}
      <g class="pet pigeon" transform="translate(130, 30)">
        <path d="M10,20 Q15,0 25,5 Q20,25 30,30 Q25,35 15,30 Q10,35 5,30 Q0,25 10,20 Z" fill="{pet.color || 'lightgray'}" stroke="#444" stroke-width="1.5"/>
        <circle cx="25" cy="15" r="5" fill="{pet.color || 'lightgray'}" stroke="#444" stroke-width="1.5"/>
        <circle cx="27" cy="13" r="1" fill="black"/>
        <path d="M30,15 Q32,14 33,15" fill="none" stroke="#444" stroke-width="1"/>
        <path d="M15,25 L5,20" fill="none" stroke="#444" stroke-width="1.5" stroke-linecap="round"/>
        <text x="15" y="45" text-anchor="middle" font-size="12" font-weight="bold" fill="white" stroke="black" stroke-width="0.5" paint-order="stroke" stroke-linecap="round" stroke-linejoin="round">{pet.name}</text>
      </g>
    {:else if pet.type === 'dog'}
      <g class="pet dog" transform="translate(80, 370)">
        <!-- Dog body -->
        <path d="M10,25 Q20,10 30,25 Q40,30 30,45 Q20,50 10,45 Q0,30 10,25 Z" 
          fill="{pet.color || 'goldenrod'}" stroke="#444" stroke-width="1.5"/>
        <g transform="translate(30, 15)">
          <ellipse cx="15" cy="10" rx="10" ry="8" fill="{pet.color || 'goldenrod'}" stroke="#444" stroke-width="1.5"/>
          <ellipse cx="20" cy="10" rx="5" ry="4" fill="wheat" stroke="#444" stroke-width="1"/>
          <circle cx="23" cy="10" r="2" fill="black"/>
          <path d="M23,12 Q20,14 17,13" fill="none" stroke="#444" stroke-width="1"/>
          <g fill="none" stroke="#444" stroke-width="1">
            <circle cx="12" cy="5" r="2" fill="white"/><circle cx="12" cy="5" r="1" fill="#444"/>
            <circle cx="20" cy="5" r="2" fill="white"/><circle cx="20" cy="5" r="1" fill="#444"/>
          </g>
          <path d="M8,0 Q5,-10 12,-5" fill="{pet.color || 'goldenrod'}" stroke="#444" stroke-width="1.5"/>
          <path d="M24,0 Q27,-10 20,-5" fill="{pet.color || 'goldenrod'}" stroke="#444" stroke-width="1.5"/>
          <path d="M23,13 Q20,15 17,14" fill="pink" stroke="#444" stroke-width="0.5"/>
        </g>
        <!-- Legs -->
        <rect x="10" y="40" width="5" height="15" rx="2" fill="{pet.color || 'goldenrod'}" stroke="#444" stroke-width="1"/>
        <rect x="25" y="40" width="5" height="15" rx="2" fill="{pet.color || 'goldenrod'}" stroke="#444" stroke-width="1"/>
        <!-- Paws -->
        <ellipse cx="12.5" cy="55" rx="3" ry="2" fill="#444" opacity="0.2"/>
        <ellipse cx="27.5" cy="55" rx="3" ry="2" fill="#444" opacity="0.2"/>
        <!-- Tail (moved before body to ensure visibility) -->
        <path d="M5,30 Q-10,20 0,15" fill="none" stroke="{pet.color || 'goldenrod'}" stroke-width="4" stroke-linecap="round" style="z-index: 1;" transform="translate(0, 0)"/>
        <text x="20" y="75" text-anchor="middle" font-size="12" font-weight="bold" fill="black">{pet.name}</text>
      </g>
    {/if}
  {/if}
  
  {#if character.pets?.length}
    {#each character.pets as pet, i}
      {#if pet.type === 'pigeon'}
        <g class="pet pigeon" transform="translate(130, 30)">
          <path d="M10,20 Q15,0 25,5 Q20,25 30,30 Q25,35 15,30 Q10,35 5,30 Q0,25 10,20 Z" fill="{pet.color || 'lightgray'}" stroke="#444" stroke-width="1.5"/>
          <circle cx="25" cy="15" r="5" fill="{pet.color || 'lightgray'}" stroke="#444" stroke-width="1.5"/>
          <circle cx="27" cy="13" r="1" fill="black"/>
          <path d="M30,15 Q32,14 33,15" fill="none" stroke="#444" stroke-width="1"/>
          <path d="M15,25 L5,20" fill="none" stroke="#444" stroke-width="1.5" stroke-linecap="round"/>
          <text x="15" y="45" text-anchor="middle" font-size="12" font-weight="bold" fill="white" stroke="black" stroke-width="0.5" paint-order="stroke" stroke-linecap="round" stroke-linejoin="round">{pet.name}</text>
        </g>
      {:else if pet.type === 'dog'}
        <g class="pet dog" transform="translate({80 + i * 70}, 370)">
          <!-- Dog body -->
          <path d="M10,25 Q20,10 30,25 Q40,30 30,45 Q20,50 10,45 Q0,30 10,25 Z" 
            fill="{pet.color || 'goldenrod'}" stroke="#444" stroke-width="1.5"/>
          <g transform="translate(30, 15)">
            <ellipse cx="15" cy="10" rx="10" ry="8" fill="{pet.color || 'goldenrod'}" stroke="#444" stroke-width="1.5"/>
            <ellipse cx="20" cy="10" rx="5" ry="4" fill="#F5DEB3" stroke="#444" stroke-width="1"/>
            <circle cx="23" cy="10" r="2" fill="black"/>
            <path d="M23,12 Q20,14 17,13" fill="none" stroke="#444" stroke-width="1"/>
            <g fill="none" stroke="#444" stroke-width="1">
              <circle cx="12" cy="5" r="2" fill="white"/><circle cx="12" cy="5" r="1" fill="#444"/>
              <circle cx="20" cy="5" r="2" fill="white"/><circle cx="20" cy="5" r="1" fill="#444"/>
            </g>
            <path d="M8,0 Q5,-10 12,-5" fill="{pet.color || 'goldenrod'}" stroke="#444" stroke-width="1.5"/>
            <path d="M24,0 Q27,-10 20,-5" fill="{pet.color || 'goldenrod'}" stroke="#444" stroke-width="1.5"/>
            <path d="M23,13 Q20,15 17,14" fill="pink" stroke="#444" stroke-width="0.5"/>
          </g>
          <rect x="10" y="40" width="5" height="15" rx="2" fill="{pet.color || 'goldenrod'}" stroke="#444" stroke-width="1"/>
          <rect x="25" y="40" width="5" height="15" rx="2" fill="{pet.color || 'goldenrod'}" stroke="#444" stroke-width="1"/>
          <ellipse cx="12.5" cy="55" rx="3" ry="2" fill="#444" opacity="0.2"/>
          <ellipse cx="27.5" cy="55" rx="3" ry="2" fill="#444" opacity="0.2"/>
          <path d="M5,30 Q-10,20 0,15" fill="none" stroke="{pet.color || 'goldenrod'}" stroke-width="4" stroke-linecap="round"/>
          <path d="M15,25 L25,25" stroke="red" stroke-width="2" stroke-linecap="round"/>
          <text x="20" y="75" text-anchor="middle" font-size="12" font-weight="bold" fill="black">{pet.name}</text>
        </g>
      {:else if pet.type === 'cat'}
        <g class="pet cat" transform="translate({80 + i * 70}, 390)">
          <path d="M15,30 Q20,10 25,30 Q35,35 25,40 Q20,45 15,40 Q5,35 15,30 Z" fill="{pet.color || 'gray'}" stroke="#444" stroke-width="1.5"/>
          <g transform="translate(20, 15)">
            <circle cx="0" cy="0" r="12" fill="{pet.color || 'gray'}" stroke="#444" stroke-width="1.5"/>
            <path d="M-8,-5 L-14,-15 L-5,-10 Z" fill="{pet.color || 'gray'}" stroke="#444" stroke-width="1"/>
            <path d="M8,-5 L14,-15 L5,-10 Z" fill="{pet.color || 'gray'}" stroke="#444" stroke-width="1"/>
            <g fill="none" stroke="#444" stroke-width="1">
              <ellipse cx="-4" cy="-2" rx="2" ry="3" fill="yellow"/>
              <ellipse cx="4" cy="-2" rx="2" ry="3" fill="yellow"/>
              <circle cx="-4" cy="-2" r="1" fill="black"/>
              <circle cx="4" cy="-2" r="1" fill="black"/>
            </g>
            <path d="M0,2 L-2,5 L2,5 Z" fill="pink" stroke="#444" stroke-width="0.5"/>
            <g stroke="#444" stroke-width="0.5">
              <line x1="-2" y1="5" x2="-15" y2="7"/>
              <line x1="-2" y1="6" x2="-15" y2="6"/>
              <line x1="-2" y1="7" x2="-15" y2="5"/>
              <line x1="2" y1="5" x2="15" y2="7"/>
              <line x1="2" y1="6" x2="15" y2="6"/>
              <line x1="2" y1="7" x2="15" y2="5"/>
            </g>
          </g>
          <path d="M30,35 Q40,20 50,25" fill="none" stroke="{pet.color || 'gray'}" stroke-width="4" stroke-linecap="round"/>
          <text x="20" y="75" text-anchor="middle" font-size="12" font-weight="bold" fill="black">{pet.name}</text>
        </g>

      {/if}
    {/each}
  {/if}

  <!-- UI Overlays -->
  <g class="ui-overlays">
    <!-- Name and Age -->
    <text x="150" y="290" text-anchor="middle" font-size="19" font-weight="bold" fill="#fff">
      {character.name || (isTarget ? 'Target' : '???')}
    </text>
    <text x="150" y="315" text-anchor="middle" font-size="18" fill="#fff">
      {character.age ? `Age: ${character.age}` : ''}
    </text>
    
    <!-- Mood -->
    <text x="150" y="340" text-anchor="middle" font-size="16" fill="#fff">
      {character.isHappy !== undefined ? (character.isHappy ? '😊 Happy' : '😢 Sad') : ''}
    </text>
    {#if isTarget}
      <rect x="0" y="0" width="300" height="500" fill="none" stroke="#4CAF50" stroke-width="4" stroke-dasharray="10,5" />
    {/if}
  </g>
</svg>

<style>
  .character {
    width: 300px;
    height: 500px;
    background: white;
    border-radius: 0.5rem;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .target {
    border: 2px solid #4CAF50;
  }
</style>
