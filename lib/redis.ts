import { Redis } from "ioredis";

const getRedisUrl = () => {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }

  throw new Error("REDIS_URL not found");
};

export const getListFromRedis = async (redisKey: string) => {
  const cachedBookmarks = await redis.lrange(redisKey, 0, -1); // Fetch all items from list
  const res = cachedBookmarks.map((b) => JSON.parse(b));
  console.log(typeof res);
  return res;
};

// sets the redis value to be a list.
export const setRedisValueToList = async (redisKey: string, list: Array<any>) => {
  await redis.rpush(redisKey, ...list.map((e) => JSON.stringify(e)));
};
export const redis = new Redis(getRedisUrl());
export const getRedisBookmarkKey = (userId: string) =>
  `user:${userId}:bookmarks`;
