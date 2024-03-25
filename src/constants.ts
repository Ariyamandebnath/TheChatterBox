export const DB_NAME :string= "THE_CHATTER_BOX";

export const UserRolesEnum = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

type UserRoles = keyof typeof UserRolesEnum; // "ADMIN" | "USER"

export const AvailableUserRoles: UserRoles[] = Object.values(UserRolesEnum);

export const UserLoginTypes = {
    GOOGLE: "GOOGLE" as const,
    GITHUB: "GITHUB" as const,
    EMAIL_PASSWORD: "EMAIL_PASSWORD" as const,
} as const;

export const AvailableSocialLogins = Object.values(UserLoginTypes) as string[];

//set of events that we are using in chat app.

enum ChatEventEnum {
  //once user is ready to go
  CONNECTED_EVENT = "connected",
  //when user gets disconnected
  DISCONNECT_EVENT = "disconnect",
  //when user joins socket room
  JOIN_CHAT_EVENT = "joinChat",
  //when participant gets removed from group , chat gets deleted or leaves a group
  LEAVE_CHAT_EVENT = "leaveChat",
  //when admin updated  a group name
  UPDATE_GROUP_NAME_EVENT = "updateGroupName",
  //when new message is received
  MESSAGE_RECEIVED_EVENT = "messageReceived",
  //when there are new one on one chat, new group chat or user gets added in the group
  NEW_CHAT_EVENT = "newChat",
  //whem there is an error in the socket
  SOCKET_ERROR_EVENT = "socketError",
  //when participant stops typing
  STOP_TYPING_EVENT = "stopTyping",
  // when participant starts typing
  TYPING_EVENT = "typing",
}

const AvailableChatEvents: string[] = Object.values(ChatEventEnum);

export { ChatEventEnum, AvailableChatEvents };
