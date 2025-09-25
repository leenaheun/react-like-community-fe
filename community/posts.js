import { getPostsInfo } from "../api/info.js"; 
import { increaseViewCount } from "../api/postService.js"
import { BASE_URL } from "../config/config.js";

document.addEventListener("DOMContentLoaded", async function () {
    const postList = document.getElementById("post-list");
    const writeBtn = document.getElementById("write-btn");
    const sentinel = document.getElementById("sentinel");

    let posts = [];
    let visiblePosts = 0;
    
    function formatNumber(num) {
        return num >= 100000 ? `${Math.floor(num / 100000)}00k`
            : num >= 10000 ? `${Math.floor(num / 1000)}k`
            : num >= 1000 ? `${(num / 1000).toFixed(1)}k`
            : num;
    }
    
    // [데이터 처리] 게시글 목록 데이터 불러오기
    const result = await getPostsInfo();
    if (result.success) {
        posts = result.data;
        renderPosts(posts);  
    } else {
        console.log(result.message);
    }

    // [UI 처리] 게시글 목록 렌더링
    async function renderPosts() {
        while (visiblePosts < posts.length) {
            const post = posts[visiblePosts];

            const isActiveUser = post.user.active;
            const nickname = isActiveUser ? post.user.nickname : "(알 수 없음)";
            const profileImgSrc = `${BASE_URL}${isActiveUser ? post.user.profileImgUrl : "/profileuploads/default-profile.png"}`;

            const postCard = document.createElement("div");
            postCard.classList.add("post-card");
            postCard.innerHTML = `
                <div class="post-title">${post.title}</div>
                <div class="post-info">
                    <span class="info-style">좋아요 ${formatNumber(post.likesCount)}</span>
                    <span class="info-style">댓글 ${formatNumber(post.commentsCount)}</span>
                    <span>조회수 ${formatNumber(post.views)}</span>
                    <span style="float: right;">${post.createdAt}</span>
                </div>
                <div class="post-divider"></div>
                <div class="user-section">
                    <img src="${profileImgSrc}" alt="프로필" class="user-profile">
                    <span id="nickname">${nickname}</span>
                </div>
            `;
            postCard.addEventListener('click', async function () {
                if (postCard.dataset.loading === "true") return; //더블클릭 요청 방지
                postCard.dataset.loading = "true";
                const result = await increaseViewCount(post.postId);
                if (result.success) window.location.href = "viewpost.html?postId=" + post.postId;
            });
            postList.insertBefore(postCard, sentinel);
            visiblePosts++;
            if (postList.offsetHeight > window.innerHeight) break;
        }
    }

    // [이벤트 처리] 무한 스크롤
    const observerOptions = {
        root: postList,
        rootMargin: "100px",
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            renderPosts();
        }
    }, observerOptions);
    observer.observe(sentinel);

    // [이벤트 처리] 게시글 작성 버튼 클릭
    writeBtn.addEventListener("click", function () {
        window.location.href = "makepost.html";
    });

});
