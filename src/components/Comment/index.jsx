import { useState, useEffect } from "react";
import CommentElement from "./CommentElement";
import { getComments, createComment, deleteComment, getUser } from "../../apis/api";
import { getCookie } from "../../utils/cookie";
import { useParams } from "react-router-dom";

const Comment = ({ postId }) => {
    const [commentList, setCommentList] = useState([]); // state for comments
    const [newContent, setNewContent] = useState(""); // state for new comment
    const [user, setUser] = useState(null);


    useEffect(() => {
        if (postId) {
            getComments(postId).then(setCommentList);
        }

        if (getCookie("access_token")) {
            getUser().then(setUser);
        }
    }, [postId]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        await createComment({ content: newContent, post: postId });
        const updated = await getComments(postId);
        setCommentList(updated);
        setNewContent("");
    };

    const handleCommentDelete = async (id) => {
        const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
        if (!confirmDelete) return;
        await deleteComment(id);
        const updated = await getComments(postId);
        setCommentList(updated);
    };


    return (
        <div className="w-full mt-5 self-start">
            <h1 className="text-3xl font-bold my-5">Comments</h1>
            {commentList.map((comment) => {
                return (
                    <CommentElement key={comment.id} comment={comment} handleCommentDelete={handleCommentDelete} postId={postId} currentUser={user}/>
                );
            })}
            
            {getCookie("access_token") ? (
                <form className="flex flex-row mt-10 gap-3" onSubmit={handleCommentSubmit}>
                    <input type="text" value={newContent} placeholder="댓글을 입력해주세요" className="input" style={{ width: "calc(100% - 100px)" }} onChange={(e) => setNewContent(e.target.value)} />
                    <button type="submit" className="button">작성</button>
                </form>
            ) : null}
        </div>
    );
};

export default Comment;
