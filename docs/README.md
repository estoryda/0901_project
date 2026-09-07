# 📑 개인 프로필 페이지 프로젝트 문서

HTML, CSS, Vanilla JavaScript를 활용하여 제작하는 반응형 개인 프로필/포트폴리오 웹페이지의 기획 및 기술 문서 모음입니다.

---

## 📚 문서 목차

1. [01. 요구사항 및 기능 정의서 (REQUIREMENTS.md)](file:///C:/Users/dhkim/Desktop/0901/docs/01_REQUIREMENTS.md)
   - 프로젝트 개요 및 목표
   - 핵심 섹션 및 기능 명세
   - 인터랙션 및 부가 기능 정의

2. [02. UI/UX 디자인 및 와이어프레임 가이드 (UI_DESIGN.md)](file:///C:/Users/dhkim/Desktop/0901/docs/02_UI_DESIGN.md)
   - 화면 레이아웃 및 섹션별 와이어프레임
   - 컬러 시스템 및 타이포그래피 (다크/라이트 모드 지원)
   - 반응형 레이아웃 기준 (Breakpoints)

3. [03. 기술 사양 및 파일 구조 설계서 (TECH_SPEC.md)](file:///C:/Users/dhkim/Desktop/0901/docs/03_TECH_SPEC.md)
   - 프론트엔드 폴더/파일 디렉토리 구조
   - HTML 시맨틱 마크업 설계
   - CSS 변수 및 스타일링 설계
   - JavaScript 모듈별 기능 로직 명세

---

## 🚀 개발 진행 로드맵

```mermaid
flowchart LR
    A[1. 기획/문서화] --> B[2. HTML 마크업]
    B --> C[3. CSS 스타일링]
    C --> D[4. JS 인터랙션]
    D --> E[5. 반응형 & 최적화]
```

1. **Step 1. 기획 및 문서화 (완료)** : 요구사항, UI 레이아웃, 기술 스택 확정
2. **Step 2. HTML 시맨틱 구조 작성** : `frontend/index.html` 기반 골격 구성
3. **Step 3. CSS 스타일링 & 디자인** : 반응형 레이아웃, CSS 변수, 다크모드 테마 적용
4. **Step 4. JavaScript 동적 기능 구현** : 다크모드 토글, 스크롤 애니메이션, 프로젝트 필터/모달 등
5. **Step 5. 브라우저 호환성 및 성능 점검** : 반응형 테스트, 웹 접근성, 성능 최적화
