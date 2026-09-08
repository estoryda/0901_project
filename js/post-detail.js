/**
 * Post Detail Controller
 * Handles article view, likes, table of contents (TOC), and comment operations.
 */

import { getPostById, getPosts, toggleLikePost, isPostLiked, addComment, deleteComment } from './blog-data.js';
import { getCurrentUser } from './auth.js';

export function initPostDetailPage() {
  const container = document.getElementById('post-detail-container');
  if (!container) return;

  // 1. Get Post ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id') || '1';

  // 2. Fetch Post
  const post = getPostById(postId, true);
  if (!post) {
    container.innerHTML = `
      <div class="empty-state" style="margin: 5rem auto; max-width: 600px;">
        <div class="empty-state-icon">⚠️</div>
        <h2 class="empty-state-title">게시글을 찾을 수 없습니다.</h2>
        <p class="empty-state-desc">요청하신 게시글이 삭제되었거나 존재하지 않는 주소입니다.</p>
        <a href="posts.html" class="btn btn-primary">게시글 목록으로 돌아가기</a>
      </div>
    `;
    return;
  }

  // 3. Document Title Update
  document.title = `${post.title} | DEV.LOG`;

  // 4. Render Post Content
  renderPostDetail(post);

  // 5. Generate Table of Contents (TOC)
  generateTOC();

  // 6. Bind Interactions (Likes, Share, Comments)
  bindInteractions(post);
}

function renderPostDetail(post) {
  // Breadcrumb / Category
  const catEl = document.getElementById('post-category');
  if (catEl) catEl.textContent = post.category;

  // Title
  const titleEl = document.getElementById('post-title');
  if (titleEl) titleEl.textContent = post.title;

  // Meta info
  const dateEl = document.getElementById('post-date');
  if (dateEl) dateEl.textContent = post.date;

  const readTimeEl = document.getElementById('post-read-time');
  if (readTimeEl) readTimeEl.textContent = post.readTime;

  const viewsEl = document.getElementById('post-views');
  if (viewsEl) viewsEl.textContent = `조회수 ${post.views}`;

  // Author Info
  const authorNameEl = document.getElementById('post-author-name');
  if (authorNameEl) authorNameEl.textContent = post.author.name;

  const authorRoleEl = document.getElementById('post-author-role');
  if (authorRoleEl) authorRoleEl.textContent = post.author.role;

  const authorAvatarEl = document.getElementById('post-author-avatar');
  if (authorAvatarEl && post.author.avatar) authorAvatarEl.src = post.author.avatar;

  // Body HTML
  const bodyEl = document.getElementById('post-body');
  if (bodyEl) bodyEl.innerHTML = post.content;

  // Tags
  const tagsContainer = document.getElementById('post-tags-container');
  if (tagsContainer && post.tags) {
    tagsContainer.innerHTML = post.tags.map(tag => `
      <a href="posts.html?q=${encodeURIComponent(tag)}" class="tag-chip">#${tag}</a>
    `).join('');
  }

  // Author Box Bottom
  const bottomAuthorName = document.getElementById('bottom-author-name');
  if (bottomAuthorName) bottomAuthorName.textContent = post.author.name;

  const bottomAuthorRole = document.getElementById('bottom-author-role');
  if (bottomAuthorRole) bottomAuthorRole.textContent = post.author.role;

  // Like Button State
  updateLikeButtonUI(post.id, post.likes);

  // Comments
  renderComments(post.id, post.comments || []);

  // Previous / Next Post Navigation
  renderPrevNextNav(post.id);
}

function generateTOC() {
  const bodyEl = document.getElementById('post-body');
  const tocList = document.getElementById('toc-list');
  if (!bodyEl || !tocList) return;

  const headings = bodyEl.querySelectorAll('h2, h3');
  if (headings.length === 0) {
    const tocBox = document.getElementById('toc-widget');
    if (tocBox) tocBox.style.display = 'none';
    return;
  }

  tocList.innerHTML = '';
  headings.forEach((heading, idx) => {
    const headingId = `heading-${idx}`;
    heading.id = headingId;

    const li = document.createElement('li');
    li.className = `toc-item ${heading.tagName.toLowerCase() === 'h3' ? 'toc-subitem' : ''}`;
    li.style.paddingLeft = heading.tagName.toLowerCase() === 'h3' ? '1.25rem' : '0.25rem';
    li.style.margin = '0.4rem 0';

    const a = document.createElement('a');
    a.href = `#${headingId}`;
    a.textContent = heading.textContent;
    a.style.color = 'var(--text-secondary)';
    a.style.textDecoration = 'none';
    a.style.fontSize = '0.875rem';
    a.style.transition = 'color var(--transition-fast)';

    a.addEventListener('mouseenter', () => { a.style.color = 'var(--accent-primary)'; });
    a.addEventListener('mouseleave', () => { a.style.color = 'var(--text-secondary)'; });

    a.addEventListener('click', (e) => {
      e.preventDefault();
      heading.scrollIntoView({ behavior: 'smooth' });
    });

    li.appendChild(a);
    tocList.appendChild(li);
  });
}

function updateLikeButtonUI(postId, likesCount) {
  const likeBtn = document.getElementById('like-btn');
  const likeCountSpan = document.getElementById('like-count');
  if (!likeBtn || !likeCountSpan) return;

  const liked = isPostLiked(postId);
  likeCountSpan.textContent = likesCount;

  if (liked) {
    likeBtn.classList.add('liked');
    likeBtn.innerHTML = `❤️ <span id="like-count">${likesCount}</span>`;
  } else {
    likeBtn.classList.remove('liked');
    likeBtn.innerHTML = `🤍 <span id="like-count">${likesCount}</span>`;
  }
}

function renderComments(postId, comments) {
  const commentsList = document.getElementById('comments-list');
  const commentsCount = document.getElementById('comments-count');
  if (!commentsList) return;

  if (commentsCount) {
    commentsCount.textContent = comments.length;
  }

  if (comments.length === 0) {
    commentsList.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--text-muted); font-size: 0.95rem;">
        아직 작성된 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!
      </div>
    `;
    return;
  }

  commentsList.innerHTML = comments.map(comment => `
    <div class="comment-item" id="comment-${comment.id}">
      <div class="comment-header">
        <div class="comment-author-info">
          <img src="${comment.avatar || 'assets/images/profile.jpg'}" alt="${comment.author}" class="comment-avatar">
          <div>
            <div class="comment-author-name">${escapeHtml(comment.author)}</div>
            <div class="comment-date">${comment.date}</div>
          </div>
        </div>
        <button class="comment-delete-btn" data-comment-id="${comment.id}" title="댓글 삭제">✕</button>
      </div>
      <div class="comment-text">${escapeHtml(comment.content)}</div>
    </div>
  `).join('');

  // 댓글 삭제 이벤트
  commentsList.querySelectorAll('.comment-delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const commentId = btn.getAttribute('data-comment-id');
      if (confirm('이 댓글을 삭제하시겠습니까?')) {
        deleteComment(postId, commentId);
        const post = getPostById(postId);
        renderComments(postId, post.comments || []);
        showGlobalToast('🗑️ 댓글이 삭제되었습니다.');
      }
    });
  });
}

function renderPrevNextNav(currentId) {
  const allPosts = getPosts();
  const index = allPosts.findIndex(p => p.id === Number(currentId));
  const navContainer = document.getElementById('article-prev-next');
  if (!navContainer || index === -1) return;

  const prevPost = index > 0 ? allPosts[index - 1] : null;
  const nextPost = index < allPosts.length - 1 ? allPosts[index + 1] : null;

  navContainer.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin: 3rem 0;">
      ${prevPost ? `
        <a href="post-detail.html?id=${prevPost.id}" class="skill-category-card" style="text-decoration: none; padding: 1.25rem;">
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">◀ 이전 글</div>
          <div style="font-weight: 700; color: var(--text-primary); font-size: 0.95rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            ${escapeHtml(prevPost.title)}
          </div>
        </a>
      ` : '<div></div>'}

      ${nextPost ? `
        <a href="post-detail.html?id=${nextPost.id}" class="skill-category-card" style="text-decoration: none; padding: 1.25rem; text-align: right;">
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">다음 글 ▶</div>
          <div style="font-weight: 700; color: var(--text-primary); font-size: 0.95rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            ${escapeHtml(nextPost.title)}
          </div>
        </a>
      ` : '<div></div>'}
    </div>
  `;
}

function bindInteractions(post) {
  // 1. Like Button Click
  const likeBtn = document.getElementById('like-btn');
  if (likeBtn) {
    likeBtn.addEventListener('click', () => {
      const result = toggleLikePost(post.id);
      updateLikeButtonUI(post.id, result.likes);
      showGlobalToast(result.isLiked ? '❤️ 게시글을 추천했습니다!' : '🤍 추천을 취소했습니다.');
    });
  }

  // 2. Share Button Click
  const shareBtn = document.getElementById('share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        showGlobalToast('🔗 게시글 링크가 클립보드에 복사되었습니다!');
      }).catch(() => {
        showGlobalToast('⚠️ 주소 복사에 실패했습니다.');
      });
    });
  }

  // 3. Comment Submit
  const commentForm = document.getElementById('comment-form');
  if (commentForm) {
    const currentUser = getCurrentUser();
    const authorInput = document.getElementById('comment-author-input');
    if (authorInput && currentUser) {
      authorInput.value = currentUser.name;
    }

    commentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('comment-author-input');
      const textInput = document.getElementById('comment-text-input');

      const authorName = (currentUser ? currentUser.name : (nameInput ? nameInput.value : '')).trim();
      const content = textInput.value.trim();

      if (!authorName) {
        showGlobalToast('⚠️ 작성자 이름을 입력해 주세요.');
        return;
      }
      if (!content) {
        showGlobalToast('⚠️ 댓글 내용을 입력해 주세요.');
        return;
      }

      const avatar = currentUser ? currentUser.avatar : 'assets/images/profile.jpg';
      addComment(post.id, { author: authorName, content, avatar });

      textInput.value = '';
      const updatedPost = getPostById(post.id);
      renderComments(post.id, updatedPost.comments || []);
      showGlobalToast('💬 댓글이 성공적으로 등록되었습니다.');
    });
  }
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
