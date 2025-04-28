// src/components/Header/menuData.tsx
import { Menu } from "@/types/menu";

const menuData = (t: any): Menu[] => [
  {
    id: 1,
    title: t("home"),
    path: "/",
    newTab: false,
  },
  {
    id: 2,
    title: t("hackathon"),
    path: "/hackathon",
    newTab: false,
  },
  {
    id: 3,
    title: t("userDashboard"),
    path: "/user-dashboard",
    newTab: false,
  },
  {
    id: 4,
    title: t("chat"),
    path: "/chat",
    newTab: false,
  },
  {
    id: 5,
    title: t("forum"),
    path: "/forum",
    newTab: false,
  },
  {
    id: 6,
    title: t("help"),
    path: "/help",
    newTab: false,
  },
];

export default menuData;
