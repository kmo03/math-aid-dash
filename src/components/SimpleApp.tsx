import { SimpleChatLayout } from "./SimpleChatLayout";
import { ChatGPTIntegration } from "./ChatGPTIntegration";

export function SimpleApp() {
  return (
    <SimpleChatLayout>
      <ChatGPTIntegration />
    </SimpleChatLayout>
  );
}