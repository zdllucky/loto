import { randomBytes } from "crypto";
import { storedSessions } from "@keystone-6/core/session";
import { Config } from ".keystone/types";
import { Session } from "../schema/_misc/accessHelpers";
import Redis from "ioredis";

const sessionSecret: string =
  process.env.COOKIE_SECRET ?? randomBytes(32).toString("hex");

const sessionMaxAge = 60 * 60 * 24 * 30;

export const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: 6379,
});

const session: Config["session"] = storedSessions<Session>({
  maxAge: sessionMaxAge,
  // the session secret is used to encrypt cookie data
  secret: sessionSecret,

  store: () => ({
    async get(sessionId) {
      const result = await redis.get(sessionId);
      if (!result) return;

      return JSON.parse(result) as Session;
    },

    async set(sessionId, data) {
      // we use redis for our Session data, in JSON
      await redis.setex(sessionId, sessionMaxAge, JSON.stringify(data));
    },

    async delete(sessionId) {
      await redis.del(sessionId);
    },
  }),
});
export default session;
