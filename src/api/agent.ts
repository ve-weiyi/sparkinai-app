import request from "@/utils/request";
import type { AgentRunReq, AgentRunResp, AgentChatReq, AgentStreamChunk } from "./types";

/** Agent */
export const AgentAPI = {
  /** Agent 多模态对话接口（SSE 流式响应） */
  agentChat(data?: AgentChatReq): Promise<IApiResponse<AgentStreamChunk>> {
    return request({
      url: `/api/v1/agent/chat`,
      method: "POST",
      data: data,
    });
  },

  /** Agent 执行接口（REST 响应） */
  agentRun(data?: AgentRunReq): Promise<IApiResponse<AgentRunResp>> {
    return request({
      url: `/api/v1/agent/run`,
      method: "POST",
      data: data,
    });
  },
};
