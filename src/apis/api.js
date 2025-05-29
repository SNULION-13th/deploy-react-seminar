import { instance, instanceWithToken } from "./axios";

export const signIn = async (data) => {
  //아직 토큰이 없음 -> axios에서 instance 사용
  //사용자 인증이 필요할 때, 상황에 따라 instanceWithToken사용
  const response = await instance.post("/account/signin/", data);
  if (response.status === 200) {
    //홈화면으로 가게 된다.
    window.location.href = "/";
  } else {
    console.log("Error");
  }
};

export const getUser = async () => {
  const response = await instanceWithToken.get("/account/info/");
  if (response.status === 200) {
    console.log("GET USER SUCCESS");
  } else {
    console.log("[ERROR] error while updating comment");
  }
  return response.data;
};

export const signUp = async (data) => {
  const response = await instance.post("/account/signup/", data);
  if (response.status === 200 || response.status === 201) {
    window.location.href = "/";
  } else {
    console.log("Error");
  }
  return response;
};

// 추가
export const getPosts = async () => {
  const response = await instance.get("/post/");
  return response.data;
};

export const getPost = async (id) => {
  const response = await instance.get(`/post/${id}/`);
  return response.data;
};

export const createPost = async (data, navigate) => {
  const response = await instanceWithToken.post("/post/", data);
  if (response.status === 201) {
    console.log("POST SUCCESS");
    navigate("/");
  } else {
    console.log("[ERROR] error while creating post");
  }
};

export const updatePost = async (id, data, navigate) => {
  const response = await instanceWithToken.put(`/post/${id}/`, data);
  if (response.status === 200) {
    console.log("POST UPDATE SUCCESS");
    navigate(-1);
  } else {
    console.log("[ERROR] error while updating post");
  }
};

// 과제!!
export const deletePost = async (id, navigate) => {
  const response = await instanceWithToken.delete(`/post/${id}/`);
  if (response.status === 204) {
    console.log("DELETE SUCCESS");
    navigate(-1);
  } else {
    console.log("[ERROR] error while deleting post");
  }
};

// 과제!!
export const likePost = async (postId) => {
  try {
    const response = await instanceWithToken.post(`/post/${postId}/like/`);
    if (response.status === 200) {
      console.log("LIKE SUCCESS");
      return response.data; // 업데이트된 post 객체 반환
    } else {
      console.log("[ERROR] unexpected status code", response.status);
    }
  } catch (error) {
    console.error("[ERROR] error while liking post", error);
  }
};

// 추가
// Tag 관련 API들
export const getTags = async () => {
  const response = await instance.get("/tag/");
  return response.data;
};

export const createTag = async (data) => {
  //사용자가 맞는지 확인할 때 토큰이 필요
  const response = await instanceWithToken.post("/tag/", data);
  if (response.status === 201) {
    console.log("TAG SUCCESS");
  } else {
    console.log("[ERROR] error while creating tag");
  }
  return response; // response 받아서 그 다음 처리
};

// 추가

// Comment 관련 API들
export const getComments = async (postId) => {
  const response = await instance.get(`/comment/?post=${postId}`);
  return response.data;
};

export const createComment = async (data) => {
  const response = await instanceWithToken.post("/comment/", data);
  if (response.status === 201) {
    console.log("COMMENT SUCCESS");
    window.location.reload(); // 새로운 코멘트 생성시 새로고침으로 반영
  } else {
    console.log("[ERROR] error while creating comment");
  }
};

export const updateComment = async (id, data) => {
  const response = await instanceWithToken.put(`/comment/${id}/`, data); // 혹시 patch로 구현했다면 .patch
  if (response.status === 200) {
    console.log("COMMENT UPDATE SUCCESS");
    window.location.reload();
  } else {
    console.log("[ERROR] error while updating comment");
  }
};

// 과제 !!
export const deleteComment = async (id) => {
  const isConfirmed = window.confirm("정말로 이 댓글을 삭제하시겠습니까?");
  if (!isConfirmed) return;

  try {
    const response = await instanceWithToken.delete(`/comment/${id}/`);
    if (response.status === 204) {
      console.log("COMMENT DELETE SUCCESS");
      window.location.reload(); // 삭제 후 새로고침
    } else {
      console.log("[ERROR] unexpected status code", response.status);
    }
  } catch (error) {
    console.error("[ERROR] error while deleting comment", error);
  }
};
