import { useEffect } from "react";
import { Room } from "twilio-video";

import { Callback } from "../../../types";

export default function useHandleTrackPublicationFailed(room: Room | null, onError: Callback) {
  useEffect(() => {
    if (room) {
      room.localParticipant.on("trackPublicationFailed", onError);
      return () => {
        room.localParticipant.off("trackPublicationFailed", onError);
      };
    }
  }, [room, onError]);
}
