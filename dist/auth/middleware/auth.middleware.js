import { TokenService } from "../services/token.service.js";
export const authMiddleware = async (c, next) => {
    const authorizationToken = c.req.header("Authorization");
    if (!authorizationToken) {
        return c.json({ message: "Unauthorized" }, 401);
    }
    if (!authorizationToken.startsWith("Bearer ")) {
        return c.json({ message: "Unauthorized" }, 401);
    }
    const token = authorizationToken.replace("Bearer ", "");
    if (!token) {
        return c.json({ message: "Unauthorized" }, 401);
    }
    const payload = await TokenService.validateAccessToken(token);
    if (!payload) {
        return c.json({ message: "Unauthorized" }, 401);
    }
    const { sub } = payload;
    if (!sub) {
        return c.json({ message: "Unauthorized" }, 401);
    }
    c.set("userId", sub);
    await next();
};
//# sourceMappingURL=auth.middleware.js.map