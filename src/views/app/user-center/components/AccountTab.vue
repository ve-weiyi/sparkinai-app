<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { useUserStore } from '@/store/modules/user'
import { toast } from 'vue-sonner'

const store = useUserStore()
const { currentUser } = storeToRefs(store)

// 修改用户名
const isEditingUsername = ref(false)
const newUsername = ref('')
const editUsername = () => {
  newUsername.value = currentUser.value?.name || ''
  isEditingUsername.value = true
}
const saveUsername = () => {
  // TODO: 调用 API 保存用户名
  toast.success('用户名已更新')
  isEditingUsername.value = false
}

// 修改手机号
const isEditingPhone = ref(false)
const phoneStep = ref<'input' | 'verify'>('input')
const newPhone = ref('')
const phoneOtp = ref('')
const phoneCountdown = ref(0)

const editPhone = () => {
  newPhone.value = currentUser.value?.phone || ''
  phoneStep.value = 'input'
  isEditingPhone.value = true
}

const sendPhoneOtp = () => {
  // TODO: 调用 API 发送验证码
  phoneCountdown.value = 60
  const timer = setInterval(() => {
    phoneCountdown.value--
    if (phoneCountdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
  phoneStep.value = 'verify'
  toast.success(`验证码已发送至 ${newPhone.value}`)
}

const savePhone = () => {
  // TODO: 调用 API 验证并保存手机号
  toast.success('手机号已更新')
  isEditingPhone.value = false
  phoneOtp.value = ''
}

// 修改密码
const isEditingPassword = ref(false)
const passwordStep = ref<'verify' | 'input'>('verify')
const emailOtp = ref('')
const emailCountdown = ref(0)
const newPassword = ref('')
const confirmPassword = ref('')

const editPassword = () => {
  passwordStep.value = 'verify'
  emailOtp.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  isEditingPassword.value = true
}

const sendEmailOtp = () => {
  // TODO: 调用 API 发送邮箱验证码
  emailCountdown.value = 60
  const timer = setInterval(() => {
    emailCountdown.value--
    if (emailCountdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
  toast.success(`验证码已发送至 ${currentUser.value?.email}`)
}

const verifyEmailOtp = () => {
  // TODO: 调用 API 验证邮箱验证码
  passwordStep.value = 'input'
}

const savePassword = () => {
  if (newPassword.value !== confirmPassword.value) {
    toast.error('两次输入的密码不一致')
    return
  }
  // TODO: 调用 API 保存新密码
  toast.success('密码已更新')
  isEditingPassword.value = false
}

// 注销账户
const isDeleteDialogOpen = ref(false)
const deleteStep = ref<'confirm' | 'verify'>('confirm')
const deleteOtp = ref('')
const deleteCountdown = ref(0)

const startDeleteAccount = () => {
  deleteStep.value = 'confirm'
  deleteOtp.value = ''
  isDeleteDialogOpen.value = true
}

const confirmDelete = () => {
  deleteStep.value = 'verify'
}

const sendDeleteOtp = () => {
  // TODO: 调用 API 发送验证码
  deleteCountdown.value = 60
  const timer = setInterval(() => {
    deleteCountdown.value--
    if (deleteCountdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
  toast.success(`验证码已发送至 ${currentUser.value?.phone || currentUser.value?.email}`)
}

const deleteAccount = () => {
  // TODO: 调用 API 注销账户
  toast.success('您的账户已成功注销')
  isDeleteDialogOpen.value = false
  // 跳转到登录页
  // router.push('/login')
}
</script>

<template>
  <div class="max-w-4xl space-y-6">
    <!-- 修改用户名 -->
    <div class="bg-white rounded-lg border p-6">
      <div class="flex justify-between items-start">
        <div class="space-y-1">
          <h3 class="text-base font-semibold">用户名</h3>
          <p class="text-sm text-gray-500">{{ currentUser?.name || '未设置' }}</p>
        </div>
        <Dialog v-model:open="isEditingUsername">
          <DialogTrigger as-child>
            <Button variant="outline" size="sm" @click="editUsername">
              修改
            </Button>
          </DialogTrigger>
          <DialogContent class="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>修改用户名</DialogTitle>
              <DialogDescription>
                请输入新的用户名
              </DialogDescription>
            </DialogHeader>
            <div class="space-y-4 py-4">
              <div class="space-y-2">
                <Label for="username">用户名</Label>
                <Input
                  id="username"
                  v-model="newUsername"
                  placeholder="请输入用户名"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" @click="isEditingUsername = false">
                取消
              </Button>
              <Button @click="saveUsername">
                保存
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>

    <!-- 修改手机号 -->
    <div class="bg-white rounded-lg border p-6">
      <div class="flex justify-between items-start">
        <div class="space-y-1">
          <h3 class="text-base font-semibold">手机号</h3>
          <p class="text-sm text-gray-500">
            {{ currentUser?.phone ? currentUser.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : '未绑定' }}
          </p>
        </div>
        <Dialog v-model:open="isEditingPhone">
          <DialogTrigger as-child>
            <Button variant="outline" size="sm" @click="editPhone">
              {{ currentUser?.phone ? '修改' : '绑定' }}
            </Button>
          </DialogTrigger>
          <DialogContent class="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{{ currentUser?.phone ? '修改手机号' : '绑定手机号' }}</DialogTitle>
              <DialogDescription>
                {{ phoneStep === 'input' ? '请输入新的手机号' : '请输入验证码' }}
              </DialogDescription>
            </DialogHeader>
            <div class="space-y-4 py-4">
              <div v-if="phoneStep === 'input'" class="space-y-2">
                <Label for="phone">手机号</Label>
                <Input
                  id="phone"
                  v-model="newPhone"
                  placeholder="请输入手机号"
                  type="tel"
                />
              </div>
              <div v-else class="space-y-4">
                <div class="space-y-2">
                  <Label>验证码</Label>
                  <InputOTP v-model="phoneOtp" :maxlength="6">
                    <InputOTPGroup class="gap-2">
                      <InputOTPSlot :index="0" />
                      <InputOTPSlot :index="1" />
                      <InputOTPSlot :index="2" />
                      <InputOTPSlot :index="3" />
                      <InputOTPSlot :index="4" />
                      <InputOTPSlot :index="5" />
                    </InputOTPGroup>
                  </InputOTP>
                  <p class="text-xs text-gray-500">
                    验证码已发送至 {{ newPhone }}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  class="w-full"
                  :disabled="phoneCountdown > 0"
                  @click="sendPhoneOtp"
                >
                  {{ phoneCountdown > 0 ? `${phoneCountdown}秒后重新发送` : '重新发送' }}
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" @click="isEditingPhone = false">
                取消
              </Button>
              <Button v-if="phoneStep === 'input'" @click="sendPhoneOtp">
                发送验证码
              </Button>
              <Button v-else @click="savePhone">
                确认
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>

    <!-- 修改密码 -->
    <div class="bg-white rounded-lg border p-6">
      <div class="flex justify-between items-start">
        <div class="space-y-1">
          <h3 class="text-base font-semibold">密码</h3>
          <p class="text-sm text-gray-500">为您的账户设置密码,以启用密码登录功能</p>
        </div>
        <Dialog v-model:open="isEditingPassword">
          <DialogTrigger as-child>
            <Button variant="outline" size="sm" @click="editPassword">
              修改
            </Button>
          </DialogTrigger>
          <DialogContent class="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>修改密码</DialogTitle>
              <DialogDescription>
                {{ passwordStep === 'verify' ? '为了安全起见,请先验证您的邮箱' : '请输入新密码' }}
              </DialogDescription>
            </DialogHeader>
            <div class="space-y-4 py-4">
              <div v-if="passwordStep === 'verify'" class="space-y-4">
                <div class="space-y-2">
                  <Label>邮箱验证码</Label>
                  <InputOTP v-model="emailOtp" :maxlength="6">
                    <InputOTPGroup class="gap-2">
                      <InputOTPSlot :index="0" />
                      <InputOTPSlot :index="1" />
                      <InputOTPSlot :index="2" />
                      <InputOTPSlot :index="3" />
                      <InputOTPSlot :index="4" />
                      <InputOTPSlot :index="5" />
                    </InputOTPGroup>
                  </InputOTP>
                  <p class="text-xs text-gray-500">
                    验证码已发送至 {{ currentUser?.email }}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  class="w-full"
                  :disabled="emailCountdown > 0"
                  @click="sendEmailOtp"
                >
                  {{ emailCountdown > 0 ? `${emailCountdown}秒后重新发送` : '发送验证码' }}
                </Button>
              </div>
              <div v-else class="space-y-4">
                <div class="space-y-2">
                  <Label for="new-password">新密码</Label>
                  <Input
                    id="new-password"
                    v-model="newPassword"
                    type="password"
                    placeholder="请输入新密码"
                  />
                </div>
                <div class="space-y-2">
                  <Label for="confirm-password">确认密码</Label>
                  <Input
                    id="confirm-password"
                    v-model="confirmPassword"
                    type="password"
                    placeholder="请再次输入新密码"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" @click="isEditingPassword = false">
                取消
              </Button>
              <Button v-if="passwordStep === 'verify'" @click="verifyEmailOtp">
                验证
              </Button>
              <Button v-else @click="savePassword">
                保存
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>

    <!-- 注销账户 -->
    <div class="bg-white rounded-lg border border-red-200 p-6">
      <div class="space-y-4">
        <div class="space-y-1">
          <h3 class="text-base font-semibold text-red-600">注销账户</h3>
          <p class="text-sm text-gray-500">
            注销账户后,您的所有数据将被永久删除且无法恢复。请谨慎操作。
          </p>
        </div>
        <AlertDialog v-model:open="isDeleteDialogOpen">
          <AlertDialogTrigger as-child>
            <Button variant="destructive" size="sm" @click="startDeleteAccount">
              注销账户
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {{ deleteStep === 'confirm' ? '确认注销账户?' : '验证身份' }}
              </AlertDialogTitle>
              <AlertDialogDescription>
                <div v-if="deleteStep === 'confirm'" class="space-y-2">
                  <p>注销账户后:</p>
                  <ul class="list-disc list-inside space-y-1 text-sm">
                    <li>您的所有个人信息将被永久删除</li>
                    <li>您的订阅和积分将被清空</li>
                    <li>您创建的所有内容将被删除</li>
                    <li>此操作无法撤销</li>
                  </ul>
                </div>
                <div v-else class="space-y-4 pt-4">
                  <div class="space-y-2">
                    <Label>验证码</Label>
                    <InputOTP v-model="deleteOtp" :maxlength="6">
                      <InputOTPGroup class="gap-2">
                        <InputOTPSlot :index="0" />
                        <InputOTPSlot :index="1" />
                        <InputOTPSlot :index="2" />
                        <InputOTPSlot :index="3" />
                        <InputOTPSlot :index="4" />
                        <InputOTPSlot :index="5" />
                      </InputOTPGroup>
                    </InputOTP>
                    <p class="text-xs text-gray-500">
                      验证码已发送至 {{ currentUser?.phone || currentUser?.email }}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    class="w-full"
                    :disabled="deleteCountdown > 0"
                    @click="sendDeleteOtp"
                  >
                    {{ deleteCountdown > 0 ? `${deleteCountdown}秒后重新发送` : '发送验证码' }}
                  </Button>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel @click="isDeleteDialogOpen = false">
                取消
              </AlertDialogCancel>
              <AlertDialogAction
                v-if="deleteStep === 'confirm'"
                class="bg-red-600 hover:bg-red-700"
                @click="confirmDelete"
              >
                继续
              </AlertDialogAction>
              <AlertDialogAction
                v-else
                class="bg-red-600 hover:bg-red-700"
                @click="deleteAccount"
              >
                确认注销
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  </div>
</template>
