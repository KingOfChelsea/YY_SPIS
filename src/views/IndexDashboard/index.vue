<template>
  <el-container class="dashboard-container">
    <el-header>
      <h2 class="dashboard-title">📊 仪表盘 - 业务概览</h2>
    </el-header>

    <el-main>
      <!-- 顶部四个统计卡片 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <h3>📦 总订单数</h3>
            <p class="stat-value">{{ dashboardData.totalOrders }}</p>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <h3>💰 总销售额</h3>
            <p class="stat-value">¥ {{ dashboardData.totalRevenue }}</p>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <h3>👤 注册用户</h3>
            <p class="stat-value">{{ dashboardData.totalUsers }}</p>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stat-card">
            <h3>📦 库存总量</h3>
            <p class="stat-value">{{ dashboardData.totalStock }}</p>
          </el-card>
        </el-col>
      </el-row>

      <!-- 中部：进度条展示 & 图表 -->
      <el-row :gutter="20" class="chart-section">
        <!-- 进度条 -->
        <el-col :span="8">
          <el-card shadow="hover" class="progress-card">
            <h3>🚀 任务完成情况</h3>
            <el-progress :percentage="dashboardData.taskCompletion" color="green" />
            <p class="progress-text">{{ dashboardData.taskCompletion }}% 完成</p>
          </el-card>
        </el-col>

        <!-- 折线图 -->
        <el-col :span="8">
          <el-card shadow="hover" class="chart-card">
            <h3>📈 每月销售趋势</h3>
            <div ref="lineChart" class="chart"></div>
          </el-card>
        </el-col>

        <!-- 饼状图 -->
        <el-col :span="8">
          <el-card shadow="hover" class="chart-card">
            <h3>🛍️ 产品销售占比</h3>
            <div ref="pieChart" class="chart"></div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

---

### **🔹 JavaScript 逻辑**
```vue
<script setup>
import { ref, onMounted } from "vue";
import * as echarts from "echarts"; // 使用 ECharts

// ** 仪表盘数据（模拟） **
const dashboardData = ref({
  totalOrders: 1520,
  totalRevenue: 258000,
  totalUsers: 845,
  totalStock: 12560,
  taskCompletion: 75, // 任务完成度（百分比）
});

// ** ECharts 图表容器 **
const lineChart = ref(null);
const pieChart = ref(null);

// ** 渲染折线图（销售趋势） **
const renderLineChart = () => {
  const chart = echarts.init(lineChart.value);
  chart.setOption({
    title: { text: "每月销售额", left: "center" },
    xAxis: { type: "category", data: ["1月", "2月", "3月", "4月", "5月", "6月"] },
    yAxis: { type: "value" },
    series: [{ data: [820, 932, 901, 934, 1290, 1330], type: "line", smooth: true }],
  });
};

// ** 渲染饼状图（产品占比） **
const renderPieChart = () => {
  const chart = echarts.init(pieChart.value);
  chart.setOption({
    title: { text: "产品销售占比", left: "center" },
    legend: { bottom: 0 },
    series: [
      {
        name: "产品占比",
        type: "pie",
        radius: "50%",
        data: [
          { value: 335, name: "白酒" },
          { value: 310, name: "啤酒" },
          { value: 234, name: "葡萄酒" },
          { value: 135, name: "饮料" },
          { value: 548, name: "其他" },
        ],
      },
    ],
  });
};

// ** 页面加载时渲染图表 **
onMounted(() => {
  setTimeout(() => {
    renderLineChart();
    renderPieChart();
  }, 500);
});
</script>
<style scoped>
/* 仪表盘整体布局 */
.dashboard-container {
  padding: 20px;
}

/* 标题 */
.dashboard-title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

/* 统计卡片 */
.stat-card {
  text-align: center;
  padding: 20px;
}
.stat-card h3 {
  font-size: 16px;
  color: #666;
}
.stat-card .stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #409eff;
  margin-top: 5px;
}

/* 进度条卡片 */
.progress-card {
  text-align: center;
  padding: 20px;
}
.progress-text {
  font-size: 16px;
  color: #666;
  margin-top: 10px;
}

/* 图表卡片 */
.chart-card {
  padding: 10px;
}
.chart {
  width: 100%;
  height: 200px;
}

/* 适配小屏幕 */
@media (max-width: 768px) {
  .chart-section {
    flex-direction: column;
  }
}
</style>
