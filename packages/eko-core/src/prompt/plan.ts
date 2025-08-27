import config from "../config";
import Context from "../core/context";

const PLAN_SYSTEM_TEMPLATE = `
You are {name}, an autonomous AI Agent Planner.

## Task Description
Your task is to understand the user's requirements, dynamically plan the user's tasks based on the Agent list, and please follow the steps below:
1. Understand the user's requirements.
2. Analyze the Agents that need to be used based on the user's requirements.
3. Generate the Agent calling plan based on the analysis results.
4. About agent name, please do not arbitrarily fabricate non-existent agent names.
5. You only need to provide the steps to complete the user's task, key steps only, no need to be too detailed.
6. Please strictly follow the output format and example output.
7. The output language should follow the language corresponding to the user's task.

## Agent list
{agents}

## Output Rules and Format
<root>
  <!-- Task Name (Short) -->
  <name>Task Name</name>
  <!-- Need to break down the task into multi-agent collaboration. Please think step by step and output a detailed thought process. -->
  <thought>Your thought process on user demand planning</thought>
  <!-- Multiple Agents work together to complete the task -->
  <agents>
    <!--
    Multi-Agent supports parallelism, coordinating parallel tasks through dependencies, and passing dependent context information through node variables.
    name: The name of the Agent, where the name can only be an available name in the Agent list.
    id: Use subscript order as ID for dependency relationships between multiple agents.
    dependsOn: The IDs of agents that the current agent depends on, separated by commas when there are multiple dependencies.
    -->
    <agent name="Agent name" id="0" dependsOn="">
      <!-- The current Agent needs to complete the task -->
      <task>current agent task</task>
      <nodes>
        <!-- Nodes support input/output variables for parameter passing and dependency handling in multi-agent collaboration. -->
        <node>Complete the corresponding step nodes of the task</node>
        <node input="variable name">...</node>
        <node output="variable name">...</node>
        <!-- When including duplicate tasks, \`forEach\` can be used -->
        <forEach items="list or variable name">
          <node>forEach step node</node>
        </forEach>
        <!-- When you need to monitor changes in webpage DOM elements, you can use \`Watch\`, the loop attribute specifies whether to listen in a loop or listen once. -->
        <watch event="dom" loop="true">
          <description>Monitor task description</description>
          <trigger>
            <node>Trigger step node</node>
            <node>...</node>
          </trigger>
        </watch>
      </nodes>
    </agent>
    <!--
    Multi-agent Collaboration Dependency Example:

    Execution Flow:
    1. Agent 0: Initial agent with no dependencies (executes first)
    2. Agent 1: Depends on Agent 0 completion (executes after Agent 0)
    3. Agent 2 & 3: Both depend on Agent 1 completion (execute in parallel after Agent 1)
    4. Agent 4: Depends on both Agent 2 and Agent 3 completion (executes last)

    Dependency Chain: Agent 0 → Agent 1 → (Agent 2 ∥ Agent 3) → Agent 4
    -->
    <agent name="Agent name" id="0" dependsOn="">...</agent>
    <agent name="Agent name" id="1" dependsOn="0">...</agent>
    <agent name="Agent name" id="2" dependsOn="1">...</agent>
    <agent name="Agent name" id="3" dependsOn="1">...</agent>
    <agent name="Agent name" id="4" dependsOn="2,3">...</agent>
  </agents>
</root>

{example_prompt}
`;

const PLAN_CHAT_EXAMPLE = `User: hello.
Output result:
<root>
  <name>Chat</name>
  <thought>Alright, the user wrote "hello". That's pretty straightforward. I need to respond in a friendly and welcoming manner.</thought>
  <agents>
    <!-- Chat agents can exist without the <task> and <nodes> nodes. -->
    <agent name="Chat" id="0" dependsOn=""></agent>
  </agents>
</root>`;

const PLAN_EXAMPLE_LIST = [
  `User: Create a backup script that compresses all project files in the current directory and saves them with timestamp.
Output result:
<root>
  <name>Create backup script</name>
  <thought>The user wants me to create a backup script that compresses project files with timestamp. This involves file operations and shell commands.</thought>
  <agents>
    <agent name="Shell" id="0" dependsOn="">
      <task>Create a backup script that compresses all project files in the current directory and saves them with timestamp.</task>
      <nodes>
        <node>Get current directory path</node>
        <node>Generate timestamp for backup filename</node>
        <node>Create tar.gz archive of all project files</node>
        <node>Verify backup file was created successfully</node>
        <node output="backupPath">Save backup file path for reference</node>
      </nodes>
    </agent>
  </agents>
</root>`,
  `User: Find all Python files in the project, analyze their imports, and generate a dependency report.
Output result:
<root>
  <name>Python Dependency Analysis</name>
  <thought>The user wants to analyze Python files and their imports to generate a dependency report. This involves file operations and text processing.</thought>
  <agents>
    <agent name="File" id="0" dependsOn="">
      <task>Find and analyze Python files for imports</task>
      <nodes>
        <node>Search for all .py files in the project directory</node>
        <node>Read each Python file content</node>
        <forEach items="python_files">
          <node>Extract import statements from file</node>
          <node>Parse import dependencies</node>
        </forEach>
        <node output="dependencyData">Compile dependency information</node>
      </nodes>
    </agent>
    <agent name="File" id="1" dependsOn="0">
      <task>Generate dependency report</task>
      <nodes>
        <node input="dependencyData">Process dependency data</node>
        <node>Format report with statistics</node>
        <node>Save report to dependency_report.txt</node>
      </nodes>
    </agent>
  </agents>
</root>`,
  `User: Monitor system logs for error patterns and create an automated alert system.
Output result:
<root>
  <name>System Log Monitor and Alert System</name>
  <thought>The user wants to monitor system logs for error patterns and create alerts. This involves file monitoring, text processing, and system operations.</thought>
  <agents>
    <agent name="Shell" id="0" dependsOn="">
      <task>Set up log monitoring and pattern detection</task>
      <nodes>
        <node>Identify system log file locations</node>
        <node>Create log monitoring script</node>
        <node>Define error patterns to watch for</node>
        <node output="logPatterns">Save pattern definitions</node>
        <forEach items="log_files">
          <node>Set up file monitoring for each log</node>
          <node>Configure pattern matching rules</node>
        </forEach>
        <node>Test monitoring system functionality</node>
      </nodes>
    </agent>
  </agents>
</root>`,
  `User: Set up a development environment with Node.js, install project dependencies, and run tests.
Output result:
<root>
  <name>Development Environment Setup</name>
  <thought>The user wants to set up a development environment with Node.js, install dependencies, and run tests. This involves shell commands and file operations.</thought>
  <agents>
    <agent name="Shell" id="0" dependsOn="">
      <task>Set up Node.js development environment</task>
      <nodes>
        <node>Check if Node.js is installed</node>
        <node>Install Node.js if not present</node>
        <node>Verify npm is available</node>
        <node>Navigate to project directory</node>
        <node>Install project dependencies using npm install</node>
        <node>Run project tests using npm test</node>
        <node>Generate test coverage report</node>
      </nodes>
    </agent>
  </agents>
</root>`,
`User: Analyze code quality across multiple programming languages in a project, generate reports, and set up automated code formatting.
Output result:
<root>
<name>Code Quality Analysis and Formatting Setup</name>
<thought>The user wants to analyze code quality across multiple programming languages, generate reports, and set up automated formatting. This involves file operations, shell commands, and text processing across different agents.</thought>
<agents>
  <agent name="File" id="0" dependsOn="">
      <task>Scan project for different programming languages</task>
      <nodes>
        <node>Identify all source code files in the project</node>
        <node>Categorize files by programming language</node>
        <node>Count lines of code for each language</node>
        <node>Analyze file structure and organization</node>
        <node output="projectStructure">Compile project structure analysis</node>
      </nodes>
    </agent>
    <agent name="Shell" id="1" dependsOn="0">
      <task>Run code quality analysis tools</task>
      <nodes>
        <node>Install necessary code analysis tools (eslint, pylint, etc.)</node>
        <node input="projectStructure">Run language-specific linters and analyzers</node>
        <node>Collect code quality metrics and issues</node>
        <node output="qualityResults">Generate quality analysis results</node>
      </nodes>
    </agent>
    <agent name="Shell" id="2" dependsOn="0">
      <task>Set up automated code formatting</task>
      <nodes>
        <node>Install code formatters (prettier, black, gofmt, etc.)</node>
        <node input="projectStructure">Configure formatting rules for each language</node>
        <node>Create pre-commit hooks for automatic formatting</node>
        <node output="formattingSetup">Document formatting configuration</node>
      </nodes>
    </agent>
    <agent name="File" id="3" dependsOn="1,2">
      <task>Generate comprehensive code quality report</task>
      <nodes>
        <node input="qualityResults,formattingSetup">Compile analysis results into report</node>
        <node>Create summary statistics and recommendations</node>
        <node>Format report with charts and tables</node>
        <node>Save report as 'Code_Quality_Analysis_Report.md'</node>
      </nodes>
    </agent>
  </agents>
</root>`,
];

const PLAN_USER_TEMPLATE = `
User Platform: {platform}
Current datetime: {datetime}
Task Description: {task_prompt}
`;

const PLAN_USER_TASK_WEBSITE_TEMPLATE = `
User Platform: {platform}
Task Website: {task_website}
Current datetime: {datetime}
Task Description: {task_prompt}
`;

export async function getPlanSystemPrompt(context: Context): Promise<string> {
  let agents_prompt = "";
  let agents = context.agents;
  for (let i = 0; i < agents.length; i++) {
    let agent = agents[i];
    let tools = await agent.loadTools(context);
    if ((agent as any).ignorePlan) {
      continue;
    }
    agents_prompt +=
      `<agent name="${agent.Name}">\n` +
      `Description: ${agent.PlanDescription || agent.Description}\n` +
      "Tools:\n" +
      tools
        .filter((tool) => !tool.noPlan)
        .map(
          (tool) =>
            `  - ${tool.name}: ${
              tool.planDescription || tool.description || ""
            }`
        )
        .join("\n") +
      "\n</agent>\n\n";
  }
  let plan_example_list =
    context.variables.get("plan_example_list") || PLAN_EXAMPLE_LIST;
  let hasChatAgent =
    context.agents.filter((a) => a.Name == "Chat").length > 0;
  let example_prompt = "";
  const example_list = hasChatAgent
    ? [PLAN_CHAT_EXAMPLE, ...plan_example_list]
    : [...plan_example_list];
  for (let i = 0; i < example_list.length; i++) {
    example_prompt += `## Example ${i + 1}\n${example_list[i]}\n\n`;
  }
  return PLAN_SYSTEM_TEMPLATE.replace("{name}", config.name)
    .replace("{agents}", agents_prompt.trim())
    .replace("{example_prompt}", example_prompt)
    .trim();
}

export function getPlanUserPrompt(
  task_prompt: string,
  task_website?: string,
  ext_prompt?: string
): string {
  let prompt = "";
  if (task_website) {
    prompt = PLAN_USER_TASK_WEBSITE_TEMPLATE.replace(
      "{task_website}",
      task_website
    );
  } else {
    prompt = PLAN_USER_TEMPLATE;
  }
  prompt = prompt
    .replace("{task_prompt}", task_prompt)
    .replace("{platform}", config.platform)
    .replace("{datetime}", new Date().toLocaleString())
    .trim();
  if (ext_prompt) {
    prompt += `\n${ext_prompt.trim()}`;
  }
  return prompt;
}
