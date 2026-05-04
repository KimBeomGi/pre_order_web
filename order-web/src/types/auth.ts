// @/types/types.ts 예시

export interface User {
  id: string;
  email: string;
  nickname: string;
  profileImage?: string; // 있을 수도 있고 없을 수도 있음
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}