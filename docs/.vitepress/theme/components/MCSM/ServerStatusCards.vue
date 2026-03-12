<template>
  <div class="server-status-container">
    <button v-if="!autoRefresh" @click="fetchData" class="refresh-btn">
      {{ loading ? '加载中...' : '刷新数据' }}
    </button>
    
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>正在加载服务器数据...</p>
    </div>
    
    <div v-else-if="error" class="maintenance-message">
      <p>当前系统正在维护</p>
      <button @click="fetchData" class="refresh-btn">重试</button>
    </div>
    
    <div v-else-if="servers.length === 0" class="maintenance-message">
      <p>当前系统正在维护</p>
      <button @click="fetchData" class="refresh-btn">重试</button>
    </div>
    
    <div v-else class="cards-container">
      <div v-for="server in servers" :key="server.uuid" class="card">
        <!-- 第一行：名字和总内存 -->
        <div class="card-header">
          <h3 class="server-name">{{ server.name }}<div class="server-info">{{ server.total_mem }} GB</div></h3>
        </div>
        
        <!-- 第二行：内存使用率 -->
        <div class="memory-row">
          <div class="memory-info">
            <span class="memory-label">内存使用率</span>
            <span class="memory-value">{{ server.mem_usage }}%</span>
          </div>
          <div class="memory-progress">
            <div class="memory-progress-bar" :style="{ width: server.mem_usage + '%' }"></div>
          </div>
        </div>
        
        <!-- 第三行：CPU使用率 -->
        <div class="cpu-row">
          <div class="cpu-info">
            <span class="cpu-label">CPU使用率</span>
            <span class="cpu-value">{{ server.cpu_usage }}%</span>
          </div>
          <div class="cpu-progress">
            <div class="cpu-progress-bar" :style="{ width: server.cpu_usage + '%' }"></div>
          </div>
        </div>
        
        <!-- 第四行：运行中和总计 -->
        <div class="instances">
          <div class="instance-count">
            <div class="count-value running">{{ server.running_instances }}</div>
            <div class="count-label">运行中</div>
          </div>
          <div class="instance-count">
            <div class="count-value total">{{ server.total_instances }}</div>
            <div class="count-label">总计</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ServerStatusCards',
  props: {
    apiUrl: {
      type: String,
      required: true
    },
    autoRefresh: {
      type: Boolean,
      default: false
    },
    refreshInterval: {
      type: Number,
      default: 30000
    }
  },
  data() {
    return {
      servers: [],  // 确保这里有 servers 数组
      loading: true,
      error: false,
      refreshTimer: null
    }
  },
  mounted() {
    console.log('服务器状态组件已加载，API:', this.apiUrl);
    this.fetchData();
    
    if (this.autoRefresh) {
      this.refreshTimer = setInterval(() => {
        this.fetchData();
      }, this.refreshInterval);
    }
  },
  beforeUnmount() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
  },
  methods: {
    async fetchData() {
      this.loading = true;
      this.error = false;
      
      try {
        console.log('正在获取服务器数据...');
        // 使用模拟数据避免 CORS 问题
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 如果需要真实数据，取消注释下面的代码
        
        const response = await fetch(this.apiUrl);
        if (!response.ok) {
          throw new Error('网络响应不正常');
        }
        const data = await response.json();
        this.servers = data;
        console.log('真实数据加载成功:', data);
        
        
      } catch (err) {
        console.error('获取服务器数据失败:', err);
        this.error = true;
        this.servers = [];
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
/* 确保样式文件已正确引入 */
</style>