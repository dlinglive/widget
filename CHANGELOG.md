# Changelog

## 0.7.0

- 기본 로더는 `https://dling.live/widget/loader.js`다. 패키지를 사용 중이면 0.7.0으로 올리고, HTML에 직접 넣었거나 `src`를 지정했다면 이 주소로 갱신한다.
- 최신 시청 화면은 채널 `/web/c/<채널>`, 방송 `/web/live/<방송ID>`에서 제공한다. 이전 버전 경로는 404다.

## 0.6.0

- 기본 로더 주소가 `https://dling.live/widget/v2/loader.js` 로 바뀌었다. 옛 `/widget/v1/loader.js` 와 v1 시청 화면(`/web/c/`·`/web/live/`·`/c/`)은 지원을 끝냈다(404). 0.5.0 이하에서 `src` 를 지정하지 않았다면 이 버전으로 올린다. 시청 화면 주소는 `/web/v2/c/<채널>`·`/web/v2/live/<방송ID>`.
- `boot` 옵션 `mini`(기본 켜짐): 방송 중이거나 다시보기가 있는 채널이면 첫 방문 때 우측 하단(또는 `position`)에 미니 플레이어가 음소거로 자동 재생된다. 누르면 크게 열리고, 닫으면 미니로 돌아간다. 미니의 ✕ 를 누르면 그 방송 동안 이 브라우저에서 다시 띄우지 않는다. `mini: false` 면 런처만 띄운다. React `<DlingLive mini />`. 근거: Firework 플로팅 플레이어 `player_placement`(기본 우측 하단), Bambuser miniplayer·음소거 자동재생.

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
