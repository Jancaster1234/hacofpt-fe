// src/components/Header/menuData.tsx
import { Menu } from "@/types/menu";

const menuData: Menu[] = [
  {
    id: 1,
    title: "Home",
    path: "/",
    newTab: false,
  },
  {
    id: 2,
    title: "Hackathon",
    path: "/hackathon",
    newTab: false,
  },
  {
    id: 3,
    title: "User dashboard",
    path: "/dashboard",
    newTab: false,
  },
  {
    id: 4,
    title: "Chat",
    path: "/chat",
    newTab: false,
  },
  {
    id: 5,
    title: "Forum",
    path: "/forum",
    newTab: false,
  },
  {
    id: 6,
    title: "Help",
    path: "/help",
    newTab: false,
  },
];
export default menuData;
