import { useState } from "react";
import { createComment } from "../../apis/api";

const Comment = ({ postId, fetchComments }) => {
  const [newContent, setNewContent] = useState("");

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    try {
      await createComment({ post_id: postId, content: newContent });
      setNewContent("");
      if (fetchComments) {
        await fetchComments(); // 댓글 다시 불러오기
      }
    } catch (err) {
      console.error("댓글 작성 실패", err);
    }
  };

  return (
    <form className="flex flex-row mt-10 gap-3" onSubmit={handleCommentSubmit}>
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
  );
};

export default Comment;
