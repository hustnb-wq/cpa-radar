export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-slate-900 text-white flex items-center justify-center text-xl font-bold">
            CPA
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">执业注册会计师 / 专业顾问</h1>
            <p className="text-sm text-slate-500">专注于中国会计准则 (CAS)、国际财务报告准则 (IFRS) 与企业财税合规</p>
          </div>
        </div>

        <div className="space-y-6 text-slate-700 leading-relaxed text-sm">
          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">执业背景</h2>
            <p>
              多年知名会计师事务所与财税咨询执业经验。长期跟踪国内外会计准则重大调整，擅长新收入准则、新租赁准则、复杂金融工具以及企业境内外上市前的财务规范化梳理。
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">本站初衷</h2>
            <p>
              当前财会政策与监管通知分布在各大官方平台，更新频繁且条文冗长。本站利用自动化爬虫结合 AI 研读，第一时间提炼会计实操变化与审计核查要点，旨在打造一个专业、及时、实用的垂直知识库。
            </p>
          </section>

          <section className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 mb-2">业务交流与咨询</h2>
            <p className="text-xs text-slate-600 mb-2">欢迎同行专业探讨、企业财税合规梳理或专项培训邀请：</p>
            <p className="font-mono text-xs text-slate-800">Email: contact@yourdomain.com</p>
          </section>
        </div>
      </div>
    </div>
  );
}
