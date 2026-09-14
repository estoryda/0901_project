/**
 * Write Page Controller (write.html)
 * Handles article creation, markdown formatting toolbar, live preview mode,
 * draft auto-saving, and integration with blog-data.js.
 */

import { createPost, updatePost, getPostById } from './blog-data.js';
import { getCurrentUser, loginAsDemo } from './auth.js';

const DRAFT_STORAGE_KEY = 'blog_write_draft';

export function initWritePage() {
  const writeForm = document.getElementById('write-form');
  if (!writeForm) return;

  const titleInput = document.getElementById('write-title');
  const categorySelect = document.getElementById('write-category');
  const thumbnailInput = document.getElementById('write-thumbnail');
  const tagsInput = document.getElementById('write-tags');
  const summaryInput = document.getElementById('write-summary');
  const contentInput = document.getElementById('write-content');
  const errorMsg = document.getElementById('write-error-msg');
  const submitBtn = document.getElementById('btn-publish-post');
  const saveDraftBtn = document.getElementById('btn-save-draft');
  const draftStatusIndicator = document.getElementById('draft-status-indicator');

  // URL 파라미터 확인 (수정 모드: ?edit=ID 또는 ?id=ID)
  const urlParams = new URLSearchParams(window.location.search);
  const editPostId = urlParams.get('edit') || urlParams.get('id');
  let isEditMode = false;
  let targetPost = null;

  if (editPostId) {
    targetPost = getPostById(editPostId, false);
    if (targetPost) {
      isEditMode = true;
      setupEditModeUI(targetPost, {
        titleInput,
        categorySelect,
        thumbnailInput,
        tagsInput,
        summaryInput,
        contentInput,
        submitBtn,
        draftStatusIndicator
      });
    }
  }

  // 1. 로그인 상태 확인 및 비로그인 안내
  checkAuthNotice();

  // 2. 임시저장 데이터 복원 (수정 모드가 아닐 때만 복원)
  if (!isEditMode) {
    loadDraft({ titleInput, categorySelect, thumbnailInput, tagsInput, summaryInput, contentInput });
  }

  // 3. 이모지 선택 버튼 이벤트
  initEmojiPicker(thumbnailInput);

  // 4. 에디터 툴바 버튼 이벤트
  initEditorToolbar(contentInput);

  // 5. 작성 모드 / 실시간 미리보기 탭 전환
  initEditorTabs(contentInput);

  // 6. 자동 임시저장 이벤트 (입력 디바운스)
  let autoSaveTimeout = null;
  const triggerAutoSave = () => {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
      saveDraftToStorage({
        title: titleInput.value,
        category: categorySelect.value,
        thumbnail: thumbnailInput.value,
        tags: tagsInput.value,
        summary: summaryInput.value,
        content: contentInput.value
      });
      if (draftStatusIndicator) {
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        draftStatusIndicator.textContent = `💾 자동 임시저장됨 (${timeStr})`;
      }
    }, 1500);
  };

  [titleInput, categorySelect, thumbnailInput, tagsInput, summaryInput, contentInput].forEach(el => {
    if (el) el.addEventListener('input', triggerAutoSave);
  });

  // 7. 수동 임시저장 버튼
  if (saveDraftBtn) {
    saveDraftBtn.addEventListener('click', () => {
      saveDraftToStorage({
        title: titleInput.value,
        category: categorySelect.value,
        thumbnail: thumbnailInput.value,
        tags: tagsInput.value,
        summary: summaryInput.value,
        content: contentInput.value
      });
      showGlobalToast('💾 임시저장이 완료되었습니다.');
    });
  }

  // 8. 폼 제출 (글 발행)
  writeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (errorMsg) errorMsg.textContent = '';

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    const category = categorySelect.value;
    const thumbnail = thumbnailInput.value.trim() || '📝';
    let summary = summaryInput.value.trim();

    if (!title) {
      if (errorMsg) errorMsg.textContent = '⚠️ 글 제목을 입력해 주세요.';
      titleInput.focus();
      return;
    }

    if (!content) {
      if (errorMsg) errorMsg.textContent = '⚠️ 본문 내용을 입력해 주세요.';
      contentInput.focus();
      return;
    }

    // 요약이 비어있으면 본문에서 자동 발췌
    if (!summary) {
      const plainText = content.replace(/<[^>]+>/g, '').replace(/[#*`_>\[\]]/g, '').trim();
      summary = plainText.length > 130 ? plainText.substring(0, 130) + '...' : plainText;
    }

    // 태그 파싱 (쉼표 구분)
    const rawTags = tagsInput.value.split(',');
    const tags = rawTags
      .map(t => t.trim().replace(/^#/, ''))
      .filter(t => t.length > 0);

    // 작성자 정보 확인
    let authorInfo = getCurrentUser();
    if (!authorInfo) {
      authorInfo = {
        name: '방문자 필진',
        role: 'Guest Author',
        avatar: 'assets/images/profile.jpg'
      };
    }

    // 마크다운을 HTML로 변환
    const parsedHtml = parseMarkdownToHtml(content);

    submitBtn.disabled = true;
    submitBtn.textContent = isEditMode ? '수정사항 저장 중...' : '발행 중...';

    try {
      if (isEditMode) {
        // 수정 (Update)
        const updatedPost = updatePost(editPostId, {
          title,
          summary,
          category,
          tags: tags.length > 0 ? tags : [category],
          thumbnail,
          content: parsedHtml
        });

        showGlobalToast('✅ 게시글이 성공적으로 수정되었습니다!');
        setTimeout(() => {
          window.location.href = `post-detail.html?id=${updatedPost.id}`;
        }, 700);
      } else {
        // 신규 작성 (Create)
        const newPost = createPost({
          title,
          summary,
          category,
          tags: tags.length > 0 ? tags : [category],
          thumbnail,
          content: parsedHtml,
          author: {
            id: authorInfo.id,
            name: authorInfo.name,
            username: authorInfo.username,
            role: authorInfo.role || 'Member',
            avatar: authorInfo.avatar || 'assets/images/profile.jpg'
          }
        });

        // 임시저장 내용 삭제
        localStorage.removeItem(DRAFT_STORAGE_KEY);

        showGlobalToast('🎉 새 아티클이 성공적으로 발행되었습니다! 메인 페이지로 이동합니다.');

        // 메인 페이지로 이동하여 목록 카드 반영 확인
        setTimeout(() => {
          window.location.href = `index.html?new_post=success`;
        }, 700);
      }
    } catch (err) {
      console.error('글 저장 실패:', err);
      if (errorMsg) errorMsg.textContent = `❌ 저장 실패: ${err.message}`;
      submitBtn.disabled = false;
      submitBtn.textContent = isEditMode ? '💾 수정사항 저장하기' : '🚀 글 발행하기';
    }
  });
}

/**
 * 수정 모드 UI 초기화
 */
function setupEditModeUI(post, elements) {
  document.title = `글 수정: ${post.title} | DEV.LOG`;

  const headingEl = document.querySelector('h1');
  if (headingEl) headingEl.textContent = '아티클 수정하기';

  if (elements.submitBtn) {
    elements.submitBtn.textContent = '💾 수정사항 저장하기';
  }

  if (elements.draftStatusIndicator) {
    elements.draftStatusIndicator.textContent = '✏️ 기존 게시글 수정 모드';
    elements.draftStatusIndicator.style.color = 'var(--accent-primary)';
    elements.draftStatusIndicator.style.fontWeight = '600';
  }

  if (elements.titleInput) elements.titleInput.value = post.title || '';
  if (elements.categorySelect) elements.categorySelect.value = post.category || 'General';
  if (elements.thumbnailInput) elements.thumbnailInput.value = post.thumbnail || '⚡';
  if (elements.tagsInput) elements.tagsInput.value = (post.tags || []).join(', ');
  if (elements.summaryInput) elements.summaryInput.value = post.summary || '';
  if (elements.contentInput) elements.contentInput.value = post.content || '';

  // 썸네일 이모지 활성화 표시
  if (post.thumbnail) {
    const activeEmojiBtn = document.querySelector(`.emoji-select-btn[data-emoji="${post.thumbnail}"]`);
    if (activeEmojiBtn) {
      document.querySelectorAll('.emoji-select-btn').forEach(b => b.classList.remove('active'));
      activeEmojiBtn.classList.add('active');
    }
  }
}

/**
 * 로그인 상태 안내 박스 처리
 */
function checkAuthNotice() {
  const noticeBox = document.getElementById('write-auth-notice');
  const demoLoginBtn = document.getElementById('write-demo-login-btn');
  if (!noticeBox) return;

  const currentUser = getCurrentUser();
  if (!currentUser) {
    noticeBox.style.display = 'flex';
    if (demoLoginBtn) {
      demoLoginBtn.addEventListener('click', () => {
        loginAsDemo();
        showGlobalToast('⚡ 데모 계정으로 간편 로그인되었습니다!');
        setTimeout(() => {
          window.location.reload();
        }, 500);
      });
    }
  } else {
    noticeBox.style.display = 'none';
  }
}

/**
 * 이모지 선택 버튼 바인딩
 */
function initEmojiPicker(thumbnailInput) {
  const emojiBtns = document.querySelectorAll('.emoji-select-btn');
  emojiBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const emoji = btn.getAttribute('data-emoji');
      if (emoji && thumbnailInput) {
        thumbnailInput.value = emoji;
        emojiBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      }
    });
  });
}

/**
 * 에디터 서식 도구 모음(Toolbar) 바인딩
 */
function initEditorToolbar(textarea) {
  const toolbar = document.getElementById('editor-toolbar');
  if (!toolbar || !textarea) return;

  toolbar.addEventListener('click', (e) => {
    const btn = e.target.closest('.toolbar-btn');
    if (!btn) return;

    const action = btn.getAttribute('data-action');
    switch (action) {
      case 'h2':
        insertFormatting(textarea, '\n## ', '\n', '큰 제목 입력');
        break;
      case 'h3':
        insertFormatting(textarea, '\n### ', '\n', '중간 제목 입력');
        break;
      case 'bold':
        insertFormatting(textarea, '**', '**', '굵은 텍스트');
        break;
      case 'italic':
        insertFormatting(textarea, '*', '*', '기울임 텍스트');
        break;
      case 'quote':
        insertFormatting(textarea, '\n> ', '\n', '인용 문구를 입력하세요');
        break;
      case 'code':
        insertFormatting(textarea, '\n```javascript\n', '\n```\n', '// 여기에 코드를 입력하세요');
        break;
      case 'list':
        insertFormatting(textarea, '\n- ', '\n', '목록 아이템');
        break;
      case 'link':
        insertFormatting(textarea, '[', '](https://example.com)', '링크 텍스트');
        break;
      case 'hr':
        insertFormatting(textarea, '\n\n---\n\n', '', '');
        break;
      default:
        break;
    }
  });
}

/**
 * 텍스트 커서 위치에 서식 삽입
 */
function insertFormatting(textarea, prefix, suffix, placeholder) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  const selectedText = text.substring(start, end);

  const insertContent = selectedText.length > 0 ? selectedText : placeholder;
  const replacement = prefix + insertContent + suffix;

  textarea.value = text.substring(0, start) + replacement + text.substring(end);
  textarea.focus();

  // 커서 재배치
  const newCursorPos = start + prefix.length + insertContent.length;
  textarea.setSelectionRange(newCursorPos, newCursorPos);

  // input 이벤트 발생 (임시저장 트리거)
  textarea.dispatchEvent(new Event('input', { bubbles: true }));
}

/**
 * 작성 모드 / 실시간 미리보기 탭
 */
function initEditorTabs(textarea) {
  const writeTabBtn = document.getElementById('tab-write-btn');
  const previewTabBtn = document.getElementById('tab-preview-btn');
  const writePane = document.getElementById('write-input-pane');
  const previewPane = document.getElementById('write-preview-pane');
  const toolbar = document.getElementById('editor-toolbar');

  if (!writeTabBtn || !previewTabBtn || !writePane || !previewPane) return;

  writeTabBtn.addEventListener('click', () => {
    writeTabBtn.classList.add('active');
    previewTabBtn.classList.remove('active');
    writePane.style.display = 'block';
    previewPane.style.display = 'none';
    if (toolbar) toolbar.style.display = 'flex';
  });

  previewTabBtn.addEventListener('click', () => {
    previewTabBtn.classList.add('active');
    writeTabBtn.classList.remove('active');
    writePane.style.display = 'none';
    previewPane.style.display = 'block';
    if (toolbar) toolbar.style.display = 'none';

    // 실시간 미리보기 HTML 렌더링
    const content = textarea.value.trim();
    if (!content) {
      previewPane.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); padding: 3rem 1rem;">
          <p>✍️ 본문 내용을 입력하시면 실시간 미리보기가 이곳에 표시됩니다.</p>
        </div>
      `;
    } else {
      previewPane.innerHTML = parseMarkdownToHtml(content);
    }
  });
}

/**
 * 마크다운을 안전한 HTML로 변환
 */
export function parseMarkdownToHtml(markdown) {
  if (!markdown) return '';

  let html = markdown.replace(/\r\n/g, '\n');

  // 1. 코드 블록 임시 보호
  const codeBlocks = [];
  html = html.replace(/```([a-zA-Z0-9_\-]*)[^\S\n]*\n([\s\S]*?)```/g, (match, lang, code) => {
    const placeholder = `%%CODE_BLOCK_${codeBlocks.length}%%`;
    codeBlocks.push(`<pre><code class="language-${lang || 'plaintext'}">${escapeHtml(code.trim())}</code></pre>`);
    return placeholder;
  });

  // 2. 인라인 코드 임시 보호
  const inlineCodes = [];
  html = html.replace(/`([^`\n]+)`/g, (match, code) => {
    const placeholder = `%%INLINE_CODE_${inlineCodes.length}%%`;
    inlineCodes.push(`<code>${escapeHtml(code)}</code>`);
    return placeholder;
  });

  // 3. 인용구: > 문장
  html = html.replace(/^>\s*(.+)$/gm, '<blockquote>$1</blockquote>');

  // 4. 제목: #, ##, ###
  html = html.replace(/^###\s*(.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^##\s*(.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^#\s*(.+)$/gm, '<h1>$1</h1>');

  // 5. 수평 구분선
  html = html.replace(/^---$/gm, '<hr>');

  // 6. 굵게, 기울임
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // 7. 링크: [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // 8. 목록 아이템: - 아이템
  html = html.replace(/^\s*[-*]\s+(.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>');
  html = html.replace(/<\/ul>\s*<ul>/g, '');

  // 9. 문단 구분 (빈 줄 단위)
  const blocks = html.split(/\n{2,}/);
  html = blocks.map(block => {
    block = block.trim();
    if (!block) return '';
    if (/^<(h[1-6]|pre|blockquote|ul|ol|hr|div|p)/i.test(block) || /^%%CODE_BLOCK_\d+%%$/.test(block)) {
      return block;
    }
    return `<p>${block.replace(/\n/g, '<br>')}</p>`;
  }).join('\n\n');

  // 10. 보호된 코드 블록 및 인라인 코드 복원
  codeBlocks.forEach((cb, idx) => {
    html = html.replace(new RegExp(`%%CODE_BLOCK_${idx}%%`, 'g'), cb);
  });

  inlineCodes.forEach((ic, idx) => {
    html = html.replace(new RegExp(`%%INLINE_CODE_${idx}%%`, 'g'), ic);
  });

  return html;
}

/**
 * 임시저장 불러오기
 */
function loadDraft({ titleInput, categorySelect, thumbnailInput, tagsInput, summaryInput, contentInput }) {
  try {
    const rawDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!rawDraft) return;

    const draft = JSON.parse(rawDraft);
    if (draft.title && titleInput) titleInput.value = draft.title;
    if (draft.category && categorySelect) categorySelect.value = draft.category;
    if (draft.thumbnail && thumbnailInput) thumbnailInput.value = draft.thumbnail;
    if (draft.tags && tagsInput) tagsInput.value = draft.tags;
    if (draft.summary && summaryInput) summaryInput.value = draft.summary;
    if (draft.content && contentInput) contentInput.value = draft.content;

    // 대표 이모지 활성화 표시
    if (draft.thumbnail) {
      const activeBtn = document.querySelector(`.emoji-select-btn[data-emoji="${draft.thumbnail}"]`);
      if (activeBtn) {
        document.querySelectorAll('.emoji-select-btn').forEach(b => b.classList.remove('active'));
        activeBtn.classList.add('active');
      }
    }
  } catch (e) {
    console.warn('임시저장 복원 실패:', e);
  }
}

/**
 * 임시저장 저장
 */
function saveDraftToStorage(data) {
  try {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('임시저장 저장 실패:', e);
  }
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

function showGlobalToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
