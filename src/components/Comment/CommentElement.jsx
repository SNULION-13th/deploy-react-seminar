import { useState, useEffect } from "react";
import { getPost, getUser, getComments, updateComment } from "../../apis/api";
import { getCookie } from "../../utils/cookie";

const CommentElement = (props) => {
  // 각 댓글 하나하나 마다 이 컴포넌트가 들어있는 것이다.
  const { comment, handleCommentDelete, postId } = props;
  const [content, setContent] = useState(comment.content); // 수정 자체는 지금 잘 되지만, 백앤드에 반영이 안되는 문제만 해결하면 된다.
  // content에는 현재 comment의 content가 들어있다.
  const [isEdit, setIsEdit] = useState(false);

  const [onChangeValue, setOnChangeValue] = useState(content); // 수정 취소 시 직전 content 값으로 변경을 위한 state

  const [user, setUser] = useState();
  // user의 정보를 담아둘 수 있기 위해서

  // user 로그인 정보 확인 위해서 띄운 창
  useEffect(() => {
    // access_token이 있으면 유저 정보 가져옴
    if (getCookie("access_token")) {
      const getUserAPI = async () => {
        const user = await getUser();
        setUser(user);
        //console.log(user.id);
        console.log(comment);
      };
      getUserAPI();
    }
  }, []);
  // 처음 한번만 실행

  // comment created_at 전처리
  const date = new Date(comment.created_at);
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  month = month < 10 ? `0${month}` : month;
  let day = date.getDate();
  day = day < 10 ? `0${day}` : day;

  const handleEditComment = () => {
    // add api call for editing comment
    updateComment(comment.id, { content: onChangeValue }); // onChangeValue가 계속 바뀌는 값이거든.. 이걸 comment id와 함께 update 날려주면 될것같다.
    //setContent(onChangeValue);
    setIsEdit(!isEdit);
    console.log({
      post: postId,
      comment: comment.id,
      content: content,
    });
  };

  // 삭제 구현

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

      <div className="flex flex-row items-center gap-3">
        {isEdit ? (
          <>
            <button
              onClick={() => {
                setIsEdit(!isEdit);
                setOnChangeValue(content);
              }}
            >
              취소
            </button>
            <button onClick={handleEditComment}>완료</button>
          </>
        ) : user?.id == comment?.author ? ( // 수정, 삭제버튼 눈에 보이기.
          <>
            <button onClick={() => handleCommentDelete(comment.id)}>
              삭제
            </button>
            <button onClick={() => setIsEdit(!isEdit)}>수정</button>
          </>
        ) : null}
      </div>
    </div>
  );
};
export default CommentElement;
