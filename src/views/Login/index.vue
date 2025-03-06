<!--
 * @Description:登录页面的实现
 * @Author: Zane Xu
 * @Date: 2024-12-15 11:52:34
 * @LastEditTime: 2025-02-28 16:55:46
 * @LastEditors: Zane Xu
-->
<template>
  <div class="login-container">
    <div class="login-img">
      <img src="https://raw.githubusercontent.com/KingOfChelsea/MarkdownPicGo/main/login.png" alt="login" />
    </div>
    <div class="login-content">
      <el-form :model="form" :rules="rules" ref="loginForm">
        <h2>广州翊宇电子商务-汾酒-进销存系统</h2>

        <!-- 手机号登录 -->
        <el-form-item prop="username">
          <el-input v-model="form.username" prefix-icon="el-icon-phone" :disabled="isCaptchaButtonDisabled" placeholder="请输入手机号码" />
        </el-form-item>

        <!-- 密码输入框 -->
        <el-form-item prop="password">
          <el-input v-model="form.password" prefix-icon="el-icon-lock" type="password" :disabled="isCaptchaButtonDisabled" placeholder="请输入密码" />
        </el-form-item>

        <!-- 验证码输入框 -->
        <el-form-item prop="captcha">
          <el-row :gutter="2">
            <el-col :span="14">
              <el-input v-model="form.captcha" placeholder="请输入验证码" />
            </el-col>
            <el-col :span="8">
              <el-button
                :disabled="isCaptchaButtonDisabled"
                @click="handleGetCaptcha"
                class="captcha-btn"
                style="width: 100%"
                type="primary">
                {{ captchaButtonText }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>

        <!-- 记住密码 -->
        <el-checkbox v-model="remember">记住密码</el-checkbox>

        <!-- 登录按钮 -->
        <el-button type="primary" @click="handleLogin" style="width: 100%">登录</el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { AccessLoginTokenAPI } from '@/apis/login/AceessLoginToken'
import { getVerificationCodeAPI } from '@/apis/login/VerificationCode'

import { ElMessage } from 'element-plus'
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

/**
 * 登录表单数据
 */
const form = reactive({
  username: '13178822476',
  password: 'admin123',
  captcha: ''
})

// 记住密码状态
const remember = ref(false)
// 当前获取验证码的身份ID
const userId = ref(null)
// 表单验证规则
const rules = {
  username: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
}

// 获取验证码按钮的禁用状态以及账号和密码
const isCaptchaButtonDisabled = ref(false)

// 获取验证码按钮的文本
const captchaButtonText = ref('获取验证码')

let timer = null
let countdown = 60

// 页面加载时恢复倒计时状态
onMounted(() => {
  // 从localStorage恢复倒计时状态
  const savedCountdown = localStorage.getItem('countdown')
  const savedIsDisabled = localStorage.getItem('isCaptchaButtonDisabled')

  if (savedCountdown && savedIsDisabled) {
    countdown = parseInt(savedCountdown)
    isCaptchaButtonDisabled.value = JSON.parse(savedIsDisabled)
    captchaButtonText.value = `${countdown}s`

    if (countdown > 0) {
      startTimer()
    }
  }
})

/**
 * handleLogin 登录操作 Create by Zane Xu
 */
const handleLogin = async () => {
  try {
    const res = await AccessLoginTokenAPI(form.captcha, userId.value);
    // 判断响应是否包含token（根据实际API响应结构调整）
    console.log(res);
    if (res.success) {
      localStorage.setItem('Token', res.token);  // 使用真实token替换mock值
      ElMessage.success('登录成功');
      // 路由跳转，替换为你需要跳转的页面路径，例如 '/dashboard'
      router.push('purchase/create');
    } else {
      throw new Error('Token不存在于响应中');
    }
  } catch (error) {
    console.error('登录失败:', error);
    ElMessage.error(`登录失败: ${error.message || '未知错误'}`);
  }
}


/**
 * handleGetCaptcha 获取验证码逻辑 Create by Zane Xu
 */
const handleGetCaptcha = async () => {
  if (!/^1[3-9]\d{9}$/.test(form.username)) {
    ElMessage.error('请输入有效的手机号码')
    return
  }
  try {
    const res = await getVerificationCodeAPI({
      Phone: form.username,
      Password: form.password
    })
    console.log(res);

    // true
    if (res.success) {
      userId.value=res.userId
      ElMessage.success("已发送验证码到个人飞书账号请查验！10分钟内有效")
      // 禁用按钮并开始倒计时
      isCaptchaButtonDisabled.value = true
      captchaButtonText.value = `${countdown}s`
      // 重置倒计时为60秒
      countdown = 60
      // 将倒计时和按钮禁用状态保存到localStorage
      localStorage.setItem('isCaptchaButtonDisabled', true)
      localStorage.setItem('countdown', countdown)

      startTimer()
    } else {
      ElMessage.error(res.message)
    }
  } catch (error) {
    ElMessage.error("错误" + error)
  }
}

/**
 * [验证码再次获取启动倒计时 Create by 徐振宇2025-2-28]
  @param 无参数
 */
const startTimer = () => {
  timer = setInterval(() => {
    countdown--
    captchaButtonText.value = `${countdown}s`

    // 每秒更新倒计时，并保存状态
    localStorage.setItem('countdown', countdown)
    localStorage.setItem('isCaptchaButtonDisabled', true)

    if (countdown <= 0) {
      clearInterval(timer)
      isCaptchaButtonDisabled.value = false
      captchaButtonText.value = '重新获取'

      // 计时结束时清除localStorage的状态
      localStorage.removeItem('countdown')
      localStorage.removeItem('isCaptchaButtonDisabled')
    }
  }, 1000)
}
</script>


<style scoped lang="scss">
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #2c3e50;
  background: -webkit-linear-gradient(to right, #3498db, #2c3e50);
  background: linear-gradient(to right, #3498db, #2c3e50);
  gap: 10px;

  .login-img {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    img {
      max-width: 400px;
      height: auto;
    }
  }
}

.login-content {
  flex-grow: 1;
  max-width: 400px;
  padding: 40px;
  background: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  text-align: center;
}


.captcha-btn {
  width: 100%;
}

/* 适配小屏幕 */
@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
    gap: 10px;
  }

  .login-img {
    display: none;
  }

  .login-content {
    max-width: 100%;
  }
}
</style>
