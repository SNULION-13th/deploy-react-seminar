import { useState, useEffect } from "react";

import comments from "../../data/comments"; // dummy data
import CommentElement from "./CommentElement";
import { getComments, createComment, deleteComment } from "../../apis/api"; // API call to set comments

const Comment = ({ postId }) => {
  //   const [commentList, setCommentList] = useState(comments); // state for comments
  const [newContent, setNewContent] = useState(""); // state for new comment

  const [commentList, setCommentList] = useState([]);
  useEffect(() => {
    const getCommentAPI = async () => {
      const comment = await getComments(postId);
      setCommentList(comment);
    };
    getCommentAPI();
  }, [postId]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    createComment({
      //   id: commentList.length + 1,
      content: newContent,
      //   created_at: new Date().toISOString(),
      post: postId,
      //   author: {
      //     id: 1,
      //     username: "user1",
      //    },
    });
    console.log({
      post: postId,
      content: newContent,
    });
    setNewContent("");
  };

  const handleCommentDelete = (commentId) => {
    console.log("comment: ", commentId);
    deleteComment(commentId);
    setCommentList(commentList.filter((comment) => comment.id !== commentId)); // TODO: add api call for deleting comment
  };

  return (
    <div className="w-full mt-5 self-start">
      <h1 className="text-3xl font-bold my-5">Comments</h1>
      {commentList.map((comment) => {
        return (
          <CommentElement
            key={comment.id}
            comment={comment}
            handleCommentDelete={handleCommentDelete}
            postId={postId}
          />
        );
      })}

      <form
        className="flex flex-row mt-10 gap-3"
        onSubmit={handleCommentSubmit}
      >
        <input
          type="text"
          value={newContent}
          placeholder="댓글을 입력해주세요"
          className="input"
          style={{ width: "calc(100% - 100px)" }}
          onChange={(e) => setNewContent(e.target.value)}
        />
        <button type="submit" className="button">
          작성
        </button>
      </form>
    </div>
  );
};

export default Comment;
