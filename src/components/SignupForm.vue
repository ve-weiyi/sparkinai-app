<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from '@/lib/utils'
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
import { AuthAPI } from '@/api/auth'
import { toast } from 'vue-sonner'

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const code = ref('')
const loading = ref(false)
const codeSent = ref(false)
const error = ref('')

const handleSendCode = async (e: Event) => {
  e.preventDefault()
  loading.value = true
  error.value = ''

  try {
    await AuthAPI.sendEmailVerifyCode({
      email: email.value,
      type: 'register',
    })
    codeSent.value = true
  } catch (err) {
    console.error('Send code failed:', err)
    error.value = '发送验证码失败，请重试'
  } finally {
    loading.value = false
  }
}

const handleVerify = async (e: Event) => {
  e.preventDefault()
  loading.value = true
  error.value = ''
  try {
    const res = await AuthAPI.register({
      email: email.value,
      password: password.value,
      verify_code: code.value,
      nickname: name.value,
    } as any)
    if (res.code === 200) {
      toast.success('注册成功')
      router.push('/login')
    }
  } catch (err) {
    console.error('Verify failed:', err)
    error.value = '验证失败，请检查验证码'
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
            <!-- 错误提示 -->
            <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
              {{ error }}
            </div>

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
              <FieldLabel for="password">
                Password
              </FieldLabel>
              <Input id="password" v-model="password" type="password" required />
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
            <!-- 错误提示 -->
            <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
              {{ error }}
            </div>

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
