// ai.js 一个简易的ai服务中间件，后续可接入更多的ai大模型

class AIService {
    constructor() {
        this.availableProviders = this.detectAvailableProviders();
        this.selectedProvider = this.selectProvider();
    }

    /**
     * 检测环境变量中可用的AI提供商
     */
    detectAvailableProviders() {
        const providers = [];

        // 检查DeepSeek配置
        if (process.env.DEEPSEEK_API_KEY) {
            providers.push({
                name: 'deepseek',
                apiKey: process.env.DEEPSEEK_API_KEY,
                model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
                baseUrl: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1'
            });
        }

        // 后续可新增更多大模型

        return providers;
    }

    /**
     * 根据优先级选择AI提供商
     */
    selectProvider() {
        if (this.availableProviders.length === 0) {
            throw new Error('没有可用大模型，请至少设置一个AI模型的环境变量。');
        }

        // 如果有明确指定的优先提供商，使用它
        if (process.env.PREFERRED_AI_PROVIDER) {
            const preferred = this.availableProviders.find(
                p => p.name === process.env.PREFERRED_AI_PROVIDER.toLowerCase()
            );
            if (preferred) return preferred;
        }

        // 默认返回第一个可用的提供商
        return this.availableProviders[0];
    }

    async getProviderModule(providerName) {
        // 动态导入供应商模块
        const module = await require(`../net/${providerName}.js`);
        return module;
    }

    /**
     * 调用AI服务获取回答
     * @param {string} question 用户问题
     * @param {object} options 可选参数
     * @returns {Promise<string>} AI回答
     */
    async getAnswer(question, options = {}) {
        if (!question || typeof question !== 'string') {
            throw new Error('问题必须为文本，暂不支持其他类型数据。');
        }

        try {
            const providerModule = await this.getProviderModule(this.selectedProvider.name);
            return await providerModule.callAPI({
                question,
                options,
                providerConfig: this.selectedProvider
            });
        } catch (error) {
            console.error(`调用${this.selectedProvider.name} API出错:`, error);
            throw error;
        }
    }

}

// 导出单例实例
module.exports = new AIService();