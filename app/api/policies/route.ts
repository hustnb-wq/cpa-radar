import { NextResponse } from 'next/server';

// 声明为静态导出，告知 Next.js 静态构建此路由
export const dynamic = 'force-static';

export async function GET() {
  // 返回默认或初始化数据
  return NextResponse.json([
    {
      id: 'sample-1',
      title: '财政部关于印发《企业数据资源相关会计处理暂行规定》的通知',
      source: '财政部会计司',
      standard_type: 'CAS',
      publish_date: '2026-08-20',
      url: 'https://kjs.mof.gov.cn/',
      summary_core: '确立了企业内部使用和对外交易的数据资源入表标准，针对无形资产与存货分类制定了详尽的披露指引。',
      target_entities: JSON.stringify(['互联网/软件企业', '数字化转型国企', '拟上市公司']),
      cpa_takeaways: '实务中需严格审核研发支出资本化与费用化划分的时点依据，核查确权凭据是否充分，防止利用数据虚构资产。'
    }
  ]);
}
