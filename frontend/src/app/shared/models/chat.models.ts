export interface ChatMetadataMessage {
  id: number;
  senderId: number;
  receiverId: number;
  message: string;
  timestamp: string;
}

export interface CometChatSession {
  uid: string;
  authToken: string;
  appId: string;
  region: string;
  authKey: string;
}
