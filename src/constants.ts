export const DB_NAME :string= "THE_CHATTER_BOX";

export const UserRolesEnum = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

type UserRoles = keyof typeof UserRolesEnum; // "ADMIN" | "USER"

export const AvailableUserRoles: UserRoles[] = Object.values(UserRolesEnum);
