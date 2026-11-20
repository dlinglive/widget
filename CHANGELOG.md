# Changelog

## 0.3.1

- 코드 변경 없음. npm trusted publishing(OIDC)으로 배포한 첫 버전.

## 0.3.0

- `onOpen(handler)`·`onClose(handler)`: 패널이 열리고 닫힐 때마다 부른다(열린 채 destroy 도 close). 근거: 채널톡 `channel-web-sdk-loader` 의 `onShowMessenger`·`onHideMessenger`.

## 0.2.0

- `boot(options, callback?)`: 런처가 뜨면 `callback(null)`, boot 가 거절되면 `callback(error)` 를 한 번 부른다. 설치 검증에 쓴다. 근거: 채널톡 `channel-web-sdk-loader` 의 `boot(option, callback)`.

## 0.1.1

- `@dlinglive/widget/react` 에 `"use client"` 지시어. Next.js App Router 서버 컴포넌트에서 import 가능.
- README.

## 0.1.0

- `loadDlingLive()` 와 `boot`·`open`·`close`·`destroy`, React `<DlingLive channel />`.
