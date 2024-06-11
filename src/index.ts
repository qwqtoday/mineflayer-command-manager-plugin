export * from "./command"
import EventEmitter from "events";
import { Bot } from "mineflayer";
import { Command, CommandContext, CommandRespondFunction } from "./command";

export class CommandManager extends EventEmitter {
    commands: Map<string, Command>

    constructor(bot: Bot) {
        super()
        this.commands = new Map()
    }

    addCommand(command: Command) {
        this.commands.set(command.name, command)
    }

    parseMessageToTryExecuteCommand(senderName: string, message: string, contextType: string, respondFunc: CommandRespondFunction) {
        const args = message.split(" ")
        const commandContext: CommandContext = {
            contextType: contextType,
            senderName: senderName,
            message: message, 
            arguments: args,
            respond: respondFunc
        }

        return this.executeCommand(commandContext)
    }

    executeCommand(context: CommandContext) : void | Promise<void> {
        let lastCommand: Command
        let command: Command
        let commandLocation: string[] = []
        let args = context.arguments
        do {
            const commandName = args[0]
            commandLocation.push(commandName)
            if (command) {
                lastCommand = command
                command = command.subCommands.get(commandName)
            } else {
                command = this.commands.get(commandName)
            }
            args = args.splice(0, 1)
        } while (command !== undefined && command.isNestedCommand)
        
        if (command === undefined) {
            let message = `command ${commandLocation.join(" ")} not found. `
            if (commandLocation.length === 1) {
                message += `correct usage: ${commandLocation.splice(commandLocation.length-1, 1).join(" ")} ${lastCommand.usage}`
            }
            return context.respond(message)
        }

        return command.execute(context)
    }
}

declare module "mineflayer" {
    interface Bot {
        commandManager: CommandManager
    }
}

export function commandManagerPlugin(bot: Bot) {
    bot.commandManager = new CommandManager(bot)
}