import { useState, useEffect } from "react";
import { updateComment, getUser, deleteComment } from "../../apis/api";
import { getCookie } from "../../utils/cookie";
import { formToJSON } from "axios";

const CommentElement = (props) => {
  const { comment, handleCommentDelete, postId } = props;
  const [content, setContent] = useState(comment.content);
  const [isEdit, setIsEdit] = useState(false);

  const [onChangeValue, setOnChangeValue] = useState(content); // 수정 취소 시 직전 content 값으로 변경을 위한 state
  const [user, setUser] = useState(null);

  // comment created_at 전처리
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
    } catch (error) {
      console.error("댓글 수정 실패", error);
    }
  };

  const handleDeleteComment = async (id) => {
    const confirmDelete = window.confirm("정말 삭세하시겠습니까?");
    if (!confirmDelete) return;
    try {
      await deleteComment(id);
      handleCommentDelete(id);
    } catch (error) {
      console.error("댓글 삭제 실패", error);
    }
  };

  useEffect(() => {
    if (getCookie("access_token")) {
      const fetchUser = async () => {
        try {
          const currentUser = await getUser();
          setUser(currentUser);
        } catch (error) {
          console.error("유저 정보를 가져오지 못했습니다", error);
        }
      };
      fetchUser();
    }
  }, []);

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
      {user?.id === comment?.author?.id && (
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
              <button onClick={() => handleDeleteComment(comment.id)}>
                삭제
              </button>
              <button onClick={() => setIsEdit(true)}>수정</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentElement;
