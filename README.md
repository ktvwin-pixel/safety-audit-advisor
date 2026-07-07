# 대한민국 안전감찰 수석 자문 AI

정적 웹앱으로 구성되어 PC, 태블릿, 모바일 브라우저에서 실행할 수 있습니다.

## 같은 PC에서 실행

```powershell
node server.js
```

브라우저에서 `http://127.0.0.1:4197/` 접속.

## 같은 Wi-Fi의 다른 PC·모바일에서 실행

1. 이 폴더 전체를 실행 PC에 둡니다.
2. 실행 PC에서 `node server.js`를 실행합니다.
3. 실행 PC의 내부 IP를 확인합니다.
4. 다른 기기에서 `http://실행PC_IP:4197/`로 접속합니다.

방화벽이 물으면 Node.js의 개인 네트워크 접근을 허용합니다.

## 외부 컴퓨터에서도 사용

이 폴더의 `index.html`, `app.js`, `styles.css`, `manifest.webmanifest`, `sw.js`, `assets/`를 정적 호스팅에 업로드하면 됩니다.

외부 Wi-Fi, LTE, 5G 등 모바일데이터 환경에서는 `127.0.0.1` 또는 `192.168.x.x` 같은 내부 주소로 접속할 수 없습니다. 반드시 기관 홈페이지, 사내 공개 웹서버, 또는 HTTPS 정적 호스팅 주소를 사용해야 합니다.

권장 홈페이지 주소 형식:

```text
https://기관도메인/safety-audit-advisor/
https://기관도메인/안전감찰-ai/
https://기관도메인/ai/safety-audit/
```

기관별 예시:

```text
https://www.example.go.kr/safety-audit-advisor/
https://audit.example.go.kr/safety-audit-advisor/
https://www.example.go.kr/안전감찰-ai/
```

권장 배포 방식:
- GitHub Pages
- 사내 웹서버
- Netlify, Vercel 등 HTTPS 정적 호스팅

모바일 설치형 앱처럼 사용하려면 HTTPS 주소에서 접속 후 브라우저의 홈 화면 추가 또는 앱 설치 기능을 사용합니다.

PWA 설치와 오프라인 캐시는 보안 정책상 HTTPS 공개 주소에서 가장 안정적으로 작동합니다. 같은 Wi-Fi 내부 테스트는 `http://실행PC_IP:4197/`로 가능하지만, 외부망 또는 모바일데이터 접속용 운영 주소로는 적합하지 않습니다.

## 중앙정부·지방정부 개별 배포

전체 법령·안전감찰 기준은 앱에 공통 내장되어 있습니다.

각 기관은 최초 접속 후 왼쪽 `기관 맞춤 설정`에 다음 값을 저장하면 됩니다.

- 기관명
- 기관 유형: 중앙정부, 지방정부, 공공기관
- 공식 홈페이지 URL
- 자치법규·훈령·예규 URL
- 안전관리계획·재난관리기금 URL
- 지역·기관 특성: 주요 위험시설, 인구·산업·복지시설 특성, 최근 현안 등

저장된 기관 설정은 해당 브라우저에 보관되며, 이후 모든 답변의 현황 분석, 법적 검토, 비교 분석, 추가 입력 요청에 반영됩니다.

여러 기관에 배포할 때는 같은 ZIP 파일을 기관별 서버 또는 정적 호스팅에 각각 업로드하고, 각 기관 담당자가 자기 기관 URL과 지역 특성을 저장해 사용하면 됩니다.

기관별 배포 주소 권장 규칙:

- 중앙정부: `https://부처도메인/safety-audit-advisor/`
- 광역지자체: `https://시도도메인/safety-audit-advisor/`
- 기초지자체: `https://시군구도메인/safety-audit-advisor/`
- 공공기관: `https://기관도메인/safety-audit-advisor/`

주소 끝에는 `/`를 유지하는 것을 권장합니다. 앱의 `manifest.webmanifest`, `sw.js`, `assets/`가 같은 폴더 아래에 있어야 설치형 앱과 오프라인 캐시가 정상 작동합니다.
