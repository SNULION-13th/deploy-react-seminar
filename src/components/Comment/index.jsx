import { useState, useEffect } from "react";
import comments from "../../data/comments"; // dummy data
import { getComments, createComment, deleteComment } from "../../apis/api";
import CommentElement from "./CommentElement";

const Comment = ({ postId }) => {
  const [commentList, setCommentList] = useState([]); // state for comments
  const [newContent, setNewContent] = useState(""); // state for new comment

  useEffect(() => {
    const getCommentsAPI = async () => {
      const comments = await getComments(postId);
      setCommentList(comments);
    };
    getCommentsAPI();
  }, [postId]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    setCommentList([
      // added api call for creating comment
      ...commentList,
      createComment({
        content: newContent,
        post: postId,
      }),
    ]);
    setNewContent("");
  };

  const handleCommentDelete = async (commentId) => {
    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;
    setCommentList(commentList.filter((comment) => comment.id !== commentId));
    // added api call for deleting comment
    try {
      await deleteComment(commentId);
    } catch (error) {
      console.error(error);
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
