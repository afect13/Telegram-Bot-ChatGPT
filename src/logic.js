import { code } from "telegraf/format";
import { openai } from "./openai.js";
import { ogg } from "./ogg.js";
import { gptMessage, removeFile } from "./utils.js";

export async function proccessVoiceMessage(ctx) {
  try {
    ctx.replyWithChatAction("typing");
    const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id);
    const userId = String(ctx.message.from.id);
    const oggPath = await ogg.create(link.href, userId);
    const mp3Path = await ogg.toMp3(oggPath, userId);
    const text = await openai.transcription(mp3Path);
    removeFile(mp3Path);
    await ctx.reply(code(`Ваш запрос: ${text}`));
    console.log(typeof text);
    await ctx.session.messages.push(gptMessage(text));
    const response = await openai.chat(ctx.session.messages);
    ctx.session.messages.push(gptMessage(response.content, openai.roles.ASSISTANT));
    await ctx.reply(response.content);
  } catch (e) {
    await ctx.reply(`Ошибка. ${e.message}`);
    console.error(`Error while proccessing voice message`, e.message);
  }
}

export async function proccessTextMessage(ctx) {
  try {
    ctx.replyWithChatAction("typing");
    ctx.session.messages.push(gptMessage(ctx.message.text));
    const response = await openai.chat(ctx.session.messages);
    ctx.session.messages.push(gptMessage(response.content, openai.roles.ASSISTANT));
    await ctx.reply(response.content);
  } catch (e) {
    await ctx.reply(`Ошибка. ${e.message}`);
    console.error(`Error while proccessing text message`, e.message);
  }
}
