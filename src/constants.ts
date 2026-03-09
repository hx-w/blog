import type { Props } from "astro";
import IconMail from "@/assets/icons/IconMail.svg";
import IconGitHub from "@/assets/icons/IconGitHub.svg";
import IconBilibili from "@/assets/icons/IconBilibili.svg";
import IconDeepShape from "@/assets/icons/IconDeepShape.svg";
import { SITE } from "@/config";

interface Social {
  name: string;
  href: string;
  linkTitle: string;
  icon: (_props: Props) => Element;
}

export const SOCIALS: Social[] = [
  {
    name: "GitHub",
    href: "https://github.com/hx-w",
    linkTitle: `${SITE.title} 的 GitHub`,
    icon: IconGitHub,
  },
  {
    name: "DeepShape",
    href: "https://deepshape.cn",
    linkTitle: "DeepShape 深形智能",
    icon: IconDeepShape,
  },
  {
    name: "Bilibili",
    href: "https://space.bilibili.com/12301465",
    linkTitle: `${SITE.title} 的 Bilibili`,
    icon: IconBilibili,
  },
  {
    name: "Mail",
    href: "mailto:herixth@163.com",
    linkTitle: `给 ${SITE.title} 发邮件`,
    icon: IconMail,
  },
] as const;
