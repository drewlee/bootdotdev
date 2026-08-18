import { and, eq, gt, isNull } from 'drizzle-orm';
import { db } from '../index.js';
import { refreshTokens, type RefreshToken } from '../schema.js';
import config from '../../config.js';

/**
 * Creates and returns a new record for the specified refresh token and user id.
 *
 * @param token - Refresh token.
 * @param userId - User id.
 * @returns New db record.
 */
export async function saveRefreshToken(
  token: string,
  userId: string,
): Promise<RefreshToken> {
  const now = new Date();

  const [result] = await db
    .insert(refreshTokens)
    .values({
      token,
      userId,
      createdAt: now,
      updatedAt: now,
      expiresAt: new Date(now.valueOf() + config.jwt.refreshDuration),
    })
    .returning();

  return result;
}

/**
 * Retrieves and returns the record for the specified refresh token.
 *
 * @param token - Refresh token.
 * @returns Record for the specified token.
 */
export async function getRefreshTokenRecord(token: string): Promise<RefreshToken> {
  const [result] = await db
    .select()
    .from(refreshTokens)
    .where(
      and(
        eq(refreshTokens.token, token),
        isNull(refreshTokens.revokedAt),
        gt(refreshTokens.expiresAt, new Date()),
      ),
    );

  return result;
}

/**
 * Revokes the record for the specified token in the db.
 *
 * @param token - Token to revoke.
 * @returns - Record for the updated token.
 */
export async function revokeRefreshToken(token: string): Promise<RefreshToken> {
  const [result] = await db
    .update(refreshTokens)
    .set({
      revokedAt: new Date(),
    })
    .where(eq(refreshTokens.token, token))
    .returning();

  return result;
}
