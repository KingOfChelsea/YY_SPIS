<template>
  <el-container class="register-container">
    <el-header>
      <h2 class="register-title">👤 用户注册</h2>
    </el-header>

    <el-main >
      <el-card class="form-card" shadow="hover">
        <el-form :model="form" :rules="rules" ref="registerForm" label-width="100px">
          <el-form-item label="用户名" prop="Username">
            <el-input v-model="form.Username" placeholder="请输入用户名" clearable />
          </el-form-item>

          <el-form-item label="密码" prop="Password">
            <el-input v-model="form.Password" show-password placeholder="请输入密码" clearable />
          </el-form-item>

          <el-form-item label="手机号" prop="Phone">
            <el-input v-model="form.Phone" placeholder="请输入手机号" clearable />
          </el-form-item>

          <el-form-item label="角色" prop="RoleID">
            <el-select v-model="form.RoleID" placeholder="请选择角色" clearable>
              <el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role.id" />
            </el-select>
          </el-form-item>

          <el-form-item label="绑定员工" prop="EmployeeID">
            <el-select v-model="form.EmployeeID" placeholder="请选择员工（可选）" clearable>
              <el-option v-for="emp in employees" :key="emp.id" :label="emp.name" :value="emp.id" />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm">注册</el-button>
            <el-button @click="resetForm">重置</el-button>
            <el-button type="danger" @click="router.push('/login')">返回</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-main>
  </el-container>
</template>

<script setup>
import { registerUserAPI } from "@/apis/sign/registerUser";
import { ElMessage } from "element-plus";
import { ref } from "vue";
import { useRouter } from 'vue-router'

const router = useRouter()

const registerForm = ref(null);

// 注册表单数据
const form = ref({
  Username: "",
  Password: "",
  Phone: "",
  RoleID: null,
  EmployeeID: null,
});

// 表单验证规则
const rules = {
  Username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 3, message: "用户名至少3个字符", trigger: "blur" }
  ],
  Password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, message: "密码至少6位", trigger: "blur" }
  ],
  Phone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "手机号格式不正确",
      trigger: "blur"
    }
  ],
  RoleID: [
    { required: true, message: "请选择角色", trigger: "change" }
  ]
};

// 模拟角色与员工数据（建议后端接口返回）
const roles = ref([
  { id: 1, name: "管理员" },
  { id: 2, name: "采购员" },
  { id: 3, name: "销售员" }
]);

const employees = ref([
  { id: 1, name: "张三" },
  { id: 2, name: "李四" },
  { id: 3, name: "王五" }
]);

// 提交注册
const submitForm = () => {
  registerForm.value.validate(async (valid) => {
    if (valid) {
      try {
        const res = await registerUserAPI(form.value)
        if (res.success) {
          ElMessage.success("注册成功！");
          resetForm()
          router.push("/login")
        }
        else{
          ElMessage.warning(res.message)
        }
      } catch (error) {
        ElMessage.error("错误："+error)
      }
    } else {
      ElMessage.error("请检查表单填写！");
    }
  });
};

// 重置表单
const resetForm = () => {
  registerForm.value.resetFields();
};
</script>

<style scoped>
.register-container {
  display: flex;
  flex-direction: column;
  justify-content:center;
  align-items: center;
  height: 100vh;
  gap: 80px;
  background-image: url("../../assets/cool-background.svg");
  background-repeat: no-repeat;
  background-size: cover;
}

.register-title {
  margin-top: 100px;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
}

.form-card {
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

</style>
