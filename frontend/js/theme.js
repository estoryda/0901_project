/**
 * Theme Manager Module
 * Handles Light/Dark mode toggling and persistence via localStorage.
 */

const THEME_STORAGE_KEY = 'portfolio-theme';

export function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // 1. 저장된 테마 불러오기 또는 OS 테마 기본값 감지
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  setTheme(initialTheme);

  // 2. 토글 버튼 클릭 이벤트 바인딩
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  }

  // 3. OS 시스템 테마 변경 감지 리스너
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_STORAGE_KEY)) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_STORAGE_KEY, theme);

  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    themeToggleBtn.setAttribute('title', theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환');
  }
}
