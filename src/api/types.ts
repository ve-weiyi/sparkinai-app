// Agent 生成图片项
export interface AgentImageItem {
  url: string; // 图片URL
}

// Agent 执行请求
export interface AgentRunReq {
  agent_type: string; // analysis | copy | image_set
  variables?: Record<string, any>; // 动态参数
}

// Agent 执行响应
export interface AgentRunResp {
  agent_type: string; // 回显 agent 类型
  agent_name: string; // 展示名称
  content: string; // analysis/copy 返回文本
  images: AgentImageItem[]; // image_set 返回图片列表
}

// 可用引擎项
export interface AvailableEngineItem {
  id: number; // 引擎ID
  name: string; // 引擎名称
  engine_type: string; // 引擎类型
  model_name: string; // 模型名称
  provider_name: string; // 供应商名称
  description: string; // 引擎描述
  is_default: boolean; // 是否为默认引擎
}

// 余额变动记录项
export interface BalanceLogItem {
  id: number; // 记录ID
  transaction_no: string; // 流水号
  change_type: string; // 变动类型
  change_amount: number; // 变动金额
  balance_before: number; // 变动前余额
  balance_after: number; // 变动后余额
  order_no: string; // 关联订单号
  description: string; // 变动描述
  created_at: number; // 创建时间
}

// Chat 响应选项
export interface ChatChoice {
  index: number; // 选项索引
  message: ChatMessage; // 消息内容
  finish_reason: string; // 结束原因
}

// Chat 请求（对应 OpenAI Chat Completions）
export interface ChatCompletionReq {
  engine_id: number; // 引擎ID（必填，后端从engine获取模型参数和提示词模板）
  variables?: Record<string, any>; // 动态变量（用于模板替换）
}

// Chat 响应（对应 OpenAI Chat Completions）
export interface ChatCompletionResp {
  id: string; // 请求ID
  object: string; // 对象类型
  created: number; // 创建时间戳
  model: string; // 使用的模型
  choices: ChatChoice[]; // 生成的选项列表
  usage: ChatUsage; // token使用统计
}

// ==================== 通用 Chat 接口（对应 OpenAI Chat Completions API）====================
export interface ChatMessage {
  role: string; // 角色：system/user/assistant
  content: string; // 消息内容
}

// Chat 消息请求
export interface ChatMessageReq {
  messages: MultimodalMessage[]; // 对话消息列表
}

// Chat 使用统计
export interface ChatUsage {
  prompt_tokens: number; // 提示词token数
  completion_tokens: number; // 完成token数
  total_tokens: number; // 总token数
}

// 多模态消息内容块
export interface ContentPart {
  type: string; // text | image_url
  text: string; // 文字内容
  url: string; // 图片URL
}

// 创建支付订单请求
export interface CreatePaymentOrderReq {
  package_id: number; // 套餐ID
  channel_code: string; // 支付渠道：alipay wechat
  return_url?: string; // 同步返回URL
}

// 创建支付订单响应
export interface CreatePaymentOrderResp {
  order_no: string; // 订单号
  amount: number; // 订单金额
  expire_time: number; // 过期时间（时间戳）
  pay_data: Record<string, any>; // 支付数据
}

// 停用账号请求（进入冷静期）
export interface DeactivateAccountReq {
  password: string; // 确认密码
  reason: string; // 停用原因
}

export interface DeactivateAccountResp {
  cooling_period_days: number; // 冷静期天数
  can_reactivate_until: number; // 可恢复截止时间（时间戳，毫秒）
}

// 删除生成记录请求
export interface DeleteGenerationReq {
  id: string; // 生成记录ID
}

// 删除生成记录响应
export interface DeleteGenerationResp {
  success: boolean; // 是否删除成功
  message: string; // 提示信息
}

// 邮箱验证码登录（仅登录，未注册报错）
export interface EmailCodeLoginReq {
  email: string; // 邮箱
  verify_code: string; // 验证码
}

export interface EmptyReq {
}

export interface EmptyResp {
}

export interface FileInfoVO {
  file_path: string; // 文件路径
  file_name: string; // 文件名称
  file_type: string; // 文件类型
  file_size: number; // 文件大小
  file_url: string; // 上传路径
  updated_at: number; // 更新时间
}

// 生成记录项
export interface GenerationItem {
  id: number; // 自增主键
  generation_id: string; // 生成记录UUID
  generation_name: string; // 生成任务名称
  generation_type: string; // 生成类型
  variables: string; // 输入参数
  result: string; // 生成结果
  status: number; // 生成状态
  error_message: string; // 错误信息
  input_tokens: number; // 输入token数量
  output_tokens: number; // 输出token数量
  cost_tokens: number; // 消耗的token总数
  cost_charge: number; // AI调用费用
  cost_time: number; // 生成耗时（秒）
  created_at: number; // 创建时间
}

// ==================== 引擎配置相关 ====================
export interface GetAvailableEnginesReq {
  engine_type?: string; // 引擎类型筛选
}

// 获取可用引擎列表响应
export interface GetAvailableEnginesResp {
  list: AvailableEngineItem[]; // 引擎列表
}

export interface GetCaptchaCodeReq {
  width?: number; // 宽度
  height?: number; // 高度
}

export interface GetCaptchaCodeResp {
  captcha_key: string; // 验证码key
  captcha_base64: string; // 验证码base64
  captcha_code: string; // 验证码
}

export interface GetClientInfoReq {
}

export interface GetClientInfoResp {
  id: number; // 访客唯一ID
  terminal_id: string; // 终端ID
  os: string; // 操作系统
  browser: string; // 浏览器
  ip_address: string; // IP地址
  ip_source: string; // IP归属地
}

// 获取生成记录详情请求
export interface GetGenerationReq {
  id: string; // 生成记录ID
}

// 获取生成记录详情响应
export interface GetGenerationResp extends GenerationItem {
}

// ==================== 生成记录相关 ====================
export interface GetGenerationsReq extends PageQuery {
  status?: number; // 生成状态筛选
}

// 获取生成记录列表响应
export interface GetGenerationsResp {
  page: number; // 当前页码
  page_size: number; // 每页数量
  total: number; // 总记录数
  list: GenerationItem[]; // 记录列表
}

// 第三方登录授权URL
export interface GetOauthAuthorizeUrlReq {
  platform: string; // 平台
  state?: string; // 状态
}

export interface GetOauthAuthorizeUrlResp {
  authorize_url: string; // 授权地址
}

// 获取支付订单列表请求
export interface GetPaymentOrderListReq extends PageQuery {
  status?: number; // 订单状态筛选
  channel_code?: string; // 支付渠道筛选
}

// 获取支付订单列表响应
export interface GetPaymentOrderListResp {
  page: number;
  page_size: number;
  total: number;
  list: PaymentOrderDetail[];
}

// 查询支付订单请求
export interface GetPaymentOrderReq {
  orderNo: string; // 订单号
}

// 查询支付订单响应
export interface GetPaymentOrderResp extends PaymentOrderDetail {
}

// 获取充值套餐列表请求
export interface GetRechargePackagesReq {
}

// 获取充值套餐列表响应
export interface GetRechargePackagesResp {
  list: RechargePackageItem[];
}

// 获取上传凭证请求
export interface GetUploadTokenReq {
  file_name: string; // 文件名称
  file_path?: string; // 文件路径
  expire_seconds?: number; // 凭证有效期（秒），默认1小时
}

// 获取上传凭证响应（完整的UploadToken结构）
export interface GetUploadTokenResp {
  upload_url: string; // 上传地址
  token: string; // 上传凭证/Token
  policy: string; // 上传策略
  signature: string; // 签名
  file_key: string; // 文件Key/路径
  access_url: string; // 上传成功后的访问URL
  expire_at: number; // 凭证过期时间戳（秒）
  extra_data: Record<string, any>; // 额外数据
}

// 获取用户账户信息请求
export interface GetUserAccountReq {
}

// 获取用户账户信息响应
export interface GetUserAccountResp extends UserAccountInfo {
}

// 获取用户余额变动记录请求
export interface GetUserBalanceLogsReq extends PageQuery {
  change_type?: string; // 变动类型筛选
}

// 获取用户余额变动记录响应
export interface GetUserBalanceLogsResp {
  page: number; // 当前页码
  page_size: number; // 每页数量
  total: number; // 总记录数
  list: BalanceLogItem[]; // 记录列表
}

// 获取当前用户信息请求
export interface GetUserProfileReq {
}

// 获取当前用户信息响应
export interface GetUserProfileResp {
  user_id: string; // 用户ID（UUID）
  username: string; // 用户名
  nickname: string; // 昵称
  avatar: string; // 头像URL
  email: string; // 邮箱
  phone: string; // 手机号
  status: number; // 账号状态
  plan: string; // 会员计划
  balance: number; // 余额
  coin: number; // 账户积分
  created_at: number; // 注册时间
}

export interface IdReq {
  id: number;
}

export interface IdsReq {
  ids: number[];
}

// 图片数据
export interface ImageData {
  url: string; // 图片URL
  b64_json: string; // Base64编码的图片
  revised_prompt: string; // 修订后的提示词
}

// ==================== 通用 Images 接口（对应 OpenAI Images API）====================
export interface ImageGenerationReq {
  engine_id: number; // 引擎ID（必填，后端从engine获取模型参数）
  variables?: Record<string, any>; // 动态变量（用于模板替换）
}

// 图片生成响应（对应 OpenAI Images Generation）
export interface ImageGenerationResp {
  created: number; // 创建时间戳
  data: ImageData[]; // 生成的图片列表
}

// 登录响应
export interface LoginResp {
  user_id: string; // 用户id
  user_type: string; // 用户类型：user-普通用户 app-管理员
  scope: string; // 作用域
  token: Token;
}

// 多模态消息
export interface MultimodalMessage {
  role: string; // user | assistant | system
  content: ContentPart[]; // 消息内容块列表
}

// 第三方登录（前端携带code）
export interface OauthLoginReq {
  platform: string; // 平台
  code: string; // 授权码
  state?: string; // 状态
}

export interface PageQuery {
  page?: number; // 当前页码
  page_size?: number; // 每页数量
  sorts?: string[]; // 排序
}

export interface PageResult {
  page: number;
  page_size: number;
  total: number;
  list: any;
}

// 密码登录（账号/手机号/邮箱 + 密码）
export interface PasswordLoginReq {
  account: string; // 账号/手机号/邮箱
  password: string; // 密码
  captcha_key?: string; // 图形验证码key
  captcha_code?: string; // 图形验证码
}

// 统一支付回调请求
export interface PaymentNotifyReq {
  platform: string; // 支付平台：alipay wechat
}

// 支付订单详情
export interface PaymentOrderDetail {
  order_no: string;
  user_id: string;
  package_id: number;
  package_name: string;
  package_credits: number;
  channel_code: string;
  pay_amount: number; // 支付金额（分）
  status: number; // 1-待支付 2-已支付 3-已取消 4-已退款
  status_text: string;
  channel_order_no: string;
  pay_time: number;
  expire_time: number;
  created_at: number;
  updated_at: number;
}

// 手机验证码登录（自动注册）
export interface PhoneCodeLoginReq {
  phone: string; // 手机号
  verify_code: string; // 验证码
}

export interface PingReq {
}

export interface PingResp {
  env: string;
  name: string;
  version: string;
  runtime: string;
  description: string;
}

// 恢复账号请求（冷静期内）
export interface ReactivateAccountReq {
  email?: string; // 邮箱
  phone?: string; // 手机号
  verification_code: string; // 验证码（可选）
}

export interface ReactivateAccountResp {
  success: boolean; // 是否恢复成功
}

// 充值套餐项
export interface RechargePackageItem {
  id: number;
  package_name: string;
  credits: number; // 套餐积分
  amount: number; // 套餐金额（元）
  original_amount: number; // 原价（元）
  description: string;
  features: string[]; // 套餐特性列表
  is_hot: boolean;
}

export interface RefreshTokenReq {
  user_id: string; // 用户id
  grant_type: string; // 授权类型
  refresh_token: string; // 刷新令牌
}

// 邮箱注册（必须设密码）
export interface RegisterReq {
  email: string; // 邮箱
  password: string; // 密码
  confirm_password?: string; // 确认密码
  verify_code: string; // 验证码
  username?: string; // 用户名
  nickname?: string; // 昵称
}

// 重置密码请求（免登录，通过验证码）
export interface ResetPasswordReq {
  email: string; // 邮箱
  password: string; // 新密码
  confirm_password?: string; // 确认密码
  verify_code: string; // 验证码
}

// 发送邮箱验证码
export interface SendEmailCodeReq {
  email: string; // 邮箱
  type: string; // login / register / reset_password / bind_email
}

// 发送手机验证码
export interface SendPhoneCodeReq {
  phone: string; // 手机号
  type: string; // login / reset_password / bind_phone
}

// SSE 流式响应块
export interface StreamChunk {
  type: string; // intent | text_delta | image | done | error
  intent: string; // 意图识别结果
  delta: string; // 文字流片段
  url: string; // 图片URL
  revised_prompt: string; // 修订后的提示词
  message: string; // 错误信息
}

export interface Token {
  token_type: string; // Token 类型（如 "Bearer"）
  access_token: string; // 访问令牌：用于接口访问，有效期短
  expires_in: number; // AccessToken 有效期（秒），如 3600（1小时）
  refresh_token: string; // 刷新令牌：仅用于刷新 AccessToken，有效期长
  refresh_expires_in: number; // RefreshToken 有效期（秒），如 604800（7天）
  refresh_expires_at: number; // RefreshToken 过期时间戳（秒）
}

// 更新用户信息请求
export interface UpdateUserProfileReq {
  nickname?: string; // 昵称
  avatar?: string; // 头像URL
}

// 更新用户信息响应
export interface UpdateUserProfileResp {
}

export interface UploadFilesReq {
  files?: any[]; // 文件列表
  file_path?: string; // 文件路径
}

// 用户账户信息
export interface UserAccountInfo {
  balance: number; // 账户余额（元）
  credit_limit: number; // 信用额度（允许负余额）
  total_recharge: number; // 累计充值（元）
  total_consume: number; // 累计消费（元）
}

