# Windows -> macOS iOS 전환 체크리스트

## 1) 코드 동기화
- [ ] Windows에서 작업 내용을 커밋 또는 백업
- [ ] macOS에서 저장소 클론 또는 최신 브랜치 pull
- [ ] `.env` 등 로컬 설정 파일 재배치

## 2) macOS 개발 환경
- [ ] Xcode 최신 버전 설치
- [ ] Xcode Command Line Tools 설치
- [ ] Node.js 20+ 설치
- [ ] CocoaPods 설치 (`sudo gem install cocoapods` 또는 brew 환경)
- [ ] Watchman 설치 (`brew install watchman`)

## 3) 프로젝트 의존성 재설치
- [ ] `npm install`
- [ ] `npx expo prebuild -p ios`
- [ ] `cd ios && pod install && cd ..`

## 4) iOS 실행 확인
- [ ] `npx expo run:ios`로 시뮬레이터 실행
- [ ] 실기기 테스트 시 Apple Developer 계정/서명 설정
- [ ] 카메라 권한 팝업/권한 승인 동작 확인

## 5) 실시간 기능 점검
- [ ] 오버레이(삼분할/수평선) 표시 확인
- [ ] 구도 점수/문구 피드백 변화 확인
- [ ] 자세 점수/문구 피드백 변화 확인
- [ ] 점수 스무딩으로 UI 깜빡임 감소 확인

## 6) 성능 점검 (MVP 기준)
- [ ] 체감 지연 300ms 내 목표 검증
- [ ] 프리뷰 체감 20fps 이상 확인
- [ ] 10분 연속 구동 시 발열/프레임 드랍 기록

## 7) 배포 준비
- [ ] `app.json`의 `ios.bundleIdentifier`를 실제 값으로 변경
- [ ] 아이콘/스플래시 등 에셋 점검
- [ ] `eas build -p ios` 또는 Xcode Archive/TestFlight 진행
