import { Configuration, OpenAIApi } from "openai";
import { createReadStream } from "fs";
import config from "config";

class OpenAI {
  roles = {
    ASSISTANT: "assistant",
    SYSTEM: "system",
    USER: "user",
  };
  constructor(apiKey, organization) {
    const configuration = new Configuration({
      organization,
      apiKey,
    });
    this.openai = new OpenAIApi(configuration);
  }
  async chat(messages = [], temperature = 0.9) {
    const maxAttempts = 5;
    let attempts = 0;
    while (attempts < maxAttempts) {
      try {
        const completionPromise = this.openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: messages,
          temperature: temperature,
        });

        const timeoutPromise = new Promise((resolve, reject) => {
          setTimeout(() => reject(new Error("Promise timed out after 9000 milliseconds")), 9000);
        });

        const completion = await Promise.race([completionPromise, timeoutPromise]);

        return completion.data.choices[0].message;
      } catch (e) {
        attempts++;
        console.error(`Error (${e}).`);
        await new Promise((resolve) => setTimeout(resolve, 5000));
        console.error(`Attempts (${attempts}).`);
      }
    }
    return { content: "ErrorSessionNeedTrimMessege" };
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

export const openai = new OpenAI(config.get("OPENAI_API_KEY"), config.get("OPENAI_ORG_ID"));
