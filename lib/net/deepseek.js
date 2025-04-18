// deepseek-api.js
const { send } = require('./http');

/**
 * DeepSeek AI供应商实现
 * @param {object} params
 * @param {string} params.question 用户问题
 * @param {object} params.options 调用选项
 * @param {object} params.providerConfig 供应商配置
 * @returns {Promise<string>} AI回答
 */
function callAPI({ question, options, providerConfig }) {
    console.log(question)
    console.log(providerConfig)
    return new Promise((resolve) => {
        console.log(`${providerConfig.baseUrl}/chat/completions`)
        send({
            method: 'POST',
            url: `${providerConfig.baseUrl}/chat/completions`,
            contents: {
                model: providerConfig.model,
                messages: [
                    {
                        role: 'system',
                        content: options.systemPrompt || '你是一个乐于助人的AI助手，用中文回答用户问题。'
                    },
                    {
                        role: 'user',
                        content: question
                    }
                ],
                temperature: options.temperature || 0.7,
                max_tokens: options.maxTokens || 2048,
                stream: false
            },
            config: {
                retry: options.retry || false
            },
            headers: {
                // accept: 'application/json, text/plain, */*',
                'content-type': 'application/json',
                'Authorization': `Bearer ${providerConfig.apiKey}`
            },
            success: res => {
                try {
                    const data = JSON.parse(res.body);
                    if (data.choices && data.choices[0]?.message?.content) {
                        resolve(data.choices[0].message.content);
                    } else {
                        resolve(new Error('DeepSeek API返回了无效响应'));
                    }
                } catch (e) {
                    resolve(new Error('解析DeepSeek响应失败: ' + e.message));
                }
            },
            failure: err => {
                resolve(new Error('DeepSeek API请求失败: ' + err));
            }
        });
    });
}

module.exports = { callAPI };