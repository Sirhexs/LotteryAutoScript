const assert = require('assert');
const ai = require('../lib/helper/ai');

(async () => {
    try {
        // 获取AI服务配置信息
        const aiService = ai;
        const config = aiService.selectedProvider;

        // 输出关键配置信息
        console.log('baseurl:', config.baseUrl);
        console.log('完整请求URL:', `${config.baseUrl}/chat/completions`);
        console.log('API key:', config.apiKey);
        console.log('model:', config.model);

        const systemPrompt = process.env.AI_SYSTEM_PROMPT || `充当一个参加动态抽奖的评论专家，如果动态中明确了需要进行@或者带上话题，你需确保评论满足要求，并且把评论控制在50字以内，不需要给我评论的说明，直接给我评论内容即可。`;
        console.log('prompt:', systemPrompt);
        console.log('-------------------');

        // 测试获取AI回答
        const description = `🍰iKF要迎来8岁生日啦~
💞感谢大家一路以来的陪伴与支持
🎁i总的第一波宠粉福利也已经赶来了！
——八周年限定周边礼包送送送！
👇每份礼包包含：
魔法碎片【主题冰箱贴】*1+星球补给包【主题编织袋】*1

⭐关注@iKF蓝牙耳机
⭐带#iKF蓝牙耳机8周年# 话题 点赞转发并评论八周年祝福
🎁6月10日评论区揪3位符合条件的宝子送出八周年限定周边礼包各1份~
🔥热知识：给置顶视频三连会提高中奖率哦~
⚠温馨提示：中奖者需在3天内提供地址，逾期系统视为自动放弃！

➕福利加码：
转发破3w+加抽1份周边礼包
转发破3.1w+再加抽1份周边礼包
#供电局福利社##互动抽奖##iKF蓝牙耳机##关注抽奖##宠粉福利##iKF蓝牙耳机8周年##流动新声永不停息##限定周边#`;
        const options = {
            systemPrompt: systemPrompt
        };

        const ai_answer = await ai.getAnswer(description, options);
        
        // 验证AI回答不为空且是字符串类型
        assert(ai_answer && typeof ai_answer === 'string', 'AI回答应该是非空字符串');

        console.log('ai_comment.test ... ok!');
        console.log('AI回答:', ai_answer);
    } catch (error) {
        console.error('测试失败:', error);
        process.exit(1);
    }
})(); 