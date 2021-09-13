import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Typography, makeStyles, TextField, Grid, Button, InputLabel, Theme } from '@material-ui/core';
import { useAppState } from '../../../state';
import { Room } from '../../../types';
import { getRooms } from './actions';

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
    maxHeight: '250px',
    overflow: 'scroll',
  },
  room: {
    display: 'flex',
    margin: '5px 5px 0 0',
  },
}));

export default function RoomListScreen() {
  const classes = useStyles();
  const { getVideopolisToken } = useAppState();
  const [rooms, setRooms] = useState<Room[]>();
  const [videoToken, setVideoToken] = useState<string>('');

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
  return (
    <>
      <Typography variant="h5" className={classes.gutterBottom}>
        Room List
      </Typography>
      <Grid container justifyContent="flex-start" className={classes.roomGrid}>
        {rooms &&
          rooms.map(room => (
            <div key={room.id} className={classes.room}>
              <div>
                <strong>Name:</strong> {room.displayName}
              </div>
              &nbsp;&nbsp;
              <div>
                <strong>Status:</strong> {room.status}
              </div>
            </div>
          ))}
      </Grid>
    </>
  );
}
