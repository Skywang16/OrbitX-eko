


<h1 align="center">
  <a href="https://github.com/FellouAI/eko" target="_blank">
    <img src="https://github.com/user-attachments/assets/55dbdd6c-2b08-4e5f-a841-8fea7c2a0b92" alt="eko-logo" width="200" height="200">
  </a>
  <br>
  <small>Eko - Build Production-ready Agentic Workflow with Natural Language</small>
</h1>



[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE) [![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://example.com/build-status) [![Version](https://img.shields.io/github/package-json/v/FellouAI/eko?color=yellow)](https://eko.fellou.ai/docs/release/versions/)

Eko (pronounced like 'echo') is a production-ready JavaScript framework that enables developers to create reliable agents, **from simple commands to complex workflows**. It provides a unified interface for running agents in **terminal and computer environments**.

## Framework Comparison

| Feature                              | Eko   | Langchain  | Browser-use  | Dify.ai  | Coze   |
|--------------------------------------|-------|------------|--------------|----------|--------|
| **Supported Platform**               | **All platform**  | Server side  | Browser  | Web  | Web  |
| **One sentence to multi-step workflow** | ✅    | ❌          | ✅            | ❌        | ❌      |
| **Intervenability**                  | ✅    | ✅          | ❌            | ❌        | ❌      |
| **Task Parallel** | ✅    | ❌          | ❌            | ❌        | ❌      |
| **Development Efficiency**           | **High**  | Low      | Middle        | Middle    | Low    |
| **Task Complexity**           | **High**  | High      | Low        | Middle    | Middle    | Middle       |
| **Open-source**                      | ✅    | ✅          | ✅            | ✅        | ❌      |
| **Access to private web resources** | ✅ | ❌          | ❌            | ❌        | ❌      |

## Features

- [x] Pure JavaScript: Built for browsers and Node.js.🚀
- [x] Multi-Agent: Unleash power with multiple Agents in one task.📈
- [x] Agent/Tool Flexibility: Customize new Agents and Tools in just one line.🎉
- [x] Native MCP: Connects seamlessly with [Awesome MCP Servers](https://mcpservers.org/).🔗
- [x] Dynamic LLM: Balance speed and performance with flexible model choices.⚙️
- [x] Human-in-the-loop: Intervene when it matters most.🤝
- [x] Stream Planning: Dynamic rendering made easy.🎨
- [x] Loop & Listener Tasks: Automate any repetitive task.🤖
- [ ] Observable Chain: *Coming soon*
- [ ] Native A2A: *Coming soon*

## Quickstart

> **Note**: Please refer to the [Eko Quickstart guide](https://eko.fellou.ai/docs/getting-started/quickstart/) guide for full instructions on how to run it.

> **Security Note**
>
> Keep your API keys secure and never expose them in client-side code or public repositories.

```typescript
const llms: LLMs = {
  default: {
    provider: "anthropic",
    model: "claude-sonnet-4-20250514",
    apiKey: "your-api-key"
  },
  gemini: {
    provider: "google",
    model: "gemini-2.5-pro",
    apiKey: "your-api-key"
  },
  openai: {
    provider: "openai",
    model: "gpt-5",
    apiKey: "your-api-key"
  }
};

let agents: Agent[] = [new FileAgent(), new ShellAgent()];
let eko = new Eko({ llms, agents });
let result = await eko.run("Create a backup script for all project files and save it as backup.sh");
```

```bash
$ pnpm install @eko-ai/eko
```

## Use Cases

- Terminal automation and command execution
- System file and process management
- Workflow automation
- Data processing and organization
- Code development and project management
- Multi-step task orchestration

## Documentation

Visit our [documentation site](https://eko.fellou.ai/docs) for:

- Getting started guide
- API reference
- Usage examples
- Best practices
- Configuration options

## Development Environments

Eko can be used in multiple environments:

- Browser Extension
- Web Applications
- Node.js Applications

## Community and Support

- Report issues on [GitHub Issues](https://github.com/FellouAI/eko/issues)

[![Star History Chart](https://api.star-history.com/svg?repos=FellouAI/eko&type=Date)](https://star-history.com/#FellouAI/eko&Date)

## License

Eko is released under the MIT License. See the [LICENSE](LICENSE) file for details.

