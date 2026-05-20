<script setup lang="ts">
import { useTheme } from '../Composables/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <div class="min-h-screen flex relative">
    <!-- Theme toggle -->
    <button
      type="button"
      class="fixed top-4 right-4 z-50 p-2 rounded-md text-muted-color hover:bg-emphasis transition-colors"
      :title="isDark ? 'Modo claro' : 'Modo escuro'"
      @click="toggleTheme"
    >
      <i v-if="!isDark" class="pi pi-moon text-lg" />
      <i v-else class="pi pi-sun text-lg" />
    </button>

    <!-- Left panel: Login form -->
    <div class="w-full lg:w-1/2 min-h-screen flex items-center justify-center p-6 bg-surface-ground">
      <div class="w-full max-w-md">
        <slot />
      </div>
    </div>

    <!-- Right panel: Brand illustration -->
    <div class="hidden lg:flex lg:w-1/2 min-h-screen bg-gradient-to-br from-primary via-primary-700 to-primary-900 relative overflow-hidden items-center justify-center p-12">
      <!-- Decorative circles -->
      <div class="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/5" />
      <div class="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-white/5" />
      <div class="absolute top-1/3 -left-16 w-48 h-48 rounded-full bg-white/[0.03]" />

      <!-- Content -->
      <div class="relative text-center max-w-lg">
        <!-- Large brand icon -->
        <div class="mb-8 flex justify-center">
          <div class="w-24 h-24 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-2xl">
            <i class="pi pi-calendar-clock text-5xl text-white" />
          </div>
        </div>

        <!-- App name -->
        <h1 class="text-4xl font-bold text-white mb-4">Smart Schedule</h1>

        <!-- Tagline -->
        <p class="text-lg text-white/80 leading-relaxed">
          Gestão inteligente de escalas para sua comunidade paroquial
        </p>

        <!-- Feature highlights -->
        <div class="mt-10 grid grid-cols-1 gap-4 text-left">
          <div class="flex items-center gap-3 bg-white/10 rounded-lg px-5 py-3 backdrop-blur-sm">
            <div class="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
              <i class="pi pi-users text-white text-sm" />
            </div>
            <div>
              <p class="text-white font-medium text-sm">Gestão de Equipes</p>
              <p class="text-white/60 text-xs">Organize ministros e grupos de serviço</p>
            </div>
          </div>

          <div class="flex items-center gap-3 bg-white/10 rounded-lg px-5 py-3 backdrop-blur-sm">
            <div class="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
              <i class="pi pi-calendar text-white text-sm" />
            </div>
            <div>
              <p class="text-white font-medium text-sm">Escalas Inteligentes</p>
              <p class="text-white/60 text-xs">Distribua plantões de forma automática</p>
            </div>
          </div>

          <div class="flex items-center gap-3 bg-white/10 rounded-lg px-5 py-3 backdrop-blur-sm">
            <div class="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
              <i class="pi pi-bell text-white text-sm" />
            </div>
            <div>
              <p class="text-white font-medium text-sm">Notificações</p>
              <p class="text-white/60 text-xs">Acompanhe mudanças em tempo real</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
