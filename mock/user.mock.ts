import { MockHttpItem } from 'vite-plugin-mock-dev-server'
import { defineMock } from './base.ts'
export const userMockData: MockHttpItem[] = [
  {
    url: '/user/current',
    method: 'GET',
    body: {
      id: '1',
      name: '与梦',
      email: 'weiyi7914@gmail.com',
      avatar: '',
      credits: 6,
      plan: 'Free',
    },
  },
  {
    url: '/user/credits',
    method: 'GET',
    body: [
      { name: '视频 Sora 2（含改编/重做）', credits: 2 },
      { name: '视频 Sora 2 15s/高清（含改编/重做）', credits: 25 },
      { name: '视频水印去除', credits: 1 },
      { name: '视频提示词复刻', credits: 1 },
      { name: '视频分析/聊天', credits: 0, label: '限时免费' },
    ],
  },
]

export default defineMock(userMockData)
