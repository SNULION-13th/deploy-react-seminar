import React, { useState, useEffect } from "react";
import {
  getComments, 
  createComment,
  deleteComment,
  getUser,
} from "../../apis/api";
import CommentElement from "./CommentElement";

const Comment = ({ postId }) => {
  const [commentList, setCommentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newContent, setNewContent] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  // 댓글 목록을 불러오는 함수
  const loadComments = async (  ) => {
    setLoading(true);
    try {
      const data = await getComments(postId);
      setCommentList(data);
    } catch (err) {
      console.error("댓글 불러오기 실패", err);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 댓글과 유저 정보 둘 다 가져오기
  useEffect(() => {
    loadComments();
  }, [postId]);

  useEffect(() => {
    (async () => {
      try {
        const userData = await getUser();
        setCurrentUser(userData);
      } catch (err) {
        console.error("유저 정보 불러오기 실패", err);
        setCurrentUser({ id: null });
      }
    })();
  }, []);

  // 댓글 생성 핸들러
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    try {
      await createComment({ post: postId, content: newContent });
      setNewContent("");
      await loadComments();
    } catch (err) {
      console.error("댓글 생성 실패", err);
    }
  };

  // 댓글 삭제 핸들러
  const handleCommentDelete = async (commentId) => {
    try {
      await deleteComment(commentId);
      await loadComments();
    } catch (err) {
      console.error("댓글 삭제 실패", err);
    }
  };

  // 로딩 중이거나 유저 정보가 없으면
  if (loading || currentUser === null) {
    return <p>로딩 중…</p>;
  }

  return (
    <div className="w-full mt-5 self-start">
      <h2 className="text-3xl font-bold mb-4">Comments</h2>

      {commentList.length === 0 ? (
        <p>아직 댓글이 없습니다.</p>
      ) : (
        <ul>
          {commentList.map((comment) => (
            <CommentElement
              key={comment.id}
              comment={comment}
              postId={postId}
              currentUserId={currentUser.id}
              onUpdate={loadComments}
              handleCommentDelete={handleCommentDelete}
            />
          ))}
        </ul>
      )}

      <form onSubmit={handleCommentSubmit} className="flex flex-row mt-6 gap-3">
        <input
          type="text"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="댓글을 입력해주세요"
          className="input flex-1"
        />
        <button type="submit" className="button">
          작성
        </button>
      </form>
    </div>
  );
};

export default Comment;
