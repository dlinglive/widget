# @dlinglive/widget

[![npm](https://img.shields.io/npm/v/@dlinglive/widget)](https://www.npmjs.com/package/@dlinglive/widget)

[들링라이브](https://dling.live) 라이브 방송을 내 쇼핑몰·웹사이트에 띄우는 위젯입니다. 페이지 오른쪽 아래에 런처 버튼이 생기고, 방송 중이면 LIVE 배지가 붙습니다. 버튼을 누르면 시청·채팅 패널이 열립니다.

이 패키지는 위젯 로더(`https://dling.live/widget/v1/loader.js`)를 페이지에 넣고, 로더가 준비되기 전의 호출을 큐에 쌓아 두었다가 실행하며, TypeScript 타입을 제공합니다. 위젯 본체는 CDN 에서 받으므로 위젯이 개선되어도 패키지를 다시 설치할 필요가 없습니다.

## 목차

- [설치](#설치)
- [빠른 시작](#빠른-시작)
- [API](#api)
- [동작 방식](#동작-방식)
- [CSP 설정](#csp-설정)
- [script 태그로 설치](#script-태그로-설치)
- [AI 에이전트로 설치](#ai-에이전트로-설치)
- [변경 이력](#변경-이력)

## 설치

```bash
npm install @dlinglive/widget
# 또는
pnpm add @dlinglive/widget
yarn add @dlinglive/widget
```

아래 예시의 `CHANNEL_SLUG` 는 내 채널 주소로 바꿉니다. 채널 시청 화면 주소 `https://dling.live/web/c/<채널 주소>` 의 마지막 부분입니다.

## 빠른 시작

### React · Next.js

```tsx
import { DlingLive } from "@dlinglive/widget/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <DlingLive channel="CHANNEL_SLUG" />
    </>
  );
}
```

- 화면에 아무것도 렌더링하지 않고, 마운트될 때 위젯을 띄우고 언마운트될 때 지웁니다.
- `"use client"` 가 들어 있어 Next.js App Router 의 서버 컴포넌트(`app/layout.tsx`)에서 바로 import 할 수 있습니다.
- 모든 페이지에 띄우려면 최상위 레이아웃에 한 번만 넣습니다.

### 그 밖의 환경 (Vue, Svelte, 순수 JavaScript 등)

```ts
import { loadDlingLive } from "@dlinglive/widget";

const live = loadDlingLive();

live.boot({ channel: "CHANNEL_SLUG" }, (error) => {
  if (error) console.error("위젯을 띄우지 못했습니다", error);
});

live.onOpen(() => console.log("패널 열림"));
live.onClose(() => console.log("패널 닫힘"));
```

SPA 에서 위젯을 띄울 화면을 벗어날 때는 `live.destroy()` 를 부릅니다.

## API

### `loadDlingLive(options?)`

로더 script 를 페이지에 한 번만 넣고 API 객체를 돌려줍니다. 여러 번 불러도 script 는 하나만 들어갑니다. 서버(SSR)에서 불러도 아무것도 하지 않습니다.

| 옵션  | 타입     | 기본값                                   | 설명      |
| ----- | -------- | ---------------------------------------- | --------- |
| `src` | `string` | `https://dling.live/widget/v1/loader.js` | 로더 주소 |

### 명령

| 메서드                     | 설명                                                                                                                                                                                                                                         |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `boot(options, callback?)` | 채널의 런처를 띄웁니다. 다시 부르면 기존 위젯을 지우고 새로 띄웁니다. `callback` 은 런처가 뜨면 `callback(null)`, 실패하면 `callback(error)` 로 한 번 불립니다. 설치 확인에 씁니다. 같은 때 `document` 에 `dlinglive:ready` 이벤트가 납니다. |
| `open()`                   | 패널을 엽니다.                                                                                                                                                                                                                               |
| `close()`                  | 패널을 닫습니다.                                                                                                                                                                                                                             |
| `destroy()`                | 런처와 패널을 페이지에서 지웁니다. 여러 번 불러도 됩니다.                                                                                                                                                                                    |
| `onOpen(handler)`          | 패널이 열릴 때마다 `handler(reason)` 를 부릅니다. 해제 함수를 돌려줍니다.                                                                                                                                                                    |
| `onClose(handler)`         | 패널이 닫힐 때마다 `handler(reason)` 를 부릅니다. 닫기 전환이 끝난 뒤 불리고, 열린 채로 `destroy()` 해도 불립니다. 해제 함수를 돌려줍니다.                                                                                                   |

`boot` 옵션:

| 옵션       | 타입                  | 기본값    | 설명                                                                                           |
| ---------- | --------------------- | --------- | ---------------------------------------------------------------------------------------------- |
| `channel`  | `string`              | (필수)    | 채널 주소                                                                                      |
| `position` | `"right"` \| `"left"` | `"right"` | 런처 위치                                                                                      |
| `history`  | `boolean`             | `true`    | 모바일 전체 화면에서 뒤로가기로 패널을 닫습니다. `false` 면 브라우저 이력을 건드리지 않습니다. |

`reason` 값: 열기는 `api`(코드) · `interaction`(런처 클릭) · `link`(`?dlinglive=open` 링크), 닫기는 `api` · `interaction`(버튼·Esc) · `back`(뒤로가기) · `player`(플레이어 안 닫기).

### `<DlingLive />` (React)

| prop       | 타입                  | 설명             |
| ---------- | --------------------- | ---------------- |
| `channel`  | `string`              | 채널 주소 (필수) |
| `position` | `"right"` \| `"left"` | 런처 위치 (선택) |
| `src`      | `string`              | 로더 주소 (선택) |

### 타입

`BootOptions`, `BootCallback`, `OpenReason`, `CloseReason`, `LoadOptions`, `DlingLiveApi`, `DlingLiveProps` 를 export 합니다. 전역 `window.DlingLive` 타입도 함께 선언됩니다.

## 동작 방식

- 런처 버튼은 Shadow DOM 안에 그려서 내 사이트의 CSS 와 서로 영향을 주지 않습니다. 화면 맨 위 층(`z-index: 2147483647`)에 놓입니다.
- 시청·채팅 화면은 `https://dling.live` 의 iframe 으로 열립니다. 처음 열 때 만들고, 닫으면 지워서 영상과 채팅 연결도 끊깁니다.
- LIVE 배지는 방송 상태를 30초마다 확인해 표시합니다. 탭이 가려져 있으면 확인을 멈추고 다시 보일 때 바로 확인합니다. 방송이 시작되면 화면 낭독기에 알립니다.
- 화면 폭이 480px 이하인 모바일에서는 패널이 전체 화면으로 열리고, 그동안 페이지 스크롤을 잠급니다. 뒤로가기를 누르면 페이지를 떠나지 않고 패널만 닫힙니다.
- Esc 로 닫을 수 있고, 닫으면 열기 전에 있던 곳으로 포커스가 돌아갑니다.
- 아이폰 노치·홈 바 영역(safe area)을 피해 배치합니다. 움직임 줄이기 설정을 켠 사용자에게는 애니메이션을 끕니다.
- 페이지 주소에 `?dlinglive=open` 을 붙여 공유하면 그 링크로 들어온 사람에게 패널이 바로 열립니다. 열고 나면 주소에서 이 값을 지웁니다.
- 다른 페이지의 iframe 안에서는 위젯을 띄우지 않습니다(`boot` 가 error 로 끝납니다).
- 로더 주소의 `v1` 은 메이저 버전입니다. 같은 주소에는 하위 호환되는 변경만 반영됩니다.

## CSP 설정

사이트에 `Content-Security-Policy` 가 있으면 아래를 추가합니다.

```
script-src https://dling.live
connect-src https://chat.dling.live
frame-src https://dling.live
```

## script 태그로 설치

빌드 도구 없이 HTML 에 직접 넣거나, 아임웹·식스샵·고도몰·메이크샵·카페24·Shopify·WordPress 같은 쇼핑몰 빌더의 "코드 삽입" 설정에 붙여 넣을 때는 패키지 없이 아래 한 줄이면 됩니다.

```html
<script async src="https://dling.live/widget/v1/loader.js" data-channel="CHANNEL_SLUG"></script>
```

런처를 왼쪽에 두려면 `data-position="left"` 를 더합니다. CSP 에 nonce 를 쓰면 이 script 태그에 `nonce` 를 붙이세요. 위젯 스타일에도 같은 값이 쓰입니다.

## AI 에이전트로 설치

Claude Code, Cursor 같은 AI 코딩 에이전트에게 아래 한 줄을 보내면 프로젝트 구조를 보고 알맞은 방법으로 설치합니다.

```
https://docs.dling.live/install.md 를 읽고 이 사이트에 dlinglive 라이브 위젯을 채널 CHANNEL_SLUG 로 설치해줘
```

## 변경 이력

[CHANGELOG.md](./CHANGELOG.md)
