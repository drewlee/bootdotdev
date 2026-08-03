import { eq } from 'drizzle-orm';
import { db } from '../index.js';
import { refreshTokens, type NewRefreshToken, type RefreshToken } from '../schema.js';

/**
 * TODO
 *
 * @param token -
 * @param userId -
 * @returns 
 */
export async function createRefreshToken(token: string, userId: string): Promise<RefreshToken> {
  const now = new Date();
  const sixtyDays = 1000 * 60 * 60 * 24 * 60;
  const expiration = now.valueOf() + sixtyDays;
  const data: NewRefreshToken = {
    token,
    userId,
    createdAt: now,
    updatedAt: now,
    expiresAt: new Date(expiration),
  };

  const [result] = await db
      .insert(refreshTokens)
      .values(data)
      .returning();

  return result;
}

/**
 * TODO
 *
 * @param token -
 * @returns 
 */
export async function getRefreshTokenRecord(token: string): Promise<RefreshToken> {
  const [result] = await db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.token, token));

  return result;
}

/**
 * TODO
 *
 * @param token -
 */
export async function revokeRefreshToken(token: string): Promise<void> {
  const now = new Date();

  await db
    .update(refreshTokens)
    .set({
      revokedAt: now,
    })
    .where(eq(refreshTokens.token, token));
}
