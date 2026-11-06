<script setup>
import { computed, ref } from 'vue'
import MealItem from './components/MealItem.vue'

const restaurant = 'Bistro Pod Hradom'
const likes = ref(0)
const meals = ref([
  { id: 1, name: 'Cesnaková polievka', price: 2.5, vegetarian: true },
  { id: 2, name: 'Kuracie prsia s ryžou', price: 8.9, vegetarian: false },
  { id: 3, name: 'Vyprážaný syr s hranolkami', price: 8.5, vegetarian: true },
  { id: 4, name: 'Hovädzí guláš s knedľou', price: 9.4, vegetarian: false },
  { id: 5, name: 'Cícerové kari', price: 8.2, vegetarian: true },
])

const onlyVegetarian = ref(false)
const visibleMeals = computed(() =>
  onlyVegetarian.value ? meals.value.filter((meal) => meal.vegetarian) : meals.value,
)

const counts = ref({})
const orderTotal = computed(() =>
  meals.value.reduce((sum, meal) => sum + meal.price * (counts.value[meal.id] ?? 0), 0),
)

const newMeal = ref({ name: '', price: 0, vegetarian: false })
let nextId = 6

function like() {
  likes.value++
}

function addToOrder(meal) {
  counts.value[meal.id] = (counts.value[meal.id] ?? 0) + 1
}

function addMeal() {
  const name = newMeal.value.name.trim()
  if (!name || !Number.isFinite(newMeal.value.price) || newMeal.value.price < 0) return

  meals.value.push({ ...newMeal.value, name, id: nextId++ })
  newMeal.value = { name: '', price: 0, vegetarian: false }
}
</script>

<template>
  <div class="page-shell">
    <main class="layout">
      <header class="intro">
        <p class="eyebrow">Denné menu · Bratislava</p>
        <h1>{{ restaurant }}</h1>
        <p class="muted">Vyberte si z dnešnej ponuky a zostavte si objednávku.</p>
        <button class="like-button" type="button" @click="like">Páči sa mi ({{ likes }})</button>
      </header>

      <div class="content-grid">
        <section class="panel menu-panel" aria-labelledby="menu-heading">
          <div class="section-heading">
            <div>
              <p class="eyebrow">Ponuka</p>
              <h2 id="menu-heading">Dnešné jedlá</h2>
            </div>
            <label class="check-label">
              <input v-model="onlyVegetarian" type="checkbox"> Iba vegetariánske
            </label>
          </div>

          <ul v-if="visibleMeals.length > 0" class="meal-list">
            <MealItem
              v-for="meal in visibleMeals"
              :key="meal.id"
              :meal="meal"
              :count="counts[meal.id] ?? 0"
              @order="addToOrder(meal)"
            />
          </ul>
          <p v-else class="muted empty-message">Dnes nemáme nič, čo by vyhovovalo filtru.</p>
        </section>

        <aside class="side-panel">
          <section class="panel" aria-labelledby="order-heading">
            <p class="eyebrow">Váš výber</p>
            <h2 id="order-heading">Objednávka</h2>
            <p v-if="orderTotal > 0" class="order-total">Spolu: <strong>{{ orderTotal.toFixed(2) }} €</strong></p>
            <p v-else class="muted last-line">Objednávka je prázdna.</p>
          </section>

          <section class="panel" aria-labelledby="new-meal-heading">
            <p class="eyebrow">Bonusová úloha</p>
            <h2 id="new-meal-heading">Nové jedlo</h2>
            <form @submit.prevent="addMeal">
              <label for="meal-name">Názov</label>
              <input id="meal-name" v-model="newMeal.name" type="text" required>

              <label for="meal-price">Cena v €</label>
              <input id="meal-price" v-model="newMeal.price" type="number" min="0" step="0.1" required>

              <label class="check-label">
                <input v-model="newMeal.vegetarian" type="checkbox"> Vegetariánske
              </label>
              <button class="submit-button" type="submit">Pridať jedlo</button>
            </form>
          </section>
        </aside>
      </div>
    </main>
  </div>
</template>

<style scoped>
.page-shell { min-height: 100vh; padding: clamp(1.25rem, 4vw, 3rem); background: #f5f2eb; color: #25382f; font-family: system-ui, sans-serif; }
.layout { max-width: 1100px; margin: 0 auto; }
.intro { padding: 1.5rem 0 2.5rem; }
.eyebrow { margin: 0 0 .55rem; color: #58735d; font-size: .76rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
h1, h2, p { margin-top: 0; }
h1, h2 { font-family: Georgia, serif; }
h1 { margin-bottom: .65rem; font-size: clamp(2.4rem, 6vw, 4rem); line-height: 1.1; }
h2 { margin-bottom: 0; font-size: 1.55rem; }
.muted { color: #617066; }
button, input { font: inherit; }
button { cursor: pointer; }
.like-button { padding: .6rem 1rem; border: 1px solid #bdcbbd; border-radius: .45rem; background: transparent; color: #244b36; font-weight: 600; }
.like-button:hover { background: #e6eee3; }
.content-grid { display: grid; grid-template-columns: minmax(0, 1.7fr) minmax(280px, 1fr); gap: 1.3rem; align-items: start; }
.panel { padding: 1.5rem; border: 1px solid #dce3d7; border-radius: .8rem; background: #fffefa; box-shadow: 0 8px 25px rgb(37 56 47 / 5%); }
.section-heading { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: end; gap: 1rem; padding-bottom: 1.15rem; border-bottom: 1px solid #e5e9df; }
.check-label { display: inline-flex; align-items: center; gap: .5rem; cursor: pointer; }
input[type='checkbox'] { accent-color: #2d6345; }
.meal-list { margin: 0; padding: 0; list-style: none; }
.empty-message { margin: 1.5rem 0 0; }
.side-panel { display: grid; gap: 1.3rem; }
.order-total, .last-line { margin: 1.25rem 0 0; }
.order-total { font-size: 1.1rem; }
form { display: grid; gap: .65rem; margin-top: 1.15rem; }
form input[type='text'], form input[type='number'] { width: 100%; padding: .65rem .75rem; border: 1px solid #bac8b9; border-radius: .4rem; background: #fff; }
form .check-label { margin: .35rem 0; }
.submit-button { padding: .7rem 1rem; border: 0; border-radius: .45rem; background: #28583e; color: #fff; font-weight: 700; }
.submit-button:hover { background: #1f4933; }
button:focus-visible, input:focus-visible { outline: 3px solid #d59237; outline-offset: 3px; }
@media (max-width: 760px) { .content-grid { grid-template-columns: 1fr; } }
</style>
