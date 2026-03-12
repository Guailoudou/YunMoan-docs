<template>
  <div class="mini-game-container">
    <!-- 搜索和筛选区域 -->
    <div class="filter-section">
      <div class="search-box">
        <input 
          v-model="searchName" 
          type="text" 
          placeholder="搜索实例名称..." 
          class="search-input"
        />
      </div>
      <div class="status-filter">
        <select v-model="selectedStatus" class="status-select">
          <option value="">全部状态</option>
          <option value="-1">忙碌</option>
          <option value="0">停止</option>
          <option value="1">停止中</option>
          <option value="2">启动中</option>
          <option value="3">运行中</option>
        </select>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>正在加载实例数据...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-message">
      <p>数据加载失败</p>
      <button @click="fetchData" class="refresh-btn">重试</button>
    </div>

    <!-- 空数据 -->
    <div v-else-if="filteredInstances.length === 0" class="empty-message">
      <p>暂无实例数据</p>
    </div>

    <!-- 按版本号分组的实例卡片 -->
    <div v-else class="groups-container">
      <div v-for="(groupInstances, version) in groupedInstances" :key="version" class="version-group">
        <h3 class="group-title">{{ version }} 版本</h3>
        <div class="instances-grid">
          <div 
            v-for="instance in groupInstances" 
            :key="instance.instanceUuid" 
            class="instance-card"
          >
            <!-- 卡片头部 -->
            <div class="card-header">
              <h3 class="instance-name">{{ getDisplayName(instance.config.nickname) }}</h3>
              <span :class="['status-badge', getStatusClass(instance.status)]">
                {{ getStatusText(instance.status) }}
              </span>
            </div>

            <!-- 实例信息 -->
            <div class="instance-info">
              <div class="info-item">
                <span class="label">运行时间:</span>
                <span class="value">{{ instance.started }} 分钟</span>
              </div>
              <div v-if="instance.config.tag && instance.config.tag.length > 0" class="info-item">
                <span class="label">标签:</span>
                <div class="tags">
                  <span v-for="tag in instance.config.tag.slice(0, 3)" :key="tag" class="tag">
                    {{ tag }}
                  </span>
                  <span v-if="instance.config.tag.length > 3" class="tag-more">
                    +{{ instance.config.tag.length - 3 }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 按钮区域 -->
            <div class="actions-section">
              <!-- 运行中实例的按钮 -->
              <template v-if="instance.status === 0">
                <div class="vote-buttons">
                  <button class="vote-btn running-btn">
                    <span class="btn-text">正版</span>
                    <span class="vote-count">({{ getVoteCount(instance.instanceUuid, 'official') }})</span>
                  </button>
                  <button class="vote-btn running-btn">
                    <span class="btn-text">离线</span>
                    <span class="vote-count">({{ getVoteCount(instance.instanceUuid, 'offline') }})</span>
                  </button>
                  <button class="vote-btn running-btn">
                    <span class="btn-text">MUA</span>
                    <span class="vote-count">({{ getVoteCount(instance.instanceUuid, 'mua') }})</span>
                  </button>
                </div>
              </template>

              <!-- 非运行中实例的按钮 -->
              <template v-else-if="instance.status == 3">
                <div class="vote-buttons">
                  <button class="vote-btn stopped-btn">
                    <span class="btn-text">强制重启</span>
                    <span class="vote-count">({{ getVoteCount(instance.instanceUuid, 'reset') }})</span>
                  </button>
                    <button class="vote-btn stopped-btn">
                    <span class="btn-text">强制关机</span>
                    <span class="vote-count">({{ getVoteCount(instance.instanceUuid, 'stop') }})</span>
                  </button>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MiniGameInstances',
  props: {
    apiUrl: {
      type: String,
      default: 'http://game.yezimoan.xyz:31046/get_minigames_remote_instances'
    }
  },
  data() {
    return {
      instances: [],
      allInstances: [], // 存储所有数据用于筛选
      loading: true,
      error: false,
      searchName: '',
      selectedStatus: '',
      // 模拟投票数据
      voteData: {}
    }
  },
  computed: {
    // 筛选后的实例
    filteredInstances() {
      let filtered = this.allInstances;
      
      // 按名称筛选
      if (this.searchName) {
        const searchLower = this.searchName.toLowerCase();
        filtered = filtered.filter(instance => 
          instance.config.nickname.toLowerCase().includes(searchLower)
        );
      }
      
      // 按状态筛选
      if (this.selectedStatus) {
        filtered = filtered.filter(instance => 
          instance.status.toString() === this.selectedStatus
        );
      }
      
      return filtered;
    },
    
    // 按版本号分组实例
    groupedInstances() {
      const groups = {};
      
      this.filteredInstances.forEach(instance => {
        const version = this.extractVersion(instance.config.nickname);
        if (!groups[version]) {
          groups[version] = [];
        }
        groups[version].push(instance);
      });
      
      return groups;
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      this.error = false;
      
      try {
        console.log('请求实例数据:', this.apiUrl);
        
        // 使用真实 API 请求（不传筛选参数）
        const response = await fetch(this.apiUrl);
        if (!response.ok) {
          throw new Error(`网络响应不正常: ${response.status}`);
        }
        const data = await response.json();
        
        if (data.status === 200) {
          this.allInstances = data.data.data || [];
          this.instances = [...this.allInstances]; // 初始显示所有数据
          console.log('实例数据加载成功:', this.allInstances);
        } else {
          throw new Error(`API 返回错误: ${data.status}`);
        }
        
      } catch (err) {
        console.error('获取实例数据失败:', err);
        this.error = true;
        this.allInstances = [];
        this.instances = [];
        
        // 如果是 CORS 错误，提供提示
        if (err.message.includes('Failed to fetch') || err.message.includes('CORS')) {
          console.warn('CORS 错误，请确保 API 服务器已启用 CORS');
        }
      } finally {
        this.loading = false;
      }
    },
    
    // 从实例名称中提取版本号
    extractVersion(nickname) {
      if (!nickname) return '未知版本';
      
      // 匹配类似 "1.12.2", "1.16.5", "1.18.2" 等版本号
      const versionMatch = nickname.match(/^(\d+\.\d+(?:\.\d+)?)/);
      return versionMatch ? versionMatch[1] : '未知版本';
    },
    
    // 获取显示名称（移除版本号）
    getDisplayName(nickname) {
      if (!nickname) return '未知实例';
      
      // 移除开头的版本号部分
      return nickname.replace(/^\d+\.\d+(?:\.\d+)?-/, '');
    },
    
    getStatusClass(status) {
      const statusMap = {
        '-1': 'status-busy',
        '0': 'status-stopped',
        '1': 'status-stopping',
        '2': 'status-starting',
        '3': 'status-running'
      };
      return statusMap[status] || 'status-unknown';
    },
    
    getStatusText(status) {
      const statusMap = {
        '-1': '忙碌',
        '0': '停止',
        '1': '停止中',
        '2': '启动中',
        '3': '运行中'
      };
      return statusMap[status] || '未知';
    },
    
    getVoteCount(instanceUuid, voteType) {
      const key = `${instanceUuid}_${voteType}`;
      return this.voteData[key] || 0;
    }
  }
}
</script>

<style scoped>
.mini-game-container {
  margin: 20px 0;
  width: 100%;
}

.filter-section {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  align-items: center;
}

.search-input, .status-select {
  padding: 10px 15px;
  border: 1px solid var(--card-border);
  border-radius: 8px;
  background: var(--card-bg);
  color: var(--text-primary);
  font-size: 1rem;
}

.search-input {
  flex: 1;
  max-width: 300px;
}

.status-select {
  min-width: 150px;
}

.groups-container {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.group-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--header-border);
}

.instances-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.instance-card {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 20px;
  border: var(--card-border);
  box-shadow: var(--card-shadow);
  transition: all 0.3s ease;
  min-height: 200px;
  display: flex;
  flex-direction: column;
}

.instance-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  gap: 10px;
  flex-shrink: 0;
}

.instance-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  flex: 1;
  word-break: break-word;
  overflow-wrap: break-word;
  line-height: 1.4;
  /* 确保长名称完整显示 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
}

.status-running {
  background: rgba(46, 204, 113, 0.2);
  color: #27ae60;
  border: 1px solid rgba(46, 204, 113, 0.3);
}

.status-stopped {
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
  border: 1px solid rgba(231, 76, 60, 0.3);
}

.status-stopping {
  background: rgba(241, 196, 15, 0.2);
  color: #f39c12;
  border: 1px solid rgba(241, 196, 15, 0.3);
}

.status-starting {
  background: rgba(52, 152, 219, 0.2);
  color: #3498db;
  border: 1px solid rgba(52, 152, 219, 0.3);
}

.status-busy {
  background: rgba(155, 89, 182, 0.2);
  color: #9b59b6;
  border: 1px solid rgba(155, 89, 182, 0.3);
}

.instance-info {
  margin-bottom: 15px;
  flex: 1;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
  font-size: 0.9rem;
}

.label {
  color: var(--text-secondary);
  font-weight: 500;
  flex-shrink: 0;
  margin-right: 10px;
}

.value {
  color: var(--text-primary);
  font-weight: 600;
  text-align: right;
  flex: 1;
}

.tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.tag {
  background: var(--border-light);
  color: var(--text-muted);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8rem;
  white-space: nowrap;
}

.tag-more {
  color: var(--text-muted);
  font-size: 0.8rem;
}

.actions-section {
  margin-top: auto;
  flex-shrink: 0;
}

.vote-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.vote-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.running-btn {
  background: rgba(46, 204, 113, 0.1);
  color: #27ae60;
  border: 1px solid rgba(46, 204, 113, 0.2);
}

.running-btn:hover {
  background: rgba(46, 204, 113, 0.2);
}

.stopped-btn {
  background: rgba(52, 152, 219, 0.1);
  color: #3498db;
  border: 1px solid rgba(52, 152, 219, 0.2);
}

.stopped-btn:hover {
  background: rgba(52, 152, 219, 0.2);
}

.btn-text {
  font-weight: 600;
}

.vote-count {
  font-size: 0.8rem;
  opacity: 0.8;
}

/* 加载和错误状态 */
.loading, .error-message, .empty-message {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-primary);
  font-size: 1.2rem;
  background: var(--card-bg);
  border-radius: 12px;
  border: var(--card-border);
}

.spinner {
  border: 4px solid rgba(102, 126, 234, 0.3);
  border-radius: 50%;
  border-top: 4px solid #667eea;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

.refresh-btn {
  background: var(--primary-gradient);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  margin-top: 15px;
  cursor: pointer;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .instances-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .instances-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
  
  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input {
    max-width: none;
  }
}

@media (max-width: 480px) {
  .instances-grid {
    grid-template-columns: 1fr;
  }
  
  .instance-card {
    padding: 15px;
  }
}
</style>