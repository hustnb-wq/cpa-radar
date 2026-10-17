'use client';

import { useState, useEffect } from 'react';

interface Policy {
  id: string;
  title: string;
  source: string;
  standard_type: string;
  publish_date: string;
  url: string;
  summary_core: string;
  target_entities: string;
  cpa_takeaways: string;
}

export default function HomePage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/policies')
      .then((res) => res.json())
      .then((data) => {
        setPolicies(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = filter === 'ALL' 
    ? policies 
    : policies.filter((p) => p.standard_type === filter);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
          国内外财会法规实时追踪与实操指引
        </h1>
        <p className="mt-3 text-base text-slate-600 max-w-2xl">
          每日自动轮询财政部、IFRS 基金会及税务总局动态，提取会计科目变动、列报要求与注册会计师审计关键点。
        </p>
      </div>

      <div className="flex gap-2 pb-6 border-b border-slate-200 mb-6 overflow-x-auto">
        {['ALL', 'CAS', 'IFRS', 'TAX', 'AUDIT'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              filter === tab
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab === 'ALL' ? '全部准则' : tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400">正在同步最新法规数据...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-400">暂无相关政策记录</div>
      ) : (
        <div className="grid gap-6">
          {filtered.map((item) => {
            let tags: string[] = [];
            try {
              tags = JSON.parse(item.target_entities || '[]');
            } catch {
              tags = ['企事业单位'];
            }

            return (
              <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow transition">
                <div className="flex items-center gap-3 text-xs mb-3 text-slate-500">
                  <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-100">
                    {item.standard_type}
                  </span>
                  <span>{item.source}</span>
                  <span>•</span>
                  <span>{item.publish_date}</span>
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-2">
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 inline-flex items-center gap-1">
                    {item.title}
                    <span className="text-xs text-slate-400">↗</span>
                  </a>
                </h2>

                <p className="text-slate-700 text-sm leading-relaxed mb-4">
                  {item.summary_core}
                </p>

                <div className="bg-slate-50 border-l-4 border-slate-900 p-4 rounded-r-lg mb-4">
                  <div className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <span>⚖️ 注册会计师核算与审计指引</span>
                  </div>
                  <div className="text-sm text-slate-700 leading-normal">
                    {item.cpa_takeaways}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
