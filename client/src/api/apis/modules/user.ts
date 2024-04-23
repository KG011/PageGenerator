import fetch from '@/api/fetch/index.ts';

export const Login = (data: User) =>{
  return fetch.post('/user/login', data)
}
export const userInfoApi = (data: User) =>{
  return fetch.post('/user/userInfo', data)
}
export const searchFriendApi = (data) =>{
  return fetch.post('/user/searchFriend', data)
}
export const Register = (data) =>{
  return fetch.post('/user/register', data)
}

/**
 * 更新用户名
 */
export const UpdateUN = (data: User) => {
  return fetch.patch(`/user/username`, data);
};


/**
 * 用户名模糊搜索用户
 * @param username
 */
export function getUsersByName(username: string) {
  return fetch.get(`/user/findByName?username=${username}`);
}

/**
 * 用户头像上传
 * @param params
 */
export function setUserAvatar(params: FormData) {
  return fetch.post(`/user/avatar`, params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
