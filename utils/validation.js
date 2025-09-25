// 이메일 유효성 검사
export function validateEmail(input) {
    const value = input.value;
    if (!value || value.trim() === "") {
        return "이메일을 입력해주세요.";
    }
    if (input.validity.typeMismatch) {
      return "올바른 이메일 주소 형식을 입력해주세요.";
    }
    return "";
}
  
// 비밀번호 정규식
const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
  
// 비밀번호 유효성 검사
export function validatePassword(password) {
    if (!password) {
      return "비밀번호를 입력해주세요.";
    }
    if (!passwordRegex.test(password)) {
      return "비밀번호는 8~20자이며, 대/소문자/숫자/특수문자를 각각 최소 1개 포함해야 합니다.";
    }
    return "";
}
  
// 닉네임 유효성 검사
export function validateNickname(nickname) {
    if (!nickname || !nickname.trim()) {
      return "닉네임을 입력해주세요.";
    }
    if (nickname.includes(" ")) {
      return "띄어쓰기를 없애주세요.";
    }
    if (nickname.length > 10) {
      return "닉네임은 최대 10자까지 작성 가능합니다.";
    }
    return "";
}
  
// 비밀번호 확인
export function validateConfirmPassword(password, confirmPassword) {
    if (confirmPassword !== password) {
      return "비밀번호가 다릅니다.";
    }
    return "";
}
  
// helper-text 표시
export function showHelper(id, message) {
    const el = document.getElementById(id);
    el.textContent = message;
    el.style.visibility = "visible";
}
  
// helper-text 숨김
export function hideHelper(id) {
    const el = document.getElementById(id);
    el.style.visibility = "hidden";
}
  