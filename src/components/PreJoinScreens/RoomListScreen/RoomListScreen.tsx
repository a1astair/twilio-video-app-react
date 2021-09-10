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
}));

export default function RoomListScreen() {
  const classes = useStyles();
  const { getVideopolisToken } = useAppState();
  const [rooms, setRooms] = useState<Room[]>();
  const [videoToken, setVideoToken] = useState<string>('');

  useEffect(() => {
    if (!videoToken) {
      console.log('hi');
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
      <Grid container justifyContent="flex-end">
        {rooms &&
          rooms.map(room => (
            <div>
              <div>room.id</div>
              <div>room.uniqueName</div>
              <div>room.displayName</div>
              <div>room.status</div>
              <div>room.properties.created</div>
              <div>room.properties.participantCount</div>
            </div>
          ))}
      </Grid>
    </>
  );
}
