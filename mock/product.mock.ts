import { MockHttpItem } from 'vite-plugin-mock-dev-server'
import { defineMock } from './base'

export const productMockData: MockHttpItem[] = [
  {
    url: '/product-set/generate',
    method: 'POST',
    body: (req) => {
      const quantity = Number(req.body?.quantity) || 5
      const now = new Date()
      const timestamp = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
      const placeholders = [
        'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=600&h=600&fit=crop',
      ]
      const generatedCopies = [
        {
          title: '生日派对好物推荐🎉🎂',
          content:
            '终于找到这个生日派对好物，真的绝了！❤️ 不仅提升了整个派对的氛围，还让每个人都笑得合不拢嘴。这个产品不仅性价比高，而且使用起来超级方便，绝对是每个派对的必备元素。',
          tags:
            '#生日派对 #好物推荐 #性价比 #实用好物 #氛围提升 #派对装饰 #细节设计 #颜色搭配 #派对必备',
        },
        {
          title: '派对神器来了！🎊✨',
          content:
            '姐妹们！这个派对神器我必须安利给你们！用过之后整个派对档次都提升了，朋友们都在问我在哪买的。质量超好，设计也很贴心，真的是派对必备好物！',
          tags: '#派对神器 #好物分享 #质量保证 #设计感 #朋友聚会 #氛围感 #高级感 #必买清单',
        },
        {
          title: '这个派对好物绝了！🎈💕',
          content:
            '作为派对达人，这个产品我真的要强烈推荐！不仅颜值在线，实用性也超强。每次用都能收获满满的赞美，性价比真的太高了，强烈建议入手！',
          tags: '#派对达人 #颜值在线 #实用好物 #高性价比 #强烈推荐 #派对装备 #品质生活 #值得入手',
        },
      ]
      const imageTypes = [
        { name: '主图', selected: true, desc: '纯白背景产品主图，展现...' },
        { name: '细节特写图', selected: true, desc: '微距镜头展示产品材质与...' },
        { name: '场景展示图', selected: true, desc: '美式现代家居场景，体现...' },
      ]
      return {
        id: Date.now(),
        timestamp,
        platform: req.body?.platform || 'TikTok Shop',
        productName: req.body?.productName || '未命名产品',
        images: placeholders.slice(0, quantity).map((url) => ({ preview: url })),
        style: '极简留白',
        resolution: '2K ✨ 2',
        ratio: '1:1',
        generatedCopies: generatedCopies.slice(0, quantity),
        imageTypes,
      }
    },
  },
  {
    url: '/product-set/generate-images',
    method: 'POST',
    body: () => {
      const mockImageUrls = [
        'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=600&h=600&fit=crop',
      ]
      const images = ['主图', '细节特写图', '场景展示图'].map((name, index) => ({
        name,
        url: mockImageUrls[index % mockImageUrls.length],
        isRegenerating: false,
      }))
      return { images }
    },
  },
  {
    url: '/product-set/regenerate-image',
    method: 'POST',
    body: () => {
      const mockImageUrls = [
        'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=600&h=600&fit=crop',
        'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=600&h=600&fit=crop',
      ]
      const randomIndex = Math.floor(Math.random() * mockImageUrls.length)
      return { url: mockImageUrls[randomIndex] }
    },
  },
  {
    url: '/product-set/analyze',
    method: 'POST',
    body: () => {
      const mockProducts = [
        {
          productName: '猫咪温馨小窝',
          sellingPoints: `产品名：猫咪温馨小窝
核心卖点：柔软舒适、保暖透气、易清洗
适用人群：养猫家庭、宠物爱好者
期望场景：家居客厅、卧室、阳台
尺寸参数：50x40x30cm，适合5kg以下猫咪`,
        },
        {
          productName: '生日派对装饰套装',
          sellingPoints: `产品名：生日派对装饰套装
核心卖点：色彩丰富、易安装、可重复使用
适用人群：派对策划者、家庭聚会
期望场景：生日派对、节日庆祝、家庭聚会
尺寸参数：包含气球、拉花、蛋糕装饰等`,
        },
        {
          productName: '智能蓝牙音箱',
          sellingPoints: `产品名：智能蓝牙音箱
核心卖点：高音质、长续航、防水设计
适用人群：音乐爱好者、户外运动者
期望场景：家居娱乐、户外旅行、运动健身
尺寸参数：直径8cm，高度12cm，重量300g`,
        },
      ]
      return mockProducts[Math.floor(Math.random() * mockProducts.length)]
    },
  },
]

export default defineMock(productMockData)
