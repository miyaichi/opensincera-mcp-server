/**
 * OpenSincera Publisher Metadata Field Descriptions
 * Extracted from adstxt-manager translations
 */

export interface FieldDescription {
  en: string;
  ja: string;
}

export const metadataDescriptions: Record<string, FieldDescription> = {
  publisherId: {
    en: 'Unique identifier for the publisher in the OpenSincera system',
    ja: 'OpenSinceraシステム内でのパブリッシャーの一意識別子',
  },
  publisherName: {
    en: 'Display name of the publisher or website',
    ja: 'パブリッシャーまたはウェブサイトの表示名',
  },
  publisherDomain: {
    en: 'Primary domain associated with the publisher',
    ja: 'パブリッシャーに関連付けられたプライマリドメイン',
  },
  status: {
    en: 'Current operational status of the publisher account',
    ja: 'パブリッシャーアカウントの現在の運用ステータス',
  },
  verificationStatus: {
    en: 'Verification level indicating the reliability of publisher information',
    ja: 'パブリッシャー情報の信頼性を示す認証レベル',
  },
  lastUpdated: {
    en: 'Date and time when the publisher information was last modified',
    ja: 'パブリッシャー情報が最後に更新された日時',
  },
  contactEmail: {
    en: 'Email address for contacting the publisher',
    ja: 'パブリッシャーへの連絡用メールアドレス',
  },
  categories: {
    en: 'Content categories or industry verticals associated with the publisher',
    ja: 'パブリッシャーに関連付けられたコンテンツカテゴリまたは業界セクター',
  },
  description: {
    en: "Description or summary of the publisher's content and services",
    ja: 'パブリッシャーのコンテンツとサービスの説明または概要',
  },
  primarySupplyType: {
    en: 'Primary type of advertising inventory supply (e.g., web, mobile, video)',
    ja: '広告インベントリサプライの主要タイプ（例：ウェブ、モバイル、ビデオ）',
  },
  avgAdsToContentRatio: {
    en: 'Ads to Content Ratio (A2CR) measures the percentage of the viewport that is dedicated to ads versus the percentage dedicated to content. The number shown is the max value found on the publisher.\nA2CR is calculated when a Synthetic User visits a property or streaming channel and measures the total ad-renderable real estate (in pixels) as a percentage of the visible content. Synthetic Users scroll and interact with content to ensure the A2CR reflects the typical user experience.\n\nCampaigns that run on high A2CR properties have significantly worse performance. By overloading the Ad Experience (and increasing A2CRs) publishers annoy users, but will risk being optimized off of a media plan.',
    ja: 'Ads to Content Ratio(A2CR) は、ビューポートのうち、広告に割り当てられている割合とコンテンツに割り当てられている割合の比率です。表示されている数値は、パブリッシャーで検出された最大値です。\nA2CR は、仮想ユーザーがプロパティまたはストリーミングチャンネルを訪問したときに計算され、表示可能な広告の合計面積（ピクセル単位）を、表示されているコンテンツの割合として測定します。仮想ユーザーは、A2CR が一般的なユーザーエクスペリエンスを確実に反映するように、コンテンツをスクロールして操作します。\n\nA2CR の高いプロパティで実行されるキャンペーンは、パフォーマンスが大幅に低下します。広告エクスペリエンスに過負荷をかけ（A2CR を増加させる）、パブリッシャーはユーザーに不快感を与えるだけでなく、メディアプランから最適化の対象から外されるリスクも生じます。',
  },
  avgAdsInView: {
    en: 'Ads in View tracks how many ads are "viewable" by the user. This number changes as the user scrolls through a webpage and the ad experience adjusts. Sincera provides initial, average, and maximum values to capture these changes.\nAs the Synthetic User scrolls the content on a URL, it notes how many ad units are in the viewport. Sincera takes this data and creates an average across multiple visits to the publisher.\n\nCrowded ad environments hurt Click, Conversion, and Recall rates. Consumers find them off-putting, and buyers risk their message getting lost.',
    ja: 'Ads in View は、ユーザーによって「表示可能」な広告の数を追跡します。この数は、ユーザーがウェブページをスクロールし、広告の表示が調整されるにつれて変化します。Sincera は、これらの変化を把握するために、初期値、平均値、および最大値を提供します。\n仮想ユーザーは、URL のコンテンツをスクロールしながら、ビューポート内に表示されている広告ユニットの数を記録します。Sincera はこのデータを使用して、パブリッシャーへの複数の訪問の平均値を算出します。\n\n広告が密集した環境は、クリック率、コンバージョン率、リコール率を低下させます。消費者はこれらを不快に感じ、広告主はメッセージが埋もれてしまうリスクがあります。',
  },
  avgAdRefresh: {
    en: "Ad Refresh is the average of time, in seconds, an ad will display on a publisher before refreshing.\nSincera's Synthetic User will wait on a given URL and count the seconds between refresh events - a costly, but highly accurate way of determining ad refresh.\n\nFast ad refresh rates hurt campaign performance and carry reputational risk for publishers. Buyers should avoid running on these ad placements, and publishers should avoid blending fast-refreshing ad placements among overall slower refresh ad units.",
    ja: 'Ad Refreshとは、パブリッシャーで広告がリフレッシュされるまでの平均表示時間（秒）のことです。\nSincera の仮装ユーザーは、指定された URL で待機し、リフレッシュイベント間の秒数をカウントします。これは、コストはかかるものの、広告のリフレッシュを非常に正確に測定できる方法です。\n\nAd Refreshが速すぎると、キャンペーンのパフォーマンスが低下し、パブリッシャーの評判が損なわれるリスクがあります。購入者は、このような広告プレースメントでの掲載は避けるべきであり、パブリッシャーは、リフレッシュの遅い広告ユニット全体に、リフレッシュの速い広告プレースメントを混ぜて使用することは避けるべきです。',
  },
  totalUniqueGpids: {
    en: 'Total number of unique Global Publisher Identifiers (GPIDs) associated with the publisher.\n\nGPIDs provide essential transparency and standardization across the programmatic advertising ecosystem. A higher number of unique GPIDs indicates better inventory organization and clearer supply chain visibility, enabling buyers to make more informed decisions and reducing the risk of fraud or misrepresented inventory.',
    ja: 'パブリッシャーに関連付けられた一意のグローバルパブリッシャー識別子（GPID）の総数。\n\nGPIDは、プログラマティック広告エコシステム全体で不可欠な透明性と標準化を提供します。一意のGPIDの数が多いほど、インベントリの整理が良好で、サプライチェーンの可視性が明確であることを示し、購入者がより情報に基づいた決定を下せるようになり、詐欺や偽装されたインベントリのリスクを軽減できます。',
  },
  idAbsorptionRate: {
    en: 'The Id Absorption Rate, a metric developed by Sincera, measures how effectively SSPs append identifiers to their outgoing bid requests. It focuses on the success rate when an identifier is already present, not the overall enrichment rate. A higher score indicates that a larger proportion of real-time bidding (RTB) traffic includes user identifiers.\n\nHigher ID absorption rates enable more effective audience targeting and attribution while maintaining user privacy standards. This improves campaign performance for advertisers and increases revenue potential for publishers, creating a more efficient and sustainable advertising ecosystem.',
    ja: 'Sinceraが開発した指標である Id Absorption Rate は、SSPが送信する入札リクエストに識別子を付加する効果を測定します。この指標は、識別子が既に存在する場合の成功率に焦点を当てており、全体の識別子付加率ではありません。スコアが高いほど、リアルタイム入札（RTB）トラフィックにユーザー識別子が含まれる割合が高くなります。\n\nId Absorption Rateが高いほど、ユーザーのプライバシー基準を維持しながら、より効果的なオーディエンスターゲティングと属性分析が可能になります。これにより広告主のキャンペーンパフォーマンスが向上し、パブリッシャーの収益ポテンシャルが増加し、より効率的で持続可能な広告エコシステムが構築されます。',
  },
  avgPageWeight: {
    en: 'The average file size in MB for a given URL, which is a signal that inversely correlates with ad performance.\n\nHeavy page weights slow down loading times and degrade user experience, leading to higher bounce rates and lower ad viewability. Publishers with optimized page weights create better user experiences, improve ad performance, and contribute to a more sustainable and user-friendly web ecosystem.',
    ja: 'コンテンツ、画像、広告を含むページの平均総サイズ（KB または MB）。これは、広告パフォーマンスと逆相関する指標です。\n\nページが重いと読み込み時間が遅くなり、ユーザーエクスペリエンスが低下し、直帰率の増加と広告視認性の低下を招きます。最適化されたページウェイトを持つパブリッシャーは、より良いユーザーエクスペリエンスを提供し、広告パフォーマンスを向上させ、より持続可能でユーザーフレンドリーなウェブエコシステムに貢献します。',
  },
  avgCpu: {
    en: 'The average CPU usage for a given URL, which is a signal that inversely correlates with ad performance. CPU usage is measured in seconds.\n\nHigh CPU usage indicates resource-intensive pages that can slow down devices and drain battery life, particularly on mobile devices. Lower CPU usage ensures better user experience, improved ad performance, and supports accessibility across different device capabilities and internet speeds.',
    ja: 'ページレンダリングのための平均CPU使用率または処理要件。これは、広告パフォーマンスと逆相関する指標です。CPU使用率は秒単位で測定されます。\n\n高いCPU使用率は、デバイスの動作を遅くし、特にモバイルデバイスでバッテリー寿命を短縮する可能性があるリソース集約的なページを示します。低いCPU使用率により、より良いユーザーエクスペリエンス、向上した広告パフォーマンスが保証され、異なるデバイス性能とインターネット速度にわたるアクセシビリティがサポートされます。',
  },
  totalSupplyPaths: {
    en: "The total number of supply paths an ad takes from the advertiser to the publisher's website or app where it is displayed. It includes the series of intermediaries involved in the selling and delivery of the ad inventory, such as ad exchanges, SSPs, and other resellers.\n\nMultiple supply paths can increase costs and reduce transparency in the advertising supply chain. Publishers with fewer, more direct supply paths offer better value for advertisers and clearer attribution, promoting a more efficient and trustworthy programmatic advertising ecosystem.",
    ja: '広告が広告主からパブリッシャーのウェブサイトやアプリに表示されるまでのサプライパスの総数。広告インベントリの販売と配信に関与する一連の中間業者（広告交換、SSP、その他のリセラーなど）を含みます。\n\n複数のサプライパスは、広告サプライチェーンにおけるコストの増加と透明性の低下を招く可能性があります。より少ない、より直接的なサプライパスを持つパブリッシャーは、広告主により良い価値を提供し、より明確な属性分析を可能にし、より効率的で信頼できるプログラマティック広告エコシステムを促進します。',
  },
  resellerCount: {
    en: "Number of resellers or intermediaries involved in the publisher's advertising supply chain.\n\nFewer intermediaries mean lower fees, better transparency, and more revenue flowing to content creators. Publishers with streamlined supply chains offer better value to advertisers and contribute to a more direct, efficient, and sustainable advertising ecosystem that benefits both buyers and sellers.",
    ja: 'パブリッシャーの広告サプライチェーンに関わるリセラーまたは中間業者の数。\n\n中間業者が少ないほど、手数料が低くなり、透明性が向上し、コンテンツクリエイターにより多くの収益が流れます。合理化されたサプライチェーンを持つパブリッシャーは、広告主により良い価値を提供し、買い手と売り手の両方に利益をもたらす、より直接的で効率的かつ持続可能な広告エコシステムに貢献します。',
  },
  slug: {
    en: 'URL-friendly identifier or slug for the publisher.',
    ja: 'パブリッシャーのURL対応識別子またはスラッグ。',
  },
};

export const statusDescriptions: Record<string, FieldDescription> = {
  active: {
    en: 'The publisher account is currently active and operational',
    ja: 'パブリッシャーアカウントは現在アクティブで運用中です',
  },
  inactive: {
    en: 'The publisher account is inactive and not currently operational',
    ja: 'パブリッシャーアカウントは非アクティブで現在運用されていません',
  },
  suspended: {
    en: 'The publisher account has been suspended and requires attention',
    ja: 'パブリッシャーアカウントは停止されており、対応が必要です',
  },
};

export const verificationDescriptions: Record<string, FieldDescription> = {
  verified: {
    en: 'Publisher information has been verified and confirmed as accurate',
    ja: 'パブリッシャー情報は認証済みで正確であることが確認されています',
  },
  pending: {
    en: 'Publisher verification is currently in progress',
    ja: 'パブリッシャーの認証は現在進行中です',
  },
  unverified: {
    en: 'Publisher information has not been verified',
    ja: 'パブリッシャー情報は認証されていません',
  },
};

/**
 * Get formatted description for a metadata field
 */
export function getFieldDescription(fieldName: string, language: 'en' | 'ja' = 'en'): string {
  const description = metadataDescriptions[fieldName];
  if (!description) {
    return '';
  }
  return description[language];
}

/**
 * Get formatted description for a status value
 */
export function getStatusDescription(status: string, language: 'en' | 'ja' = 'en'): string {
  const description = statusDescriptions[status];
  if (!description) {
    return '';
  }
  return description[language];
}

/**
 * Get formatted description for a verification status
 */
export function getVerificationDescription(status: string, language: 'en' | 'ja' = 'en'): string {
  const description = verificationDescriptions[status];
  if (!description) {
    return '';
  }
  return description[language];
}

/**
 * Format publisher metadata with descriptions
 */
export function formatPublisherWithDescriptions(
  publisher: any,
  language: 'en' | 'ja' = 'en'
): string {
  const lines: string[] = [];

  lines.push(`# ${publisher.publisherName || 'Unknown Publisher'}`);
  lines.push('');

  // Basic Information
  lines.push('## Basic Information');
  lines.push(`- **Publisher ID**: ${publisher.publisherId}`);
  lines.push(`  ${getFieldDescription('publisherId', language)}`);
  lines.push('');

  lines.push(`- **Domain**: ${publisher.publisherDomain}`);
  lines.push(`  ${getFieldDescription('publisherDomain', language)}`);
  lines.push('');

  lines.push(`- **Status**: ${publisher.status}`);
  lines.push(`  ${getStatusDescription(publisher.status, language)}`);
  lines.push('');

  lines.push(`- **Verification Status**: ${publisher.verificationStatus}`);
  lines.push(`  ${getVerificationDescription(publisher.verificationStatus, language)}`);
  lines.push('');

  if (publisher.contactEmail) {
    lines.push(`- **Contact Email**: ${publisher.contactEmail}`);
    lines.push(`  ${getFieldDescription('contactEmail', language)}`);
    lines.push('');
  }

  if (publisher.categories && publisher.categories.length > 0) {
    lines.push(`- **Categories**: ${publisher.categories.join(', ')}`);
    lines.push(`  ${getFieldDescription('categories', language)}`);
    lines.push('');
  }

  lines.push(`- **Last Updated**: ${publisher.lastUpdated}`);
  lines.push(`  ${getFieldDescription('lastUpdated', language)}`);
  lines.push('');

  // Metadata
  if (publisher.metadata) {
    lines.push('## Performance Metrics');
    lines.push('');

    const metadata = publisher.metadata;

    if (metadata.description) {
      lines.push(`### Description`);
      lines.push(metadata.description);
      lines.push('');
    }

    if (metadata.primarySupplyType) {
      lines.push(`### Primary Supply Type: ${metadata.primarySupplyType}`);
      lines.push(getFieldDescription('primarySupplyType', language));
      lines.push('');
    }

    if (metadata.avgAdsToContentRatio !== undefined) {
      lines.push(`### Ads to Content Ratio: ${metadata.avgAdsToContentRatio}`);
      lines.push(getFieldDescription('avgAdsToContentRatio', language));
      lines.push('');
    }

    if (metadata.avgAdsInView !== undefined) {
      lines.push(`### Ads in View: ${metadata.avgAdsInView}`);
      lines.push(getFieldDescription('avgAdsInView', language));
      lines.push('');
    }

    if (metadata.avgAdRefresh !== undefined) {
      lines.push(`### Ad Refresh Rate: ${metadata.avgAdRefresh} seconds`);
      lines.push(getFieldDescription('avgAdRefresh', language));
      lines.push('');
    }

    if (metadata.totalUniqueGpids !== undefined) {
      lines.push(`### Total Unique GPIDs: ${metadata.totalUniqueGpids}`);
      lines.push(getFieldDescription('totalUniqueGpids', language));
      lines.push('');
    }

    if (metadata.idAbsorptionRate !== undefined) {
      lines.push(`### ID Absorption Rate: ${metadata.idAbsorptionRate}`);
      lines.push(getFieldDescription('idAbsorptionRate', language));
      lines.push('');
    }

    if (metadata.avgPageWeight !== undefined) {
      lines.push(`### Average Page Weight: ${metadata.avgPageWeight} KB`);
      lines.push(getFieldDescription('avgPageWeight', language));
      lines.push('');
    }

    if (metadata.avgCpu !== undefined) {
      lines.push(`### Average CPU Usage: ${metadata.avgCpu} seconds`);
      lines.push(getFieldDescription('avgCpu', language));
      lines.push('');
    }

    if (metadata.totalSupplyPaths !== undefined) {
      lines.push(`### Total Supply Paths: ${metadata.totalSupplyPaths}`);
      lines.push(getFieldDescription('totalSupplyPaths', language));
      lines.push('');
    }

    if (metadata.resellerCount !== undefined) {
      lines.push(`### Reseller Count: ${metadata.resellerCount}`);
      lines.push(getFieldDescription('resellerCount', language));
      lines.push('');
    }
  }

  return lines.join('\n');
}
