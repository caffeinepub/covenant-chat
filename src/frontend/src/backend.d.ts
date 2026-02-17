import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Message {
    content: string;
    messageId: bigint;
    timestamp: Time;
}
export type Time = bigint;
export interface backendInterface {
    addMessage(password: string, content: string): Promise<Message>;
    clearChat(password: string): Promise<void>;
    getMessages(password: string, sinceMessageId: bigint | null): Promise<Array<Message>>;
    setPassword(oldPassword: string, newPassword: string): Promise<void>;
}
