"use client";

import { useEffect } from "react";
import { type LoadOptions, loadDlingLive } from "./index";

export interface DlingLiveProps extends LoadOptions {
  channel: string;
}

export function DlingLive({ channel, src }: DlingLiveProps): null {
  useEffect(() => {
    const live = loadDlingLive(src === undefined ? {} : { src });
    live.boot({ channel });
    return () => live.destroy();
  }, [channel, src]);
  return null;
}
