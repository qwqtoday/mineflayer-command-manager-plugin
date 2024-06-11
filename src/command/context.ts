export interface CommandContext {
    contextType: string 
    senderName: string
    
    message: string
    arguments: string[]
    
    respond: CommandRespondFunction
}

export type CommandRespondFunction = (message: string) => void | Promise<void>