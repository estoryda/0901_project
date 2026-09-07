/**
 * Main Application Entry Point
 * Initializes all modules and handles global interactions (clipboard, contact form, etc.)
 */

import { initTheme } from './theme.js';
import { initScroll } from './scroll.js';
import { initTyping } from './typing.js';
import { initProjects } from './projects.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. 모듈 초기화
  initTheme();
  initScroll();
  initTyping();
  initProjects();

  // 2. 이메일 클립보드 복사 & Toast 알림
  const copyBtn = document.getElementById('copy-email-btn');
  const toast = document.getElementById('toast');

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const email = copyBtn.getAttribute('data-email') || 'developer@example.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('📋 이메일 주소가 클립보드에 복사되었습니다!');
      }).catch(() => {
        showToast('⚠️ 복사에 실패했습니다. 직접 복사해 주세요.');
      });
    });
  }

  // 3. 문의 폼(Contact Form) 제출 처리
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const messageInput = document.getElementById('contact-message');

      if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
        showToast('⚠️ 모든 필수 항목을 입력해 주세요.');
        return;
      }

      // 제출 시뮬레이션
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = '전송 중...';

      setTimeout(() => {
        showToast('✉️ 메시지가 성공적으로 전송되었습니다! 곧 회신드리겠습니다.');
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }, 1000);
    });
  }

  // 4. Toast 알림 헬퍼 함수
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
});
