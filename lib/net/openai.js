// openai.js - OpenAI兼容API实现，支持所有使用OpenAI格式的AI服务
const { send } = require('./http');

/**
 * 延时函数
 * @param {number} time ms
 * @returns {Promise<void>}
 */
function delay(time) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

/**
 * OpenAI兼容API供应商实现
 * 支持OpenAI、DeepSeek、以及其他使用OpenAI兼容格式的AI服务
 * @param {object} params
 * @param {string} params.question 用户问题
 * @param {object} params.options 调用选项
 * @param {object} params.providerConfig 供应商配置
 * @returns {Promise<string>} AI回答
 */
async function callAPI({ question, options, providerConfig }) {
  // AI评论专用配置
  const AI_TIMEOUT = 90000; // 90秒超时，适应需要长时间思考的AI模型
  const MAX_RETRIES = 3; // 最大重试次数
  const BASE_DELAY = 2000; // 基础延迟2秒

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await new Promise((resolve, reject) => {
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
            timeout: AI_TIMEOUT, // 90秒超时
            retry: false, // 禁用HTTP层重试，使用自定义重试逻辑
            wait: 1000,
            retry_times: 0 // 禁用HTTP层重试次数
          },
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${providerConfig.apiKey}`
          },
          success: res => {
            try {
              const data = JSON.parse(res.body);
              if (data.choices && data.choices[0]?.message?.content) {
                resolve(data.choices[0].message.content);
              } else {
                reject(new Error('AI服务API返回了无效响应'));
              }
            } catch (e) {
              reject(new Error('解析AI服务API响应失败: ' + e.message));
            }
          },
          failure: err => {
            reject(new Error('AI服务API请求失败: ' + err));
          }
        });
      });

      // 请求成功，返回结果
      return result;

    } catch (error) {
      console.error(`AI请求第${attempt}次尝试失败:`, error.message);

      // 如果是最后一次尝试，抛出错误
      if (attempt === MAX_RETRIES) {
        throw new Error(`AI服务请求失败，已重试${MAX_RETRIES}次: ${error.message}`);
      }

      // 计算递增延迟时间
      const delayTime = BASE_DELAY * attempt;
      console.log(`等待${delayTime}ms后进行第${attempt + 1}次重试...`);
      await delay(delayTime);
    }
  }
}

module.exports = { callAPI };
