import { createDefineMock } from 'vite-plugin-mock-dev-server'

const defineMock = createDefineMock((mock) => {
  mock.url = '/api' + mock.url
})

export default defineMock([
  {
    url: '/auth/login',
    method: 'POST',
    body: (req) => {
      return {
        success: true,
        data: {
          id: '1',
          name: '与梦',
          email: req.body.email || 'weiyi7914@gmail.com',
          avatar: '',
          credits: 6,
          plan: 'Free',
          token: 'mock-token-' + Date.now(),
        },
      }
    },
  },
  {
    url: '/auth/oauth/apple',
    method: 'POST',
    body: {
      success: true,
      data: {
        id: '2',
        name: 'Apple User',
        email: 'apple.user@icloud.com',
        avatar: '',
        credits: 10,
        plan: 'Pro',
        token: 'mock-apple-token-' + Date.now(),
      },
    },
  },
  {
    url: '/auth/oauth/google',
    method: 'POST',
    body: {
      success: true,
      data: {
        id: '3',
        name: 'Google User',
        email: 'google.user@gmail.com',
        avatar: '',
        credits: 10,
        plan: 'Pro',
        token: 'mock-google-token-' + Date.now(),
      },
    },
  },
])
