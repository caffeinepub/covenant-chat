import { getDeviceId } from './deviceIdentity';

const MESSAGE_SEPARATOR = '|||DEVICE|||';

export interface DecodedMessage {
  deviceId: string;
  text: string;
}

export function encodeMessage(text: string): string {
  const deviceId = getDeviceId();
  return `${deviceId}${MESSAGE_SEPARATOR}${text}`;
}

export function decodeMessage(content: string): DecodedMessage {
  const parts = content.split(MESSAGE_SEPARATOR);
  
  if (parts.length >= 2) {
    const deviceId = parts[0];
    const text = parts.slice(1).join(MESSAGE_SEPARATOR);
    return { deviceId, text };
  }
  
  // Fallback for legacy messages without device ID
  return {
    deviceId: 'unknown',
    text: content
  };
}

export function isOwnMessage(content: string): boolean {
  const decoded = decodeMessage(content);
  return decoded.deviceId === getDeviceId();
}

