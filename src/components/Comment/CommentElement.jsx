import { useState, useEffect } from "react";
import {updateComment} from "../../apis/api.js"
import { getCookie } from "../../utils/cookie.js";
const CommentElement = (props) => {
    const { comment, handleCommentDelete, postId } = props;
    const [content, setContent] = useState(comment.content);
    const [isEdit, setIsEdit] = useState(false);
    const [onChangeValue, setOnChangeValue] = useState(content); // 수정 취소 시 직전 content 값으로 변경을 위한 state
    const [isAuthor, setIsAuthor] = useState(false);

    // comment created_at 전처리
    const date = new Date(comment.created_at);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = month < 10 ? `0${month}` : month;
    let day = date.getDate();
    day = day < 10 ? `0${day}` : day;

    const handleEditComment = async ()  => { 
        // add api call for editing comment
        try{
            const res= await updateComment(comment.id,onChangeValue);
            setContent(onChangeValue);
            setIsEdit(false);
            console.log({
                post: postId,
                comment: comment.id,
                content: onChangeValue,
            });
        }catch(error){
            console.error("댓글 수정 실패",error)
        }
    };

    useEffect(() => { // add api call to check if user is the author of the comment
        const checkAuthor = async () => {
            if (getCookie("access_token")){
                try{
                    const user=await getUser();
                    if (user.id === comment.author.id){
                        setIsAuthor(true);
                    }
                }catch (error){
                    console.error("checkauthor 오류",error)
                }
            }
        };
        checkAuthor();

    }, [comment.author.id]);

    return (
        <div className="w-full flex flex-row justify-between items-center mb-5">
            <div className="w-3/4 flex flex-col gap-1">
                {isEdit ? (
                    <input className="input mb-2" value={onChangeValue} onChange={(e) => setOnChangeValue(e.target.value)} />
                ) : (
                    <p className="text-lg">{content}</p>
                )}

                <span className="text-base text-gray-300">{year}.{month}.{day}</span>
            </div>

            <div className="flex flex-row items-center gap-3">
                {isEdit ? (
                    <>
                        <button onClick={() => { setIsEdit(!isEdit); setOnChangeValue(content); }}>취소</button>
                        <button onClick={handleEditComment}>완료</button>
                    </>
                ) : (
                    isAuthor &&(
                    <>
                        <button onClick={() => handleCommentDelete(comment.id)}>삭제</button>
                        <button onClick={() => setIsEdit(!isEdit)}>수정</button>
                    </>
                    )
                )}
            </div>
        </div>
    );
};
export default CommentElement;
