const API_URL = import.meta.env.VITE_API_URL;

interface LoginResponse {
  accessToken: string;
  expiresIn: number;
}

/**
 * 로그인
 * @param email
 * @param password
 */
export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message ?? '이메일 또는 비밀번호가 올바르지 않습니다.');
  }

  return response.json();
}
