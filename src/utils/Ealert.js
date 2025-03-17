/*
 * @Description:
 * @Author: Zane Xu
 * @Date: 2025-01-24 12:36:07
 * @LastEditTime: 2025-03-14 15:13:26
 * @LastEditors: Zane Xu
 */

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
export function showNotification(type,message){
  if (type === 'success') {
    ElNotification({
      title: 'Success',
      message: message,
      type: 'success',
    }) // 显示成功提示
  } else if (type === 'error') {
    ElNotification({
      title: 'Error',
      message: message,
      type: 'error',
    }) // 显示错误提示
  } else if (type === 'warning') {
    ElNotification({
      title: 'Warning',
      message: message,
      type: 'warning',
    }) // 显示警告提示
  } else {
    ElNotification({
      title: 'Info',
      message: message,
      type: 'info',
    }) // 默认信息提示
  }
}
