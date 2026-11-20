"use client";

import { useEffect } from "react";
import { type BootOptions, type LoadOptions, loadDlingLive } from "./index";

export interface DlingLiveProps extends LoadOptions {
  channel: string;
  position?: BootOptions["position"];
}

export function DlingLive({ channel, position, src }: DlingLiveProps): null {
  useEffect(() => {
    const live = loadDlingLive(src === undefined ? {} : { src });
    live.boot(position === undefined ? { channel } : { channel, position });
    return () => live.destroy();
  }, [channel, position, src]);
  return null;
}
