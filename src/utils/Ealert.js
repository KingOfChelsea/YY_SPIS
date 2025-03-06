import { ElMessage } from 'element-plus';2

export function showMessage(type, message) {
  if (type === 'success') {
    ElMessage.success(message); // 显示成功提示
  } else if (type === 'error') {
    ElMessage.error(message); // 显示错误提示
  } else if (type === 'warning') {
    ElMessage.warning(message); // 显示警告提示
  } else {
    ElMessage.info(message); // 默认信息提示
  }
}
