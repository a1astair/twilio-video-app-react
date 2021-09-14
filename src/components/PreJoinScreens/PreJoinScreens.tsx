import React, { useEffect, useState, FormEvent } from 'react';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { useAppState } from '../../state';
import IntroContainer from '../IntroContainer/IntroContainer';
import DeviceSelectionScreen from './DeviceSelectionScreen/DeviceSelectionScreen';
import RoomNameScreen from './RoomNameScreen/RoomNameScreen';

export enum Steps {
  roomNameStep,
  deviceSelectionStep,
}

export default function PreJoinScreens() {
  const { user } = useAppState();
  const [step, setStep] = useState(Steps.roomNameStep);
  const [name, setName] = useState<string>(user?.displayName || '');
  const [roomName, setRoomName] = useState<string>('');
  const { getAudioAndVideoTracks } = useVideoContext();
  const [mediaError, setMediaError] = useState<Error>();

  useEffect(() => {
    if (step === Steps.deviceSelectionStep && !mediaError) {
      getAudioAndVideoTracks().catch(error => {
        console.log('Error acquiring local media:');
        console.dir(error);
        setMediaError(error);
      });
    }
  }, [getAudioAndVideoTracks, step, mediaError]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // If this app is deployed as a twilio function, don't change the URL because routing isn't supported.
    if (!window.location.origin.includes('twil.io')) {
      window.history.replaceState(null, '', window.encodeURI(`/room/${roomName}${window.location.search || ''}`));
    }
    setStep(Steps.deviceSelectionStep);
  };

  return (
    <IntroContainer>
      {step === Steps.roomNameStep && (
        <RoomNameScreen
          name={name}
          roomName={roomName}
          setName={setName}
          setRoomName={setRoomName}
          handleSubmit={handleSubmit}
        />
      )}

      {step === Steps.deviceSelectionStep && (
        <DeviceSelectionScreen name={name} roomName={roomName} setStep={setStep} />
      )}
    </IntroContainer>
  );
}
