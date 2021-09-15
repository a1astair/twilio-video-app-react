import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Typography, makeStyles, TextField, Grid, Button, InputLabel, Theme } from '@material-ui/core';
import { useAppState } from '../../../state';
import { Participant, Room, RoomType } from '../../../types';
import { getRoomDetails, getRooms, getTwilioToken } from '../RoomListScreen/actions';
import ParticipantList from '../../ParticipantList/ParticipantList';

const useStyles = makeStyles((theme: Theme) => ({
  gutterBottom: {
    marginBottom: '1em',
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '1.5em 0 3.5em',
    '& div:not(:last-child)': {
      marginRight: '1em',
    },
    [theme.breakpoints.down('sm')]: {
      margin: '1.5em 0 2em',
    },
  },
  textFieldContainer: {
    width: '100%',
  },
  continueButton: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  roomGrid: {
    maxHeight: '350px',
    overflow: 'scroll',
  },
  room: {
    display: 'flex',
    margin: '5px 5px 0 0',
  },
  joinButton: {
    marginLeft: '10px',
  },
  participantGrid: {
    maxHeight: '200px',
    overflow: 'scroll',
  },
  participant: {
    display: 'flex',
    margin: '5px 5px 0 0',
  },
}));

interface RoomNameScreenProps {
  name: string;
  roomName: string;
  setName: (name: string) => void;
  setRoomName: (roomName: string) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function RoomNameScreen({ name, roomName, setName, setRoomName, handleSubmit }: RoomNameScreenProps) {
  const classes = useStyles();
  const { user } = useAppState();
  const { getVideopolisToken, setTwilioToken } = useAppState();
  const [rooms, setRooms] = useState<Room[]>();
  const [room, setRoom] = useState<Room>();
  const [videoToken, setVideoToken] = useState<string>('');
  const [roomType, setRoomType] = useState<RoomType>();
  const [participant, setParticipant] = useState<Participant>();
  const [participants, setParticipants] = useState<Participant[]>();
  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleRoomNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRoomName(event.target.value);
  };

  //This seems to fire off twice
  useEffect(() => {
    if (!videoToken) {
      getVideopolisToken().then(({ token }) => {
        setVideoToken(token);
      });
    }
  }, [getVideopolisToken, videoToken]);

  useEffect(() => {
    // load all rooms from videopolis
    if (videoToken) {
      getRooms(videoToken).then(res => {
        if (res) {
          setRooms(res);
        }
      });
    }
  }, [videoToken]);

  const setRoomInfo = (room: Room) => {
    if (room) {
      setRoom(room);
      setRoomName(room.displayName);
      //Also get the participant info from the joined room
      getRoomDetails(videoToken, room.id).then(res => {
        if (res?.participants) {
          setParticipants(res.participants);
        }
      });
    }
  };

  const joinRoom = () => {
    if (videoToken && room?.id && participant?.id) {
      getTwilioToken(videoToken, room.id, participant.id).then(res => {
        if (res && res.token) {
          if (res.roomType) {
            setRoomType(res.roomType);
          }
          setTwilioToken(res.token);
          // Got the token which we can send to twilio for video
        }
      });
    }
  };

  const roomList = () => (
    <>
      <Typography variant="h6" className={classes.gutterBottom}>
        Pick a room to join
      </Typography>
      <Grid container justifyContent="flex-start" className={classes.roomGrid}>
        {rooms &&
          rooms.map((room: Room) => (
            <div key={room.id} className={classes.room}>
              <div>
                <strong>ID:</strong> {room.id}
              </div>
              &nbsp;&nbsp;
              <div>
                <strong>Name:</strong> {room.displayName}
              </div>
              &nbsp;&nbsp;
              <div>
                <strong>Status:</strong> {room.status}
              </div>
              <button className={classes.joinButton} onClick={() => setRoomInfo(room)}>
                Join
              </button>
            </div>
          ))}
      </Grid>
    </>
  );

  const participantList = () => (
    <>
      <Grid container justifyContent="flex-start" className={classes.participantGrid}>
        {participants &&
          participants.map((participant: Participant) => (
            <div key={participant.id} className={classes.participant}>
              <div>
                <strong>ID:</strong> {participant.id}
              </div>
              &nbsp;&nbsp;
              <div>
                <strong>Name:</strong> {participant.displayName}
              </div>
              &nbsp;&nbsp;
              <div>
                <strong>Status:</strong> {participant.status}
              </div>
              <button className={classes.joinButton} onClick={() => setParticipant(participant)}>
                Select
              </button>
            </div>
          ))}
      </Grid>
    </>
  );

  const hasUsername = !window.location.search.includes('customIdentity=true') && user?.displayName;

  return (
    <>
      {!room && roomList()}
      {room && (
        <>
          <Typography variant="body1" className={classes.gutterBottom}>
            Pick your participant
          </Typography>
          {participantList()}
          <form onSubmit={handleSubmit}>
            <div className={classes.inputContainer}>
              {!hasUsername && (
                <div className={classes.textFieldContainer}>
                  <InputLabel shrink htmlFor="input-user-name">
                    Participant Name
                  </InputLabel>
                  <TextField
                    id="input-user-name"
                    variant="outlined"
                    disabled={true}
                    fullWidth
                    size="small"
                    value={participant?.displayName}
                  />
                </div>
              )}
              <div className={classes.textFieldContainer}>
                <InputLabel shrink htmlFor="input-room-name">
                  Room Name
                </InputLabel>
                <TextField
                  disabled={true}
                  autoCapitalize="false"
                  id="input-room-name"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={roomName}
                />
              </div>
            </div>
            <Grid container justifyContent="flex-end">
              <Button
                variant="contained"
                type="submit"
                color="primary"
                disabled={!participant?.displayName || !roomName}
                onClick={() => joinRoom()}
                className={classes.continueButton}
              >
                Continue
              </Button>
            </Grid>
          </form>
        </>
      )}
    </>
  );
}
