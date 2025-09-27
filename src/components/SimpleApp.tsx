import { CenteredLayout } from "./CenteredLayout";
import { ChatGPTIntegration } from "./ChatGPTIntegration";

export function SimpleApp() {
  return (
    <CenteredLayout>
      <ChatGPTIntegration />
    </CenteredLayout>
  );
}