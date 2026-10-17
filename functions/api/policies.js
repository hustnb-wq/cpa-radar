export async function onRequestGet(context) {
  try {
    // 直接使用 Cloudflare Pages 原生方式读取绑定的 D1 数据库
    const db = context.env.DB;
    if (db) {
      const { results } = await db
        .prepare('SELECT * FROM policies ORDER BY publish_date DESC LIMIT 50')
        .all();
      if (results && results.length > 0) {
        return Response.json(results);
      }
    }

    // 当数据库还没有抓取到数据时，显示的默认示例数据
    return Response.json([
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
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
