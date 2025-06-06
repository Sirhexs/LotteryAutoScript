# AutoScript

- [AutoScript](#autoscript)
  - [操作步骤](#操作步骤)
    - [获取COOKIE](#获取cookie)
      - [扫码登陆](#扫码登陆)
      - [AutMan插件获取](#autman插件获取)
    - [青龙面板使用](#青龙面板使用)
      - [脚本的安装与更新](#脚本的安装与更新)
      - [评论AI的接入](#评论ai的接入)

[原版Github仓库链接](https://github.com/shanmiteko/LotteryAutoScript)


原版已实现功能:

- 监控用户转发
- 监控话题页面
- 监控专栏合集
- 自动点赞、评论、乱序转发、@好友、带话题、可选随机动态
- 直播预约抽奖
- 检测是否中奖
  - 已读@
  - 已读私信
- 清理动态关注
- 检查更新
- 更多功能设置请参考配置文件

新增功能:

- 增加项目在青龙面板更高的可玩性
- 适配[RayWangQvQ_BiliBiliToolPro](https://github.com/RayWangQvQ/BiliBiliToolPro)项目的Cookie 
- AI智能评论（支持所有OpenAI兼容API格式的智能评论生成，包括OpenAI、DeepSeek等）

**声明**: 此脚本仅用于学习和测试，作者本人并不对其负责，请于运行测试完成后自行删除，请勿滥用！

---------------------------------

## 操作步骤

**使用前务必阅读此教程和配置文件内注释**

右上角<kbd>★ Star</kbd>

↓↓

### 获取COOKIE

#### 扫码登陆

~~在`env.js`文件填`COOKIE`的对应位置写入`"DedeUserID=你的UID"`即可使用`lottery login`扫码自动获取Cookie~~

~~`COOKIE`中包含`DedeUserID=你的UID`的都会被自动替换~~
env.js已被替换为自动从青龙面板环境变量中获取Ray_BiliBiliCookies__X变量，所以需使用[RayWangQvQ_BiliBiliToolPro](https://github.com/RayWangQvQ/BiliBiliToolPro)项目的变量获取方式进行获取

#### AutMan插件获取
订阅我的AutMan市场 `sirhexs` 安装 `bilibili登录` 插件

----------------------------------------

### 青龙面板使用

#### 脚本的安装与更新
1. 脚本初始化

复制脚本内容[qinglong](script/qinglong/init.sh)

![ql0](doc/pic/ql0.gif)

2. 新建任务

![ql1](doc/pic/ql1.png)

![ql2](doc/pic/ql2.png)

3. 脚本更新即再次运行初始化脚本

#### 评论AI的接入
相关环境变量说明：

支持所有OpenAI兼容的API格式，包括OpenAI、DeepSeek、通义千问、智谱AI等。

**推荐使用新的OpenAI格式环境变量：**

|        变量名        |           说明           |                                                                                描述                                                                                 |
| :----------------: | :----------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| `OPENAI_API_KEY`   |     OpenAI兼容API密钥    | OpenAI兼容API的访问密钥，用于AI评论功能                                                                                                                              |
| `OPENAI_BASE_URL`  |     OpenAI兼容API地址    | OpenAI兼容API的基础URL地址，如：https://api.openai.com/v1、https://api.deepseek.com/v1 等                                                                         |
| `OPENAI_MODEL`     |    AI模型名称           | 使用的AI模型名称，如：gpt-3.5-turbo、deepseek-chat、qwen-turbo 等                                                                                                  |
| `IS_AI_CHAT`       |     是否启用AI评论        | 是否启用AI智能评论功能，true/false                                                                                                                                  |
| `AI_SYSTEM_PROMPT` |      AI系统提示词        | 自定义AI评论的系统提示词，用于指导AI生成更符合预期的评论内容                                                                                                          |

**向后兼容的DeepSeek格式环境变量（仍然支持）：**

|        变量名        |           说明           |                                                                                描述                                                                                 |
| :----------------: | :----------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| `DEEPSEEK_API_KEY` |     DeepSeek API密钥     | DeepSeek API的访问密钥，用于AI评论功能（向后兼容）                                                                                                                    |
| `DEEPSEEK_BASE_URL`|     DeepSeek API地址    | DeepSeek API的基础URL地址，默认为官方API地址（向后兼容）                                                                                                             |
| `DEEPSEEK_MODEL`   |    DeepSeek 模型名称     | 使用的DeepSeek模型名称，如DeepSeek-R1（向后兼容）                                                                                                                   |

**配置示例：**

使用DeepSeek：
```bash
OPENAI_API_KEY=sk-xxx
OPENAI_BASE_URL=https://api.deepseek.com/v1
OPENAI_MODEL=deepseek-chat
```

使用OpenAI：
```bash
OPENAI_API_KEY=sk-xxx
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-3.5-turbo
```

使用其他OpenAI兼容服务：
```bash
OPENAI_API_KEY=your-api-key
OPENAI_BASE_URL=https://your-api-endpoint/v1
OPENAI_MODEL=your-model-name
```


AI评论测试定时任务，设置好相关变量，运行以下定时即可查看ai生成效果
```bash
task LotteryAutoScript/test/ai_comment.test.js   # AI评论功能测试
```

----------------------------------------

