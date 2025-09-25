import { loginUser } from "../api/userService.js";
import { CustomAlert } from "../assets/component/CustomAlert.js";
import {
    validateEmail,
    validatePassword,
    showHelper,
    hideHelper
} from "../utils/validation.js";

document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const loginButton = document.getElementById("login-button");

    const alertBox = new CustomAlert();

    // [UI 처리] 로그인 버튼 활성화
    function updateButtonState() {
        const emailValid = !validateEmail(emailInput);
        const passwordValid = !validatePassword(passwordInput.value);

        const isValid = emailValid && passwordValid;
        loginButton.disabled = !isValid;
        loginButton.style.backgroundColor = isValid ? "#7F6AEE" : "#ACA0EB";
    }

    // [이벤트 처리] 입력 유효성 검사
    emailInput.addEventListener("input", function () {
        const msg = validateEmail(emailInput);
        msg ? showHelper("email-helper", msg) : hideHelper("email-helper");
        updateButtonState();
    });
    
    passwordInput.addEventListener("input", function () {
        const msg = validatePassword(passwordInput.value);
        msg ? showHelper("password-helper", msg) : hideHelper("password-helper");
        updateButtonState();
    });

     // [이벤트 처리] 로그인 버튼 클릭
    loginButton.addEventListener("click", async function (event) {
        event.preventDefault();

        const email = emailInput.value;
        const password = passwordInput.value;

        const result = await loginUser(email, password);
        if (result.success) {
            window.location.href = "../community/posts.html";
        } else if (result.status === 401) {
            alertBox.show("이메일 또는 비밀번호가 올바르지 않습니다.");
        }else {
            console.log(result.message); 
        }
    });
});

