<script setup lang="ts"></script>

<template>
  <div class="text-center">
    <img style="height: 150px" src="/logo-conjures.png" alt="Logo des conjurés du temporel" />
  </div>

  <p class="text-h5">Nos outils pour les jeux de plateau</p>

  <q-card class="q-my-sm cursor-pointer" @click="$router.push({ name: 'suggest' })">
    <q-card-section>
      <div class="text-h6"><q-icon name="tips_and_updates" /> L'assistant</div>
      <div>Laisse-moi t'aider à choisir un jeu dans notre bibliothèque</div>
    </q-card-section>
  </q-card>

  <q-card class="q-my-sm cursor-pointer" @click="$router.push({ name: 'games' })">
    <q-card-section>
      <div class="text-h6"><q-icon name="flare" /> Les jeux du moment</div>
      <div>Vois à quoi on joue en ce moment</div>
    </q-card-section>
  </q-card>

  <q-card class="q-my-sm cursor-pointer" @click="$router.push({ name: 'record-play' })">
    <q-card-section>
      <div class="text-h6"><q-icon name="rate_review" /> Enregistre ta partie</div>
      <div>Dis-nous à quoi tu as joué avec nous</div>
    </q-card-section>
  </q-card>
</template>

<style scoped></style>
