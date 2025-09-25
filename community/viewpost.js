import { getPostInfo } from "../api/info.js";
import { addLike, removeLike, deletePost } from "../api/postService.js";
import { BASE_URL } from "../config/config.js";
import { Comments } from "../assets/component/comments.js"; 
import { CustomAlert } from "../assets/component/CustomAlert.js";

document.addEventListener("DOMContentLoaded", async function () {
    const editBtn =  document.getElementById("editbtn");
    const deletePostBtn = document.getElementById("deletebtn");
    const deleteModal = document.getElementById("delete-modal");
    const confirmButton = document.getElementById("confirm-btn");
    const cancelButton = document.getElementById("cancel-btn");
    const likeBtn = document.getElementById("like-btn");
    const alertBox = new CustomAlert();

    const params = new URLSearchParams(window.location.search);
    const postId = params.get("postId");
    if (!postId) {
        console.error("postid가 전달되지 않았습니다.");
        window.location.href = "posts.html";
        return;
    }

    function formatNumber(num) {
        return num >= 100000 ? `${Math.floor(num / 100000)}00k`
            : num >= 10000 ? `${Math.floor(num / 1000)}k`
            : num >= 1000 ? `${(num / 1000).toFixed(1)}k`
            : num;
    }

    // [데이터 처리] 게시글 데이터 가져오기
    const result = await getPostInfo(Number(postId));
    if (!result.success) {
        console.error(result.message);
        return;
    }
    let postData = result.data;
 
    // [UI 처리] 작성자가 아니면 수정/삭제 버튼 숨김
    const currentUserId = localStorage.getItem("userId");
    if (Number(currentUserId) !== postData.user.userId) {
        editBtn.style.display = "none";
        deletePostBtn.style.display = "none";
    }

     // [UI 처리] 게시글 정보 렌더링
    function renderPost() {
        document.querySelector('.title').innerText = postData.title;
        const isActiveUser = postData.user.active;
        const profileImgUrl = isActiveUser
            ? `${BASE_URL}${postData.user.profileImgUrl}`
            : `${BASE_URL}/profileuploads/default-profile.png`;

        document.querySelector('.nickname').innerText = isActiveUser ? postData.user.nickname : "(알 수 없음)";
        document.querySelector('.user-img img').src = profileImgUrl;
        document.querySelector('.date').innerText = postData.createdAt;
        const postImgElement = document.querySelector('.post-content img');
        if (postData.postImgUrl) {
            if (postImgElement) {
                postImgElement.src = `${BASE_URL}${postData.postImgUrl}`;
                postImgElement.style.display = "block"; 
            }
        } else {
            if (postImgElement) postImgElement.remove(); 
        }
        document.querySelector('.post-content p').innerText = postData.content;
        document.getElementById('like-count').innerText = formatNumber(postData.likesCount);
        document.getElementById('view-count').innerText = formatNumber(postData.views);
        document.getElementById('comment-count').innerText = formatNumber(postData.commentsCount);
        likeBtn.classList.toggle("liked", postData.likedByCurrentUser);
    }
    renderPost();

    // [UI 처리] 댓글 렌더링
    Comments(postData, postId, async () => {
        const updated = await getPostInfo(Number(postId));
        if (updated.success) {
            postData = updated.data;
            renderPost();
        }
    });

    // [이벤트 처리] 수정 버튼 클릭
    editBtn.addEventListener('click', function () {
        window.location.href = "editpost.html?postId=" + postId;
    });
    
    // [이벤트 처리] 좋아요 버튼 클릭(이벤트 위임)
    document.body.addEventListener("click", async function (e) {
        const likeBtn = e.target.closest("#like-btn");
        if (!likeBtn) return;

        const result = likeBtn.classList.contains("liked")
            ? await removeLike(Number(postId))
            : await addLike(Number(postId));

        if (result.success) {
            const updatedResult = await getPostInfo(Number(postId));
            if (updatedResult.success) {
                postData = updatedResult.data;
                renderPost(); 
            }
        } else {
            console.log(result.message);
        }
    });

    // [이벤트 처리] 삭제 버튼 클릭
    deletePostBtn.addEventListener("click", function () {
        deleteModal.style.display = "flex";
    });
    cancelButton.addEventListener('click', function () {
        deleteModal.style.display = "none";
    });
    confirmButton.addEventListener('click', async function () {
        const result = await deletePost(Number(postId));
        if (result.success) {
            deleteModal.style.display = "none";
            alertBox.show("게시글이 삭제되었습니다.", () => {
                window.location.href = `posts.html`;
            });
        } else {
            console.log(result.message);
        }
    });
});