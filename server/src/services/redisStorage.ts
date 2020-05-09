import { createHandyClient } from "handy-redis";
export const redis = createHandyClient({ url: process.env.REDIS_URL });
