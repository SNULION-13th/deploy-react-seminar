import { useState, useEffect } from "react";
// dummy data import comments from "../../data/comments";
import CommentElement from "./CommentElement";
import {
  getComments,
  createComment,
  deleteComment,
  updateComment,
} from "../../apis/api";

const Comment = ({ postId }) => {
  const [commentList, setCommentList] = useState([]); // state for comments
  const [newContent, setNewContent] = useState(""); // state for new comment

  useEffect(() => {
    (async () => {
      try {
        const data = await getComments(postId);
        setCommentList(data); // 또는 data.results 일 수도 있으니 콘솔 확인
      } catch (e) {
        console.error("댓글 로드 실패", e);
      }
    })();
  }, [postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const created = await createComment({
        post: postId,
        content: newContent,
      });
      // createComment 에서 window.reload() 대신,
      // 리턴값을 만들어 주시면 이곳에서:
      setCommentList((prev) => [...prev, created]);
      setNewContent("");
    } catch (e) {
      console.error("작성 실패", e);
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      await deleteComment(commentId);
      setCommentList((prev) => prev.filter((c) => c.id !== commentId));
    } catch (e) {
      console.error("삭제 실패", e);
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
            postId={postId}
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
