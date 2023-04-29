module.exports = {
  apps: [
    {
      name: "my-bot",
      script: "./src/main.js",
      instances: 1,
      autorestart: true,
      watch: ["./src", "./ecosystem.config.js"],
      watch_delay: 1000,
      ignore_watch: ["node_modules"],
      max_memory_restart: "1G",
    },
  ],
};
