import { useState, useEffect } from "react";
import comments from "../../data/comments"; // dummy data
import CommentElement from "./CommentElement";
import { getComments } from "../../apis/api";
import { getCookie } from "../../utils/cookie";

const Comment = ({ postId }) => {
  //const [commentList, setCommentList] = useState(comments); // state for comments
  const [commentList, setCommentList] = useState([]); // 처음에는 빈칸 설정.
  const [newContent, setNewContent] = useState(""); // state for new comment

  // getPost와 비슷하게, 맨 초기에 이미 존재하는 Comment 불러오기.
  useEffect(() => {
    const getCommentsAPI = async () => {
      const comments = await getComments(postId); // 특정게시물의 comments를 불러오는거임.
      setCommentList(comments);
    };
    getCommentsAPI();
  }, [postId]); // postID가 바뀔때마다 실행된다!

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    setCommentList([
      // TODO: add api call for creating comment -> 이 부분 수정하라는!
      ...commentList,
      {
        id: commentList.length + 1,
        content: newContent,
        created_at: new Date().toISOString(),
        post: postId,
        author: {
          id: 1,
          username: "user1",
        },
      },
    ]);
    console.log({
      post: postId,
      content: newContent,
    });
    setNewContent("");
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
          <CommentElement
            key={comment.id}
            comment={comment}
            handleCommentDelete={handleCommentDelete}
            postId={postId}
          />
        );
      })}

      {getCookie("access_token") ? (
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
      ) : null}
    </div>
  );
};

export default Comment;
