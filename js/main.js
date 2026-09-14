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
import { initWritePage } from './write.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. 공통 모듈 초기화
  initTheme();
  initNavAuth();
  initScroll();

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

  // 9. 글쓰기 페이지 (write.html)
  if (document.getElementById('write-container')) {
    initWritePage();
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

  // 글 작성 완료 후 이동 시 토스트 안내
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('new_post') === 'success') {
    showToast('🎉 새 글이 메인 페이지에 성공적으로 등록되었습니다!');
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  // 실제 저장된 게시글 데이터 로드 및 최신 작성순 정렬 (date 역순, id 역순)
  const rawPosts = getPosts();
  const allPosts = [...rawPosts].sort((a, b) => {
    const dateDiff = new Date(b.date) - new Date(a.date);
    if (dateDiff !== 0) return dateDiff;
    return (b.id || 0) - (a.id || 0);
  });

  // 1. Featured Post 렌더링 (가장 최신 게시글을 스포트라이트 카드로 노출)
  if (featuredContainer) {
    if (allPosts.length > 0) {
      const topPost = allPosts[0];
      featuredContainer.innerHTML = `
        <article class="featured-card" data-href="post-detail.html?id=${topPost.id}" style="cursor: pointer;">
          <div class="featured-visual">
            <span>${topPost.thumbnail || '⚡'}</span>
          </div>
          <div class="featured-content">
            <div style="margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
              <span class="section-tag" style="padding: 0.2rem 0.75rem; font-size: 0.75rem;">LATEST SPOTLIGHT</span>
              <span class="post-card-category-badge" style="position: static; font-size: 0.75rem;">${escapeHtml(topPost.category)}</span>
              <span style="font-size: 0.85rem; color: var(--text-muted);">${topPost.date}</span>
              <span style="font-size: 0.85rem; color: var(--text-muted);">• ${topPost.readTime}</span>
            </div>
            <h3 style="font-size: 1.6rem; font-weight: 800; line-height: 1.35; margin-bottom: 0.85rem;">
              <a href="post-detail.html?id=${topPost.id}" style="color: inherit; text-decoration: none;">
                ${escapeHtml(topPost.title)}
              </a>
            </h3>
            <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.5rem; font-size: 0.95rem;">
              ${escapeHtml(topPost.summary)}
            </p>
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-top: auto;">
              <div style="display: flex; align-items: center; gap: 0.6rem;">
                <img src="${(topPost.author && topPost.author.avatar) || 'assets/images/profile.jpg'}" alt="${(topPost.author && topPost.author.name) || '작성자'}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">
                <span style="font-size: 0.9rem; font-weight: 600;">${escapeHtml((topPost.author && topPost.author.name) || '홍길동')}</span>
              </div>
              <a href="post-detail.html?id=${topPost.id}" class="btn btn-primary" style="padding: 0.5rem 1.25rem; font-size: 0.9rem;">
                글 전체 읽기 ➔
              </a>
            </div>
          </div>
        </article>
      `;

      const featuredEl = featuredContainer.querySelector('.featured-card');
      if (featuredEl) {
        featuredEl.addEventListener('click', (e) => {
          if (e.target.closest('a') || e.target.closest('button')) return;
          window.location.href = `post-detail.html?id=${topPost.id}`;
        });
      }
    } else {
      featuredContainer.innerHTML = '';
    }
  }

  // 2. Recent Posts 렌더링 (최신 게시글 목록 카드 6개)
  if (recentContainer) {
    if (allPosts.length === 0) {
      recentContainer.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1; padding: 3rem 1.5rem; text-align: center;">
          <div class="empty-state-icon" style="font-size: 3rem; margin-bottom: 1rem;">📝</div>
          <h3 class="empty-state-title" style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem;">작성된 게시글이 없습니다.</h3>
          <p class="empty-state-desc" style="color: var(--text-secondary); margin-bottom: 1.5rem;">첫 번째 기술 블로그 글을 작성해 보세요!</p>
          <a href="write.html" class="btn btn-primary">✏️ 새 글 작성하기</a>
        </div>
      `;
    } else {
      const recent = allPosts.slice(0, 6);
      recentContainer.innerHTML = recent.map(post => `
        <article class="post-card fade-in-section is-visible" data-href="post-detail.html?id=${post.id}" style="cursor: pointer;">
          <a href="post-detail.html?id=${post.id}" class="post-card-thumb" style="text-decoration: none;">
            <span>${post.thumbnail || '📄'}</span>
            <span class="post-card-category-badge">${escapeHtml(post.category)}</span>
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
            
            <div style="display: flex; gap: 0.35rem; flex-wrap: wrap; margin-bottom: 1rem;">
              ${(post.tags || []).slice(0, 3).map(tag => `
                <a href="posts.html?q=${encodeURIComponent(tag)}" class="tag-chip" style="font-size: 0.72rem; padding: 0.15rem 0.45rem;">#${escapeHtml(tag)}</a>
              `).join('')}
            </div>

            <div class="post-card-footer">
              <div style="display: flex; align-items: center; gap: 0.4rem;">
                <img src="${(post.author && post.author.avatar) || 'assets/images/profile.jpg'}" alt="${(post.author && post.author.name) || '작성자'}" style="width: 22px; height: 22px; border-radius: 50%; object-fit: cover;">
                <span style="font-size: 0.85rem;">${escapeHtml((post.author && post.author.name) || '홍길동')}</span>
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

      // 목록 카드 어디를 누르든 상세페이지로 이동하도록 이벤트 바인딩
      recentContainer.querySelectorAll('.post-card').forEach(card => {
        card.addEventListener('click', (e) => {
          if (e.target.closest('a') || e.target.closest('button')) return;
          const href = card.getAttribute('data-href');
          if (href) {
            window.location.href = href;
          }
        });
      });
    }
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
