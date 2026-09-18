import { eq, and } from "drizzle-orm";
import { db } from "../config/database.js";
import { users } from "../config/schema.js";

/**
 * Melakukan query login pada tabel user
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<object|null>}
 */
export async function loginUser(username, password) {
  const result = await db
    .select({
      username: users.username,
      role: users.role,
    })
    .from(users)
    .where(and(eq(users.username, username), eq(users.password, password)))
    .limit(1);

  return result[0] || null;
}

/**
 * Mencari user berdasarkan username
 * @param {string} username 
 * @returns {Promise<object|null>}
 */
export async function findUserByUsername(username) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  return result[0] || null;
}
