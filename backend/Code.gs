/**
 * ==========================================================================
 * Google Apps Script (Code.gs) - v2 (강력한 유연성 지원)
 * ==========================================================================
 */

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
    Logger.log('✅ users 시트가 자동 생성되었습니다!');
  }
}

function doGet(e) {
  var params = e ? e.parameter : {};
  var action = params.action;

  try {
    if (!action || action === 'ping') {
      return createJsonResponse({ success: true, message: 'Google Apps Script Auth API가 정상 작동 중입니다.' });
    }

    if (action === 'login') {
      return handleLogin(params.emailOrUsername, params.password);
    }

    if (action === 'checkDuplicate') {
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      var sheet = getOrCreateUsersSheet(ss);
      var users = getSheetData(sheet);
      var email = String(params.email || '').toLowerCase().trim();
      var username = String(params.username || '').toLowerCase().trim();

      var emailExists = users.some(function(u) { return String(u.email || '').toLowerCase().trim() === email; });
      var usernameExists = users.some(function(u) { return String(u.username || '').toLowerCase().trim() === username; });

      return createJsonResponse({
        success: true,
        emailExists: emailExists,
        usernameExists: usernameExists
      });
    }

    return createJsonResponse({ success: false, message: '알 수 없는 GET 액션입니다.' });
  } catch (err) {
    return createJsonResponse({ success: false, error: err.toString() });
  }
}

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

function handleRegister(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getOrCreateUsersSheet(ss);
  var users = getSheetData(sheet);

  var name = String(data.name || '').trim();
  var username = String(data.username || '').trim();
  var email = String(data.email || '').toLowerCase().trim();
  var password = String(data.password || '').trim();
  var role = String(data.role || 'Junior Developer').trim();
  var bio = String(data.bio || '안녕하세요! 반갑습니다.').trim();

  if (!name || !username || !email || !password) {
    return createJsonResponse({ success: false, message: '이름, 닉네임, 이메일, 비밀번호는 필수 입력 항목입니다.' });
  }

  for (var i = 0; i < users.length; i++) {
    var existingEmail = String(users[i].email || '').toLowerCase().trim();
    var existingUsername = String(users[i].username || '').toLowerCase().trim();

    if (existingEmail === email) {
      return createJsonResponse({ success: false, message: '이미 가입된 이메일 주소입니다.' });
    }
    if (existingUsername === username) {
      return createJsonResponse({ success: false, message: '이미 사용 중인 닉네임(아이디)입니다.' });
    }
  }

  var userId = 'user_' + new Date().getTime();
  var joinedDate = Utilities.formatDate(new Date(), "Asia/Seoul", "yyyy-MM-dd");

  sheet.appendRow([userId, name, username, email, password, role, bio, joinedDate]);

  return createJsonResponse({
    success: true,
    message: '회원가입이 성공적으로 완료되었습니다!',
    user: { id: userId, name: name, username: username, email: email, role: role, bio: bio, joinedDate: joinedDate, avatar: 'assets/images/profile.jpg' }
  });
}

function handleLogin(emailOrUsername, password) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = getOrCreateUsersSheet(ss);
  var users = getSheetData(sheet);

  var query = String(emailOrUsername || '').toLowerCase().trim();
  var inputPassword = String(password || '').trim();

  if (!query || !inputPassword) {
    return createJsonResponse({ success: false, message: '이메일(아이디)과 비밀번호를 모두 입력해 주세요.' });
  }

  for (var i = 0; i < users.length; i++) {
    var u = users[i];
    var uEmail = String(u.email || '').toLowerCase().trim();
    var uUsername = String(u.username || '').toLowerCase().trim();
    var uPassword = String(u.password || '').trim();

    if ((uEmail === query || uUsername === query) && uPassword === inputPassword) {
      return createJsonResponse({
        success: true,
        message: '로그인에 성공했습니다.',
        user: {
          id: u.id || 'user_demo',
          name: u.name || '회원',
          username: u.username || query,
          email: u.email || query,
          role: u.role || 'Member',
          bio: u.bio || '',
          joinedDate: u.joineddate || u.joinedDate || '',
          avatar: 'assets/images/profile.jpg'
        }
      });
    }
  }

  return createJsonResponse({ success: false, message: '이메일(아이디) 또는 비밀번호가 일치하지 않습니다.' });
}

function getOrCreateUsersSheet(ss) {
  var sheet = ss.getSheetByName('users');
  if (!sheet) {
    sheet = ss.getActiveSheet(); // 만약 users 탭이 없으면 현재 활성 시트 사용
  }
  return sheet;
}

function getSheetData(sheet) {
  if (!sheet) return [];
  var rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];

  // 헤더를 소문자 및 공백 제거하여 정규화
  var headers = rows[0].map(function(h) {
    return String(h || '').toLowerCase().replace(/\s+/g, '');
  });
  var list = [];

  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    var item = {};
    for (var j = 0; j < headers.length; j++) {
      if (headers[j]) {
        item[headers[j]] = row[j];
      }
    }
    list.push(item);
  }
  return list;
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
