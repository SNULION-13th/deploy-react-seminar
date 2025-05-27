import { useState, useEffect } from "react";
import { getUser, updateComment } from "../../apis/api";
import { getCookie } from "../../utils/cookie";

const CommentElement = (props) => {
    const { comment, handleCommentDelete } = props;
    const [isAuthor, setIsAuthor] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [content, setContent] = useState(comment.content);
    const [onChangeContent, setOnChangeContent] = useState(content);

    // comment created_at 전처리
    const date = new Date(comment.created_at);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = month < 10 ? `0${month}` : month;
    let day = date.getDate();
    day = day < 10 ? `0${day}` : day;

    useEffect(() => {
        if (getCookie("access_token")) {
            const getUserAPI = async () => {
                const user = await getUser();
                try {
                    setIsAuthor(user.id === comment.author.id);
                }
                catch (error) {
                    setIsAuthor(false);
                    console.log("CommentElement: 유저 정보 가져오기 실패 (Undefined Value):", error);
                }
            };

            getUserAPI().catch(error => {
                setIsAuthor(false);
                console.log("CommentElement: 유저 정보 가져오기 실패 (Promise catch):", error);
            });
        }
    }, [comment]);

    const handleEditComment = async () => {
        try {
            await updateComment(comment.id, { content: onChangeContent });
            setContent(onChangeContent);
            setIsEdit(false);
        } catch (error) {
            console.error("댓글 수정 실패:", error);
            setOnChangeContent(content);
        }
    };


    return (
        <div className="w-full flex flex-row justify-between items-center mb-5">
            <div className="w-3/4 flex flex-col gap-1">
                {isEdit ? (
                    <input
                        className="input mb-2"
                        value={onChangeContent}
                        onChange={(e) => setOnChangeContent(e.target.value)}
                    />
                ) : (
                    <p className="text-lg">{content}</p>
                )}

                <span className="text-base text-gray-300">
                    {year}.{month}.{day}
                </span>
            </div>

            <div className="flex flex-row items-center gap-3">
                {isAuthor ? (
                    isEdit ? (
                        <>
                            <button
                                onClick={() => {
                                    setIsEdit(false);
                                    setOnChangeContent(content);
                                }}
                            >
                                취소
                            </button>
                            <button onClick={handleEditComment}>완료</button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => handleCommentDelete(comment.id)}>
                                삭제
                            </button>
                            <button onClick={() => setIsEdit(true)}>수정</button>
                        </>
                    )
                ) : null}
            </div>
        </div>
    );
};
export default CommentElement;