/**
 * Auth Module
 * Handles user authentication (register, login, logout), session persistence,
 * and header navigation updates according to auth state.
 */

const STORAGE_KEYS = {
  USERS: 'blog_users',
  CURRENT_USER: 'blog_currentUser'
};

// 기본 데모 계정 초기화
function initDefaultUsers() {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const defaultUsers = [
      {
        id: 'user_1',
        email: 'developer@example.com',
        password: 'password123',
        name: '홍길동',
        username: 'gildong_dev',
        role: 'Frontend Engineer',
        bio: '사용자 경험과 클린 코드를 사랑하는 프론트엔드 개발자입니다. 기술과 배움을 기록합니다.',
        avatar: 'assets/images/profile.jpg',
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        joinedDate: '2025-01-15',
        interests: ['Frontend', 'Architecture', 'UI/UX']
      }
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
  }
}

initDefaultUsers();

/**
 * 현재 로그인된 사용자 반환
 */
export function getCurrentUser() {
  try {
    const userJson = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return userJson ? JSON.parse(userJson) : null;
  } catch (e) {
    console.error('Failed to parse current user', e);
    return null;
  }
}

/**
 * 회원가입
 */
export function registerUser({ name, username, email, password, role, bio, interests }) {
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  
  // 이메일 중복 확인
  const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    throw new Error('이미 등록된 이메일 주소입니다.');
  }

  // 아이디/닉네임 중복 확인
  const existingUsername = users.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (existingUsername) {
    throw new Error('이미 사용 중인 닉네임(아이디)입니다.');
  }

  const newUser = {
    id: 'user_' + Date.now(),
    name: name.trim(),
    username: username.trim(),
    email: email.trim().toLowerCase(),
    password, // 실제 프로덕션에선 해싱 필요
    role: role || 'Junior Developer',
    bio: bio || '안녕하세요! 기술 블로그를 방문해 주셔서 감사합니다.',
    avatar: 'assets/images/profile.jpg',
    github: 'https://github.com',
    linkedin: '',
    joinedDate: new Date().toISOString().split('T')[0],
    interests: interests || ['Frontend']
  };

  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

  // 가입 즉시 자동 로그인
  setCurrentUser(newUser);
  return newUser;
}

/**
 * 로그인
 */
export function loginUser(emailOrUsername, password) {
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  const query = emailOrUsername.trim().toLowerCase();

  const user = users.find(u => 
    (u.email.toLowerCase() === query || u.username.toLowerCase() === query) &&
    u.password === password
  );

  if (!user) {
    throw new Error('이메일(아이디) 또는 비밀번호가 일치하지 않습니다.');
  }

  setCurrentUser(user);
  return user;
}

/**
 * 데모 계정으로 1초 로그인
 */
export function loginAsDemo() {
  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  const demoUser = users[0];
  if (demoUser) {
    setCurrentUser(demoUser);
    return demoUser;
  }
  return null;
}

/**
 * 로그인 사용자 정보 세션 저장
 */
export function setCurrentUser(user) {
  const safeUser = { ...user };
  delete safeUser.password;
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(safeUser));
}

/**
 * 로그아웃
 * @param {boolean} [redirectToHome=false] 홈으로 리다이렉트 여부
 */
export function logoutUser(redirectToHome = false) {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  if (currentPath === 'profile.html' || redirectToHome) {
    window.location.href = 'index.html';
  } else {
    window.location.reload();
  }
}

/**
 * 프로필 정보 수정
 */
export function updateUserProfile(updatedFields) {
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error('로그인이 필요합니다.');

  const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  const index = users.findIndex(u => u.id === currentUser.id);

  if (index !== -1) {
    const updated = { ...users[index], ...updatedFields };
    users[index] = updated;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    setCurrentUser(updated);
    return updated;
  } else {
    // 세션 사용자만 업데이트
    const updated = { ...currentUser, ...updatedFields };
    setCurrentUser(updated);
    return updated;
  }
}

/**
 * 헤더 네비게이션 바의 로그인 상태 UI 렌더링
 * - 비로그인 시: 로그인 버튼 / 회원가입 버튼
 * - 로그인 시: 로그아웃 버튼 / 프로필 버튼으로 변경 처리
 */
export function initNavAuth() {
  const navContainers = document.querySelectorAll('.nav-links');
  if (!navContainers || navContainers.length === 0) return;

  const currentUser = getCurrentUser();
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const menuToggleBtn = document.getElementById('menu-toggle');

  navContainers.forEach(navContainer => {
    // 기존 동적 auth 링크 요소 제거
    const existingAuthItems = navContainer.querySelectorAll('.nav-auth-item');
    existingAuthItems.forEach(item => item.remove());

    if (currentUser) {
      // 1. 글쓰기 버튼
      const writeLi = document.createElement('li');
      writeLi.className = 'nav-auth-item';
      const isWriteActive = currentPath === 'write.html' ? 'active' : '';
      writeLi.innerHTML = `
        <a href="write.html" class="nav-link ${isWriteActive} nav-btn-write" id="nav-write-btn" style="display: inline-flex; align-items: center; gap: 0.35rem;" title="새 아티클 작성">
          <span>✏️</span> 글쓰기
        </a>
      `;

      // 2. 로그아웃 버튼 (로그인 버튼 위치에 대응)
      const logoutLi = document.createElement('li');
      logoutLi.className = 'nav-auth-item';
      logoutLi.innerHTML = `
        <button type="button" id="nav-logout-btn" class="nav-link nav-logout-btn" title="로그아웃">
          로그아웃
        </button>
      `;

      // 3. 프로필 버튼 (회원가입 버튼 위치에 대응, 강조 스타일)
      const profileLi = document.createElement('li');
      profileLi.className = 'nav-auth-item';
      const isProfileActive = currentPath === 'profile.html' ? 'active' : '';
      profileLi.innerHTML = `
        <a href="profile.html" class="nav-link ${isProfileActive} nav-btn-highlight nav-profile-btn" id="nav-profile-btn" title="${currentUser.name}님의 프로필">
          <span>👤</span> 프로필
        </a>
      `;

      navContainer.appendChild(writeLi);
      navContainer.appendChild(logoutLi);
      navContainer.appendChild(profileLi);

      const logoutBtn = logoutLi.querySelector('#nav-logout-btn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
          e.preventDefault();
          if (confirm('로그아웃 하시겠습니까?')) {
            logoutUser();
          }
        });
      }

      // 모바일 드로어 클릭 시 닫기
      if (menuToggleBtn) {
        writeLi.querySelector('a')?.addEventListener('click', () => {
          navContainer.classList.remove('open');
          menuToggleBtn.innerHTML = '☰';
        });
        profileLi.querySelector('a')?.addEventListener('click', () => {
          navContainer.classList.remove('open');
          menuToggleBtn.innerHTML = '☰';
        });
      }
    } else {
      // 비로그인 상태: 로그인 버튼 / 회원가입 버튼
      // 1. 로그인 버튼
      const loginLi = document.createElement('li');
      loginLi.className = 'nav-auth-item';
      const isLoginActive = currentPath === 'login.html' ? 'active' : '';
      loginLi.innerHTML = `<a href="login.html" class="nav-link ${isLoginActive}" id="nav-login-btn">로그인</a>`;

      // 2. 회원가입 버튼 (강조 스타일)
      const registerLi = document.createElement('li');
      registerLi.className = 'nav-auth-item';
      const isRegActive = currentPath === 'register.html' ? 'active' : '';
      registerLi.innerHTML = `<a href="register.html" class="nav-link ${isRegActive} nav-btn-highlight" id="nav-register-btn">회원가입</a>`;

      navContainer.appendChild(loginLi);
      navContainer.appendChild(registerLi);

      // 모바일 드로어 클릭 시 닫기
      if (menuToggleBtn) {
        loginLi.querySelector('a')?.addEventListener('click', () => {
          navContainer.classList.remove('open');
          menuToggleBtn.innerHTML = '☰';
        });
        registerLi.querySelector('a')?.addEventListener('click', () => {
          navContainer.classList.remove('open');
          menuToggleBtn.innerHTML = '☰';
        });
      }
    }
  });
}
