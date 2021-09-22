import React from "react";

import useRoomState from "../../hooks/useRoomState/useRoomState";
import Snackbar from "../Snackbar/Snackbar";

export default function ReconnectingNotification() {
  const roomState = useRoomState();

  return (
    <Snackbar
      variant="error"
      headline="Connection Lost:"
      message="Reconnecting to room..."
      open={roomState === "reconnecting"}
    />
  );
}
