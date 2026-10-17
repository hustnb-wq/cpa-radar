import crypto from 'node:crypto';
import * as cheerio from 'cheerio';
import Parser from 'rss-parser';

const parser = new Parser();

async function fetchIFRS() {
  try {
    const feed = await parser.parseURL('https://www.iasplus.com/en/rss/standard-news.xml');
    return (feed.items || []).slice(0, 3).map((i) => ({
      title: i.title || '',
      url: i.link || '',
      date: i.pubDate ? new Date(i.pubDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      source: 'IFRS / IASB',
      standard_type: 'IFRS',
      content: i.contentSnippet || i.title || ''
    }));
  } catch (err) {
    console.warn('IFRS fetch skipped:', err.message);
    return [];
  }
}

async function fetchMOF() {
  try {
    const res = await fetch('https://kjs.mof.gov.cn/zhengcefabu/', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const html = await res.text();
    const $ = cheerio.load(html);
    const list = [];

    $('ul.list-txt li').slice(0, 3).each((_, el) => {
      const a = $(el).find('a');
      const date = $(el).find('span').text().replace(/[\[\]]/g, '').trim();
      const title = a.text().trim();
      const href = a.attr('href');
      if (title && href) {
        list.push({
          title,
          url: new URL(href, 'https://kjs.mof.gov.cn/zhengcefabu/').toString(),
          date,
          source: '财政部会计司',
          standard_type: 'CAS',
          content: title
        });
      }
    });
    return list;
  } catch (err) {
    console.warn('MOF fetch skipped:', err.message);
    return [];
  }
}

async function generateInsight(title, content) {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) {
    return {
      summary_core: title,
      target_entities: JSON.stringify(['企事业单位']),
      cpa_takeaways: '请密切跟进官方实施细则与过渡安排。'
    };
  }

  const prompt = `你是资深注册会计师。请研读政策《${title}》，简要输出一个纯 JSON：
{
  "summary_core": "2句话概括政策重大变动",
  "target_entities": ["涉及行业或企业类型"],
  "cpa_takeaways": "站在 CPA 与审计视角，给出 1~2 条具体会计处理或底稿合规建议"
}`;

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2
      })
    });
    const data = await res.json();
    const parsed = JSON.parse(data.choices[0].message.content.replace(/```json|```/g, '').trim());
    return {
      summary_core: parsed.summary_core,
      target_entities: JSON.stringify(parsed.target_entities || []),
      cpa_takeaways: parsed.cpa_takeaways
    };
  } catch {
    return {
      summary_core: title,
      target_entities: JSON.stringify(['通用企业']),
      cpa_takeaways: '关注新政策执行过渡期中的会计调整。'
    };
  }
}

async function saveToD1(record) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_API_TOKEN;
  const dbId = process.env.CLOUDFLARE_D1_DATABASE_ID;

  if (!accountId || !token || !dbId) {
    console.log('Skipping remote DB write: Missing Cloudflare credentials.');
    return;
  }

  const sql = `INSERT OR IGNORE INTO policies (id, title, source, standard_type, url, publish_date, summary_core, target_entities, cpa_takeaways)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;

  await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${dbId}/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sql,
      params: [
        record.id,
        record.title,
        record.source,
        record.standard_type,
        record.url,
        record.publish_date,
        record.summary_core,
        record.target_entities,
        record.cpa_takeaways
      ]
    })
  });
}

async function main() {
  console.log('--- 开始轮询法规动态 ---');
  const items = [...(await fetchIFRS()), ...(await fetchMOF())];
  console.log(`获取到 ${items.length} 条待处理项目`);

  for (const item of items) {
    const id = crypto.createHash('sha256').update(item.url).digest('hex');
    console.log(`正在分析: ${item.title}`);
    const insight = await generateInsight(item.title, item.content);
    
    await saveToD1({
      id,
      title: item.title,
      source: item.source,
      standard_type: item.standard_type,
      url: item.url,
      publish_date: item.date,
      ...insight
    });
  }
  console.log('--- 同步完成 ---');
}

main();
