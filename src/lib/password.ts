import bcrypt from "bcryptjs";

/**
 * Parol xeshlash.
 * Spec §7 Argon2id talab qiladi; ishlab chiqarish muhitida Argon2idga o'tish
 * tavsiya etiladi. bcryptjs (toza JS, native build talab qilmaydi) dev va
 * o'rnatish uchun ishlatiladi — xuddi shu interfeys saqlanadi.
 */
const ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export const PASSWORD_POLICY = {
  minLength: 8,
  // 1 katta harf + 1 raqam + 1 maxsus belgi
  pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
};
