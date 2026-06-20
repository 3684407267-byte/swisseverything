// GitHub Releases API — 版本检查
import { APP_CONFIG } from '@/constants/config';

interface UpdateInfo {
  version: string;
  body: string;
  url: string;
  publishedAt: string;
}

export async function checkForUpdate(
  currentVersion: string
): Promise<UpdateInfo | null> {
  try {
    const { githubOwner, githubRepo } = APP_CONFIG;

    // 如果未配置 GitHub 仓库，跳过检查
    if (githubOwner === 'YOUR_USERNAME' || !githubOwner) {
      return null;
    }

    const response = await fetch(
      `https://api.github.com/repos/${githubOwner}/${githubRepo}/releases/latest`,
      {
        headers: { Accept: 'application/vnd.github.v3+json' },
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!response.ok) return null;

    const release = await response.json();

    // 去除版本号前缀 'v'
    const latestVersion = (release.tag_name || '').replace(/^v/, '');
    const current = currentVersion.replace(/^v/, '');

    // 比较版本号
    if (compareVersions(latestVersion, current) > 0) {
      return {
        version: latestVersion,
        body: release.body || '',
        url: release.html_url || APP_CONFIG.githubReleaseUrl,
        publishedAt: release.published_at || '',
      };
    }

    return null;
  } catch {
    return null;
  }
}

// 简单的语义化版本比较
function compareVersions(a: string, b: string): number {
  const partsA = a.split('.').map(Number);
  const partsB = b.split('.').map(Number);

  for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
    const numA = partsA[i] || 0;
    const numB = partsB[i] || 0;
    if (numA > numB) return 1;
    if (numA < numB) return -1;
  }
  return 0;
}
