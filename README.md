# Uni-T 팀과외 웹 대시보드

학생, 학부모, 튜터, 관리자 모듈이 통합된 팀과외 플랫폼 웹 대시보드입니다.

## 📁 프로젝트 구조

```
FRST_Uni-T/
├── Uni_T/
│   ├── index.html      # 메인 HTML 파일
│   ├── styles/
│   │   └── main.css    # 스타일시트
│   └── scripts/
│       └── main.js     # JavaScript 로직
└── README.md
```

## 🚀 GitHub Pages 배포 방법

### 방법 1: GitHub Pages 설정에서 폴더 지정 (권장)

1. GitHub 저장소로 이동
2. **Settings** → **Pages** 메뉴 클릭
3. **Source** 섹션에서:
   - Branch: `main` (또는 사용 중인 브랜치)
   - Folder: **`/Uni_T`** 선택
4. **Save** 클릭
5. 몇 분 후 `https://[사용자명].github.io/[저장소명]/` 에서 접속 가능

### 방법 2: 루트에 index.html 배치

루트의 `index.html`이 자동으로 `Uni_T/index.html`로 리다이렉트합니다.

## 🎨 기능

- **학생 모드**: 학습 홈, 월간 리포트, 알림센터
- **학부모 모드**: 홈, 결제·팀 관리, 알림센터
- **튜터 모드**: 홈, 클래스 관리, 스케줄·자료, 알림센터
- **관리자 모드**: 튜터·수업 관리, 오퍼레이션 정산, 매칭 관리, 알림센터

## 🛠️ 기술 스택

- HTML5
- CSS3 (Custom Properties, Flexbox, Grid)
- JavaScript (Vanilla JS)
- Chart.js (데이터 시각화)

## 📝 참고사항

- GitHub Pages는 Jekyll을 기본으로 사용하지만, `.nojekyll` 파일로 비활성화되어 있습니다.
- 모든 경로는 상대 경로로 설정되어 있어 폴더 구조 변경 시 주의가 필요합니다.

