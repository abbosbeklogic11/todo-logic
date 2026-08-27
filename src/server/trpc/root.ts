import { router } from "./trpc";
import { authRouter } from "./routers/auth";
import { taskRouter } from "./routers/task";
import { goalRouter } from "./routers/goal";
import { habitRouter } from "./routers/habit";
import { categoryRouter } from "./routers/category";
import { settingsRouter } from "./routers/settings";

export const appRouter = router({
  auth: authRouter,
  task: taskRouter,
  goal: goalRouter,
  habit: habitRouter,
  category: categoryRouter,
  settings: settingsRouter,
});

export type AppRouter = typeof appRouter;
