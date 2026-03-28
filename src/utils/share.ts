export type ShareTarget = "wechat";

export type FallbackActionId = "system-share" | "copy-link" | "show-qrcode";

export interface SharePayload {
  title: string;
  description: string;
  url: string;
  ogImageUrl?: string;
}

export interface FallbackAction {
  id: FallbackActionId;
  label: string;
}

type NavigatorLike = {
  canShare?: (data?: ShareData) => boolean;
};

export function buildShareHref(baseUrl: string, url: string) {
  return `${baseUrl}${encodeURIComponent(url)}`;
}

export function createSharePayload(payload: SharePayload) {
  return payload;
}

export function isFileShareSupported(
  navigatorLike?: NavigatorLike,
  files: File[] = []
) {
  if (!navigatorLike || typeof navigatorLike.canShare !== "function") {
    return false;
  }

  try {
    return navigatorLike.canShare({ files });
  } catch {
    return false;
  }
}

export function getFallbackActions(
  _target: ShareTarget,
  options: { supportsSystemShare: boolean }
) {
  const actions: FallbackAction[] = [];

  if (options.supportsSystemShare) {
    actions.push({ id: "system-share", label: "调用系统分享" });
  }

  actions.push({ id: "copy-link", label: "复制链接" });
  actions.push({ id: "show-qrcode", label: "显示二维码" });
  return actions;
}

export function getShareDialogContent(
  _target: ShareTarget,
  isInWechat: boolean
) {
  if (isInWechat) {
    return {
      title: "分享到微信",
      description:
        "当前页面已经在微信内打开，可以直接使用右上角菜单分享给朋友或朋友圈。",
    };
  }

  return {
    title: "分享到微信",
    description:
      "微信对普通网页没有开放通用直连分享协议。更稳妥的方式是复制链接、扫码打开，或在支持的设备上调用系统分享。",
  };
}

export async function createOgImageFile(
  ogImageUrl: string,
  fileName = "share-card.png",
  fetcher: typeof fetch = fetch
) {
  const response = await fetcher(ogImageUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch OG image: ${response.status}`);
  }

  const blob = await response.blob();
  const type = blob.type || "image/png";
  return new File([blob], fileName, { type });
}
