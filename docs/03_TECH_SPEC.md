frontend/
├── index.html              # 메인 홈 페이지 (Hero & 포트폴리오 둘러보기)
├── about.html              # About Me 상세 페이지
├── skills.html             # Skills 기술 스택 상세 페이지
├── projects.html           # Projects & Portfolio 필터/모달 상세 페이지
├── experience.html         # Experience & Education 타임라인 상세 페이지
├── css/
│   ├── variables.css       # 색상, 폰트, 공통 CSS 변수 정의
│   ├── reset.css           # 브라우저 기본 스타일 초기화 (Normalize/Reset)
│   ├── style.css           # 레이아웃, 컴포넌트, 섹션 스타일
│   └── responsive.css      # 미디어 쿼리 기반 반응형 스타일
├── js/
│   ├── main.js             # 진입점 및 공통 초기화 스크립트
│   ├── theme.js            # 다크/라이트 테마 모드 전환 및 로컬스토리지 연동
│   ├── scroll.js           # 현재 활성 네비게이션 자동 감지, 스크롤 프로그레스, Top 버튼
│   ├── projects.js         # 프로젝트 필터링, 데이터 렌더링, 모달 팝업 제어
│   └── typing.js           # Hero 섹션 타이핑 애니메이션 효과
└── assets/
    ├── images/             # 프로필 사진 (profile.jpg), 프로젝트 썸네일 등
    └── icons/              # 파비콘 및 아이콘 리소스

---

## 2. HTML 시맨틱 구조 설계 (`index.html`)

```html
<!DOCTYPE html>
<html lang="ko" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>개인 프로필 & 포트폴리오</title>
  <!-- CSS Stylesheets -->
  <link rel="stylesheet" href="css/reset.css">
  <link rel="stylesheet" href="css/variables.css">
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/responsive.css">
</head>
<body>
  <!-- 스크롤 진행 바 -->
  <div id="scroll-progress" class="scroll-progress"></div>

  <!-- 상단 헤더 & 네비게이션 -->
  <header id="header" class="header">
    <nav class="nav-container">
      <a href="#hero" class="logo">Portfolio</a>
      <ul class="nav-links">
        <li><a href="#about" class="nav-link">About</a></li>
        <li><a href="#skills" class="nav-link">Skills</a></li>
        <li><a href="#projects" class="nav-link">Projects</a></li>
        <li><a href="#experience" class="nav-link">Experience</a></li>
        <li><a href="#contact" class="nav-link">Contact</a></li>
      </ul>
      <div class="nav-actions">
        <button id="theme-toggle" class="theme-toggle" aria-label="테마 전환">🌓</button>
        <button id="menu-toggle" class="menu-toggle" aria-label="메뉴 열기">☰</button>
      </div>
    </nav>
  </header>

  <main>
    <!-- 1. Hero 섹션 -->
    <section id="hero" class="hero-section"> ... </section>

    <!-- 2. About Me 섹션 -->
    <section id="about" class="section about-section"> ... </section>

    <!-- 3. Skills 섹션 -->
    <section id="skills" class="section skills-section"> ... </section>

    <!-- 4. Projects 섹션 -->
    <section id="projects" class="section projects-section"> ... </section>

    <!-- 5. Experience 섹션 -->
    <section id="experience" class="section experience-section"> ... </section>

    <!-- 6. Contact 섹션 -->
    <section id="contact" class="section contact-section"> ... </section>
  </main>

  <!-- 하단 푸터 -->
  <footer class="footer"> ... </footer>

  <!-- 맨 위로 가기 버튼 -->
  <button id="back-to-top" class="back-to-top" aria-label="맨 위로 가기">↑</button>

  <!-- 프로젝트 상세 모달 -->
  <div id="project-modal" class="modal hidden" role="dialog" aria-modal="true">
    <div class="modal-backdrop"></div>
    <div class="modal-content">
      <button class="modal-close" aria-label="닫기">&times;</button>
      <div id="modal-body"></div>
    </div>
  </div>

  <!-- JavaScript Scripts -->
  <script type="module" src="js/main.js"></script>
</body>
</html>
```

---

## 3. CSS 아키텍처 및 스타일 규칙

1. **CSS Custom Properties (변수) 활용**:
   - `variables.css`에 모든 색상, 여백 간격, 라운딩, 트랜지션 속도를 정의하여 일관성 유지.
   - `html[data-theme="dark"]` 선택자를 통해 변수값만 재정의하여 테마 전환을 매끄럽게 처리.
2. **Modern CSS Layout**:
   - 컴포넌트 내부는 `Flexbox` 활용 (`display: flex; gap: ...;`)
   - 카드 목록, 스킬 목록 등 2차원 배치는 `CSS Grid` 활용 (`display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));`)
3. **Scroll-Driven & Intersection Animations**:
   - `IntersectionObserver`로 `.fade-in` 클래스가 뷰포트에 들어올 때 투명도 및 Y축 이동 트랜지션 실행.

---

## 4. JavaScript 모듈별 구현 사양

| 모듈 파일명 | 담당 기능 및 주요 API |
|---|---|
| `theme.js` | - `localStorage.getItem('theme')` / `setItem` 관리<br>- `document.documentElement.setAttribute('data-theme', theme)` |
| `scroll.js` | - `window.addEventListener('scroll')`로 스크롤 프로그레스 바 너비 갱신<br>- `IntersectionObserver`로 현재 뷰포트의 섹션 감지 및 헤더 메뉴 활성화 (`active` 클래스 부여)<br>- Top 이동 버튼 표시/숨김 및 클릭 시 `window.scrollTo({ top: 0, behavior: 'smooth' })` |
| `typing.js` | - Hero 섹션 텍스트 배열을 순회하며 글자 단위 타이핑 및 지우기 애니메이션 루프 |
| `projects.js` | - 프로젝트 데이터 배열(JSON 형태) 관리<br>- 카테고리 탭 클릭 시 필터링 및 동적 DOM 렌더링<br>- 카드 클릭 시 모달 열기 및 ESC/배경 클릭 시 닫기 |
| `main.js` | - 각 모듈 import 및 DOMContentLoaded 시점 초기화 호출 |
