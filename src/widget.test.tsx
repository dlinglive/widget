import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_LOADER_SRC, loadDlingLive } from "./index";
import { DlingLive } from "./react";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const scripts = () => document.querySelectorAll("script#dlinglive-loader");

afterEach(() => {
  document.head.innerHTML = "";
  document.body.innerHTML = "";
  delete window.DlingLive;
});

describe("loadDlingLive", () => {
  it("injects the CDN loader once", () => {
    loadDlingLive();
    loadDlingLive({ src: "https://other.example/loader.js" });
    expect(scripts()).toHaveLength(1);
    expect((scripts()[0] as HTMLScriptElement).src).toBe(DEFAULT_LOADER_SRC);
  });

  it("queues calls made before the loader arrives, for the loader to replay", () => {
    loadDlingLive({ src: "https://cdn.example/loader.js" }).boot({ channel: "test-a" });
    expect(window.DlingLive?.q).toEqual([["boot", { channel: "test-a" }]]);
  });

  it("hands the boot callback to the loader", () => {
    const done = vi.fn();
    loadDlingLive({ src: "https://cdn.example/loader.js" }).boot({ channel: "test-a" }, done);
    expect(window.DlingLive?.q).toEqual([["boot", { channel: "test-a" }, done]]);
  });

  it("queues open/close handlers for the loader", () => {
    const onOpen = vi.fn();
    loadDlingLive({ src: "https://cdn.example/loader.js" }).onOpen(onOpen);
    expect(window.DlingLive?.q).toEqual([["onOpen", onOpen]]);
  });

  it("forwards to the loaded widget", () => {
    const widget = Object.assign(vi.fn(), { loaded: true });
    window.DlingLive = widget;
    loadDlingLive().open();
    expect(widget).toHaveBeenCalledWith("open");
  });
});

describe("<DlingLive>", () => {
  it("boots on mount, reboots on channel change, destroys on unmount", () => {
    const widget = Object.assign(vi.fn(), { loaded: true });
    window.DlingLive = widget;
    const root = createRoot(document.createElement("div"));
    act(() => root.render(<DlingLive channel="test-a" />));
    act(() => root.render(<DlingLive channel="test-b" />));
    act(() => root.unmount());
    expect(widget.mock.calls).toEqual([
      ["boot", { channel: "test-a" }],
      ["destroy"],
      ["boot", { channel: "test-b" }],
      ["destroy"],
    ]);
  });
});
