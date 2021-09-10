import React from 'react';
import IntroContainer from '../IntroContainer/IntroContainer';
import RoomListScreen from './RoomListScreen/RoomListScreen';

export enum Steps {
  roomNameStep,
  deviceSelectionStep,
}

export default function PreJoinScreens() {
  return (
    <IntroContainer>
      <RoomListScreen />
    </IntroContainer>
  );
}
