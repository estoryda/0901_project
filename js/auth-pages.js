/**
 * Auth Pages Controller (Login & Register)
 * Handles form validation, credential checks, demo logins, and redirection.
 * Supports both Google Apps Script Spreadsheet API and LocalStorage Fallback.
 */

import { loginUser, registerUser, loginAsDemo, getCurrentUser, setCurrentUser } from './auth.js';
import { apiLoginUser, apiRegisterUser, GAS_WEB_APP_URL } from './api-service.js';

export function initLoginPage() {
  const loginForm = document.getElementById('login-form');
  if (!loginForm) return;

  // 이미 로그인되어 있으면 안내
  const currentUser = getCurrentUser();
  if (currentUser) {
    const noticeBox = document.getElementById('already-logged-notice');
    if (noticeBox) {
      noticeBox.style.display = 'block';
      noticeBox.innerHTML = `
        <p>이미 <strong>${currentUser.name}</strong> 계정으로 로그인되어 있습니다.</p>
        <a href="profile.html" class="btn btn-primary" style="margin-top: 0.5rem; display: inline-block;">내 프로필로 이동</a>
      `;
    }
  }

  // 1. 일반 로그인 폼 제출
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const errorEl = document.getElementById('login-error');
    const submitBtn = loginForm.querySelector('button[type="submit"]');

    if (errorEl) errorEl.textContent = '';

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      if (errorEl) errorEl.textContent = '⚠️ 이메일(아이디)과 비밀번호를 모두 입력해 주세요.';
      return;
    }

    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = '로그인 중...';

    try {
      let user = null;

      // 1) 로컬 저장소 우선 확인 (기본 데모 계정 및 로컬 등록 계정 즉시 지원)
      try {
        user = loginUser(email, password);
      } catch (localErr) {
        // 로컬에 없으면 스프레드시트 API 시도
      }

      // 2) 로컬에 없을 때 구글 스프레드시트 API 연동 시도
      if (!user && GAS_WEB_APP_URL) {
        try {
          const apiResult = await apiLoginUser(email, password);
          if (apiResult.success && apiResult.user) {
            user = apiResult.user;
            setCurrentUser(user);
          }
        } catch (apiErr) {
          console.warn('스프레드시트 로그인 API 에러:', apiErr);
        }
      }

      if (!user) {
        throw new Error('이메일(아이디) 또는 비밀번호가 일치하지 않습니다.');
      }

      showGlobalToast(`🎉 환영합니다, ${user.name}님!`);
      setTimeout(() => {
        window.location.href = 'profile.html';
      }, 800);
    } catch (err) {
      if (errorEl) errorEl.textContent = `❌ ${err.message}`;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  });

  // 2. 데모 간편 로그인 버튼
  const demoLoginBtn = document.getElementById('demo-login-btn');
  if (demoLoginBtn) {
    demoLoginBtn.addEventListener('click', () => {
      const user = loginAsDemo();
      if (user) {
        showGlobalToast(`⚡ 데모 계정(${user.name})으로 로그인되었습니다.`);
        setTimeout(() => {
          window.location.href = 'profile.html';
        }, 800);
      }
    });
  }

  // 3. 소셜 로그인 버튼 시뮬레이션
  const githubBtn = document.getElementById('social-github-btn');
  if (githubBtn) {
    githubBtn.addEventListener('click', () => {
      loginAsDemo();
      showGlobalToast('🐙 GitHub 계정으로 간편 로그인되었습니다.');
      setTimeout(() => {
        window.location.href = 'profile.html';
      }, 800);
    });
  }

  const googleBtn = document.getElementById('social-google-btn');
  if (googleBtn) {
    googleBtn.addEventListener('click', () => {
      loginAsDemo();
      showGlobalToast('🔍 Google 계정으로 간편 로그인되었습니다.');
      setTimeout(() => {
        window.location.href = 'profile.html';
      }, 800);
    });
  }

  // 4. 비밀번호 보기 토글
  const togglePassBtn = document.getElementById('toggle-password-btn');
  const passwordInput = document.getElementById('login-password');
  if (togglePassBtn && passwordInput) {
    togglePassBtn.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      togglePassBtn.textContent = isPassword ? '🙈' : '👁️';
    });
  }
}

export function initRegisterPage() {
  const registerForm = document.getElementById('register-form');
  if (!registerForm) return;

  const passwordInput = document.getElementById('reg-password');
  const confirmInput = document.getElementById('reg-password-confirm');
  const passwordMatchMsg = document.getElementById('password-match-msg');

  // 비밀번호 일치 실시간 검증
  function checkPasswordMatch() {
    if (!passwordMatchMsg) return;
    if (!confirmInput.value) {
      passwordMatchMsg.textContent = '';
      return;
    }
    if (passwordInput.value === confirmInput.value) {
      passwordMatchMsg.textContent = '✓ 비밀번호가 일치합니다.';
      passwordMatchMsg.style.color = '#10b981';
    } else {
      passwordMatchMsg.textContent = '✕ 비밀번호가 일치하지 않습니다.';
      passwordMatchMsg.style.color = '#ef4444';
    }
  }

  if (passwordInput && confirmInput) {
    passwordInput.addEventListener('input', checkPasswordMatch);
    confirmInput.addEventListener('input', checkPasswordMatch);
  }

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const username = document.getElementById('reg-username').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmInput.value;
    const role = document.getElementById('reg-role')?.value || 'Junior Developer';
    const termsAgree = document.getElementById('reg-terms')?.checked;
    const errorEl = document.getElementById('reg-error');
    const submitBtn = registerForm.querySelector('button[type="submit"]');

    if (errorEl) errorEl.textContent = '';

    if (!termsAgree) {
      if (errorEl) errorEl.textContent = '⚠️ 이용약관 및 개인정보 처리방침에 동의해 주세요.';
      return;
    }

    if (password.length < 6) {
      if (errorEl) errorEl.textContent = '⚠️ 비밀번호는 6자리 이상이어야 합니다.';
      return;
    }

    if (password !== confirmPassword) {
      if (errorEl) errorEl.textContent = '⚠️ 비밀번호가 일치하지 않습니다.';
      return;
    }

    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = '회원가입 처리 중...';

    try {
      // 1) 로컬 저장소에 사용자 등록
      const newUser = registerUser({
        name,
        username,
        email,
        password,
        role
      });

      // 2) 스프레드시트 API 연동이 설정된 경우 비동기 동기화 시도
      if (GAS_WEB_APP_URL) {
        apiRegisterUser({
          name,
          username,
          email,
          password,
          role
        }).catch(err => console.warn('스프레드시트 등록 동기화 실패(로컬 계정은 정상 등록됨):', err));
      }

      showGlobalToast(`🎉 환영합니다, ${newUser.name}님! 회원가입이 완료되었습니다.`);
      setTimeout(() => {
        window.location.href = 'profile.html';
      }, 1000);
    } catch (err) {
      if (errorEl) errorEl.textContent = `❌ ${err.message}`;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  });
}

function showGlobalToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
