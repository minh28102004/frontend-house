module.exports = {
  apps: [
    {
      name: "frontend-vincens",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      env: {
        PORT: 3001
      }
    }
  ]
}
