import { getPostInfo } from "../api/info.js";
import { updatePost, deletePostImage } from "../api/postService.js";
import { CustomAlert } from "../assets/component/CustomAlert.js";

document.addEventListener("DOMContentLoaded", async function () {
    const titleInput = document.getElementById("title");
    const contentInput = document.getElementById("content");
    const fileInput = document.getElementById("image");
    const fileNameDisplay = document.getElementById("file-name");
    const editBtn = document.getElementById("edit-btn");
    const contentHelper = document.getElementById("content-helper");
    const deleteImgBtn = document.getElementById("delete-img-btn");
    const header = document.querySelector("header-component");
    const alertBox = new CustomAlert();

    const params = new URLSearchParams(window.location.search);
    const postId = params.get("postId");
    if (!postId) {
        console.error("postid가 전달되지 않았습니다.");
        window.location.href = "posts.html";
        return;
    }

    let postData = null;
    let selectedFile = null;

    if (header && postId) {
        header.setAttribute("back-path", `../community/viewpost.html?postId=${postId}`);
    }

    const getOriginalFileName = url => url?.split("_")[1] || "";

    function updateFileNameDisplay(fileName, showDelete = false) {
        fileNameDisplay.textContent = fileName;
        deleteImgBtn.style.display = showDelete ? "inline" : "none";
    }

    // [데이터 처리] 게시글 데이터 불러오기
    async function loadPostData() {
        const result = await getPostInfo(Number(postId));
        if (!result.success) {
            alert(result.message);
            return;
        }

        postData = result.data;
        titleInput.value = postData.title;
        contentInput.value = postData.content;

        const fileName = postData.postImgUrl ? getOriginalFileName(postData.postImgUrl) : "파일을 선택하세요.";
        updateFileNameDisplay(fileName, !!postData.postImgUrl);

        updateButtonState();
    }

    await loadPostData();

    // [UI 처리] 수정 버튼 활성화
    function updateButtonState() {
        const isTitleFilled = titleInput.value.trim().length > 0;
        const isContentFilled = contentInput.value.trim().length > 0;

        const isValid = isTitleFilled && isContentFilled;
        contentHelper.textContent = isValid ? "" : "제목, 내용을 모두 작성해주세요";
        contentHelper.classList.toggle("visible", !isValid);
        editBtn.disabled = !isValid;
        editBtn.style.backgroundColor = isValid ? "#7F6AEE" : "#ACA0EB";
    }

    // [이벤트 처리] 입력 유효성 검사
    titleInput.addEventListener("input", function () {
        if (this.value.length > 26) {
            this.value = this.value.slice(0, 26);
        }
        updateButtonState();
    });
    
    contentInput.addEventListener("input", updateButtonState);

    // [이벤트 처리] 파일 업로드
    fileInput.addEventListener("change", function () {
        if (this.files.length > 0) {
            selectedFile = this.files[0];
            updateFileNameDisplay(selectedFile.name, false); 
        } else {
            selectedFile = null;
            const fallbackName = postData.postImgUrl ? getOriginalFileName(postData.postImgUrl) : "파일을 선택하세요.";
            updateFileNameDisplay(fallbackName, !!postData.postImgUrl);
        }
    });

    // [이벤트 처리] 수정 버튼 클릭
    editBtn.addEventListener("click", async function (event) {
        event.preventDefault();

        const currentTitle = titleInput.value.trim();
        const currentContent = contentInput.value.trim();

        const updateData = {};
        if (currentTitle !== postData.title) updateData.title = currentTitle;
        if (currentContent !== postData.content) updateData.content = currentContent;
        if (selectedFile) updateData.postImage = selectedFile;

        if (Object.keys(updateData).length === 0) {
            alertBox.show("수정된 내용이 없습니다.");
            return;
        }

        const result = await updatePost(Number(postId), updateData);

        if (result.success) {
            alertBox.show("게시글이 수정되었습니다.", () => {
                window.location.href = `viewpost.html?postId=${postId}`;
            });
        } else {
            console.log(result.message);
        }
    });

    // [이벤트 처리] 이미지 삭제 클릭
    deleteImgBtn.addEventListener("click", async function () {
        const result = await deletePostImage(postId);
        if (result.success) {
            alertBox.show("이미지가 삭제되었습니다.", () => {
                fileInput.value = "";
                selectedFile = null;
                loadPostData();
            });
        } else {
            console.log(result.message);
        }
    });
});
