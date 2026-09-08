/**
 * Profile Page Controller
 * Handles user profile info, statistics, tab switching, and profile settings.
 */

import { getCurrentUser, updateUserProfile, logoutUser, loginAsDemo } from './auth.js';
import { getPosts, getPostById } from './blog-data.js';

export function initProfilePage() {
  const profileContainer = document.getElementById('profile-container');
  if (!profileContainer) return;

  let currentUser = getCurrentUser();

  // 로그인하지 않은 경우
  if (!currentUser) {
    profileContainer.innerHTML = `
      <div class="empty-state" style="margin: 5rem auto; max-width: 540px;">
        <div class="empty-state-icon">🔒</div>
        <h2 class="empty-state-title">로그인이 필요한 페이지입니다</h2>
        <p class="empty-state-desc">프로필 및 마이페이지를 이용하시려면 로그인해 주세요.</p>
        <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
          <a href="login.html" class="btn btn-primary">로그인하기</a>
          <button id="quick-demo-login-btn" class="btn btn-secondary">데모 계정으로 바로 체험</button>
        </div>
      </div>
    `;

    const demoBtn = document.getElementById('quick-demo-login-btn');
    if (demoBtn) {
      demoBtn.addEventListener('click', () => {
        loginAsDemo();
        window.location.reload();
      });
    }
    return;
  }

  // 1. 프로필 정보 렌더링
  renderProfileInfo(currentUser);

  // 2. 탭 전환 이벤트 바인딩
  initTabs(currentUser);

  // 3. 프로필 수정 폼 이벤트 바인딩
  initProfileEditForm(currentUser);

  // 4. 로그아웃 버튼 바인딩
  const logoutBtn = document.getElementById('profile-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('정말 로그아웃 하시겠습니까?')) {
        logoutUser();
      }
    });
  }
}

function renderProfileInfo(user) {
  const nameEl = document.getElementById('profile-display-name');
  if (nameEl) nameEl.textContent = user.name;

  const usernameEl = document.getElementById('profile-display-username');
  if (usernameEl) usernameEl.textContent = `@${user.username}`;

  const roleEl = document.getElementById('profile-display-role');
  if (roleEl) roleEl.textContent = user.role;

  const bioEl = document.getElementById('profile-display-bio');
  if (bioEl) bioEl.textContent = user.bio;

  const joinedEl = document.getElementById('profile-display-joined');
  if (joinedEl) joinedEl.textContent = `가입일: ${user.joinedDate || '2025-01-15'}`;

  const avatarEl = document.getElementById('profile-display-avatar');
  if (avatarEl && user.avatar) avatarEl.src = user.avatar;

  // 통계 계산
  const allPosts = getPosts();
  const myPosts = allPosts.filter(p => p.author && p.author.name === user.name);
  const totalLikesReceived = myPosts.reduce((acc, p) => acc + (p.likes || 0), 0);

  // 좋아요한 게시글 ID 목록
  let likedIds = [];
  try {
    likedIds = JSON.parse(localStorage.getItem('blog_liked_posts') || '[]');
  } catch {}

  // 내가 작성한 댓글 수 계산
  let myCommentsCount = 0;
  allPosts.forEach(p => {
    (p.comments || []).forEach(c => {
      if (c.author === user.name) myCommentsCount++;
    });
  });

  const statPosts = document.getElementById('stat-my-posts');
  if (statPosts) statPosts.textContent = myPosts.length;

  const statLikes = document.getElementById('stat-likes-received');
  if (statLikes) statLikes.textContent = totalLikesReceived;

  const statBookmarks = document.getElementById('stat-bookmarked');
  if (statBookmarks) statBookmarks.textContent = likedIds.length;

  const statComments = document.getElementById('stat-my-comments');
  if (statComments) statComments.textContent = myCommentsCount;

  // 탭 콘텐츠 렌더링
  renderMyPostsList(myPosts);
  renderLikedPostsList(likedIds);
  renderMyCommentsList(user.name);
}

function initTabs() {
  const tabBtns = document.querySelectorAll('.profile-tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const activePane = document.getElementById(`tab-${targetTab}`);
      if (activePane) activePane.classList.add('active');
    });
  });
}

function renderMyPostsList(myPosts) {
  const container = document.getElementById('my-posts-container');
  if (!container) return;

  if (myPosts.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📝</div>
        <h3 class="empty-state-title">작성한 게시글이 없습니다.</h3>
        <p class="empty-state-desc">새로운 지식과 경험을 블로그에 공유해 보세요!</p>
        <a href="posts.html" class="btn btn-primary">게시글 둘러보기</a>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="posts-grid">
      ${myPosts.map(post => `
        <div class="post-card">
          <div class="post-card-thumb" style="height: 120px;">
            <span>${post.thumbnail || '📄'}</span>
          </div>
          <div class="post-card-body">
            <div class="post-card-meta">
              <span>📅 ${post.date}</span>
              <span>•</span>
              <span>👁️ ${post.views || 0}</span>
              <span>•</span>
              <span>❤️ ${post.likes || 0}</span>
            </div>
            <h4 class="post-card-title">
              <a href="post-detail.html?id=${post.id}" style="color: inherit; text-decoration: none;">
                ${escapeHtml(post.title)}
              </a>
            </h4>
            <p class="post-card-summary" style="-webkit-line-clamp: 2;">${escapeHtml(post.summary)}</p>
            <div style="margin-top: 1rem; display: flex; justify-content: flex-end;">
              <a href="post-detail.html?id=${post.id}" class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.85rem;">
                글 보기 ➔
              </a>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderLikedPostsList(likedIds) {
  const container = document.getElementById('liked-posts-container');
  if (!container) return;

  const allPosts = getPosts();
  const likedPosts = allPosts.filter(p => likedIds.includes(p.id));

  if (likedPosts.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">❤️</div>
        <h3 class="empty-state-title">추천(좋아요)한 게시글이 없습니다.</h3>
        <p class="empty-state-desc">마음에 드는 유용한 글을 발견하면 하트를 눌러보세요.</p>
        <a href="posts.html" class="btn btn-secondary">게시글 보러가기</a>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="posts-grid">
      ${likedPosts.map(post => `
        <div class="post-card">
          <div class="post-card-thumb" style="height: 120px;">
            <span>${post.thumbnail || '📄'}</span>
          </div>
          <div class="post-card-body">
            <div class="post-card-meta">
              <span>${post.category}</span>
              <span>•</span>
              <span>❤️ ${post.likes}</span>
            </div>
            <h4 class="post-card-title">
              <a href="post-detail.html?id=${post.id}" style="color: inherit; text-decoration: none;">
                ${escapeHtml(post.title)}
              </a>
            </h4>
            <p class="post-card-summary" style="-webkit-line-clamp: 2;">${escapeHtml(post.summary)}</p>
            <div style="margin-top: 1rem; display: flex; justify-content: flex-end;">
              <a href="post-detail.html?id=${post.id}" class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.85rem;">
                글 읽기 ➔
              </a>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderMyCommentsList(authorName) {
  const container = document.getElementById('my-comments-container');
  if (!container) return;

  const allPosts = getPosts();
  const myComments = [];

  allPosts.forEach(post => {
    (post.comments || []).forEach(comment => {
      if (comment.author === authorName) {
        myComments.push({
          postTitle: post.title,
          postId: post.id,
          ...comment
        });
      }
    });
  });

  if (myComments.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">💬</div>
        <h3 class="empty-state-title">작성한 댓글이 없습니다.</h3>
        <p class="empty-state-desc">게시글에 생각과 의견을 남겨 소통해 보세요.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="comment-list">
      ${myComments.map(c => `
        <div class="comment-item">
          <div class="comment-header">
            <span style="font-size: 0.85rem; color: var(--accent-primary); font-weight: 600;">
              📌 원문: <a href="post-detail.html?id=${c.postId}" style="color: inherit;">${escapeHtml(c.postTitle)}</a>
            </span>
            <span class="comment-date">${c.date}</span>
          </div>
          <div class="comment-text">${escapeHtml(c.content)}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function initProfileEditForm(user) {
  const form = document.getElementById('profile-edit-form');
  if (!form) return;

  const nameInput = document.getElementById('edit-name');
  const roleInput = document.getElementById('edit-role');
  const bioInput = document.getElementById('edit-bio');
  const emailInput = document.getElementById('edit-email');

  if (nameInput) nameInput.value = user.name || '';
  if (roleInput) roleInput.value = user.role || '';
  if (bioInput) bioInput.value = user.bio || '';
  if (emailInput) emailInput.value = user.email || '';

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const updated = updateUserProfile({
      name: nameInput.value.trim(),
      role: roleInput.value.trim(),
      bio: bioInput.value.trim()
    });

    renderProfileInfo(updated);
    showGlobalToast('✅ 프로필 정보가 성공적으로 변경되었습니다!');
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

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
