import { auth as betterAuth } from "../../lib/auth.js";
import { catchAsync } from "../../utils/catchAsync.js";
export const auth = (...roles) => {
    return catchAsync(async (req, res, next) => {
        // 1. Get the session
        const session = await betterAuth.api.getSession({
            headers: req.headers,
        });
        // 2. Validate session existence
        if (!session || !session.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication failed. Please log in.",
            });
        }
        // 3. Cast to your custom interface
        const user = session.user;
        // 4. Blocked check
        if (user.isBlocked) {
            return res.status(403).json({
                success: false,
                message: "Your account has been deactivated by an admin.",
            });
        }
        // 5. Role check (Case-insensitive check is safer if your DB enums vary)
        if (roles.length > 0) {
            const hasRole = roles.includes(user.role);
            if (!hasRole) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied: Insufficient permissions.",
                });
            }
        }
        // 6. Attach to Request object
        req.user = user;
        next();
    });
};
//# sourceMappingURL=auth.js.map