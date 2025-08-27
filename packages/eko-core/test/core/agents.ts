import { Agent, AgentContext } from "../../src";
import { ToolResult, IMcpClient } from "../../src/types";
import { BaseComputerAgent, BaseFileAgent } from "../../src/agent";

export class SimpleChatAgent extends Agent {
  constructor(llms?: string[], mcpClient?: IMcpClient) {
    super({
      name: "Chat",
      description: "You are a helpful assistant.",
      tools: [
        {
          name: "get_weather",
          description: "weather query",
          parameters: {
            type: "object",
            properties: {
              city: {
                type: "string",
                default: "Beijing",
              },
            },
          },
          execute: async (
            args: Record<string, unknown>,
            agentContext: AgentContext
          ): Promise<ToolResult> => {
            return await this.callInnerTool(() =>
              (async () =>
                `Today, the weather in ${args.city} is cloudy, 25-30° (Celsius), suitable for going out for a walk.`)()
            );
          },
        },
      ],
      llms: llms,
      mcpClient: mcpClient,
      planDescription:
        "Chat assistant, handles non-task related conversations. Please use it to reply when the task does not involve operations with other agents.",
    });
  }
}



export class SimpleComputerAgent extends BaseComputerAgent {
  protected screenshot(agentContext: AgentContext): Promise<{ imageBase64: string; imageType: "image/jpeg" | "image/png"; }> {
    throw new Error("Method not implemented.");
  }
  protected typing(agentContext: AgentContext, text: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  protected click(agentContext: AgentContext, x: number, y: number, num_clicks: number, button_type: "left" | "right" | "middle"): Promise<void> {
    throw new Error("Method not implemented.");
  }
  protected scroll(agentContext: AgentContext, amount: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
  protected move_to(agentContext: AgentContext, x: number, y: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
  protected press(agentContext: AgentContext, key: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  protected hotkey(agentContext: AgentContext, keys: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  protected drag_and_drop(agentContext: AgentContext, x1: number, y1: number, x2: number, y2: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

export class SimpleFileAgent extends BaseFileAgent {
  protected file_list(agentContext: AgentContext, path: string): Promise<Array<{ path: string; name?: string; isDirectory?: boolean; size?: string; modified?: string; }>> {
    throw new Error("Method not implemented.");
  }
  protected file_read(agentContext: AgentContext, path: string): Promise<string> {
    throw new Error("Method not implemented.");
  }
  protected file_write(agentContext: AgentContext, path: string, content: string, append: boolean): Promise<any> {
    throw new Error("Method not implemented.");
  }
  protected file_str_replace(agentContext: AgentContext, path: string, old_str: string, new_str: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
  protected file_find_by_name(agentContext: AgentContext, path: string, glob: string): Promise<Array<{ path: string; name?: string; isDirectory?: boolean; size?: string; modified?: string; }>> {
    throw new Error("Method not implemented.");
  }
}