import { useState, useEffect } from "react";
import CommentElement from "./CommentElement";

import { getComments, createComment, deleteComment } from "../../apis/api";

const Comment = ({ postId }) => {
  const [commentList, setCommentList] = useState([]); // state for comments
  const [newContent, setNewContent] = useState(""); // state for new comment

  useEffect(() => {
    const getCommentsAPI = async () => {
      const data = await getComments(postId);
      setCommentList(data);
    };
    getCommentsAPI();
  }, [postId]);

  const createCommentsAPI = async () => {
    await createComment({ post: postId, content: newContent });
    const data = await getComments(postId);
    setCommentList(data);
  };

  const deleteCommentsAPI = async (commentId) => {
    const confirm = window.confirm("정말 삭제하시겠습니까?");

    if (!confirm) return;

    await deleteComment(commentId);
    const data = await getComments(postId);
    data.filter((comment) => comment.id !== commentId);
    setCommentList(data); // 코멘트 삭제한 뒤 새로고침.
  };

  return (
    <div className="w-full mt-5 self-start">
      <h1 className="text-3xl font-bold my-5">Comments</h1>
      {commentList.map((comment) => {
        return (
          <CommentElement
            key={comment.id}
            comment={comment}
            handleCommentDelete={deleteCommentsAPI}
          />
        );
      })}

      <form className="flex flex-row mt-10 gap-3" onSubmit={createCommentsAPI}>
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
