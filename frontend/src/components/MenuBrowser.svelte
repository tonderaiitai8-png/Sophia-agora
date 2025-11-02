<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let categories: any[] = []

  const dispatch = createEventDispatcher()
  let activeCategory = 0

  function selectItem(item: any) {
    dispatch('add', item)
  }
</script>

<div class="flex-1 overflow-auto">
  <!-- Category Tabs -->
  <div class="tabs tabs-bordered mb-4 flex-nowrap overflow-x-auto">
    {#each categories as category, idx (category.id)}
      <button
        class="tab {activeCategory === idx ? 'tab-active' : ''}"
        on:click={() => (activeCategory = idx)}
      >
        {category.name}
      </button>
    {/each}
  </div>

  <!-- Items in Active Category -->
  <div class="space-y-2 max-h-96 overflow-y-auto">
    {#each categories[activeCategory]?.items || [] as item (item.id)}
      <div class="card bg-base-100 shadow-sm p-3 cursor-pointer hover:shadow-md transition" on:click={() => selectItem(item)}>
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <p class="font-bold text-sm">{item.name}</p>
            {#if item.description}
              <p class="text-xs text-gray-600 line-clamp-2">{item.description}</p>
            {/if}
          </div>
          <span class="text-sm font-bold text-red-600 ml-2">£{item.price.toFixed(2)}</span>
        </div>
      </div>
    {/each}
  </div>
</div>
