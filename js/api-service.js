/**
 * Google Apps Script API Service
 * 구글 스프레드시트 웹 앱(Web App)과 통신하는 클라이언트 모듈
 * 
 * [배포 후 설정]
 * 웹 앱 배포 URL을 아래 GAS_WEB_APP_URL에 넣으시면 
 * 스프레드시트 DB와 실시간으로 통신합니다!
 */

// ⚠️ 배포 후 발급받은 '웹 앱 URL'을 여기에 입력하세요. (비어있으면 로컬 저장소 모드로 작동)
export const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxBKGoKnYl87KcMv-wzApYa37Nq2kCBsBXvekO5pjc8_9A2l3pLawJ-P6JOGR4AeWXL/exec';

/**
 * 스프레드시트 백엔드 회원가입 API 호출
 */
export async function apiRegisterUser(userData) {
  if (!GAS_WEB_APP_URL) {
    return { success: false, isLocal: true };
  }

  try {
    const response = await fetch(GAS_WEB_APP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify({
        action: 'register',
        name: userData.name,
        username: userData.username,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        bio: userData.bio || ''
      })
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('스프레드시트 회원가입 통신 에러:', error);
    return { success: false, message: '스프레드시트 서버 연결 실패: ' + error.message };
  }
}

/**
 * 스프레드시트 백엔드 로그인 API 호출
 */
export async function apiLoginUser(emailOrUsername, password) {
  if (!GAS_WEB_APP_URL) {
    return { success: false, isLocal: true };
  }

  try {
    const response = await fetch(GAS_WEB_APP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify({
        action: 'login',
        emailOrUsername,
        password
      })
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('스프레드시트 로그인 통신 에러:', error);
    return { success: false, message: '스프레드시트 서버 연결 실패: ' + error.message };
  }
}

/**
 * API 연결 상태 체크 (Ping)
 */
export async function apiCheckHealth() {
  if (!GAS_WEB_APP_URL) return false;
  try {
    const res = await fetch(`${GAS_WEB_APP_URL}?action=ping`);
    const data = await res.json();
    return data.success;
  } catch {
    return false;
  }
}
