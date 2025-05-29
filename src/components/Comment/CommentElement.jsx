import { useState, useEffect, useContext } from "react";
import { deleteComment, updateComment } from "../apis/api";
import { AuthContext } from "../contexts/AuthContext"; // 실제 경로에 맞게 수정하세요

const CommentElement = (props) => {
  const { comment, postId } = props;
  const [content, setContent] = useState(comment.content);
  const [isEdit, setIsEdit] = useState(false);
  const [onChangeValue, setOnChangeValue] = useState(content);

  const { user } = useContext(AuthContext); // 현재 로그인한 유저 정보
  const isAuthor = user?.username === comment.author.username; // 본인 댓글 여부

  const date = new Date(comment.created_at);
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  month = month < 10 ? `0${month}` : month;
  let day = date.getDate();
  day = day < 10 ? `0${day}` : day;

  const handleEditComment = async () => {
    try {
      await updateComment(comment.id, { content: onChangeValue });
      setContent(onChangeValue);
      setIsEdit(false);
    } catch (err) {
      console.error("댓글 수정 실패", err);
    }
  };

  const handleDelete = async () => {
    const isConfirmed = window.confirm("정말로 이 댓글을 삭제하시겠습니까?");
    if (!isConfirmed) return;
    try {
      await deleteComment(comment.id);
    } catch (err) {
      console.error("댓글 삭제 실패", err);
    }
  };

  return (
    <div className="w-full flex flex-row justify-between items-center mb-5">
      <div className="w-3/4 flex flex-col gap-1">
        {isEdit ? (
          <input
            className="input mb-2"
            value={onChangeValue}
            onChange={(e) => setOnChangeValue(e.target.value)}
          />
        ) : (
          <p className="text-lg">{content}</p>
        )}
        <span className="text-base text-gray-300">
          {year}.{month}.{day}
        </span>
      </div>

      {isAuthor && (
        <div className="flex flex-row items-center gap-3">
          {isEdit ? (
            <>
              <button
                onClick={() => {
                  setIsEdit(false);
                  setOnChangeValue(content);
                }}
              >
                취소
              </button>
              <button onClick={handleEditComment}>완료</button>
            </>
          ) : (
            <>
              <button onClick={handleDelete}>삭제</button>
              <button onClick={() => setIsEdit(true)}>수정</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentElement;
