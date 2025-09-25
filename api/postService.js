import { authFetch } from "./info.js";
import { BASE_URL } from "../config/config.js";

// 게시글 작성: (POST) /post
export async function createPost(title, content, imageFile) {
    try {
        const formData = new FormData();
        formData.append("data", new Blob([JSON.stringify({ title, content })], { type: "application/json" }));

        if (imageFile) {
            formData.append("postImage", imageFile);
        }

        const response = await authFetch(`${BASE_URL}/post`, {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            return { success: true };
        } else {
            const result = await response.json();
            return { success: false, message: result.message || "게시글 작성 실패" };
        }
    } catch (error) {
        return { success: false, message: "서버와의 연결에 실패했습니다." };
    }
}

// 게시글 수정: (PATCH) /post/{postId}
export async function updatePost(postId, { title, content, postImage }) {
    try {
        const data = {};
        if (title !== undefined && title !== null) data.title = title;
        if (content !== undefined && content !== null) data.content = content;

        const formData = new FormData();
        formData.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));

        if (postImage) {
            formData.append("postImage", postImage);
        }

        const response = await authFetch(`${BASE_URL}/post/${postId}`, {
            method: "PATCH",
            body: formData
        });

        if (response.ok) {
            return { success: true };
        } else {
            const result = await response.json();
            return { success: false, message: result.message || "게시글 수정 실패" };
        }
    } catch (error) {
        return { success: false, message: "서버와의 연결에 실패했습니다." };
    }
}

// 게시글 이미지 삭제: (PATCH) /post/{postId}/image
export async function deletePostImage(postId) {
    try {
        const response = await authFetch(`${BASE_URL}/post/${postId}/image`, {
            method: "PATCH",
        });

        if (response.ok) {
            return { success: true };
        } else {
            const result = await response.json();
            return { success: false, message: result.message || "이미지 삭제 실패" };
        }
    } catch (error) {
        return { success: false, message: "서버와의 연결에 실패했습니다." };
    }
}

// 게시글 삭제: (DELETE) /post/{postId}
export async function deletePost(postId) {
    try {
        const response = await authFetch(`${BASE_URL}/post/${postId}`, {
            method: "DELETE",
        });

        if (response.ok) {
            return { success: true };
        } else {
            const result = await response.json();
            return { success: false, message: result.message || "게시글 삭제 실패" };
        }
    } catch (error) {
        return { success: false, message: "서버와의 연결에 실패했습니다." };
    }
}

// 조회수 증가: (POST) /patch/{postId}/views
export async function increaseViewCount(postId) {
    try {
        const response = await authFetch(`${BASE_URL}/post/${postId}/views`, {
            method: "PATCH"
        });
        const result = await response.json();

        if (response.ok) {
            return { success: true, message: result.message };
        } else {
            return { success: false, message: result.message || "조회수 증가 실패" };
        }
    } catch (error) {
        return { success: false, message: "서버와의 연결에 실패했습니다." };
    }
}

// 게시글 좋아요 추가: (POST) /post/{postId}.likes
export async function addLike(postId) {
    try {
        const response = await authFetch(`${BASE_URL}/post/${postId}/likes`, {
            method: "POST"
        });

        if (response.ok) {
            return { success: true };
        } else {
            const result = await response.json();
            return { success: false, message: result.message || "좋아요 추가 실패" };
        }
    } catch (error) {
        return { success: false, message: "서버와의 연결에 실패했습니다." };
    }
}

// 게시글 좋아요 취소: (DELETE) /post/{postId}/likes
export async function removeLike(postId) {
    try {
        const response = await authFetch(`${BASE_URL}/post/${postId}/likes`, {
            method: "DELETE"
        });

        if (response.ok) {
            return { success: true, message: "좋아요가 취소되었습니다." };
        } else {
            const result = await response.json();
            return { success: false, message: result.message || "좋아요 취소 실패" };
        }
    } catch (error) {
        return { success: false, message: "서버와의 연결에 실패했습니다." };
    }
}

// 댓글 등록: (POST) /post/{postId}/comments
export async function addAPIComment(postId, commentText) {
    try {
        const response = await authFetch(`${BASE_URL}/post/${postId}/comments`, {
            method: "POST",
            body: JSON.stringify({ comment: commentText })
        });

        if (response.ok) {
            const result = await response.json();
            return { success: true};
        } else {
            const result = await response.json();
            return { success: false, message: result.message || "댓글 등록 실패" };
        }
    } catch (error) {
        return { success: false, message: "서버와의 연결에 실패했습니다." };
    }
}

// 댓글 수정: (PATCH) /post/{postId}/comments/{commentId}
export async function editAPIComment(postId, commentId, newCommentText) {
    try {
        const response = await authFetch(`${BASE_URL}/post/${postId}/comments/${commentId}`, {
            method: "PATCH",
            body: JSON.stringify({ comment: newCommentText })
        });

        if (response.ok) {
            const result = await response.json();
            return { success: true, data: result.data };
        } else {
            const result = await response.json();
            return { success: false, message: result.message || "댓글 수정 실패" };
        }
    } catch (error) {
        return { success: false, message: "서버와의 연결에 실패했습니다." };
    }
}

// 댓글 삭제: (DELETE) /post/{postId}/comments/{commentId}
export async function deleteAPIComment(postId, commentId) {
    try {
        const response = await authFetch(`${BASE_URL}/post/${postId}/comments/${commentId}`, {
            method: "DELETE"
        });

        if (response.ok) {
            return { success: true };
        } else {
            const result = await response.json();
            return { success: false, message: result.message || "댓글 삭제 실패" };
        }
    } catch (error) {
        return { success: false, message: "서버와의 연결에 실패했습니다." };
    }
}
