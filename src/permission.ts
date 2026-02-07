import { AuthAPI } from "@/api/auth";
import { router } from "@/router";
import { AuthStorage } from "@/utils/preferencesStorage";

// 获取客户端信息
const fetchClientInfo = async (): Promise<void> => {
  try {
    const res = await AuthAPI.getClientInfo();
    AuthStorage.setTerminalId(res.data.terminal_id);
  } catch {
    console.log("获取客户端信息失败");
  }
};

router.beforeEach(async (to, from, next) => {
  if (!AuthStorage.getTerminalId()) {
    await fetchClientInfo();
  }
  console.log("获取客户端信息", AuthStorage.getTerminalId());
  next();
});

// 路由守卫 - 检查认证状态
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title as string;
  }
  const accessToken = AuthStorage.getAccessToken();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !accessToken) {
    // 需要认证但没有token，重定向到登录页
    next({
      path: "/login",
      query: { redirect: to.fullPath },
    });
  } else if ((to.path === "/login" || to.path === "/register") && accessToken) {
    // 已登录用户访问登录/注册页，重定向到dashboard
    next("/app/dashboard");
  } else {
    next();
  }
});
