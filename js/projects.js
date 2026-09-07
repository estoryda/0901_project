/**
 * Projects & Modal Module
 * Manages project data, filtering, card rendering, and detailed modal views.
 */

export const projectData = [
  {
    id: 1,
    title: '모던 반응형 개인 포트폴리오',
    category: 'frontend',
    categoryLabel: 'Frontend',
    icon: '💻',
    period: '2026.08 - 2026.09',
    description: 'HTML5, CSS3, Vanilla JavaScript를 활용하여 제작한 빠르고 가벼운 반응형 프로필 웹사이트입니다.',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive', 'Light/Dark Theme'],
    features: [
      'CSS 변수(Variables) 기반 다크/라이트 테마 즉시 전환',
      'IntersectionObserver를 활용한 고성능 스크롤 인터랙션 및 애니메이션',
      '모바일 터치 친화적 네비게이션 드로어 UI 지원',
      '외부 라이브러리 없이 100% 순수 웹 표준 기술로 구현하여 최적의 로딩 성능 보장'
    ],
    demoUrl: '#',
    githubUrl: 'https://github.com'
  },
  {
    id: 2,
    title: '실시간 할 일 관리 웹 애플리케이션 (Task Master)',
    category: 'frontend',
    categoryLabel: 'Frontend',
    icon: '📋',
    period: '2026.05 - 2026.06',
    description: '드래그 앤 드롭을 지원하는 칸반 보드 스타일의 인터랙티브 투두리스트 웹앱입니다.',
    tags: ['JavaScript', 'HTML5 Drag & Drop', 'CSS Grid', 'LocalStorage'],
    features: [
      'HTML5 Drag and Drop API를 활용한 카드 상태 이동 기능',
      'LocalStorage를 통한 브라우저 영구 데이터 저장 및 동기화',
      '우선순위(긴급/보통/낮음)별 정렬 및 태그 필터링',
      '완료율 통계 차트 시각화'
    ],
    demoUrl: '#',
    githubUrl: 'https://github.com'
  },
  {
    id: 3,
    title: 'RESTful API 기반 블로그 & CMS 백엔드',
    category: 'backend',
    categoryLabel: 'Backend',
    icon: '⚙️',
    period: '2026.03 - 2026.04',
    description: 'Node.js와 Express를 활용하여 인증 및 CRUD 기능을 갖춘 RESTful API 백엔드 서버입니다.',
    tags: ['Node.js', 'Express', 'JWT', 'MongoDB', 'REST API'],
    features: [
      'JWT 기반 사용자 인증 및 권한(Role) 인가 미들웨어 구현',
      '게시글, 카테고리, 댓글 CRUD 및 페이징/검색 쿼리 최적화',
      'Swagger(OpenAPI)를 활용한 API 명세서 자동 문서화',
      'Bcrypt를 적용한 안전한 비밀번호 해싱 및 보안 헤더 설정'
    ],
    demoUrl: '#',
    githubUrl: 'https://github.com'
  },
  {
    id: 4,
    title: '글로벌 날씨 정보 & 대기질 대시보드',
    category: 'frontend',
    categoryLabel: 'Frontend',
    icon: '🌤️',
    period: '2026.01 - 2026.02',
    description: '공공 날씨 Open API를 연동하여 전 세계 주요 도시의 날씨 및 미세먼지 수치를 시각화한 대시보드입니다.',
    tags: ['JavaScript', 'Fetch API', 'Chart.js', 'Geolocation API'],
    features: [
      '브라우저 Geolocation API로 사용자 현재 위치 자동 감지 및 날씨 조회',
      '비동기 Fetch API를 활용한 날씨/미세먼지 실시간 데이터 수신',
      '주간 기온 변화 그래프 및 강수 확률 Chart 시각화',
      '날씨 상태(맑음, 비, 눈 등)에 따른 동적 배경 테마 변경'
    ],
    demoUrl: '#',
    githubUrl: 'https://github.com'
  },
  {
    id: 5,
    title: '인터랙티브 웹 타이머 & 뽀모도로 포커스 앱',
    category: 'toy',
    categoryLabel: 'Toy Project',
    icon: '⏱️',
    period: '2025.11 - 2025.12',
    description: '집중력 향상을 돕는 뽀모도로 기법 기반의 감각적인 타이머 및 화이트 노이즈 사운드 플레이어입니다.',
    tags: ['Vanilla JS', 'Web Audio API', 'Canvas API', 'Notifications'],
    features: [
      'Canvas API를 이용한 원형 타이머 게이지 애니메이션 렌더링',
      'Web Audio API를 활용한 빗소리/카페/모닥불 백색소음 믹싱 기능',
      '브라우저 Notification API 기반 세션 종료 데스크톱 알림',
      '일간 집중 시간 기록 및 로컬 통계 저장'
    ],
    demoUrl: '#',
    githubUrl: 'https://github.com'
  },
  {
    id: 6,
    title: '협업 게시판 & 풀스택 커뮤니티 플랫폼',
    category: 'fullstack',
    categoryLabel: 'Fullstack',
    icon: '💬',
    period: '2025.08 - 2025.10',
    description: '웹소켓 실시간 채팅과 게시판 기능을 통합한 개발자 커뮤니티 웹 플랫폼입니다.',
    tags: ['JavaScript', 'Node.js', 'Socket.io', 'MySQL', 'CSS3'],
    features: [
      'Socket.io 기반 실시간 1:1 및 그룹 채팅방 기능',
      '마크다운 에디터 지원 및 코드 신택스 하이라이팅',
      '좋아요, 북마크, 실시간 댓글 알림 시스템',
      '반응형 레이아웃 및 모바일 뷰 완벽 대응'
    ],
    demoUrl: '#',
    githubUrl: 'https://github.com'
  }
];

export function initProjects() {
  const container = document.getElementById('projects-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const modal = document.getElementById('project-modal');
  const modalCloseBtn = modal ? modal.querySelector('.modal-close') : null;
  const modalBackdrop = modal ? modal.querySelector('.modal-backdrop') : null;
  const modalBody = document.getElementById('modal-body');

  if (!container) return;

  // 1. 초기 렌더링 (All)
  renderProjects('all');

  // 2. 필터 버튼 이벤트 바인딩
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter') || 'all';
      renderProjects(filter);
    });
  });

  // 프로젝트 렌더링 함수
  function renderProjects(filter) {
    const filtered = filter === 'all' 
      ? projectData 
      : projectData.filter(p => p.category === filter);

    container.innerHTML = filtered.map(item => `
      <div class="project-card fade-in-section is-visible" data-id="${item.id}">
        <div class="project-thumbnail">
          <span class="thumbnail-icon">${item.icon}</span>
          <span class="project-badge">${item.categoryLabel}</span>
        </div>
        <div class="project-content">
          <h3 class="project-title">${item.title}</h3>
          <p class="project-desc">${item.description}</p>
          <div class="project-tech-tags">
            ${item.tags.map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
          </div>
          <div class="project-footer-links">
            <span class="project-link">상세 보기 ➔</span>
            <span style="font-size: 0.8rem; color: var(--text-muted);">${item.period}</span>
          </div>
        </div>
      </div>
    `).join('');

    // 카드 클릭 시 모달 열기 이벤트 등록
    const cards = container.querySelectorAll('.project-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const id = parseInt(card.getAttribute('data-id'), 10);
        openModal(id);
      });
    });
  }

  // 3. 모달 제어 함수
  function openModal(id) {
    const project = projectData.find(p => p.id === id);
    if (!project || !modal || !modalBody) return;

    modalBody.innerHTML = `
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <span style="font-size: 3.5rem; display: inline-block; margin-bottom: 0.75rem;">${project.icon}</span>
        <div class="section-tag">${project.categoryLabel}</div>
        <h2 style="font-size: 1.6rem; font-weight: 800; margin: 0.5rem 0;">${project.title}</h2>
        <p style="font-size: 0.9rem; color: var(--text-muted);">${project.period}</p>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <h4 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--accent-primary);">📌 프로젝트 개요</h4>
        <p style="color: var(--text-secondary); line-height: 1.7;">${project.description}</p>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <h4 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--accent-primary);">✨ 주요 구현 기능</h4>
        <ul style="list-style: disc; padding-left: 1.25rem; color: var(--text-secondary); line-height: 1.8;">
          ${project.features.map(f => `<li>${f}</li>`).join('')}
        </ul>
      </div>

      <div style="margin-bottom: 2rem;">
        <h4 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--accent-primary);">🛠️ 사용 기술 및 도구</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          ${project.tags.map(tag => `<span class="skill-tag">${tag}</span>`).join('')}
        </div>
      </div>

      <div style="display: flex; gap: 1rem; justify-content: flex-end; padding-top: 1rem; border-top: 1px solid var(--border-color);">
        <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="padding: 0.6rem 1.2rem; font-size: 0.9rem;">
          GitHub 코드
        </a>
        <a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="padding: 0.6rem 1.2rem; font-size: 0.9rem;">
          라이브 데모 ↗
        </a>
      </div>
    `;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closeModal);
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
}
