import { updatePassword } from "../api/userService.js";
import {
    validatePassword,
    validateConfirmPassword,
    showHelper,
    hideHelper,
  } from "../utils/validation.js";

document.addEventListener("DOMContentLoaded", function () {
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const editButton = document.getElementById("edit-button");

    // [UI 처리] 토스트 메시지
    function showToast(message) {
        const toast = document.getElementById("toast");
        toast.textContent = message;
        toast.classList.add("show");
        setTimeout(() => {
            toast.classList.remove("show");
        }, 1000);
    }

    // [UI 처리] 수정 버튼 활성화
    function updateButtonState() {
        const passwordValid = passwordInput.value && document.getElementById("password-helper").style.visibility === "hidden";
        const confirmPasswordValid = confirmPasswordInput.value === passwordInput.value;
        if (passwordValid && confirmPasswordValid ) {
            editButton.disabled = false;
            editButton.style.backgroundColor = "#7F6AEE";
        } else {
            editButton.disabled = true;
            editButton.style.backgroundColor = "#ACA0EB";
        }
    }

     // [이벤트 처리] 유효성 검사 핸들러
    passwordInput.addEventListener("input", function () {
        const msg = validatePassword(passwordInput.value);
        msg ? showHelper("password-helper", msg) : hideHelper("password-helper");
        updateButtonState();
    });

    confirmPasswordInput.addEventListener("input", function () {
        const msg = validateConfirmPassword(passwordInput.value, confirmPasswordInput.value);
        msg ? showHelper("confirm-password-helper", msg) : hideHelper("confirm-password-helper");
        updateButtonState();
    });
    
    // [이벤트 처리] 수정 버튼 클릭
    editButton.addEventListener("click", async function (event) { 
        event.preventDefault();
        if (!editButton.disabled) {
            const newPassword = passwordInput.value; 
            const result = await updatePassword(newPassword); 
            if (result.success) {
                showToast("수정 완료");
                passwordInput.value = "";
                confirmPasswordInput.value = "";
            } else {
                console.log(result.message);
            }
        }
    });
});