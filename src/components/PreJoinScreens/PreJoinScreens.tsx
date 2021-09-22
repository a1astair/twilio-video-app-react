import React, { useEffect, useState } from "react";

import useVideoContext from "../../hooks/useVideoContext/useVideoContext";
import { useAppState } from "../../state";
import IntroContainer from "../IntroContainer/IntroContainer";

import DeviceSelectionScreen from "./DeviceSelectionScreen/DeviceSelectionScreen";
import MediaErrorSnackbar from "./MediaErrorSnackbar/MediaErrorSnackbar";

export enum Steps {
  roomNameStep,
  deviceSelectionStep
}

export default function PreJoinScreens() {
  const { getAudioAndVideoTracks } = useVideoContext();
  const [step, setStep] = useState(Steps.roomNameStep);

  // Will need to get this from kopernik
  const [roomName] = useState<string>("");

  const [mediaError, setMediaError] = useState<Error>();

  useEffect(() => {
    if (step === Steps.deviceSelectionStep && !mediaError) {
      getAudioAndVideoTracks().catch(error => {
        setMediaError(error);
      });
    }
  }, [getAudioAndVideoTracks, step, mediaError]);

  return (
    <IntroContainer>
      <MediaErrorSnackbar error={mediaError} />
      {step === Steps.deviceSelectionStep && (
        <DeviceSelectionScreen setStep={setStep} />
      )}
    </IntroContainer>
  );
}
