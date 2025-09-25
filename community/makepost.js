import { createPost } from "../api/postService.js";
import { CustomAlert } from "../assets/component/CustomAlert.js";

document.addEventListener("DOMContentLoaded", function () {
    const titleInput = document.getElementById("title");
    const contentInput = document.getElementById("content");
    const fileInput = document.getElementById("image");
    const fileNameDisplay = document.getElementById("file-name");
    const writeBtn = document.getElementById("write-btn");
    const contentHelper = document.getElementById("content-helper");
    const alertBox = new CustomAlert();

    // [UI 처리] 완료 버튼 활성화
    function updateButtonState() {
        const isTitleFilled = titleInput.value.trim().length > 0;
        const isContentFilled = contentInput.value.trim().length > 0;

        if (!isTitleFilled || !isContentFilled) {
            contentHelper.textContent = "제목, 내용을 모두 작성해주세요"; 
            contentHelper.classList.add("visible");
            writeBtn.disabled = true;
            writeBtn.style.backgroundColor = "#ACA0EB"; 
        } else {
            contentHelper.textContent = ""; 
            contentHelper.classList.remove("visible");
            writeBtn.disabled = false;
            writeBtn.style.backgroundColor = "#7F6AEE"; 
        }
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
        fileNameDisplay.textContent = this.files.length > 0 ? this.files[0].name : "파일을 선택하세요.";
    });

    // [이벤트 처리] 완료 버튼 클릭
    writeBtn.addEventListener("click", async function (event) {
        event.preventDefault(); 

        const title = titleInput.value.trim();
        const content = contentInput.value.trim();
        const file = fileInput.files[0]; 
      
        const result = await createPost(title, content, file);
        if (result.success) {
            alertBox.show("게시글이 등록되었습니다.", () => {
                window.location.href = `posts.html`;
            });
        } else {
            console.log(result.message); 
        }
    });
});
