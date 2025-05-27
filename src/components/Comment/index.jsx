import { getComments, createComment, deleteComment } from "../../apis/api";
import { useState, useEffect } from "react";
import CommentElement from "./CommentElement";

const Comment = ({ postId }) => {
    const [commentList, setCommentList] = useState([]);
    const [content, setContent] = useState("");

    useEffect(() => {
        const getCommentsAPI = async () => {
            try {
                const data = await getComments(postId);
                setCommentList(data);
            } catch (err) {
                console.error("Error fetching comments:", err);
                setCommentList([]);
                alert("댓글을 불러오는 데 실패했습니다.");
            }
        };

        getCommentsAPI();
    }, [postId]);

    const handleCommentSubmit = async (e) => {
        const commentData = {
            post: postId,
            content: content,
        };
        e.preventDefault();

        try {
            await createComment(commentData);
            setContent("");
        } catch (err) {
            console.error("Error creating comment:", err);
            alert("댓글 작성에 실패했습니다.");
        }
    };

    const handleCommentDelete = async (commentId) => {
        try {
            await deleteComment(commentId);
        } catch (err) {
            console.error("Error deleting comment:", err);
            alert("댓글 삭제에 실패했습니다.");
        }
    };

    return (
        <div className="w-full mt-5 self-start">
            <h1 className="text-3xl font-bold my-5">Comments</h1>
            {commentList.map((comment) => {
                return (
                    <CommentElement
                        key={comment.id}
                        comment={comment}
                        handleCommentDelete={handleCommentDelete}
                    />
                );
            })}

            <form
                className="flex flex-row mt-10 gap-3"
                onSubmit={handleCommentSubmit}
            >
                <input
                    type="text"
                    value={content}
                    placeholder="댓글을 입력해주세요"
                    className="input"
                    style={{ width: "calc(100% - 100px)" }}
                    onChange={(e) => setContent(e.target.value)}
                />
                <button type="submit" className="button">
                    작성
                </button>
            </form>
        </div>
    );
};

export default Comment;