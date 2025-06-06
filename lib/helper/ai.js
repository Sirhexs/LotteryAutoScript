// ai.js 一个简易的ai服务中间件，支持所有OpenAI兼容的API格式

class AIService {
    constructor() {
        this.availableProviders = this.detectAvailableProviders();
        this.selectedProvider = this.selectProvider();
    }

    /**
     * 规范化baseUrl，进行防呆处理
     * @param {string} baseUrl 原始baseUrl
     * @returns {string} 规范化后的baseUrl
     */
    normalizeBaseUrl(baseUrl) {
        if (!baseUrl || typeof baseUrl !== 'string') {
            throw new Error('baseUrl不能为空且必须是字符串');
        }

        // 去除首尾空格
        baseUrl = baseUrl.trim();

        // 如果没有协议，默认添加https://
        if (!/^https?:\/\//i.test(baseUrl)) {
            baseUrl = 'https://' + baseUrl;
        }

        // 验证URL格式
        try {
            const url = new URL(baseUrl);
            // 确保协议是http或https
            if (!['http:', 'https:'].includes(url.protocol)) {
                throw new Error('baseUrl协议必须是http或https');
            }
        } catch (error) {
            throw new Error(`无效的baseUrl格式: ${baseUrl}, 错误: ${error.message}`);
        }

        // 移除末尾的斜杠，确保统一格式
        baseUrl = baseUrl.replace(/\/+$/, '');

        // 如果URL不以/v1结尾，自动添加
        if (!baseUrl.endsWith('/v1')) {
            baseUrl += '/v1';
        }

        return baseUrl;
    }

    /**
     * 检测环境变量中可用的AI提供商
     */
    detectAvailableProviders() {
        const providers = [];

        // 检查OpenAI兼容API配置（优先使用新格式）
        if (process.env.OPENAI_API_KEY || process.env.DEEPSEEK_API_KEY) {
            const rawBaseUrl = process.env.OPENAI_BASE_URL || process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1';

            try {
                const normalizedBaseUrl = this.normalizeBaseUrl(rawBaseUrl);
                providers.push({
                    name: 'deepseek',
                    apiKey: process.env.OPENAI_API_KEY || process.env.DEEPSEEK_API_KEY,
                    model: process.env.OPENAI_MODEL || process.env.DEEPSEEK_MODEL || 'deepseek-chat',
                    baseUrl: normalizedBaseUrl
                });
            } catch (error) {
                console.error(`baseUrl配置错误: ${error.message}`);
                throw new Error(`AI服务配置错误: ${error.message}`);
            }
        }

        // 后续可新增更多大模型

        return providers;
    }

    /**
     * 根据优先级选择AI提供商
     */
    selectProvider() {
        if (this.availableProviders.length === 0) {
            throw new Error('没有可用大模型，请至少设置一个AI模型的环境变量。支持的环境变量：OPENAI_API_KEY 或 DEEPSEEK_API_KEY');
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