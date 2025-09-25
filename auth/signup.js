import { signupUser } from "../api/userService.js";
import { CustomAlert } from "../assets/component/CustomAlert.js";
import {
    validateEmail,
    validatePassword,
    validateConfirmPassword,
    validateNickname,
    showHelper,
    hideHelper
} from "../utils/validation.js";


document.addEventListener("DOMContentLoaded", function () {
    const profilePicInput = document.getElementById("profile-pic");
    const profilePreview = document.getElementById("profile-preview");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const nicknameInput = document.getElementById("nickname");
    const signupBtn = document.getElementById("signup-btn");
    const plusIcon = document.getElementById("plus-icon");
    const alertBox = new CustomAlert();

    // [UI 처리] 회원가입 버튼 활성화
    function updateButtonState() {
        const emailValid = !validateEmail(emailInput);
        const passwordValid = !validatePassword(passwordInput.value);
        const confirmPasswordValid = !validateConfirmPassword(passwordInput.value, confirmPasswordInput.value);
        const nicknameValid = !validateNickname(nicknameInput.value);
        const profileValid = profilePreview.src && profilePreview.src !== "";
        
        const isValid = emailValid && passwordValid && confirmPasswordValid && nicknameValid && profileValid;
        signupBtn.disabled = !isValid;
        signupBtn.style.backgroundColor = isValid ? "#7F6AEE" : "#ACA0EB";
    }

    // [이벤트 처리] 입력 유효성 검사
    emailInput.addEventListener("input", function () {
        const msg = validateEmail(emailInput);
        if (msg) showHelper("email-helper", msg);
        else hideHelper("email-helper");
        updateButtonState();
    });

    passwordInput.addEventListener("input", function () {
        const msg = validatePassword(passwordInput.value);
        if (msg) showHelper("password-helper", msg);
        else hideHelper("password-helper");
        updateButtonState();
    });

    ["paste", "copy", "cut", "contextmenu"].forEach(eventName => { // 비밀번호 확인은 복사, 붙여넣기 금지
        confirmPasswordInput.addEventListener(eventName, e => e.preventDefault());
    });
    
    confirmPasswordInput.addEventListener("input", function () {
        const msg = validateConfirmPassword(passwordInput.value, confirmPasswordInput.value);
        if (msg) showHelper("confirm-password-helper", msg);
        else hideHelper("confirm-password-helper");
        updateButtonState();
    });

    nicknameInput.addEventListener("input", function () {
        const msg = validateNickname(nicknameInput.value);
        if (msg) showHelper("nickname-helper", msg);
        else hideHelper("nickname-helper");
        updateButtonState();
    });

    // [이벤트 처리] 파일 업로드
    profilePicInput.addEventListener("change", function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profilePreview.src = e.target.result;
                profilePreview.style.display = "block"; 
                plusIcon.style.display = "none";
                hideHelper("profile-helper");
                updateButtonState(); 
            };
            reader.readAsDataURL(file);
        }
        else{
            profilePreview.style.display = "none";
            plusIcon.style.display = "block";
            showHelper("profile-helper", "프로필 사진을 추가해주세요.");
            updateButtonState(); 
        }
    });

     // [이벤트 처리] 회원가입 버튼 클릭
     signupBtn.addEventListener("click", async function (event) { 
        event.preventDefault();
        if (!signupBtn.disabled) {
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            const nickname = nicknameInput.value.trim();
            const file = profilePicInput.files[0];  

            const result = await signupUser(email, password, nickname, file);
            if (result.success) {
                alertBox.show("회원가입이 완료되었습니다.", () => {
                    window.location.href = "login.html";
                });
            } else {
                console.log(result.message);
            }
        }
    });
});
