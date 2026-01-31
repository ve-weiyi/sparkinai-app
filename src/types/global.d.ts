/**
 * 全局类型声明
 *
 * @deprecated 请使用 @/types 下的具名导出
 */
declare global {
  interface PageQuery {
    page?: number
    page_size?: number
    sorts?: string[]
  }

  interface PageResp<T> {
    list: T
    page: number
    page_size: number
    total: number
  }

  interface IApiResponse<T = any> {
    flag: number
    code: number
    data: T
    msg: string
    trace_id: string
  }

  const __APP_INFO__: {
    pkg: {
      name: string
      version: string
    }
  }
}

export {}
