import { LocalVideoTrack, RemoteVideoTrack, TwilioError } from 'twilio-video';

declare module 'twilio-video' {
  // These help to create union types between Local and Remote VideoTracks
  interface LocalVideoTrack {
    isSwitchedOff: undefined;
    setPriority: undefined;
  }
}

declare global {
  interface Window {
    visualViewport?: {
      scale: number;
    };
  }

  interface MediaDevices {
    getDisplayMedia(constraints: MediaStreamConstraints): Promise<MediaStream>;
  }

  interface HTMLMediaElement {
    setSinkId?(sinkId: string): Promise<undefined>;
  }

  // Helps create a union type with TwilioError
  interface Error {
    code: undefined;
  }
}

export type Callback = (...args: any[]) => void;

export type ErrorCallback = (error: TwilioError | Error) => void;

export type IVideoTrack = LocalVideoTrack | RemoteVideoTrack;

export type RoomType = 'group' | 'group-small' | 'peer-to-peer' | 'go';

export type RecordingRule = {
  type: 'include' | 'exclude';
  all?: boolean;
  kind?: 'audio' | 'video';
  publisher?: string;
};

export type RecordingRules = RecordingRule[];

//Videopolis types
export interface Room {
  id: string;
  uniqueName: string;
  displayName: string;
  status: string;
  durations: number;
  properties: RoomProperties;
}

export interface RoomProperties {
  created: string;
  modified: string;
  participantCount: number;
}

export interface Participant {
  id: string;
  uniqueName: string;
  displayName: string;
  status: string;
  role: string;
  connected: string;
  disconnected: string;
  properties: object;
  created: string;
  modified: string;
}
