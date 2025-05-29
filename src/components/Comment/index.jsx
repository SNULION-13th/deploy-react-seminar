import { useEffect, useState } from "react";
//import comments from "../../data/comments"; // dummy data
import CommentElement from "./CommentElement";
import { getComments,createComment } from "../../apis/api";

const Comment = ({ postId }) => {
    const [commentList, setCommentList] = useState([]); // state for comments
    const [newContent, setNewContent] = useState(""); // state for new comment
    

    useEffect(()=>{
        const fetchComments = async () =>{
            try{
                const response = await getComments(postId)
                setCommentList(response.data);

            } catch (error){
                console.error("댓글 불러오기 실패",error)
            }
        };
         fetchComments();
    },[postId]);

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        try{
        const newComment= createComment({
                content: newContent,
                post: postId,
            });

        setCommentList([ // TODO: add api call for creating comment
            ...commentList,
                newComment
        ]);
        console.log({
            post: postId,
            content: newContent
        });
        setNewContent("");
    }catch(error){
        console.error("댓글 작성 중 오류가 생겼습니다.", error)
    };
    };
    const handleCommentDelete = (commentId) => {
        console.log("comment: ", commentId);
        setCommentList(commentList.filter((comment) => comment.id !== commentId)); // TODO: add api call for deleting comment
    };

    return (
        <div className="w-full mt-5 self-start">
            <h1 className="text-3xl font-bold my-5">Comments</h1>
            {commentList.map((comment) => {
                return (
                    <CommentElement key={comment.id} comment={comment} handleCommentDelete={handleCommentDelete} postId={postId} />
                );
            })}
            
            <form className="flex flex-row mt-10 gap-3" onSubmit={handleCommentSubmit}>
                <input type="text" value={newContent} placeholder="댓글을 입력해주세요" className="input" style={{ width: "calc(100% - 100px)" }} onChange={(e) => setNewContent(e.target.value)} />
                <button type="submit" className="button">작성</button>
            </form>
        </div>
    );
};

export default Comment;
