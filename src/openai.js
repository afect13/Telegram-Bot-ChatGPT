import { Configuration, OpenAIApi } from "openai";
import { createReadStream } from "fs";
import config from "config";
import { Context } from "telegraf";

class OpenAI {
  roles = {
    ASSISTANT: "assistant",
    SYSTEM: "system",
    USER: "user",
  };

  constructor(apiKey) {
    const configuration = new Configuration({
      apiKey,
    });
    this.openai = new OpenAIApi(configuration);
    // this.lastError = null;
    // this.lastMessages = null;
  }
  async chat(messages = []) {
    try {
      const completion = await this.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages,
      });
      // this.lastError = null; // Сброс ошибки при успешном выполнении
      // this.lastMessages = messages; // Сохранение сообщений при успешном выполнении
      return completion.data.choices[0].message;
    } catch (e) {
      console.error(`Error while chat completion: ${e.message}`);
      return { content: "Ошибка попробуйте еще раз введите /restart" };
    }
  }

  async transcription(filepath) {
    try {
      const response = await this.openai.createTranscription(createReadStream(filepath), "whisper-1");
      return response.data.text;
    } catch (e) {
      console.error(`Error while transcription: ${e.message}`);
    }
  }
}

export const openai = new OpenAI(config.get("OPENAI_API_KEY"));
