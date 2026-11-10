import { EventType, HttpAgent, type RunAgentInput } from "@ag-ui/client";
import { tap } from "rxjs";

/**
 * HARNESS-AUTHORED, not doc code. A plain HttpAgent that also prints failed
 * runs to the `next dev` terminal.
 *
 * Without it a failed run is silent server-side: a transport error (e.g. a 404
 * from an unmapped endpoint) or a RUN_ERROR event only reaches the browser,
 * inside an otherwise-200 stream, so the runtime's onError hook never fires.
 * Events pass through unchanged.
 */
export class LoggedHttpAgent extends HttpAgent {
  run(input: RunAgentInput) {
    const where = `[agent ${this.agentId ?? "?"} → ${this.url}]`;
    return super.run(input).pipe(
      tap({
        next: (event) => {
          if (event.type === EventType.RUN_ERROR) {
            console.error(`${where} RUN_ERROR`, JSON.stringify(event));
          }
        },
        error: (error: unknown) => {
          console.error(`${where} run failed:`, error);
        },
      }),
    );
  }
}
