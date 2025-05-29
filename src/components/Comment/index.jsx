import { useEffect, useState } from "react";
import comments from "../../data/comments"; // dummy data
import CommentElement from "./CommentElement";
import { createComment, deleteComment, getComments } from "../../apis/api";

const Comment = ({ postId }) => {
  const [commentList, setCommentList] = useState([]); // state for comments
  const [newContent, setNewContent] = useState(""); // state for new comment

  const fetchComments = async () => {
    try {
      const response = await getComments(postId);
      setCommentList(response);
    } catch (error) {
      console.error("댓글 불러오기 실패", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const haneleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newContent.trim() === "") return;

    try {
      await createComment({ post_id: postId, content: newContent });
      setNewContent("");
      fetchComments();
    } catch (error) {
      console.error("댓글 작성 실패".error);
    }
  };

  const handleCommentDelete = async (commentId) => {
    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await deleteComment(commentId);
      fetchComments();
    } catch (error) {
      console.error("댓글 삭제 실패", error);
    }
  };

  return (
    <div className="w-full mt-5 self-start">
      <h1 className="text-3xl font-bold my-5">Comments</h1>

      {commentList.map((comment) => (
        <CommentElement
          key={comment.id}
          comment={comment}
          handleCommentDelete={handleCommentDelete}
          postId={postId}
        />
      ))}

      <form
        className="flex flex-row mt-10 gap-3"
        onSubmit={haneleCommentSubmit}
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
