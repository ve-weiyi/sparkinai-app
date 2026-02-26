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
import { useI18n } from 'vue-i18n'

const props = defineProps<{ class?: HTMLAttributes["class"] }>()

const { t } = useI18n()
const router = useRouter()
const email = ref('')
const nickname = ref('')
const password = ref('')
const code = ref('')
const loading = ref(false)
const codeSent = ref(false)
const countdown = ref(0)
const error = ref('')

const handleSendCode = async (e: Event) => {
  e.preventDefault()
  if (countdown.value > 0) return
  loading.value = true
  error.value = ''
  try {
    await AuthAPI.sendEmailCode({ email: email.value, type: 'register' })
    codeSent.value = true
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) clearInterval(timer)
    }, 1000)
  } catch {
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
      nickname: nickname.value,
    })
    if (res.code === 200) {
      toast.success('注册成功')
      router.push('/login')
    }
  } catch {
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
        <CardTitle class="text-xl">{{ t('auth.register.title') }}</CardTitle>
        <CardDescription>{{ t('auth.register.subtitle') }}</CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit="handleSendCode">
          <FieldGroup>
            <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
              {{ error }}
            </div>
            <Field>
              <FieldLabel for="nickname">{{ t('auth.register.fullName') }}</FieldLabel>
              <Input id="nickname" v-model="nickname" type="text" :placeholder="t('auth.register.namePlaceholder')" required />
            </Field>
            <Field>
              <FieldLabel for="email">{{ t('auth.register.email') }}</FieldLabel>
              <Input id="email" v-model="email" type="email" :placeholder="t('auth.register.emailPlaceholder')" required />
            </Field>
            <Field>
              <FieldLabel for="password">{{ t('auth.register.password') }}</FieldLabel>
              <Input id="password" v-model="password" type="password" required />
            </Field>
            <Field>
              <Button type="submit" :disabled="loading || countdown > 0">
                {{ countdown > 0 ? `${countdown}s` : (loading ? t('auth.register.sending') : t('auth.register.createButton')) }}
              </Button>
              <FieldDescription class="text-center">
                {{ t('auth.register.hasAccount') }} <RouterLink to="/login">{{ t('auth.register.signIn') }}</RouterLink>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>

    <Card v-else>
      <CardHeader class="text-center">
        <CardTitle class="text-xl">{{ t('auth.register.verifyTitle') }}</CardTitle>
        <CardDescription>{{ t('auth.register.verifySubtitle') }}</CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit="handleVerify">
          <FieldGroup>
            <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
              {{ error }}
            </div>
            <Field>
              <FieldLabel for="otp" class="sr-only">{{ t('auth.register.verifyCode') }}</FieldLabel>
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
              <FieldDescription class="text-center">{{ t('auth.register.verifyDescription') }}</FieldDescription>
            </Field>
            <Button type="submit" :disabled="loading">
              {{ loading ? t('auth.register.verifying') : t('auth.register.verifyButton') }}
            </Button>
            <FieldDescription class="text-center">
              {{ t('auth.register.noCode') }}
              <a href="#" @click.prevent="codeSent = false">{{ t('auth.register.changeEmail') }}</a>
            </FieldDescription>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>

    <FieldDescription class="px-6 text-center">
      {{ t('auth.terms') }} <a href="#">{{ t('auth.termsOfService') }}</a>
      {{ t('auth.and') }} <a href="#">{{ t('auth.privacyPolicy') }}</a>.
    </FieldDescription>
  </div>
</template>
