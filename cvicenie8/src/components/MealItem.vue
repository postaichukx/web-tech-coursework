<script setup>
defineProps({
  meal: { type: Object, required: true },
  count: { type: Number, default: 0 },
})

const emit = defineEmits(['order'])
</script>

<template>
  <li class="meal-item" :class="{ veg: meal.vegetarian }">
    <div class="meal-description">
      <span class="name">{{ meal.name }}</span>
      <span v-if="count > 0" class="count">{{ count }}× v objednávke</span>
    </div>
    <span class="price">{{ meal.price.toFixed(2) }} €</span>
    <button type="button" :aria-label="`Pridať ${meal.name} do objednávky`" @click="emit('order')">+</button>
  </li>
</template>

<style scoped>
.meal-item { display: grid; grid-template-columns: minmax(0, 1fr) auto auto; gap: .8rem; align-items: center; padding: 1rem 0; border-bottom: 1px solid #edf0e9; }
.meal-item:last-child { border-bottom: 0; }
.meal-description { display: grid; gap: .25rem; }
.name { font-weight: 600; }
.veg .name { color: #267044; }
.count { color: #617066; font-size: .85rem; }
.price { white-space: nowrap; font-variant-numeric: tabular-nums; }
button { width: 2rem; height: 2rem; border: 0; border-radius: 50%; background: #e1eee1; color: #1f5c39; font-size: 1.2rem; font-weight: 700; cursor: pointer; }
button:hover { background: #cce3ce; }
button:focus-visible { outline: 3px solid #d59237; outline-offset: 3px; }
@media (max-width: 480px) {
  .meal-item { grid-template-columns: minmax(0, 1fr) auto; }
  .price { grid-column: 1; }
  button { grid-column: 2; grid-row: 1 / span 2; }
}
</style>
