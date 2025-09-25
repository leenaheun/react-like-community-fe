export class HeaderComponent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const showBackButton = this.getAttribute("back") !== null;
        const showProfile = this.getAttribute("profile") !== null;
        const backPath = this.getAttribute("back-path") || null;

        this.innerHTML = `
            <header class="header-custom">
                <div class="header-container">
                    ${showBackButton ? `
                        <button class="header-back-button" id="header-back-btn">
                            <img src="/assets/images/backbtn.png" alt="뒤로가기">
                        </button>
                    ` : `<div class="header-placeholder"></div>`}
                    
                    <h1 class="header-title" id="header-title">Today's Log</h1>

                    ${showProfile ? `
                        <div class="header-profile-container">
                            <img id="header-profile-img" alt="프로필 이미지">
                        </div>` : `<div class="header-placeholder"></div>`
                    }
                </div>
            </header>
        `;

        const title = this.querySelector("#header-title");
        title.addEventListener("click", () => {
            const path = window.location.pathname;
            if (!path.includes("login") && !path.includes("signup")) {
                window.location.href = "../community/posts.html";
            }
        });

        if (showBackButton) {
            const backBtn = this.querySelector("#header-back-btn");
            backBtn.addEventListener("click", () => {
                window.location.href = backPath || document.referrer || "javascript:history.back()";
            });
        }

        if (showProfile) {
            const profileImg = this.querySelector("#header-profile-img");
            import("./DropdownMenu.js").then(module => {
                const dropdown = new module.DropdownMenu(profileImg, this);
                dropdown.render();
            });
        }
    }
}

customElements.define("header-component", HeaderComponent);

