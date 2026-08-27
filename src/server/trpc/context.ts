import { auth } from "@/server/auth";
import { db } from "@/server/db";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

export async function createContext(opts?: FetchCreateContextFnOptions) {
  const session = await auth();
  return { db, session, req: opts?.req };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
