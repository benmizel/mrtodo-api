import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit of 5 requests
  message: "Too many login attempts, please try again later.",
});

const refreshTokenLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit of 5 requests
    message: "Too many refresh token requests, please try again later.",
  });

  export { loginLimiter, refreshTokenLimiter };