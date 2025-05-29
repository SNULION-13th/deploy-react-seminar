import { useEffect, useState } from "react";
//import comments from "../../data/comments"; // dummy data
import CommentElement from "./CommentElement";
import { getComments,createComment, deleteComment } from "../../apis/api";

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

    const handleCommentSubmit =async (e) => {
        e.preventDefault();
        if (!newContent.trim()) return;
        try{
        const newComment= await createComment({
                post: postId,
                content: newContent,
            });

        if (!newComment) {
        console.error("댓글 응답이 없습니다");
        return;
        }

        setCommentList((commentList)=>[ // TODO: add api call for creating comment
            ...commentList,
            newComment
        ]);
        setNewContent("");
        
        console.log({
            post: postId,
            content: newContent
        });
        
    }catch(error){
        console.error("댓글 작성 중 오류가 생겼습니다.", error)
        };
    };



    const handleCommentDelete = (commentId) => {
        console.log("comment: ", commentId);
        if (window.confirm("정말로 삭제하시겠습니까?진짜?진짜요?")) {
            deleteComment(commentId);
        }
        setCommentList(commentList.filter((comment) => comment.id !== commentId)); // TODO: add api call for deleting comment
    };

    const handleCommentUpdate = (commentId, newContent) => {
        setCommentList(prev =>
            prev.map(comment =>
            comment.id === commentId
                ? { ...comment, content: newContent }
                : comment
            )
        );
        };


    return (
        <div className="w-full mt-5 self-start">
            <h1 className="text-3xl font-bold my-5">Comments</h1>
            {commentList.map((comment) => {
                return (
                    <CommentElement key={comment.id} comment={comment} handleCommentDelete={handleCommentDelete} handleCommentUpdate={handleCommentUpdate} postId={postId} />
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
