/**
 * Main Application Entry Point
 * Initializes modules, router-like page detections, theme, auth states, and UI interactions.
 */

import { initTheme } from './theme.js';
import { initScroll } from './scroll.js';
import { initTyping } from './typing.js';
import { initNavAuth } from './auth.js';
import { getPosts, getFeaturedPosts, getCategories, getPopularTags } from './blog-data.js';
import { initPostsPage } from './posts.js';
import { initPostDetailPage } from './post-detail.js';
import { initProfilePage } from './profile.js';
import { initLoginPage, initRegisterPage } from './auth-pages.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. 공통 모듈 초기화
  initTheme();
  initScroll();
  initNavAuth();

  // 2. 홈 화면(index.html) 전용 초기화
  if (document.getElementById('home-featured-posts')) {
    initHomePage();
  }

  // 3. 타이핑 효과 (홈 등 typing-text 엘리먼트가 있을 때)
  if (document.getElementById('typing-text')) {
    initTyping();
  }

  // 4. 게시글 목록 페이지 (posts.html)
  if (document.getElementById('posts-grid')) {
    initPostsPage();
  }

  // 5. 게시글 상세 페이지 (post-detail.html)
  if (document.getElementById('post-detail-container')) {
    initPostDetailPage();
  }

  // 6. 프로필 페이지 (profile.html)
  if (document.getElementById('profile-container')) {
    initProfilePage();
  }

  // 7. 로그인 페이지 (login.html)
  if (document.getElementById('login-form')) {
    initLoginPage();
  }

  // 8. 회원가입 페이지 (register.html)
  if (document.getElementById('register-form')) {
    initRegisterPage();
  }

  // 9. 이메일 클립보드 복사 & Toast 알림
  const copyBtn = document.getElementById('copy-email-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const email = copyBtn.getAttribute('data-email') || 'developer@example.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('📋 이메일 주소가 클립보드에 복사되었습니다!');
      }).catch(() => {
        showToast('⚠️ 복사에 실패했습니다.');
      });
    });
  }

  // 10. 뉴스레터 구독 폼 처리
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('newsletter-email');
      if (emailInput && emailInput.value) {
        showToast('💌 뉴스레터 구독 신청이 완료되었습니다! 매주 기술 소식을 전해드립니다.');
        emailInput.value = '';
      }
    });
  }
});

/**
 * 홈 화면 렌더링 함수
 */
function initHomePage() {
  const featuredContainer = document.getElementById('home-featured-posts');
  const recentContainer = document.getElementById('home-recent-posts');
  const sidebarCategories = document.getElementById('sidebar-categories');
  const sidebarTags = document.getElementById('sidebar-tags');

  const allPosts = getPosts();
  const featured = getFeaturedPosts();

  // 1. Featured Post 렌더링
  if (featuredContainer && featured.length > 0) {
    const topPost = featured[0];
    featuredContainer.innerHTML = `
      <article class="featured-card">
        <div class="featured-visual">
          <span>${topPost.thumbnail || '⚡'}</span>
        </div>
        <div class="featured-content">
          <div style="margin-bottom: 0.75rem;">
            <span class="section-tag" style="padding: 0.2rem 0.75rem; font-size: 0.75rem;">FEATURED ARTICLE</span>
            <span style="font-size: 0.85rem; color: var(--text-muted); margin-left: 0.5rem;">${topPost.date}</span>
          </div>
          <h3 style="font-size: 1.6rem; font-weight: 800; line-height: 1.35; margin-bottom: 0.85rem;">
            <a href="post-detail.html?id=${topPost.id}" style="color: inherit; text-decoration: none;">
              ${escapeHtml(topPost.title)}
            </a>
          </h3>
          <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.5rem; font-size: 0.95rem;">
            ${escapeHtml(topPost.summary)}
          </p>
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <img src="${topPost.author.avatar}" alt="${topPost.author.name}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">
              <span style="font-size: 0.9rem; font-weight: 600;">${topPost.author.name}</span>
            </div>
            <a href="post-detail.html?id=${topPost.id}" class="btn btn-primary" style="padding: 0.5rem 1.25rem; font-size: 0.9rem;">
              글 전체 읽기 ➔
            </a>
          </div>
        </div>
      </article>
    `;
  }

  // 2. Recent Posts 렌더링 (최신 4개)
  if (recentContainer) {
    const recent = allPosts.slice(0, 4);
    recentContainer.innerHTML = recent.map(post => `
      <article class="post-card fade-in-section is-visible">
        <a href="post-detail.html?id=${post.id}" class="post-card-thumb">
          <span>${post.thumbnail || '📄'}</span>
          <span class="post-card-category-badge">${post.category}</span>
        </a>
        <div class="post-card-body">
          <div class="post-card-meta">
            <span>📅 ${post.date}</span>
            <span>•</span>
            <span>⏱️ ${post.readTime}</span>
          </div>
          <h3 class="post-card-title">
            <a href="post-detail.html?id=${post.id}" style="color: inherit; text-decoration: none;">
              ${escapeHtml(post.title)}
            </a>
          </h3>
          <p class="post-card-summary">${escapeHtml(post.summary)}</p>
          
          <div class="post-card-footer">
            <div style="display: flex; align-items: center; gap: 0.4rem;">
              <img src="${post.author.avatar}" alt="${post.author.name}" style="width: 22px; height: 22px; border-radius: 50%; object-fit: cover;">
              <span style="font-size: 0.85rem;">${post.author.name}</span>
            </div>
            <div class="post-card-metrics">
              <span title="조회수">👁️ ${post.views || 0}</span>
              <span title="좋아요">❤️ ${post.likes || 0}</span>
              <span title="댓글수">💬 ${(post.comments || []).length}</span>
            </div>
          </div>
        </div>
      </article>
    `).join('');
  }

  // 3. 사이드바 카테고리
  if (sidebarCategories) {
    const categories = getCategories();
    sidebarCategories.innerHTML = Object.entries(categories).map(([cat, count]) => `
      <li class="widget-category-item">
        <a href="posts.html?cat=${encodeURIComponent(cat)}">
          <span>📁 ${cat}</span>
          <span class="widget-category-count">${count}</span>
        </a>
      </li>
    `).join('');
  }

  // 4. 사이드바 태그 클라우드
  if (sidebarTags) {
    const popularTags = getPopularTags().slice(0, 8);
    sidebarTags.innerHTML = popularTags.map(tag => `
      <a href="posts.html?q=${encodeURIComponent(tag)}" class="tag-chip">#${tag}</a>
    `).join('');
  }

  // 5. 홈 검색창 이벤트
  const homeSearchForm = document.getElementById('home-search-form');
  if (homeSearchForm) {
    homeSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('home-search-input');
      if (input && input.value.trim()) {
        window.location.href = `posts.html?q=${encodeURIComponent(input.value.trim())}`;
      }
    });
  }
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
