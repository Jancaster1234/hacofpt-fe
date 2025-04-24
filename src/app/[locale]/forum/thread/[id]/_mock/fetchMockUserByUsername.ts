// src/app/[locale]/forum/thread/[id]/_mock/fetchMockUserByUsername.ts
import { User } from "@/types/entities/user";

export const fetchMockUserByUsername = (
  username: string
): Promise<User | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockUser: User = {
        id: "user1",
        email: "alice@example.com",
        username: "alice123",
        firstName: "Alice",
        lastName: "Johnson",
        avatarUrl: "https://example.com/avatars/alice.png",
        userRoles: [
          {
            id: "ur1",
            role: {
              id: "5",
              name: "TEAM_MEMBER", //TEAM_MEMBER, JUDGE, MENTOR, ADMIN, ORGANIZER
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      resolve(mockUser);
    }, 500);
  });
};
