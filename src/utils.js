import { unlink } from "fs/promises";

export async function removeFile(filepath) {
  try {
    await unlink(filepath);
  } catch (e) {
    console.log(`Error while unlinking file: `, e.message);
  }
}

export const gptMessage = (content, role = "user") => ({
  content,
  role,
});

export const startSession = () => ({
  messages: [],
  selectedTemp: 0.9,
});

export const trimSessionMessages = (messages) => {
  const excess = messages.length - 8;
  return excess > 0 ? messages.slice(excess) : [...messages];
};
