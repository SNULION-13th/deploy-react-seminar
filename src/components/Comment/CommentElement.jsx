import React, { useState } from "react";
import { updateComment, deleteComment } from "../../apis/api";

const CommentElement = ({
  comment,
  handleCommentDelete,
  postId,
  currentUserId,
  onUpdate,
}) => {
  const [content, setContent] = useState(comment.content);
  const [isEdit, setIsEdit] = useState(false);
  const [editValue, setEditValue] = useState(comment.content);

  // 날짜 포맷
  const date = new Date(comment.created_at);
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  month = month < 10 ? `0${month}` : month;
  let day = date.getDate();
  day = day < 10 ? `0${day}` : day;

  const startEdit = () => {
    setEditValue(content);
    setIsEdit(true);
  };
  const cancelEdit = () => {
    setEditValue(content);
    setIsEdit(false);
  };

  const submitEdit = async () => {
    try {
      await updateComment(comment.id, { content: editValue });
      setContent(editValue);
      setIsEdit(false);
      onUpdate();
    } catch (err) {
      console.error("댓글 수정 실패", err);
    }
  };

  const handleDeleteClick = async () => {
    if (window.confirm("정말 이 댓글을 삭제하시겠습니까?")) {
      try {
        await deleteComment(comment.id);
        onUpdate();
      } catch (err) {
        console.error("댓글 삭제 실패", err);
      }
    }
  };

  return (
    <li className="w-full flex justify-between items-center mb-5">
      <div className="flex-1">
        {isEdit ? (
          <input
            className="input mb-2"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
          />
        ) : (
          <p className="text-lg">{content}</p>
        )}
        <span className="text-gray-400 text-sm">
          {year}.{month}.{day}
        </span>
      </div>
      <div className="flex gap-3">
        {isEdit ? (
          <>
            <button onClick={cancelEdit}>취소</button>
            <button onClick={submitEdit}>완료</button>
          </>
        ) : (
          currentUserId === comment.author.id && (
            <>
              <button onClick={handleDeleteClick}>삭제</button>
              <button onClick={startEdit}>수정</button>
            </>
          )
        )}
      </div>
    </li>
  );
};

export default CommentElement;
