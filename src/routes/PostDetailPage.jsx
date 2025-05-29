import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { BigPost } from "../components/Posts";
import Comment from "../components/Comment";
import CommentElement from "../components/CommentElement"; // 댓글 하나 렌더링
import {
  getPost,
  getUser,
  deletePost,
  getComments,
  deleteComment,
  likePost,
} from "../apis/api";
import { getCookie } from "../utils/cookie";

const PostDetailPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [user, setUser] = useState();
  const [comments, setComments] = useState([]);

  const navigate = useNavigate();

  // 포스트 데이터 불러오기
  useEffect(() => {
    const getPostAPI = async () => {
      const post = await getPost(postId);
      setPost(post);
    };
    getPostAPI();
  }, [postId]);

  // 로그인 유저 정보 불러오기
  useEffect(() => {
    if (getCookie("access_token")) {
      const getUserAPI = async () => {
        const user = await getUser();
        setUser(user);
      };
      getUserAPI();
    }
  }, []);

  // 댓글 목록 불러오기
  const fetchComments = async () => {
    try {
      const data = await getComments(postId);
      setComments(data);
    } catch (err) {
      console.error("댓글 불러오기 실패", err);
    }
  };

  // 댓글 삭제 핸들러
  const handleCommentDelete = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error("댓글 삭제 실패", err);
    }
  };

  // 댓글 목록도 함께 불러오기
  useEffect(() => {
    fetchComments();
  }, [postId]);

  // 포스트 삭제
  const onClickDelete = async () => {
    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;
    try {
      await deletePost(postId, navigate);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLikePost = async () => {
    try {
      const updatedPost = await likePost(postId);
      if (updatedPost) {
        setPost(updatedPost); // ❤️ 수 갱신
      }
    } catch (error) {
      console.error("좋아요 실패", error);
    }
  };

  return (
    post && (
      <div className="flex flex-col items-center w-[60%] p-8">
        <BigPost post={post} onClickLike={handleLikePost} user={user} />

        {/* 댓글 작성 */}
        <Comment postId={postId} fetchComments={fetchComments} />

        {/* 댓글 목록 */}
        <div className="w-full mt-6">
          {comments.map((comment) => (
            <CommentElement
              key={comment.id}
              comment={comment}
              postId={postId}
              handleCommentDelete={handleCommentDelete}
            />
          ))}
        </div>

        {/* 수정/삭제 버튼 (본인 글일 때만) */}
        <div className="flex flex-row gap-3">
          {user?.id === post?.author.id ? (
            <>
              <Link to={`/${post.id}/edit`}>
                <button className="button mt-10 py-2 px-10">수정</button>
              </Link>
              <button
                className="button mt-10 py-2 px-10"
                onClick={onClickDelete}
              >
                삭제
              </button>
            </>
          ) : null}
        </div>
      </div>
    )
  );
};

export default PostDetailPage;
