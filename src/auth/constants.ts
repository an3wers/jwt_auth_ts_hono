export const userRights = {
  USER: "user",
  ADMIN: "admin",
  SUPERADMIN: "superadmin",
  PREMIUM: "premium",
  MARKETING: "marketing",
} as const;

export type UserRights = (typeof userRights)[keyof typeof userRights];
