import type { Props } from "astro";
import IconMail from "@/assets/icons/IconMail.svg";
import IconGitHub from "@/assets/icons/IconGitHub.svg";
import IconBilibili from "@/assets/icons/IconBilibili.svg";
import IconDeepShape from "@/assets/icons/IconDeepShape.svg";
import IconWechat from "@/assets/icons/IconWechat.svg";
import IconXiaohongshu from "@/assets/icons/IconXiaohongshu.svg";

interface Social {
  name: string;
  href: string;
  linkTitle: string;
  icon: (_props: Props) => Element;
}

interface ShareBase {
  name: string;
  linkTitle: string;
  icon: (_props: Props) => Element;
}

interface ShareUrlLink extends ShareBase {
  type: "url";
  href: string;
}

interface ShareActionLink extends ShareBase {
  type: "action";
  action: "wechat" | "xiaohongshu";
}

export type ShareLink = ShareUrlLink | ShareActionLink;

export const SOCIALS: Social[] = [
  {
    name: "GitHub",
    href: "https://github.com/hx-w",
    linkTitle: "访问我的 GitHub",
    icon: IconGitHub,
  },
  {
    name: "DeepShape",
    href: "https://deepshape.cn",
    linkTitle: "访问 DeepShape",
    icon: IconDeepShape,
  },
  {
    name: "Bilibili",
    href: "https://space.bilibili.com/12301465",
    linkTitle: "访问我的 Bilibili",
    icon: IconBilibili,
  },
  {
    name: "Mail",
    href: "mailto:herixth@163.com",
    linkTitle: "给我发邮件",
    icon: IconMail,
  },
] as const;

export const SHARE_LINKS: ShareLink[] = [
  {
    name: "WeChat",
    type: "action",
    action: "wechat",
    linkTitle: "分享到微信",
    icon: IconWechat,
  },
  {
    name: "Xiaohongshu",
    type: "action",
    action: "xiaohongshu",
    linkTitle: "分享到小红书",
    icon: IconXiaohongshu,
  },
  {
    name: "Mail",
    type: "url",
    href: "mailto:?subject=读一下这篇文章&body=",
    linkTitle: "通过邮件分享这篇文章",
    icon: IconMail,
  },
] as const;
