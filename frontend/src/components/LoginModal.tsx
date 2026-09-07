import React, { useState } from 'react';
import { LockKeyhole, Mail, X } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<void>;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await onLogin(email, password);
      setPassword('');
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error ? error.message : '로그인 요청 중 오류가 발생했습니다.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md rounded-2xl border border-[#E6DDD2] bg-[#FBF9F6] p-6 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-[#2C2723]/60 transition-colors hover:bg-[#EFE8DE] hover:text-[#2C2723]"
          aria-label="로그인 창 닫기"
        >
          <X className="h-4 w-4" />
        </button>

        <span className="text-[10px] font-light uppercase tracking-[0.2em] text-[#2C2723]/50">
          Jerry Blossom
        </span>
        <h2 className="mt-1 text-xl font-semibold text-[#2C2723]">로그인</h2>
        <p className="mt-2 text-xs font-light leading-relaxed text-[#2C2723]/65">
          주문 내역과 장바구니를 이용하려면 로그인해주세요.
        </p>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs text-[#2C2723]/70">이메일</span>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2C2723]/40" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-[#E2D8CC] bg-white py-3 pl-10 pr-3 text-sm text-[#2C2723] outline-none transition-colors focus:border-[#2C2723]"
                placeholder="name@example.com"
                autoComplete="email"
                required
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs text-[#2C2723]/70">비밀번호</span>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2C2723]/40" />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-[#E2D8CC] bg-white py-3 pl-10 pr-3 text-sm text-[#2C2723] outline-none transition-colors focus:border-[#2C2723]"
                placeholder="비밀번호를 입력하세요"
                autoComplete="current-password"
                required
              />
            </div>
          </label>
        </div>

        {errorMessage && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700" role="alert">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full rounded-xl bg-[#2C2723] py-3 text-xs font-medium uppercase tracking-[0.2em] text-[#FBF9F6] transition-colors hover:bg-[#1C1917] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? '로그인 중...' : '로그인'}
        </button>
      </form>
    </div>
  );
};
