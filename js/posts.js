/**
 * Posts Page Controller
 * Handles article listing, search filter, category tabs, sorting, and pagination.
 */

import { getPosts, getCategories } from './blog-data.js';

const POSTS_PER_PAGE = 6;
let currentCategory = 'All';
let currentSort = 'latest';
let searchQuery = '';
let currentPage = 1;

export function initPostsPage() {
  const postsGrid = document.getElementById('posts-grid');
  if (!postsGrid) return;

  // URL 쿼리스트링 파라미터 처리 (예: ?q=react or ?cat=Frontend)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('q')) {
    searchQuery = urlParams.get('q');
    const searchInput = document.getElementById('posts-search-input');
    if (searchInput) searchInput.value = searchQuery;
  }
  if (urlParams.has('cat')) {
    currentCategory = urlParams.get('cat');
  }

  // 1. 카테고리 탭 렌더링 & 이벤트 바인딩
  renderCategoryTabs();

  // 2. 검색 입력 이벤트 바인딩
  const searchInput = document.getElementById('posts-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      currentPage = 1;
      renderPosts();
    });
  }

  // 3. 정렬 셀렉트 이벤트 바인딩
  const sortSelect = document.getElementById('posts-sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      currentPage = 1;
      renderPosts();
    });
  }

  // 4. 초기 게시글 렌더링
  renderPosts();
}

function renderCategoryTabs() {
  const container = document.getElementById('category-tabs');
  if (!container) return;

  const categories = getCategories();
  container.innerHTML = '';

  Object.entries(categories).forEach(([category, count]) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `filter-category-btn ${currentCategory === category ? 'active' : ''}`;
    btn.textContent = `${category} (${count})`;
    btn.addEventListener('click', () => {
      currentCategory = category;
      currentPage = 1;
      // 탭 활성화 클래스 토글
      container.querySelectorAll('.filter-category-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderPosts();
    });
    container.appendChild(btn);
  });
}

function renderPosts() {
  const postsGrid = document.getElementById('posts-grid');
  const countDisplay = document.getElementById('posts-count-display');
  const paginationContainer = document.getElementById('pagination-container');
  if (!postsGrid) return;

  const allPosts = getPosts();

  // 1. 필터링 (카테고리 & 검색어)
  let filtered = allPosts.filter(post => {
    const matchCat = currentCategory === 'All' || post.category === currentCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || 
      post.title.toLowerCase().includes(q) ||
      post.summary.toLowerCase().includes(q) ||
      (post.tags && post.tags.some(t => t.toLowerCase().includes(q)));
    return matchCat && matchSearch;
  });

  // 2. 정렬
  if (currentSort === 'latest') {
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (currentSort === 'popular') {
    filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
  } else if (currentSort === 'views') {
    filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
  }

  // 총 게시글 수 표시
  if (countDisplay) {
    countDisplay.textContent = `총 ${filtered.length}개의 아티클`;
  }

  // 3. 결과가 없을 때 (Empty State)
  if (filtered.length === 0) {
    postsGrid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">🔍</div>
        <h3 class="empty-state-title">검색된 게시글이 없습니다.</h3>
        <p class="empty-state-desc">다른 키워드로 검색하거나 카테고리 필터를 변경해 보세요.</p>
        <button class="btn btn-secondary" id="reset-filter-btn">필터 초기화</button>
      </div>
    `;
    const resetBtn = document.getElementById('reset-filter-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        searchQuery = '';
        currentCategory = 'All';
        const searchInput = document.getElementById('posts-search-input');
        if (searchInput) searchInput.value = '';
        renderCategoryTabs();
        renderPosts();
      });
    }
    if (paginationContainer) paginationContainer.innerHTML = '';
    return;
  }

  // 4. 페이지네이션 슬라이싱
  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  if (currentPage > totalPages) currentPage = totalPages;

  const startIdx = (currentPage - 1) * POSTS_PER_PAGE;
  const currentItems = filtered.slice(startIdx, startIdx + POSTS_PER_PAGE);

  // 5. 카드 렌더링
  postsGrid.innerHTML = currentItems.map(post => `
    <article class="post-card fade-in-section is-visible">
      <a href="post-detail.html?id=${post.id}" class="post-card-thumb" style="text-decoration: none;">
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
        
        <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1rem;">
          ${(post.tags || []).map(tag => `<span class="tag-chip" style="font-size: 0.75rem; padding: 0.2rem 0.5rem;">#${tag}</span>`).join('')}
        </div>

        <div class="post-card-footer">
          <div style="display: flex; align-items: center; gap: 0.4rem;">
            <img src="${post.author.avatar}" alt="${post.author.name}" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover;">
            <span>${post.author.name}</span>
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

  // 6. 페이지네이션 버튼 렌더링
  renderPagination(totalPages);
}

function renderPagination(totalPages) {
  const container = document.getElementById('pagination-container');
  if (!container) return;

  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  let html = `
    <button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} id="prev-page-btn" title="이전 페이지">◀</button>
  `;

  for (let i = 1; i <= totalPages; i++) {
    html += `
      <button class="page-btn ${currentPage === i ? 'active' : ''}" data-page="${i}">${i}</button>
    `;
  }

  html += `
    <button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} id="next-page-btn" title="다음 페이지">▶</button>
  `;

  container.innerHTML = html;

  const prevBtn = document.getElementById('prev-page-btn');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderPosts();
        window.scrollTo({ top: 300, behavior: 'smooth' });
      }
    });
  }

  const nextBtn = document.getElementById('next-page-btn');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderPosts();
        window.scrollTo({ top: 300, behavior: 'smooth' });
      }
    });
  }

  container.querySelectorAll('.page-btn[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      currentPage = Number(btn.getAttribute('data-page'));
      renderPosts();
      window.scrollTo({ top: 300, behavior: 'smooth' });
    });
  });
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
