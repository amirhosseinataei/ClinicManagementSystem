module.exports = {
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true
    },
    rateLimit: {
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: "Too many requests from this IP."
    },
    slowDown: {
        windowMs: 15 * 60 * 1000,
        delayAfter: 50,
        delayMs: 500
    }
};
