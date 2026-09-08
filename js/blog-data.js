/**
 * Blog Data & Storage Service
 * Manages blog articles, comments, views, likes, and search/filtering.
 */

const STORAGE_KEYS = {
  POSTS: 'blog_posts',
  LIKED_POSTS: 'blog_liked_posts'
};

const DEFAULT_POSTS = [
  {
    id: 1,
    title: '모던 웹 프론트엔드 아키텍처: 컴포넌트 주도 설계와 상태 관리의 진화',
    summary: '웹 애플리케이션의 복잡도가 높아짐에 따라 모듈화와 유지보수성은 프론트엔드 엔지니어링의 핵심 과제가 되었습니다. 컴포넌트 설계 원칙과 최신 상태 관리 패턴을 살펴봅니다.',
    category: 'Frontend',
    tags: ['Architecture', 'React', 'DesignSystem', 'CleanCode'],
    date: '2026-03-01',
    readTime: '6분 읽기',
    views: 1420,
    likes: 87,
    featured: true,
    thumbnail: '⚡',
    author: {
      name: '홍길동',
      role: 'Frontend Engineer',
      avatar: 'assets/images/profile.jpg'
    },
    content: `
      <h2>1. 서론: 왜 프론트엔드 아키텍처인가?</h2>
      <p>과거의 웹사이트는 정적인 HTML/CSS 문서를 전달하고 약간의 인터랙션을 스크립트로 제어하는 수준에 불과했습니다. 하지만 오늘날의 웹은 데스크톱 네이티브 앱에 준하는 복잡한 비즈니스 로직과 실시간 상태 관리를 요구받고 있습니다.</p>
      <p>복잡성이 증가할수록 코드의 <strong>결합도(Coupling)</strong>는 낮추고 <strong>응집도(Cohesion)</strong>를 높이는 체계적인 아키텍처 원칙이 필수가 되었습니다.</p>

      <blockquote>
        "아키텍처의 목표는 시스템을 구축하고 유지보수하는 데 드는 인적 자원을 최소화하는 것이다." — 로버트 C. 마틴 (클린 아키텍처)
      </blockquote>

      <h2>2. 컴포넌트 주도 개발(CDD)과 역할 분리</h2>
      <p>컴포넌트 설계 시 가장 흔히 범하는 실수는 <em>데이터 패칭(Data Fetching)</em>, <em>비즈니스 로직</em>, <em>스타일 렌더링</em>을 하나의 컴포넌트에 모두 쏟아붓는 것입니다.</p>

      <h3>관심사 분리(Separation of Concerns) 패턴</h3>
      <ul>
        <li><strong>Presentational Components:</strong> 순수 UI 렌더링 담당, props를 통해 데이터와 콜백만 수신</li>
        <li><strong>Container / Hook Layer:</strong> 데이터 호출 및 상태 로직 전담 (Custom Hook을 통한 캡슐화)</li>
        <li><strong>Domain Models:</strong> 백엔드 DTO를 화면 표시용 데이터로 변환하는 순수 변환 함수</li>
      </ul>

      <pre><code class="language-typescript">// 예시: Custom Hook을 통한 비즈니스 로직 캡슐화
export function useArticleList(category: string) {
  const [articles, setArticles] = useState&lt;Article[]&gt;([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isSubscribed = true;
    fetchArticlesByCategory(category).then(data => {
      if (isSubscribed) {
        setArticles(data);
        setLoading(false);
      }
    });
    return () => { isSubscribed = false; };
  }, [category]);

  return { articles, loading };
}</code></pre>

      <h2>3. 상태 관리의 진화: 전역 상태의 미니멀리즘</h2>
      <p>과거 모든 데이터를 Redux 같은 거대한 단일 스토어에 넣던 관행에서 벗어나, 현재는 <strong>서버 상태(Server State)</strong>와 <strong>클라이언트 UI 상태(Client State)</strong>를 엄격히 분리하는 추세입니다.</p>
      <ol>
        <li><strong>Server State:</strong> 캐싱, 재시도, 유효성 검증 (React Query, SWR 등 활용)</li>
        <li><strong>Client UI State:</strong> 모달 오픈 여부, 테마 모드, 폼 임시 입력값 (Zustand, Context API 등 가벼운 도구)</li>
      </ol>

      <h2>4. 정리하며</h2>
      <p>완벽한 아키텍처는 존재하지 않으며, 팀의 규모와 프로젝트 요구사항에 맞는 유연하고 변경에 용이한 설계를 끊임없이 고민해야 합니다. 작은 컴포넌트 단위부터 단일 책임 원칙(SRP)을 적용해 보세요.</p>
    `,
    comments: [
      {
        id: 101,
        author: '김코드',
        avatar: 'assets/images/dog.jpg',
        date: '2026-03-02 14:20',
        content: '서버 상태와 클라이언트 상태를 분리하는 관점이 정말 공감됩니다! 실무에서 구조 잡을 때 큰 도움이 되었어요.'
      },
      {
        id: 102,
        author: '이프론트',
        avatar: 'assets/images/profile.jpg',
        date: '2026-03-03 09:15',
        content: 'Custom Hook 기반 레이어 분리 예시 코드가 명쾌하네요. 다음 글도 기대하겠습니다!'
      }
    ]
  },
  {
    id: 2,
    title: '웹 성능 최적화 완벽 가이드: LCP, FID, CLS 코어 웹 바이탈 개선기',
    summary: '구글 코어 웹 바이탈(Core Web Vitals) 지표를 측정하고 실제 렌더링 성능을 개선한 경험을 공유합니다. 리소스 프리로드, 이미지 최적화, 레이아웃 이동 방지 기법을 다룹니다.',
    category: 'Performance',
    tags: ['WebPerf', 'CoreWebVitals', 'Lighthouse', 'Optimization'],
    date: '2026-02-24',
    readTime: '8분 읽기',
    views: 2150,
    likes: 124,
    featured: true,
    thumbnail: '🚀',
    author: {
      name: '홍길동',
      role: 'Frontend Engineer',
      avatar: 'assets/images/profile.jpg'
    },
    content: `
      <h2>1. 코어 웹 바이탈(Core Web Vitals)이란?</h2>
      <p>구글은 사용자 경험을 수량화하기 위해 3가지 핵심 지표를 제시했습니다:</p>
      <ul>
        <li><strong>LCP (Largest Contentful Paint):</strong> 최대 콘텐츠 렌더링 시간 (권장 2.5초 이내)</li>
        <li><strong>INP / FID (Interaction to Next Paint):</strong> 사용자의 입력 반응성 (권장 200ms 이내)</li>
        <li><strong>CLS (Cumulative Layout Shift):</strong> 시각적 안정성, 레이아웃 밀림 방지 (권장 0.1 이하)</li>
      </ul>

      <h2>2. LCP 4.2초 -> 1.3초 단축 전략</h2>
      <p>LCP 개선에서 가장 결정적이었던 것은 <strong>핵심 이미지 우선 로딩</strong>과 <strong>서버 사이드 힌트</strong> 적용이었습니다.</p>
      
      <pre><code class="language-html">&lt;!-- 상단 히어로 배너 이미지 preload 적용 --&gt;
&lt;link rel="preload" as="image" href="/assets/hero.webp" fetchpriority="high"&gt;

&lt;!-- 반응형 webp 및 크기 명시 --&gt;
&lt;img src="/assets/hero.webp" width="1200" height="600" alt="Hero Banner" decoding="async"&gt;</code></pre>

      <h2>3. CLS 0점 달성: 레이아웃 시프트 박멸</h2>
      <p>동적으로 로딩되는 광고나 이미지에 높이(height)나 비율(aspect-ratio)을 지정하지 않으면 브라우저는 렌더링 도중 크기를 다시 계산하며 주변 콘텐츠를 밀어냅니다. 이를 방지하기 위해 CSS <code>aspect-ratio</code>를 적극 활용했습니다.</p>

      <pre><code class="language-css">.responsive-banner {
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: var(--bg-subtle); /* 스켈레톤 플레이스홀더 */
}</code></pre>

      <h2>4. 결론 및 성과</h2>
      <p>성능 최적화는 한 번 끝내고 마는 작업이 아니라 지속적인 모니터링 체계를 구축해야 비로소 유지될 수 있습니다. Lighthouse CI와 RUM(Real User Monitoring)을 프로젝트에 도입해 보세요.</p>
    `,
    comments: [
      {
        id: 201,
        author: '박성능',
        avatar: 'assets/images/profile.jpg',
        date: '2026-02-25 11:30',
        content: 'aspect-ratio 적용만으로도 CLS 잡는 데 큰 효과를 봤습니다. 좋은 글 감사합니다.'
      }
    ]
  },
  {
    id: 3,
    title: '자바스크립트 비동기 프로그래밍 심층 분석: Event Loop부터 Async/Await까지',
    summary: '싱글 스레드 기반 자바스크립트가 동시성을 다루는 원리를 Call Stack, Web APIs, Task Queue, Microtask Queue의 상호작용으로 알기 쉽게 풀어냅니다.',
    category: 'JavaScript',
    tags: ['JavaScript', 'Async', 'EventLoop', 'DeepDive'],
    date: '2026-02-15',
    readTime: '7분 읽기',
    views: 1890,
    likes: 95,
    featured: false,
    thumbnail: '⚙️',
    author: {
      name: '홍길동',
      role: 'Frontend Engineer',
      avatar: 'assets/images/profile.jpg'
    },
    content: `
      <h2>1. 자바스크립트는 싱글 스레드인데 어떻게 비동기를 처리할까?</h2>
      <p>자바스크립트 엔진 자체(V8 등)는 단 하나의 Call Stack만을 가지고 실행됩니다. 즉, 한 번에 하나의 작업만 수행할 수 있습니다. 비동기 작업의 동시성을 가능하게 해주는 핵심은 브라우저 환경이 제공하는 <strong>Web APIs</strong>와 <strong>이벤트 루프(Event Loop)</strong>입니다.</p>

      <h2>2. Microtask Queue vs Macrotask Queue</h2>
      <p>태스크 큐는 우선순위에 따라 나뉩니다. 이벤트 루프는 콜 스택이 비었을 때 마이크로태스크 큐를 먼저 완전히 비운 후에야 매크로태스크를 하나 처리합니다.</p>
      <ul>
        <li><strong>Microtask:</strong> Promise callbacks, process.nextTick, MutationObserver</li>
        <li><strong>Macrotask (Task):</strong> setTimeout, setInterval, setImmediate, I/O 이벤트</li>
      </ul>

      <pre><code class="language-javascript">console.log('1. Start');

setTimeout(() => {
  console.log('2. Timeout (Macrotask)');
}, 0);

Promise.resolve().then(() => {
  console.log('3. Promise (Microtask)');
});

console.log('4. End');

// 출력 순서:
// 1. Start
// 4. End
// 3. Promise (Microtask)
// 2. Timeout (Macrotask)</code></pre>

      <h2>3. Async/Await의 실체: Generator와 Promise의 결합</h2>
      <p><code>async/await</code>는 자바스크립트의 새로운 비동기 엔진이 아니라, <code>Promise</code>와 <code>Generator</code>를 기반으로 만든 문법적 설탕(Syntactic Sugar)입니다. 이를 이해하면 에러 핸들링과 병렬 처리를 훨씬 우아하게 작성할 수 있습니다.</p>
    `,
    comments: []
  },
  {
    id: 4,
    title: 'CSS 신기술 총정리: Container Queries, Subgrid, View Transitions',
    summary: '뷰포트 기준이 아닌 부모 컨테이너 기준 반응형 디자인을 가능하게 하는 컨테이너 쿼리와 더욱 정교해진 CSS 그리드 서브그리드, 모바일 앱 같은 화면 전환 효과를 살펴봅니다.',
    category: 'CSS',
    tags: ['CSS3', 'ContainerQueries', 'Subgrid', 'WebDesign'],
    date: '2026-02-02',
    readTime: '5분 읽기',
    views: 980,
    likes: 62,
    featured: false,
    thumbnail: '🎨',
    author: {
      name: '홍길동',
      role: 'Frontend Engineer',
      avatar: 'assets/images/profile.jpg'
    },
    content: `
      <h2>1. 미디어 쿼리의 한계를 넘는 Container Queries</h2>
      <p>기존 미디어 쿼리는 브라우저 창(Viewport)의 크기에만 의존했습니다. 동일한 카드 컴포넌트라도 메인 피드에 들어갈 때와 좁은 사이드바에 들어갈 때 서로 다른 스타일이 필요하지만, 뷰포트 기준으로는 이를 제어하기 까다로웠습니다.</p>

      <pre><code class="language-css">.card-container {
  container-type: inline-size;
}

@container (min-width: 450px) {
  .card {
    display: flex;
    flex-direction: row;
  }
}</code></pre>

      <h2>2. View Transitions API: 단일 페이지처럼 부드러운 화면 전환</h2>
      <p>SPA(Single Page App)나 멀티 페이지 웹사이트 모두에서 페이지 이동 시 앱과 같은 네이티브한 애니메이션 전환 효과를 아주 적은 코드로 구현할 수 있게 되었습니다.</p>
    `,
    comments: []
  },
  {
    id: 5,
    title: '주니어 개발자의 1년간 기술 블로그 운영 회고 및 성장 기록',
    summary: '매주 1편씩 꾸준히 글을 쓰며 느낀 지식의 체계화, 코드 리뷰와 기술 면접에서의 이점, 그리고 블로그를 운영하며 배운 팁들을 진솔하게 기록합니다.',
    category: 'Career',
    tags: ['Career', 'Retrospective', 'Blogging', 'Growth'],
    date: '2026-01-20',
    readTime: '4분 읽기',
    views: 3120,
    likes: 210,
    featured: false,
    thumbnail: '✍️',
    author: {
      name: '홍길동',
      role: 'Frontend Engineer',
      avatar: 'assets/images/profile.jpg'
    },
    content: `
      <h2>1. 왜 기술 블로그를 시작했는가?</h2>
      <p>단순히 코드를 복사해서 붙여넣고 끝나는 코딩이 아니라, '내가 왜 이 기술을 선택했고 어떤 문제를 해결했는가'를 글로 설명할 수 있어야 진짜 내 지식이 된다는 것을 느꼈습니다.</p>

      <h2>2. 1년간 글을 쓰며 얻은 세 가지 변화</h2>
      <ol>
        <li><strong>공식 문서와 스펙을 파고드는 습관:</strong> 남에게 설명하려면 피상적인 지식으로는 부족했습니다. MDN과 ECMAScript 명세를 직접 찾아보게 되었습니다.</li>
        <li><strong>기술 면접과 협업에서의 자신감:</strong> 질문을 받았을 때 머릿속에 정돈된 프레임워크로 논리적인 답변을 할 수 있었습니다.</li>
        <li><strong>개발자 커뮤니티와의 연결:</strong> 피드백과 질문 댓글을 통해 새로운 인사이트를 얻고 지평을 넓힐 수 있었습니다.</li>
      </ol>
    `,
    comments: [
      {
        id: 501,
        author: '초보코더',
        avatar: 'assets/images/dog.jpg',
        date: '2026-01-22 18:40',
        content: '저도 이제 막 블로그를 시작하려는데 큰 동기부여가 됩니다. 꾸준함이 비결이네요!'
      }
    ]
  },
  {
    id: 6,
    title: 'REST API에서 GraphQL, 그리고 tRPC까지: 클라이언트-서버 통신의 변천사',
    summary: '오버패칭과 언더패칭을 해결하기 위해 등장한 GraphQL, 그리고 풀스택 타입스크립트 생태계에서 엔드투엔드 타입 안전성을 선사하는 tRPC의 장단점을 비교 분석합니다.',
    category: 'Architecture',
    tags: ['API', 'GraphQL', 'tRPC', 'TypeScript'],
    date: '2026-01-10',
    readTime: '7분 읽기',
    views: 1650,
    likes: 79,
    featured: false,
    thumbnail: '🔄',
    author: {
      name: '홍길동',
      role: 'Frontend Engineer',
      avatar: 'assets/images/profile.jpg'
    },
    content: `
      <h2>1. REST API의 오랜 장점과 마주한 한계</h2>
      <p>REST는 직관적인 HTTP 메서드와 리소스 중심의 URL로 웹의 표준으로 자리 잡았습니다. 하지만 모바일 디바이스의 보급과 복잡한 대시보드 화면이 늘어나면서 <em>Over-fetching</em>(불필요한 데이터 수신)과 <em>Under-fetching</em>(화면 하나를 위해 N번의 API 요청 필요) 문제가 불거졌습니다.</p>

      <h2>2. GraphQL의 선언적 데이터 질의</h2>
      <p>클라이언트가 원하는 필드 구조를 JSON 형태로 정확히 지정하여 단일 엔드포인트(<code>/graphql</code>)로 요청할 수 있게 되었습니다.</p>

      <h2>3. tRPC: 코드 생성 없는 무결점 E2E 타입 안정성</h2>
      <p>프론트엔드와 백엔드가 모두 TypeScript로 작성된 모노레포 환경이라면, 스키마 정의나 스키마 컴파일 없이도 백엔드 라우터의 타입을 프론트엔드가 즉시 추론할 수 있는 tRPC가 가장 이상적인 해결책으로 떠오르고 있습니다.</p>
    `,
    comments: []
  }
];

/**
 * 초기 게시글 데이터 로드 또는 로컬스토리지 복원
 */
export function getPosts() {
  const saved = localStorage.getItem(STORAGE_KEYS.POSTS);
  if (!saved) {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(DEFAULT_POSTS));
    return DEFAULT_POSTS;
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to parse blog posts from storage', e);
    return DEFAULT_POSTS;
  }
}

/**
 * 특정 ID의 게시글 가져오기 (조회수 1 증가)
 */
export function getPostById(id, incrementView = false) {
  const posts = getPosts();
  const post = posts.find(p => p.id === Number(id));
  if (!post) return null;

  if (incrementView) {
    post.views = (post.views || 0) + 1;
    savePosts(posts);
  }
  return post;
}

/**
 * 추천 / 대표 게시글
 */
export function getFeaturedPosts() {
  const posts = getPosts();
  return posts.filter(p => p.featured);
}

/**
 * 카테고리 목록과 개수
 */
export function getCategories() {
  const posts = getPosts();
  const counts = { All: posts.length };
  posts.forEach(p => {
    counts[p.category] = (counts[p.category] || 0) + 1;
  });
  return counts;
}

/**
 * 인기 태그 목록
 */
export function getPopularTags() {
  const posts = getPosts();
  const tagsMap = {};
  posts.forEach(p => {
    (p.tags || []).forEach(tag => {
      tagsMap[tag] = (tagsMap[tag] || 0) + 1;
    });
  });
  return Object.keys(tagsMap).sort((a, b) => tagsMap[b] - tagsMap[a]);
}

/**
 * 좋아요 토글
 */
export function toggleLikePost(postId) {
  const liked = getLikedPostIds();
  const idNum = Number(postId);
  const posts = getPosts();
  const post = posts.find(p => p.id === idNum);
  if (!post) return { isLiked: false, likes: 0 };

  const index = liked.indexOf(idNum);
  let isLiked = false;

  if (index > -1) {
    liked.splice(index, 1);
    post.likes = Math.max(0, (post.likes || 1) - 1);
    isLiked = false;
  } else {
    liked.push(idNum);
    post.likes = (post.likes || 0) + 1;
    isLiked = true;
  }

  localStorage.setItem(STORAGE_KEYS.LIKED_POSTS, JSON.stringify(liked));
  savePosts(posts);
  return { isLiked, likes: post.likes };
}

/**
 * 좋아요 여부 확인
 */
export function isPostLiked(postId) {
  const liked = getLikedPostIds();
  return liked.includes(Number(postId));
}

function getLikedPostIds() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.LIKED_POSTS) || '[]');
  } catch {
    return [];
  }
}

/**
 * 댓글 추가
 */
export function addComment(postId, { author, content, avatar }) {
  const posts = getPosts();
  const post = posts.find(p => p.id === Number(postId));
  if (!post) throw new Error('게시글을 찾을 수 없습니다.');

  if (!post.comments) post.comments = [];

  const now = new Date();
  const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const newComment = {
    id: Date.now(),
    author: author.trim(),
    avatar: avatar || 'assets/images/profile.jpg',
    date: formattedDate,
    content: content.trim()
  };

  post.comments.push(newComment);
  savePosts(posts);
  return newComment;
}

/**
 * 댓글 삭제
 */
export function deleteComment(postId, commentId) {
  const posts = getPosts();
  const post = posts.find(p => p.id === Number(postId));
  if (!post || !post.comments) return false;

  post.comments = post.comments.filter(c => c.id !== Number(commentId));
  savePosts(posts);
  return true;
}

/**
 * 새 글 작성
 */
export function createPost(newPostData) {
  const posts = getPosts();
  const newId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;
  const post = {
    id: newId,
    title: newPostData.title,
    summary: newPostData.summary,
    category: newPostData.category || 'General',
    tags: newPostData.tags || [],
    date: new Date().toISOString().split('T')[0],
    readTime: `${Math.max(1, Math.ceil(newPostData.content.length / 500))}분 읽기`,
    views: 1,
    likes: 0,
    featured: false,
    thumbnail: newPostData.thumbnail || '📝',
    author: newPostData.author || {
      name: '홍길동',
      role: 'Frontend Engineer',
      avatar: 'assets/images/profile.jpg'
    },
    content: newPostData.content,
    comments: []
  };

  posts.unshift(post);
  savePosts(posts);
  return post;
}

function savePosts(posts) {
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
}
