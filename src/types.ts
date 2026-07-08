export type Theme = "dark" | "light";

export type AgentStatus = "idle" | "loading" | "success" | "error";

export interface AgentRunState {
  status: AgentStatus;
  result: string | null;
  error: string | null;
}
