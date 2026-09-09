const API_URL = import.meta.env.VITE_API_URL;

export interface UserProfile {
  id: number;
  email: string;
  name: string;
  phoneNumber: string | null;
  role: string;
}

/**
 * 내 정보 조회
 * @param accessToken
 */
export async function getMyProfile(accessToken: string): Promise<UserProfile> {
  const response = await fetch(`${API_URL}/api/users/me`, {
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message ?? '회원 정보를 불러오지 못했습니다.');
  }

  return response.json();
}
