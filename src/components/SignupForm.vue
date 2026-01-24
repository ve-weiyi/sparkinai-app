<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from '@/lib/utils.ts'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { authService } from '@/services/auth'

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()

const router = useRouter()
const name = ref('')
const email = ref('')
const code = ref('')
const loading = ref(false)
const codeSent = ref(false)

const handleSendCode = async (e: Event) => {
  e.preventDefault()
  loading.value = true
  codeSent.value = true
  loading.value = false
  return
  
  try {
    const response = await authService.sendVerificationCode(email.value, name.value)
    if (response.success) {
      codeSent.value = true
    }
  } catch (error) {
    console.error('Send code failed:', error)
    // 即使失败也切换到验证码页面用于测试
    codeSent.value = true
  } finally {
    loading.value = false
  }
}

const handleVerify = async (e: Event) => {
  e.preventDefault()
  loading.value = true
  try {
    const response = await authService.verifyAndRegister(email.value, code.value)
    if (response.success) {
      localStorage.setItem('token', response.data.token)
      router.push('/app/dashboard')
    }
  } catch (error) {
    console.error('Verify failed:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card v-if="!codeSent">
      <CardHeader class="text-center">
        <CardTitle class="text-xl">
          Create your account
        </CardTitle>
        <CardDescription>
          Enter your email below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit="handleSendCode">
          <FieldGroup>
            <Field>
              <FieldLabel for="name">
                Full Name
              </FieldLabel>
              <Input id="name" v-model="name" type="text" placeholder="John Doe" required />
            </Field>
            <Field>
              <FieldLabel for="email">
                Email
              </FieldLabel>
              <Input
                id="email"
                v-model="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </Field>
            <Field>
              <Button type="submit" :disabled="loading">
                {{ loading ? '发送中...' : 'Create Account' }}
              </Button>
              <FieldDescription class="text-center">
                Already have an account? <a href="/login">Sign in</a>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
    <Card v-else>
      <CardHeader class="text-center">
        <CardTitle class="text-xl">
          Enter verification code
        </CardTitle>
        <CardDescription>We sent a 6-digit code to your email.</CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit="handleVerify">
          <FieldGroup>
            <Field>
              <FieldLabel for="otp" class="sr-only">
                Verification code
              </FieldLabel>
              <div class="flex justify-center">
                <InputOTP id="otp" v-model="code" :maxlength="6" required>
                  <InputOTPGroup class="gap-2.5 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border">
                    <InputOTPSlot :index="0" />
                    <InputOTPSlot :index="1" />
                    <InputOTPSlot :index="2" />
                    <InputOTPSlot :index="3" />
                    <InputOTPSlot :index="4" />
                    <InputOTPSlot :index="5" />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <FieldDescription class="text-center">
                Enter the 6-digit code sent to your email.
              </FieldDescription>
            </Field>
            <Button type="submit" :disabled="loading">
              {{ loading ? '验证中...' : 'Verify' }}
            </Button>
            <FieldDescription class="text-center">
              Didn't receive the code? <a href="#" @click.prevent="codeSent = false">Change email</a>
            </FieldDescription>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
    <FieldDescription class="px-6 text-center">
      By clicking continue, you agree to our <a href="#">Terms of Service</a>
      and <a href="#">Privacy Policy</a>.
    </FieldDescription>
  </div>
</template>
