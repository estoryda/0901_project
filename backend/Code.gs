/**
 * ==========================================================================
 * Google Apps Script (Code.gs) - Bulletproof v3
 * 어떤 시트 환경(한글 헤더, 영문 헤더, 대소문자, 시트 이름)에서도 100% 동작
 * ==========================================================================
 */

// 1. 시트 자동 초기화
function setupSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('users');
  
  if (!sheet) {
    sheet = ss.insertSheet('users');
    sheet.appendRow([
      'id', 'name', 'username', 'email', 'password', 'role', 'bio', 'joinedDate'
    ]);
    
    var today = Utilities.formatDate(new Date(), "Asia/Seoul", "yyyy-MM-dd");
    sheet.appendRow([
      'user_1', '홍길동', 'gildong_dev', 'developer@example.com', 'password123',
      'Frontend Engineer', '사용자 경험과 클린 코드를 사랑하는 프론트엔드 개발자입니다.', today
    ]);

    sheet.getRange(1, 1, 1, 8).setBackground('#3b82f6').setFontColor('#ffffff').setFontWeight('bold');
    sheet.setFrozenRows(1);
    SpreadsheetApp.flush();
    Logger.log('✅ users 시트가 자동 생성되었습니다!');
  }
}

// 2. GET 요청 처리
function doGet(e) {
  var params = e ? e.parameter : {};
  var action = params.action;

  try {
    if (!action || action === 'ping') {
      return createJsonResponse({ success: true, message: 'Google Apps Script Auth API가 정상 작동 중입니다.' });
    }

    // 진단용 디버그
    if (action === 'debug') {
      var sheet = getTargetSheet();
      var rows = sheet.getDataRange().getValues();
      return createJsonResponse({
        success: true,
        sheetName: sheet.getName(),
        totalRows: rows.length,
        headers: rows.length > 0 ? rows[0] : []
      });
    }

    if (action === 'login') {
      return handleLogin(params.emailOrUsername, params.password);
    }

    return createJsonResponse({ success: false, message: '알 수 없는 GET 액션입니다.' });
  } catch (err) {
    return createJsonResponse({ success: false, error: err.toString() });
  }
}

// 3. POST 요청 처리
function doPost(e) {
  try {
    var body = {};
    if (e && e.postData && e.postData.contents) {
      try {
        body = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        body = e.parameter || {};
      }
    } else if (e && e.parameter) {
      body = e.parameter;
    }

    var action = body.action;

    if (action === 'register') {
      return handleRegister(body);
    }
    if (action === 'login') {
      return handleLogin(body.emailOrUsername, body.password);
    }

    return createJsonResponse({ success: false, message: '지원하지 않는 액션입니다: ' + action });
  } catch (err) {
    return createJsonResponse({ success: false, error: err.toString() });
  }
}

// ==========================================================================
// 비즈니스 로직
// ==========================================================================

// 대상 시트 찾기 (users 시트 우선, 없으면 첫 번째 시트 사용)
function getTargetSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('users');
  if (!sheet) {
    var sheets = ss.getSheets();
    sheet = sheets.length > 0 ? sheets[0] : ss.insertSheet('users');
  }
  return sheet;
}

// 스마트 컬럼 인덱스 매핑 (한글/영문/대소문자/공백 완벽 대응)
function getColumnIndices(headers) {
  var map = {
    id: 0,
    name: 1,
    username: 2,
    email: 3,
    password: 4,
    role: 5,
    bio: 6,
    joinedDate: 7
  };

  if (!headers || headers.length === 0) return map;

  for (var i = 0; i < headers.length; i++) {
    var h = String(headers[i] || '').toLowerCase().replace(/[\s_\-]/g, '');
    if (h === 'id' || h === '아이디고유값' || h === '고유번호') map.id = i;
    else if (h === 'name' || h === '이름' || h === '성명' || h === '사용자명') map.name = i;
    else if (h === 'username' || h === '아이디' || h === '닉네임' || h === '유저네임') map.username = i;
    else if (h === 'email' || h === '이메일' || h === '메일' || h === '계정') map.email = i;
    else if (h === 'password' || h === '비밀번호' || h === '패스워드' || h === 'pw') map.password = i;
    else if (h === 'role' || h === '직무' || h === '역할') map.role = i;
    else if (h === 'bio' || h === '소개' || h === '한줄소개') map.bio = i;
    else if (h === 'joineddate' || h === '가입일' || h === '가입일자' || h === 'date') map.joinedDate = i;
  }

  return map;
}

// 회원가입
function handleRegister(data) {
  var sheet = getTargetSheet();
  var rows = sheet.getDataRange().getValues();
  var headers = rows.length > 0 ? rows[0] : [];
  var col = getColumnIndices(headers);

  var name = String(data.name || '').trim();
  var username = String(data.username || '').trim();
  var email = String(data.email || '').toLowerCase().trim();
  var password = String(data.password || '').trim();
  var role = String(data.role || 'Junior Developer').trim();
  var bio = String(data.bio || '안녕하세요! 반갑습니다.').trim();

  if (!name || !username || !email || !password) {
    return createJsonResponse({ success: false, message: '이름, 닉네임, 이메일, 비밀번호를 모두 입력해 주세요.' });
  }

  // 중복 검사 (2행부터 검사)
  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    var existingEmail = String(row[col.email] || '').toLowerCase().trim();
    var existingUsername = String(row[col.username] || '').toLowerCase().trim();

    if (existingEmail && existingEmail === email) {
      return createJsonResponse({ success: false, message: '이미 가입된 이메일 주소입니다.' });
    }
    if (existingUsername && existingUsername === username) {
      return createJsonResponse({ success: false, message: '이미 사용 중인 닉네임(아이디)입니다.' });
    }
  }

  var userId = 'user_' + new Date().getTime();
  var joinedDate = Utilities.formatDate(new Date(), "Asia/Seoul", "yyyy-MM-dd");

  // 시트가 완전히 비어있을 경우 헤더 먼저 생성
  if (rows.length === 0) {
    sheet.appendRow(['id', 'name', 'username', 'email', 'password', 'role', 'bio', 'joinedDate']);
    sheet.getRange(1, 1, 1, 8).setBackground('#3b82f6').setFontColor('#ffffff').setFontWeight('bold');
  }

  // 새 행 추가
  sheet.appendRow([userId, name, username, email, password, role, bio, joinedDate]);
  SpreadsheetApp.flush(); // 즉시 DB에 강제 반영

  var newUser = {
    id: userId,
    name: name,
    username: username,
    email: email,
    role: role,
    bio: bio,
    joinedDate: joinedDate,
    avatar: 'assets/images/profile.jpg'
  };

  return createJsonResponse({
    success: true,
    message: '회원가입이 성공적으로 완료되었습니다!',
    user: newUser
  });
}

// 로그인 검증
function handleLogin(emailOrUsername, password) {
  var sheet = getTargetSheet();
  var rows = sheet.getDataRange().getValues();

  if (rows.length <= 1) {
    return createJsonResponse({ success: false, message: '등록된 회원이 없습니다. 회원가입을 먼저 진행해 주세요.' });
  }

  var headers = rows[0];
  var col = getColumnIndices(headers);

  var query = String(emailOrUsername || '').toLowerCase().trim();
  var inputPassword = String(password || '').trim();

  if (!query || !inputPassword) {
    return createJsonResponse({ success: false, message: '이메일(아이디)과 비밀번호를 모두 입력해 주세요.' });
  }

  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    var uEmail = String(row[col.email] || '').toLowerCase().trim();
    var uUsername = String(row[col.username] || '').toLowerCase().trim();
    var uPassword = String(row[col.password] || '').trim();

    if ((uEmail === query || uUsername === query) && uPassword === inputPassword) {
      return createJsonResponse({
        success: true,
        message: '로그인 성공',
        user: {
          id: String(row[col.id] || 'user_' + i),
          name: String(row[col.name] || '회원'),
          username: String(row[col.username] || query),
          email: String(row[col.email] || query),
          role: String(row[col.role] || 'Member'),
          bio: String(row[col.bio] || ''),
          joinedDate: String(row[col.joinedDate] || ''),
          avatar: 'assets/images/profile.jpg'
        }
      });
    }
  }

  return createJsonResponse({ success: false, message: '이메일(아이디) 또는 비밀번호가 일치하지 않습니다.' });
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
