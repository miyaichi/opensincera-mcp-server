import { PublisherMetadata } from './opensincera-service.js';

// ============================================================
// compare_publishers helpers
// ============================================================

interface MetricDef {
  label: string;
  key: string;
  extract: (p: PublisherMetadata) => number | undefined;
  lowerIsBetter: boolean;
  format?: (v: number) => string;
}

const COMPARE_METRICS: MetricDef[] = [
  { label: 'A2CR', key: 'a2cr', extract: p => p.metadata?.avgAdsToContentRatio, lowerIsBetter: true, format: v => v.toFixed(2) },
  { label: 'Ads in View', key: 'aiv', extract: p => p.metadata?.avgAdsInView, lowerIsBetter: true, format: v => v.toFixed(1) },
  { label: 'Ad Refresh (s)', key: 'adr', extract: p => p.metadata?.avgAdRefresh, lowerIsBetter: false, format: v => v.toFixed(1) },
  { label: 'Page Weight', key: 'pw', extract: p => p.metadata?.avgPageWeight, lowerIsBetter: true, format: v => v.toFixed(0) },
  { label: 'CPU Usage', key: 'cpu', extract: p => p.metadata?.avgCpu, lowerIsBetter: true, format: v => v.toFixed(1) },
  { label: 'Total Supply Paths', key: 'sp', extract: p => p.metadata?.totalSupplyPaths, lowerIsBetter: true, format: v => v.toFixed(0) },
  { label: 'Reseller Count', key: 'rc', extract: p => p.metadata?.resellerCount, lowerIsBetter: true, format: v => v.toFixed(0) },
  { label: 'ID Absorption Rate', key: 'idar', extract: p => p.metadata?.idAbsorptionRate, lowerIsBetter: false, format: v => (v * 100).toFixed(1) + '%' },
  { label: 'Total Unique GPIDs', key: 'gpids', extract: p => p.metadata?.totalUniqueGpids, lowerIsBetter: false, format: v => v.toFixed(0) },
];

export function buildComparisonReport(
  self: PublisherMetadata,
  peers: PublisherMetadata[]
): string {
  const all = [self, ...peers];
  const names = all.map(p => p.publisherName || p.ownerDomain || p.publisherId);

  // Header
  let md = `# Competitive Benchmark Report\n\n`;
  md += `**Your Publisher:** ${names[0]} (${self.ownerDomain})\n\n`;
  md += `**Compared with:** ${peers.length} similar publisher(s)\n\n`;

  // Table header
  md += '| Metric | ' + names.map(n => n.substring(0, 20)) .join(' | ') + ' | Your Rank |\n';
  md += '|' + '---|'.repeat(names.length + 2) + '\n';

  for (const m of COMPARE_METRICS) {
    const vals = all.map(p => m.extract(p));
    const selfVal = vals[0];
    const fmt = m.format || ((v: number) => String(v));

    // rank (1 = best)
    let rank = '-';
    if (selfVal != null) {
      const defined = vals.filter((v): v is number => v != null);
      const sorted = [...defined].sort((a, b) => m.lowerIsBetter ? a - b : b - a);
      rank = `${sorted.indexOf(selfVal) + 1}/${defined.length}`;
    }

    const cells = vals.map(v => v != null ? fmt(v) : 'N/A');
    md += `| ${m.label} | ${cells.join(' | ')} | ${rank} |\n`;
  }

  md += '\n### Legend\n';
  md += '- Rank 1 = best among compared publishers\n';
  md += '- A2CR, Ads in View, Page Weight, CPU, Supply Paths, Reseller Count: lower is better\n';
  md += '- Ad Refresh, ID Absorption Rate, Unique GPIDs: higher is better\n';

  return md;
}

// ============================================================
// evaluate_media helpers
// ============================================================

type CampaignGoal = 'branding' | 'performance' | 'balanced';

interface MetricWeight {
  key: string;
  label: string;
  extract: (p: PublisherMetadata) => number | undefined;
  lowerIsBetter: boolean;
  weights: { branding: number; performance: number; balanced: number };
  /** If true, penalty is relaxed for video supply types */
  videoRelaxed?: boolean;
  // scaling bounds (approx)
  min: number;
  max: number;
}

const isVideoSupplyType = (p: PublisherMetadata): boolean => {
  const st = (p.metadata?.primarySupplyType || '').toLowerCase();
  return st.includes('video') || st.includes('ctv') || st.includes('ott');
};

const EVAL_METRICS: MetricWeight[] = [
  { key: 'a2cr', label: 'A2CR', extract: p => p.metadata?.avgAdsToContentRatio, lowerIsBetter: true,
    weights: { branding: 25, performance: 10, balanced: 15 }, min: 0, max: 1 },
  { key: 'aiv', label: 'Ads in View', extract: p => p.metadata?.avgAdsInView, lowerIsBetter: true,
    weights: { branding: 20, performance: 8, balanced: 12 }, min: 0, max: 30 },
  { key: 'adr', label: 'Ad Refresh', extract: p => p.metadata?.avgAdRefresh, lowerIsBetter: false,
    weights: { branding: 10, performance: 5, balanced: 8 }, min: 0, max: 120 },
  { key: 'pw', label: 'Page Weight', extract: p => p.metadata?.avgPageWeight, lowerIsBetter: true,
    weights: { branding: 8, performance: 5, balanced: 8 }, min: 0, max: 20000, videoRelaxed: true },
  { key: 'cpu', label: 'CPU Usage', extract: p => p.metadata?.avgCpu, lowerIsBetter: true,
    weights: { branding: 7, performance: 5, balanced: 7 }, min: 0, max: 5000, videoRelaxed: true },
  { key: 'sp', label: 'Supply Paths', extract: p => p.metadata?.totalSupplyPaths, lowerIsBetter: true,
    weights: { branding: 5, performance: 20, balanced: 12 }, min: 0, max: 500 },
  { key: 'rc', label: 'Reseller Count', extract: p => p.metadata?.resellerCount, lowerIsBetter: true,
    weights: { branding: 5, performance: 12, balanced: 8 }, min: 0, max: 300 },
  { key: 'idar', label: 'ID Absorption Rate', extract: p => p.metadata?.idAbsorptionRate, lowerIsBetter: false,
    weights: { branding: 10, performance: 25, balanced: 15 }, min: 0, max: 1 },
  { key: 'gpids', label: 'Unique GPIDs', extract: p => p.metadata?.totalUniqueGpids, lowerIsBetter: false,
    weights: { branding: 5, performance: 5, balanced: 5 }, min: 0, max: 1000 },
];

// Verification bonus (flat addition)
const VERIFICATION_BONUS = 5;

function normalize(value: number, min: number, max: number, lowerIsBetter: boolean): number {
  const clamped = Math.max(min, Math.min(max, value));
  const ratio = (clamped - min) / (max - min || 1);
  const score = lowerIsBetter ? (1 - ratio) * 100 : ratio * 100;
  return Math.max(0, Math.min(100, score));
}

export interface ScoredPublisher {
  publisher: PublisherMetadata;
  totalScore: number;
  metricScores: { key: string; label: string; raw: number | undefined; score: number; weight: number }[];
}

export function scorePublisher(p: PublisherMetadata, goal: CampaignGoal): ScoredPublisher {
  const isVideo = isVideoSupplyType(p);
  const metricScores: ScoredPublisher['metricScores'] = [];
  let weightedSum = 0;
  let totalWeight = 0;

  for (const m of EVAL_METRICS) {
    const raw = m.extract(p);
    const weight = m.weights[goal];
    if (raw == null) {
      metricScores.push({ key: m.key, label: m.label, raw: undefined, score: 50, weight });
      weightedSum += 50 * weight;
      totalWeight += weight;
      continue;
    }

    let effectiveWeight = weight;
    let lowerIsBetter = m.lowerIsBetter;

    // Video relaxation for page weight / CPU
    if (m.videoRelaxed && isVideo) {
      effectiveWeight = Math.max(1, weight * 0.3); // reduce penalty weight
    }

    const score = normalize(raw, m.min, m.max, lowerIsBetter);
    metricScores.push({ key: m.key, label: m.label, raw, score: Math.round(score), weight: effectiveWeight });
    weightedSum += score * effectiveWeight;
    totalWeight += effectiveWeight;
  }

  let totalScore = totalWeight > 0 ? weightedSum / totalWeight : 50;

  // Verification bonus
  if (p.verificationStatus === 'verified') {
    totalScore = Math.min(100, totalScore + VERIFICATION_BONUS);
  }

  return { publisher: p, totalScore: Math.round(totalScore), metricScores };
}

interface EvalLabels {
  title: string;
  goal: string;
  rank: string;
  domain: string;
  score: string;
  verified: string;
  supplyType: string;
  metricBreakdown: string;
  metric: string;
  raw: string;
  mScore: string;
  weight: string;
  recommended: string;
  skipped: string;
  skippedNote: string;
}

const LABELS: Record<string, EvalLabels> = {
  en: {
    title: 'Media Evaluation Report',
    goal: 'Campaign Goal',
    rank: 'Rank',
    domain: 'Domain',
    score: 'Score',
    verified: 'Verified',
    supplyType: 'Supply Type',
    metricBreakdown: 'Metric Breakdown',
    metric: 'Metric',
    raw: 'Raw',
    mScore: 'Score',
    weight: 'Weight',
    recommended: '⭐ Recommended',
    skipped: 'Skipped Domains',
    skippedNote: 'Could not retrieve data for',
  },
  ja: {
    title: 'メディア評価レポート',
    goal: 'キャンペーン目的',
    rank: '順位',
    domain: 'ドメイン',
    score: 'スコア',
    verified: '認証済み',
    supplyType: '供給タイプ',
    metricBreakdown: 'メトリクス内訳',
    metric: '指標',
    raw: '実測値',
    mScore: 'スコア',
    weight: '重み',
    recommended: '⭐ 推奨',
    skipped: 'スキップされたドメイン',
    skippedNote: 'データを取得できませんでした',
  },
};

export function buildEvaluationReport(
  scored: ScoredPublisher[],
  skippedDomains: string[],
  goal: CampaignGoal,
  language: string
): string {
  const L = LABELS[language] || LABELS.en;
  const sorted = [...scored].sort((a, b) => b.totalScore - a.totalScore);

  let md = `# ${L.title}\n\n`;
  md += `**${L.goal}:** ${goal}\n\n`;

  // Ranking table
  md += `## Ranking\n\n`;
  md += `| ${L.rank} | ${L.domain} | ${L.score} | ${L.verified} | ${L.supplyType} |\n`;
  md += '|---|---|---|---|---|\n';
  sorted.forEach((s, i) => {
    const p = s.publisher;
    const star = i === 0 ? ' ' + L.recommended : '';
    md += `| ${i + 1} | ${p.ownerDomain}${star} | **${s.totalScore}**/100 | ${p.verificationStatus} | ${p.metadata?.primarySupplyType || 'N/A'} |\n`;
  });

  // Detail per publisher
  md += `\n## ${L.metricBreakdown}\n\n`;
  for (const s of sorted) {
    md += `### ${s.publisher.ownerDomain} (${L.score}: ${s.totalScore}/100)\n\n`;
    md += `| ${L.metric} | ${L.raw} | ${L.mScore} | ${L.weight} |\n`;
    md += '|---|---|---|---|\n';
    for (const ms of s.metricScores) {
      const rawStr = ms.raw != null ? String(Math.round(ms.raw * 1000) / 1000) : 'N/A';
      md += `| ${ms.label} | ${rawStr} | ${ms.score}/100 | ${ms.weight.toFixed(1)} |\n`;
    }
    md += '\n';
  }

  if (skippedDomains.length > 0) {
    md += `## ${L.skipped}\n\n`;
    md += `${L.skippedNote}: ${skippedDomains.join(', ')}\n`;
  }

  return md;
}
