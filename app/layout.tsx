import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: '财税智眸 | 注册会计师法规雷达与专业解读',
  description: '自动追踪财政部、IFRS、税务总局最新会计政策，提供注册会计师视角的实操应对方案。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col justify-between">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-slate-900 tracking-tight">财税智眸</span>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">CPA 雷达</span>
            </Link>
            <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
              <Link href="/" className="hover:text-blue-600">最新准则情报</Link>
              <Link href="/about" className="hover:text-blue-600">关于我 / 执业资质</Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500">
          <div className="max-w-6xl mx-auto px-4 space-y-2">
            <p>免责声明：本站所载法规政策均由系统自动归集，AI 解读与实操建议仅供专业学习与参考，不构成法定审计意见或鉴证结论。</p>
            <p>© {new Date().getFullYear()} 注册会计师个人站 · 依托 Cloudflare 全球网络驱动</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
