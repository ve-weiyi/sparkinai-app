import request from "@/utils/request";
import type {
  AgentRunReq,
  AgentRunResp,
  ChatMessageReq,
  StreamChunk,
} from "./types";

/** Agent */
export const AgentAPI = {
  /** 多模态对话接口（SSE 流式响应） */
  chatMessage(data?: ChatMessageReq): Promise<IApiResponse<StreamChunk>> {
    return request({
      url: `/api/v1/chat/message`,
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
