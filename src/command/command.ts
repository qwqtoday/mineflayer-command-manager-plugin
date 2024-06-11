import { Bot } from "mineflayer";
import { CommandContext } from "./context";

export interface CommandArgument {
    name: string
    description: string
    required: boolean
}

export interface CommandOptions {
    name: string
    description?: string
    isNestedCommand?: boolean
    arguments?: CommandArgument[]
    subCommands?: Command[]
}

export abstract class Command {
    bot: Bot

    name: string
    description: string
    usage: string
    isNestedCommand: boolean
    arguments: CommandArgument[]

    subCommands: Map<string, Command> 

    constructor(bot: Bot, options: CommandOptions) {
        this.bot = bot
        this.name = options.name
        this.description = this.description
        
        this.isNestedCommand = this.isNestedCommand ?? false
        this.arguments = options.arguments

        this.usage = this.arguments ? this.arguments.map((arg) => {
            if (arg.required) {
                return `<${arg.name}>`
            }
            return `[${arg.name}]`
        })
            .join(" ")
            :
            ""
        
        // Add all subcommands
        if (this.isNestedCommand) {
            this.subCommands = new Map()
            options.subCommands.forEach(this.addSubCommand)
        } else {
            this.subCommands = null
        }
    }

    private addSubCommand(subCommand: Command) {
        this.subCommands.set(subCommand.name, subCommand)
    }

    abstract execute(context: CommandContext): void | Promise<void>
}