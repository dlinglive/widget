export const DEFAULT_LOADER_SRC = "https://dling.live/widget/v1/loader.js";

export interface BootOptions {
  channel: string;
}

export type BootCallback = (error: Error | null) => void;

export interface LoadOptions {
  src?: string;
}

type Command = "boot" | "open" | "close" | "destroy" | "onOpen" | "onClose";
type Global = ((cmd: Command, ...args: unknown[]) => void) & { q?: unknown[][]; loaded?: boolean };

declare global {
  interface Window {
    DlingLive?: Global;
  }
}

export interface DlingLiveApi {
  boot(options: BootOptions, callback?: BootCallback): void;
  open(): void;
  close(): void;
  destroy(): void;

  onOpen(handler: () => void): void;
  onClose(handler: () => void): void;
}

const SCRIPT_ID = "dlinglive-loader";

function call(cmd: Command, ...args: unknown[]): void {
  window.DlingLive?.(cmd, ...args);
}

const api: DlingLiveApi = {
  boot: (options, callback) => (callback ? call("boot", options, callback) : call("boot", options)),
  open: () => call("open"),
  close: () => call("close"),
  destroy: () => call("destroy"),
  onOpen: (handler) => call("onOpen", handler),
  onClose: (handler) => call("onClose", handler),
};

export function loadDlingLive(options: LoadOptions = {}): DlingLiveApi {
  if (typeof window === "undefined") return api;
  if (!window.DlingLive) {
    const stub: Global = (...args: unknown[]) => {
      stub.q ??= [];
      stub.q.push(args);
    };
    window.DlingLive = stub;
  }
  if (!document.getElementById(SCRIPT_ID)) {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = options.src ?? DEFAULT_LOADER_SRC;
    document.head.appendChild(script);
  }
  return api;
}
