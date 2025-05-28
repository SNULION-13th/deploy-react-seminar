import { useState, useEffect } from "react";
import CommentElement from "./CommentElement";
import { createComment, getComments, deleteComment } from "../../apis/api.js";

const Comment = ({ postId }) => {
  const [commentList, setCommentList] = useState([]); // state for comments
  const [newContent, setNewContent] = useState(""); // state for new comment

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await createComment({ post: postId, content: newContent });
      const updated = await getComments(postId);
      setCommentList(updated);
      setNewContent("");
    } catch (err) {
      console.error("댓글 작성 실패:", err);
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      console.log("comment: ", commentId);
      await deleteComment(commentId);
      const updated = await getComments(postId);
      setCommentList(updated);
    } catch (err) {
      console.error("댓글 삭제 실패:", err);
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      if (!postId) return; // 필수 방어 코드

      try {
        const updated = await getComments(postId);
        setCommentList(updated);
      } catch (error) {
        console.error("댓글 조회 실패:", error.response?.data || error.message);
      }
    };

    fetchComments();
  }, [postId]);

  return (
    <div className="w-full mt-5 self-start">
      <h1 className="text-3xl font-bold my-5">Comments</h1>
      {commentList.map((comment) => {
        return (
          <CommentElement
            key={comment.id}
            comment={comment}
            handleCommentDelete={handleCommentDelete}
            postId={postId}
            setCommentList={setCommentList}
          />
        );
      })}

      <form
        className="flex flex-row mt-10 gap-3"
        onSubmit={handleCommentSubmit}
      >
        <input
          type="text"
          value={newContent}
          placeholder="댓글을 입력해주세요"
          className="input"
          style={{ width: "calc(100% - 100px)" }}
          onChange={(e) => setNewContent(e.target.value)}
        />
        <button type="submit" className="button">
          작성
        </button>
      </form>
    </div>
  );
};

export default Comment;
