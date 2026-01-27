<script setup lang="ts">
import SignupForm from '@/components/SignupForm.vue'
</script>

<template>
  <div class="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
    <div class="flex w-full max-w-sm flex-col gap-6">
      <a href="/" class="flex items-center gap-2 self-center font-medium">
        <div class="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-4"
          >
            <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
          </svg>
        </div>
        SparkInAI Platform
      </a>
      <SignupForm />
    </div>
  </div>
</template>
