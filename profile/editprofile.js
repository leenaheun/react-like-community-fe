import { getProfileInfo } from "../api/info.js";
import { updateProfile, deleteUser } from "../api/userService.js"; 
import { BASE_URL } from "../config/config.js";
import { CustomAlert } from "../assets/component/CustomAlert.js";
import {
    validateNickname,
    showHelper,
    hideHelper
} from "../utils/validation.js";

document.addEventListener("DOMContentLoaded", async function () {
    const profilePicInput = document.getElementById("profile-pic");
    const profilePreview = document.getElementById("profile-preview");
    const emailInput = document.getElementById("email");
    const nicknameInput = document.getElementById("nickname");
    const editButton = document.getElementById("edit-button");
    const loginButton = document.getElementById("login-button");
    const cancelButton = document.getElementById("cancel-btn");
    const confirmButton = document.getElementById("confirm-btn");
    const alertBox = new CustomAlert();

    let selectedFile = null; 
    let userData = null;

    // [데이터 처리] 프로필 정보 불러오기
    async function loadUserProfile() {
        const result = await getProfileInfo();
        if (!result.success) {
            alert(result.message);
            return;
        }

        userData = result.data;
        emailInput.textContent = userData.email;
        nicknameInput.value = userData.nickname;
        if (userData.profileImgUrl && userData.profileImgUrl !== "default-profile.png") {
            profilePreview.src = `${BASE_URL}${userData.profileImgUrl}`;
        }
        updateButtonState();
    }

    await loadUserProfile();

    // [UI 처리] 토스트 메시지
    function showToast(message) {
        const toast = document.getElementById("toast");
        toast.textContent = message;
        toast.classList.add("show");
        setTimeout(() => {
            toast.classList.remove("show");
        }, 1000);
    }

    // [UI 처리] 버튼 상태 업데이트
    function updateButtonState() {
        const nicknameValid = !validateNickname(nicknameInput.value);
        const profileValid = profilePreview.src !== "" && profilePreview.src !== null;

        const isValid = nicknameValid && profileValid;
        editButton.disabled = !isValid;
        editButton.style.backgroundColor = isValid ? "#7F6AEE" : "#ACA0EB";
    };

    // [이벤트 처리] 입력 유효성 검사
    nicknameInput.addEventListener("input", function () {
        const msg = validateNickname(nicknameInput.value);
        msg ? showHelper("nickname-helper", msg) : hideHelper("nickname-helper");
        updateButtonState();
    });

    // [이벤트 처리] 파일 업로드
    profilePicInput.addEventListener("change", function(event) {
        const file = event.target.files[0];
        if (file) {
            selectedFile = file; 
            const reader = new FileReader();
            reader.onload = e => profilePreview.src = e.target.result;
            reader.readAsDataURL(file);
        } else {
            selectedFile = null;
            profilePreview.src = `${BASE_URL}${userData.profileImgUrl}`;
        }
        updateButtonState();
    });

    // [이벤트 처리] 수정 버튼 클릭
    editButton.addEventListener("click", async function (event) { 
        event.preventDefault();
        const nickname = nicknameInput.value.trim();

        const updateData = {};
        if (nickname !== userData.nickname) updateData.nickname = nickname;
        if (selectedFile) updateData.profileImg = selectedFile;

        if (Object.keys(updateData).length === 0) {
            alertBox.show("수정된 내용이 없습니다.");
            return;
        }

        const result = await updateProfile(updateData);
        if (result.success) {
            showToast("수정 완료");
            await loadUserProfile();
        } else {
            console.log(result.message);
        }
    });

    // [이벤트 처리] 회원탈퇴 클릭
    function openDeleteModal() {
        document.getElementById('delete-modal').style.display = 'flex';
    }
    function closeDeleteModal() {
        document.getElementById('delete-modal').style.display = 'none';
    }
    loginButton.addEventListener("click", function (event) {
        openDeleteModal();
    });
    cancelButton.addEventListener("click", function (event) {
        closeDeleteModal();
    });
    confirmButton.addEventListener("click", async function (event) {
        event.preventDefault();
        closeDeleteModal();
    
        const result = await deleteUser(); 
        if (result.success) {
            window.location.href = "../auth/login.html";
        } else {
            console.log(result.message);
        }
    });
});