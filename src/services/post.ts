// src/services/post.ts
import { mock } from "@/sample";
export const getPost = (id: string = "default"): Promise<any> => {
  return new Promise<any>((resolve) => {
    setTimeout(() => {
      if (typeof window !== "undefined") {
        try {
          const data = localStorage.getItem(`post_${id}`);
          resolve(data ? JSON.parse(data) : mock);
          if (!data) savePost(mock, id);
        } catch {
          resolve(mock);
        }
      }

      return resolve(mock);
    }, 200);
  });
};

export const savePost = (data: any, id: string = "default") => {
  if (typeof window === "undefined") return;

  try {
    const value = data?.content?.trim() ? { ...mock, ...data } : mock;
    localStorage.setItem(`post_${id}`, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};
