import { Telegraf, session } from "telegraf";
import { message } from "telegraf/filters";
import { proccessVoiceMessage, proccessTextMessage } from "./logic.js";
import config from "config";
import { exec } from "child_process";
export const INITIAL_SESSION = {
  messages: [],
};

const bot = new Telegraf(config.get("TELEGRAM_TOKEN"));
const allowedUsers = config.get("ALLOWED_USERS");

bot.use(session());

bot.use(async (ctx, next) => {
  const userId = ctx.from.id;
  if (allowedUsers.includes(userId)) {
    await next();
  } else {
    ctx.reply("Извините, у вас нет доступа к этому боту.");
  }
});

bot.start(async (ctx) => {
  ctx.reply("Начнем? GPTChat готов :) ");
  ctx.session = INITIAL_SESSION;
  await ctx.reply("Жду вашего сообщения");
});

bot.command("start", async (ctx) => {
  ctx.session = INITIAL_SESSION;
  await ctx.reply("Жду вашего  сообщения");
});

bot.command("restart", async (ctx) => {
  // const userId = ctx.from.id;
  // if (userId === allowedUsers[0]) {
  ctx.reply("Выполняю перезапуск сервера...");
  exec("npm run restart");
  // } else {
  //   ctx.reply("У вас нет прав на выполнение этой команды.");
  // }
});

bot.on(message("voice"), async (ctx) => {
  ctx.session ??= INITIAL_SESSION;
  await proccessVoiceMessage(ctx);
});

bot.on(message("text"), async (ctx) => {
  ctx.session ??= INITIAL_SESSION;
  await proccessTextMessage(ctx);
});

bot.launch();

process.once("SIGINT", () => {
  bot.stop("SIGINT");
});

process.once("SIGTERM", () => {
  bot.stop("SIGTERM");
});
