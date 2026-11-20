export const DEFAULT_LOADER_SRC = "https://dling.live/widget/v1/loader.js";

export interface BootOptions {
  channel: string;
  position?: "right" | "left";
  history?: boolean;
}

export type BootCallback = (error: Error | null) => void;

export type OpenReason = "api" | "interaction" | "link";
export type CloseReason = "api" | "interaction" | "back" | "player";

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

  onOpen(handler: (reason: OpenReason) => void): () => void;
  onClose(handler: (reason: CloseReason) => void): () => void;
}

const SCRIPT_ID = "dlinglive-loader";

function call(cmd: Command, ...args: unknown[]): void {
  window.DlingLive?.(cmd, ...args);
}

function subscribe<R>(cmd: "onOpen" | "onClose", handler: (reason: R) => void): () => void {
  let active = true;
  call(cmd, (reason: R) => {
    if (active) handler(reason);
  });
  return () => {
    active = false;
  };
}

const api: DlingLiveApi = {
  boot: (options, callback) => (callback ? call("boot", options, callback) : call("boot", options)),
  open: () => call("open"),
  close: () => call("close"),
  destroy: () => call("destroy"),
  onOpen: (handler) => subscribe("onOpen", handler),
  onClose: (handler) => subscribe("onClose", handler),
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
