# mineflayer-command-manager-plugin

commands for mineflayer bot

## Usage:
```js
const { commandManagerPlugin, Command } = require("mineflayer-command-manager-plugin")

// Create your bot
...

// Create a command
class HelloCommand extends Command {
    constructor(bot: Bot) {
        super(bot, {
            name: "hello",
            description: "say hello",
            isNestedCommand: false,
            arguments: null,
            subCommands: null
        })
    }
}

bot.loadPlugin(commandManagerPlugin)

bot.once("spawn", () => {
    bot.commandManager.addCommand(new HelloCommand(bot))
})
```