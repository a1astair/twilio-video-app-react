import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Typography, makeStyles, TextField, Grid, Button, InputLabel, Theme } from '@material-ui/core';
import { useAppState } from '../../../state';
import { Room } from '../../../types';
import { getRooms, getTwilioToken } from '../RoomListScreen/actions';

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
    maxHeight: '200px',
    overflow: 'scroll',
  },
  room: {
    display: 'flex',
    margin: '5px 5px 0 0',
  },
  joinButton: {
    marginLeft: '10px',
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
  const { getVideopolisToken } = useAppState();
  const [rooms, setRooms] = useState<Room[]>();
  const [videoToken, setVideoToken] = useState<string>('');
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
          setRooms(res.filter((r: Room) => r.status === 'initialized'));
        }
      });
    }
  }, [videoToken]);

  const joinRoom = (room: Room) => {
    if (videoToken && room) {
      setRoomName(room.displayName);
      getTwilioToken(videoToken, room.id, name).then(res => {
        if (res) {
          // Got the token which we can send to twilio for video
        }
      });
    }
  };

  const roomList = () => (
    <>
      <Typography variant="h6" className={classes.gutterBottom}>
        Room List
      </Typography>
      <Grid container justifyContent="flex-start" className={classes.roomGrid}>
        {rooms &&
          rooms.map((room: Room) => (
            <div key={room.id} className={classes.room}>
              <div>
                <strong>Name:</strong> {room.displayName}
              </div>
              &nbsp;&nbsp;
              <div>
                <strong>Status:</strong> {room.status}
              </div>
              <button className={classes.joinButton} onClick={() => joinRoom(room)}>
                Join
              </button>
            </div>
          ))}
      </Grid>
    </>
  );

  const hasUsername = !window.location.search.includes('customIdentity=true') && user?.displayName;

  return (
    <>
      <Typography variant="body1" className={classes.gutterBottom}>
        Enter your name and pick a room you would like to join
      </Typography>
      <form onSubmit={handleSubmit}>
        <div className={classes.inputContainer}>
          {!hasUsername && (
            <div className={classes.textFieldContainer}>
              <InputLabel shrink htmlFor="input-user-name">
                Your Name
              </InputLabel>
              <TextField
                id="input-user-name"
                variant="outlined"
                fullWidth
                size="small"
                value={name}
                onChange={handleNameChange}
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
              onChange={handleRoomNameChange}
            />
          </div>
        </div>
        <Grid container justifyContent="flex-end">
          <Button
            variant="contained"
            type="submit"
            color="primary"
            disabled={!name || !roomName}
            className={classes.continueButton}
          >
            Continue
          </Button>
        </Grid>
      </form>
      {roomList()}
    </>
  );
}
