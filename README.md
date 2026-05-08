# AI 사진 촬영 지원 앱 MVP (iPhone 전용)

실시간 구도 가이드와 자세 피드백을 제공하는 iPhone 전용 MVP입니다.

## 현재 구현 범위
- 카메라 프리뷰 및 권한 처리
- 삼분할/수평 오버레이
- 구도 점수 계산 로직
- 포즈 기반 자세 점수/피드백 로직
- 실시간 점수 스무딩 및 피드백 패널 UI

## 실행 (iOS)
1. macOS + Xcode 설치
2. Node.js 20+ 설치
3. 의존성 설치
   - `npm install`
4. iOS 프로젝트 생성/동기화
   - `npx expo prebuild -p ios`
5. CocoaPods 설치
   - `cd ios && pod install && cd ..`
6. iOS 실행
   - `npx expo run:ios`

## 포즈 추정 엔진 교체 안내
현재 `src/analysis/poseEstimator.ts`는 다음 우선순위로 동작합니다.
1. iOS 네이티브 프레임 프로세서가 전달한 랜드마크 payload
2. MediaPipe 로더
3. 데모용 Mock 폴백

추가로 macOS 전환 절차는 `docs/windows-to-macos-ios-checklist.md`를 참고하세요.
