from flask import Flask
import requests
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
# 基本配置
baseUrl = 'http://game.yezimoan.xyz:31042/api/'
api_key = '4172ab2de4aa4e06aa1a57cfa2214849'

# 获取远程节点仪表盘(未清洗)
def get_remote_services_info(api_key):
    url = f"{baseUrl}overview?apikey={api_key}"
    headers = {
        "Content-Type": "application/json; charset=utf-8",
        "X-Requested-With": "XMLHttpRequest"
    }
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()  
        return response.json()  
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return None
# 清洗JSON数据，移除cpuMemChart字段
# 原数据中存在仪表盘柱状图数据
def remove_cpu_mem_chart_from_json(json_data):
    def clean_data(data):
        if isinstance(data, dict):
            # 创建新字典，排除cpuMemChart字段
            cleaned = {}
            for key, value in data.items():
                if key != 'cpuMemChart' and key != 'chart':
                    cleaned[key] = clean_data(value)
            return cleaned
        elif isinstance(data, list):
            # 递归处理列表中的每个元素
            return [clean_data(item) for item in data]
        else:
            # 基本数据类型直接返回
            return data
    
    # 如果输入是JSON字符串，先解析
    if isinstance(json_data, str):
        data_dict = json.loads(json_data)
        cleaned_dict = clean_data(data_dict)
        return cleaned_dict
    else:
        # 如果已经是字典，直接处理
        return clean_data(json_data)

# 获取清除仪表盘数据远程服务信息
def get_cleaned_remote_services_info(api_key):
    raw_data = get_remote_services_info(api_key)
    if raw_data is not None:
        cleaned_data = remove_cpu_mem_chart_from_json(raw_data)
        return cleaned_data
    else:
        return None

# 获取文档使用的节点信息列表
@app.route('/get_docs_remote_services_info', methods=['GET'])
def get_docs_remote_services_info():
    nodes = []
    response_data = get_remote_services_info(api_key)
    if response_data is None:
        return nodes
    for remote in response_data.get("data", {}).get("remote", []):
        # 节点名称处理
        name = remote.get("remarks", "未知节点").split("|")[0]
        
        # 实例信息
        instance_info = remote.get("instance", {})
        
        # 系统信息
        sys_info = remote.get("system", {})
        total_mem_gb = round(sys_info.get("totalmem", 0) / (1024**3), 2)
        
        # 最新性能数据
        chart_data = remote.get("cpuMemChart", [{}])[-1]
        
        nodes.append({
            "name": name,
            "mem_usage": chart_data.get("mem", 0),
            "total_mem": total_mem_gb,
            "cpu_usage": chart_data.get("cpu", 0),
            "running_instances": instance_info.get("running", 0),
            "total_instances": instance_info.get("total", 0)
        })
    
    return nodes
def get_remote_instances(api_key):
    url = f"{baseUrl}service/remote_service_instances?apikey={api_key}"
    param ={
        "daemonId": 'c39c0904e04d4d13a8e86fd3edfe0eae',
        "page": 1,
        "page_size": 1000,
        "instance_name": None,
        "status": None
    }
    headers = {
        "Content-Type": "application/json; charset=utf-8",
        "X-Requested-With": "XMLHttpRequest"
    }
    try:
        response = requests.get(url,params=param, headers=headers)
        response.raise_for_status()  
        return response.json()  
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return None
# 文档：获取小游戏节点所有实例
@app.route('/get_minigames_remote_instances', methods=['GET'])
def get_docs_minigames_remote_instances():
    return get_remote_instances(api_key)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=25570, debug=False)

    