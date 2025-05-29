import { instance, instanceWithToken } from "./axios";

// Account 관련 API들
export const signIn = async (data) => {
  const response = await instance.post("/account/signin/", data); // instance를 써서 상태가 상당히 깔끔해진다.\
  // 이 위에는 backend에서 가져오는 거인거고
  if (response.status === 200) {
    window.location.href = "/"; // 회원가입 잘 되면 홈화면으로 가게끔.
    // 이거는 프론트의 홈화면으로 보내는 것 같음.
  } else {
    console.log("Error");
  }
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

// post

// 추가
export const getPosts = async () => {
  // 전부 다 가져오는거
  const response = await instance.get("/post/"); // backend에서 모든 post를 get하는 것을 요청. --> getComments도 마찬가지!
  return response.data;
};

export const getPost = async (id) => {
  // 한개만 가져오는거
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
export const likePost = async (postId) => {};

// 추가
// Tag 관련 API들
export const getTags = async () => {
  const response = await instance.get("/tag/");
  return response.data;
};

export const createTag = async (data) => {
  const response = await instanceWithToken.post("/tag/", data); // 로그인 권한이 필요한 기능은 instanceWithToken으로..
  if (response.status === 201) {
    console.log("TAG SUCCESS");
  } else {
    console.log("[ERROR] error while creating tag");
  }
  return response; // response 받아서 그 다음 처리
};

// Comment 추가

// Comment 관련 API들
export const getComments = async (postId) => {
  const response = await instance.get(`/comment/?post=${postId}`);
  return response.data;
};
// getPosts 참고해서 getComments로 모든 댓글 불러오기. 백엔드와의 연결도 필요.

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
  const response = await instanceWithToken.delete(`/comment/${id}/`);
  if (response.status === 204) {
    console.log("No Content");
    window.location.reload();
  } else {
    if (response.status === 400) {
      console.log("Bad Request");
    } else {
      if (response.status === 401) {
        console.log("Unauthorized");
      } else {
        if (response.status === 404) {
          console.log("Not Found");
        }
      }
    }
  }
  return response.data;
};

//추가
export const getUser = async () => {
  const response = await instanceWithToken.get("/account/info/");
  if (response.status === 200) {
    console.log("GET USER SUCCESS");
  } else {
    console.log("[ERROR] error while updating comment");
  }
  return response.data;
};
