import { useState, useEffect } from "react";
// import comments from "../../data/comments"; // dummy data
import CommentElement from "./CommentElement";
import { createComment } from "../../apis/api";
import { getComments, deleteComment } from "../../apis/api";

const Comment = ({ postId }) => {
  const [commentList, setCommentList] = useState([]); // state for comments
  const [newContent, setNewContent] = useState(""); // state for new comment

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    try {
      const response = await createComment({
        post: postId,
        content: newContent,
      });
      setCommentList((commentList) => [...commentList, newContent]);
      setNewContent("");
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const handleCommentDelete = async (commentId) => {
    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;
    try {
      const response = await deleteComment(commentId);
      setCommentList((commentList) =>
        commentList.filter((comment) => comment.id !== commentId)
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  useEffect(() => {
    const getCommentsAPI = async () => {
      try {
        const comments = await getComments(postId);
        setCommentList(comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    getCommentsAPI();
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
