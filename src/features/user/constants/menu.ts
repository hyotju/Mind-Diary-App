import type { MyMenuItem } from "@/features/user/types";

export const CONVENIENCE_MENU_ITEMS: MyMenuItem[] = [
  {
    href: "/my/notifications",
    iconHasBackground: true,
    iconSize: 18,
    iconSrc: "/figma/my/menu/alarm.svg",
    label: "알림 설정",
  },
];

export const SUPPORT_MENU_ITEMS: MyMenuItem[] = [
  {
    iconHasBackground: true,
    iconSize: 19,
    iconSrc: "/figma/my/menu/customer-center.svg",
    label: "고객센터",
  },
  {
    href: "/my/terms",
    iconHasBackground: false,
    iconSize: 31,
    iconSrc: "/figma/my/menu/terms.svg",
    label: "서비스 \n이용 약관",
  },
  {
    iconHasBackground: true,
    iconSize: 17,
    iconSrc: "/figma/my/menu/privacy.svg",
    label: "개인정보 \n처리 방침",
  },
];

export const ACCOUNT_MENU_ITEMS: MyMenuItem[] = [
  {
    action: "logout",
    iconHasBackground: true,
    iconSize: 17,
    iconSrc: "/figma/my/menu/logout.svg",
    label: "로그아웃",
  },
  {
    action: "withdraw",
    iconHasBackground: true,
    iconSize: 17,
    iconSrc: "/figma/my/menu/delete-account.svg",
    label: "회원탈퇴",
  },
];
