import { getProfileInfo } from "../../api/info.js";
import { BASE_URL } from "../../config/config.js";

export class DropdownMenu {
    constructor(profileImg, root) {
        this.profileImg = profileImg;
        this.root = root;
    }

    async render() {
        const result = await getProfileInfo();
        if (!result.success) {
            console.log(result.message);
            return;
        }

        const user = result.data;
        this.profileImg.src = `${BASE_URL}${user.profileImgUrl}`;

        const dropdown = document.createElement("div");
        dropdown.classList.add("profile-dropdown");
        dropdown.innerHTML = `
            <style>
                .profile-dropdown {
                    display: none;
                    position: absolute;
                    right: calc((100vw - 500px) / 2);
                    top: 55px;
                    width: 120px;
                    height: 120px;
                    z-index: 9999;
                }
                .menu-button {
                    padding: 5px 0;
                    height: 30px;
                    text-align: center;
                    cursor: pointer;
                    background: #d9d9d9;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .menu-button:hover {
                    background: #E9E9E9;
                }
                .menu-button a {
                    color: black;
                    text-decoration: none;
                    font-size: 15px;
                }
            </style>
            <div class="menu-button"><a href="../profile/editprofile.html">회원정보 수정</a></div>
            <div class="menu-button"><a href="../profile/editpassword.html">비밀번호 변경</a></div>
            <div class="menu-button" id="logout-btn"><a href="#">로그아웃</a></div>
        `;

        this.root.appendChild(dropdown);

        this.profileImg.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
        });

        window.addEventListener("click", (e) => {
            if (!dropdown.contains(e.target)) {
                dropdown.style.display = "none";
            }
        });

        dropdown.querySelector("#logout-btn").addEventListener("click", () => {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            window.location.href = "../auth/login.html";
        });
    }
}
