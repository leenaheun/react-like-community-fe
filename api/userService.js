import { authFetch} from "./info.js";
import { BASE_URL } from "../config/config.js";

// 로그인: (POST) /user/login
export async function loginUser(email, password) {
    try {
        const response = await fetch(`${BASE_URL}/user/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (response.ok) {
            const token = result.token;
            const userId = result.userId;
            localStorage.setItem("token", token); 
            localStorage.setItem("userId", userId); 
            return { success: true };
        } else {
            if (result.message === "Invalid credentials") {
                return { success: false, status: response.status };
            }
            return { success: false, message: result.message || "로그인 실패" };
        }
    } catch (error) {
        return { success: false, message: "서버와의 연결에 실패했습니다." };
    }
}

// 회원가입: (POST) /user
export async function signupUser(email, password, nickname, profileImageFile) {
    try {
        const formData = new FormData();

        const userData = {
            email: email,
            password: password,
            nickname: nickname
        };
        
        
        formData.append("data", new Blob([JSON.stringify(userData)], { type: "application/json" }));

        if (profileImageFile) {
            formData.append("profileImage", profileImageFile);
        }

        const response = await fetch(`${BASE_URL}/user`, {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            return { success: true };
        } else {
            const result = await response.json();
            return { success: false, message: result.message || "회원가입 실패" };
        }
    } catch (error) {
        return { success: false, message: "서버와의 연결에 실패했습니다." };
    }
}

// 프로필 수정: (PATCH) /user/profile
export async function updateProfile({ nickname, profileImg }) {
    try {
        const data = {};
        if (nickname !== undefined && nickname !== null) data.nickname = nickname;

        const formData = new FormData();
        formData.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));

        if (profileImg) {
            formData.append("profileImage", profileImg); 
        }

        const response = await authFetch(`${BASE_URL}/user/profile`, {
            method: "PATCH",
            body: formData
        });

        if (response.ok) {
            return { success: true };
        } else {
            const result = await response.json();
            return { success: false, message: result.message || "프로필 수정 실패" };
        }
    } catch (error) {
        return { success: false, message: "서버와의 연결에 실패했습니다." };
    }
}

// 비밀번호 변경: (PATCH) /user/password
export async function updatePassword(newPassword) {
    try {
        const response = await authFetch(`${BASE_URL}/user/password`, {
            method: "PATCH",
            body: JSON.stringify({ password: newPassword })
        });

        if (response.ok) {
            return { success: true };
        } else {
            const result = await response.json();
            return { success: false, message: result.message || "비밀번호 변경 실패" };
        }
    } catch (error) {
        return { success: false, message: "서버와의 연결에 실패했습니다." };
    }
}

// 회원탈퇴: (DELETE) /user
export async function deleteUser() {
    try {
        const response = await authFetch(`${BASE_URL}/user`, {
            method: "DELETE"
        });

        localStorage.removeItem("token");
        localStorage.removeItem("userId");

        if (response.ok) {
            return { success: true };
        } else {
            const result = await response.json();
            return { success: false, message: result.message || "회원 탈퇴 실패" };
        }
    } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        return { success: false, message: "서버와의 연결에 실패했습니다." };
    }
}




