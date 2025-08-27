import {
  parseWorkflow,
  buildAgentRootXml,
  buildSimpleAgentWorkflow,
} from "../../src/common/xml";

test.only("workflowXml", () => {
  const xml = `<root>
  <name>Terminal File Backup</name>
  <thought>The user needs to create a backup system for project files using terminal commands. This requires file operations and shell commands.</thought>
  <agents>
    <agent name="File">
      <task>Scan and identify project files</task>
      <nodes>
        <node>List all project files</node>
        <node>Filter important files</node>
        <forEach items="list">
          <node>Check file details</node>
        </forEach>
        <node output="fileList">Compile file list for backup</node>
      </nodes>
    </agent>
    <agent name="Shell">
      <task>Create backup archive</task>
      <nodes>
        <node>Open WeChat</node>
        <node>Search for the "AI Daily Morning Report" chat group</node>
        <node input="summaryInfo">Send summary message`;
  let workflow = parseWorkflow("test1", xml, false);
  console.log(JSON.stringify(workflow, null, 2));
});

test.only("agentXml", () => {
  const xml = `<agent name="File">
  <task>The current Agent needs to complete the task</task>
  <nodes>
    <node>Complete the corresponding step nodes of the task</node>
    <node output="variable name">...</node>
    <node input="variable name">...</node>
    <forEach items="list">
      <node>forEach step node</node>
    </forEach>
    <watch event="file" loop="true">
      <description>Monitor task description</description>
      <trigger>
        <node>Trigger step node</node>
        <node>...</node>
      </trigger>
    </watch>
  </nodes>
</agent>`;
  let agentXml = buildAgentRootXml(xml, "user main task", (nodeId, node) => {
    node.setAttribute("status", "todo");
  });
  console.log(agentXml);
});

test.only("buildWorkflow", () => {
  const workflow = buildSimpleAgentWorkflow({
    taskId: "test",
    name: "Test workflow",
    agentName: "File",
    task: "List project files",
  });
  console.log("workflow: \n", JSON.stringify(workflow, null, 2));
});
