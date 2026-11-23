"use client";

import { useEffect } from "react";
import { type BootOptions, type LoadOptions, loadDlingLive } from "./index";

export interface DlingLiveProps extends LoadOptions {
  channel: string;
  position?: BootOptions["position"];
  mini?: BootOptions["mini"];
}

export function DlingLive({ channel, position, mini, src }: DlingLiveProps): null {
  useEffect(() => {
    const live = loadDlingLive(src === undefined ? {} : { src });
    const options: BootOptions = { channel };
    if (position !== undefined) options.position = position;
    if (mini !== undefined) options.mini = mini;
    live.boot(options);
    return () => live.destroy();
  }, [channel, position, mini, src]);
  return null;
}
