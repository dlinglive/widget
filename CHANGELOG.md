# Changelog

## 0.5.0

- `identify({ memberId, memberHash } | null)`: 회원 연동. `memberHash` 는 고객사 서버가 hex(HMAC-SHA256(비밀값, memberId)) 로 만든다. 검증은 dlinglive 서버가 하고 실패하면 비회원으로 동작한다. 근거: 채널톡 `memberHash`, Intercom identity verification.

## 0.4.0

- `onOpen`·`onClose` 가 해제 함수를 돌려주고, handler 에 열고 닫은 이유(`reason`)를 넘긴다. 로더가 오기 전에 해제해도 된다.
- `boot` 옵션 `position`(`right`·`left`), `history`(모바일 뒤로가기로 닫기, 기본 켜짐). React `<DlingLive position />`.
- 로더(CDN) 동작: Esc 로 닫기와 포커스 복원, 모바일 전체 화면 동안 스크롤 잠금·뒤로가기로 닫기, `?dlinglive=open` 링크로 열기, 탭이 가려지면 상태 확인 멈춤, LIVE 시작 알림, safe area, 움직임 줄이기.

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
