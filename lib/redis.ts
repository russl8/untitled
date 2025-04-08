import { Redis } from "ioredis";

const getRedisUrl = () => {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }

  throw new Error("REDIS_URL not found");
};
/**
 * Given a redis key, return the corresponding list
 */
export const getListFromRedis = async (redisKey: string): Promise<any[]> => {
  const cachedBookmarks = await redis.lrange(redisKey, 0, -1);
  const res = cachedBookmarks.map((b) => JSON.parse(b));
  return res;
};

/**
 * Given a redis key and array, set the redis value to be the array.
 */
export const addArrayToRedisKey = async (
  redisKey: string,
  array: Array<any>
): Promise<void> => {
  await redis.rpush(redisKey, ...array.map((e) => JSON.stringify(e)));
};
export const redis = new Redis(getRedisUrl());
export const getRedisBookmarkKey = (userId: string) =>
  `user:${userId}:bookmarks`;
export const getRedisWeeklyReportKey = (userId: string) =>
  `user:${userId}:weeklyreport`;
export const getRedisWorkoutKey = (userId: string) =>
  `user:${userId}:workouts`;