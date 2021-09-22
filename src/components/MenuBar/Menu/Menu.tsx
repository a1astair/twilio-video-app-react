import React, { useRef, useState } from "react";
import { Button, Menu as MenuContainer, MenuItem, styled, Theme, Typography, useMediaQuery } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreIcon from "@material-ui/icons/MoreVert";
import { isSupported } from "@twilio/video-processors";

import useChatContext from "../../../hooks/useChatContext/useChatContext";
import useFlipCameraToggle from "../../../hooks/useFlipCameraToggle/useFlipCameraToggle";
import useIsRecording from "../../../hooks/useIsRecording/useIsRecording";
import useVideoContext from "../../../hooks/useVideoContext/useVideoContext";
import BackgroundIcon from "../../../icons/BackgroundIcon";
import FlipCameraIcon from "../../../icons/FlipCameraIcon";
import InfoIconOutlined from "../../../icons/InfoIconOutlined";
import SettingsIcon from "../../../icons/SettingsIcon";
import StartRecordingIcon from "../../../icons/StartRecordingIcon";
import StopRecordingIcon from "../../../icons/StopRecordingIcon";
import { useAppState } from "../../../state";
import AboutDialog from "../../AboutDialog/AboutDialog";
import DeviceSelectionDialog from "../../DeviceSelectionDialog/DeviceSelectionDialog";

export const IconContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  width: "1.5em",
  marginRight: "0.3em"
});

export default function Menu(props: { buttonClassName?: string }) {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

  const [aboutOpen, setAboutOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { isFetching, roomType } = useAppState();
  const { setIsChatWindowOpen } = useChatContext();
  const isRecording = useIsRecording();
  const { setIsBackgroundSelectionOpen } = useVideoContext();

  const anchorRef = useRef<HTMLButtonElement>(null);
  const { flipCameraDisabled, toggleFacingMode, flipCameraSupported } = useFlipCameraToggle();

  return (
    <>
      <Button
        onClick={() => setMenuOpen(isOpen => !isOpen)}
        ref={anchorRef}
        className={props.buttonClassName}
        data-cy-more-button
      >
        {isMobile ? (
          <MoreIcon />
        ) : (
          <>
            More
            <ExpandMoreIcon />
          </>
        )}
      </Button>
      <MenuContainer
        open={menuOpen}
        onClose={() => setMenuOpen(isOpen => !isOpen)}
        anchorEl={anchorRef.current}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left"
        }}
        transformOrigin={{
          vertical: isMobile ? -55 : "bottom",
          horizontal: "center"
        }}
      >
        {roomType !== "peer-to-peer" && roomType !== "go" && (
          <MenuItem
            disabled={isFetching}
            onClick={() => {
              setMenuOpen(false);
              //This is where update recording rules was called to twilio's server. Will need to hook this up with aceso/videopolis to be able to change the recording rules
            }}
            data-cy-recording-button
          >
            <IconContainer>{isRecording ? <StopRecordingIcon /> : <StartRecordingIcon />}</IconContainer>
            <Typography variant="body1">{isRecording ? "Stop" : "Start"} Recording</Typography>
          </MenuItem>
        )}
        {flipCameraSupported && (
          <MenuItem disabled={flipCameraDisabled} onClick={toggleFacingMode}>
            <IconContainer>
              <FlipCameraIcon />
            </IconContainer>
            <Typography variant="body1">Flip Camera</Typography>
          </MenuItem>
        )}

        <MenuItem onClick={() => setSettingsOpen(true)}>
          <IconContainer>
            <SettingsIcon />
          </IconContainer>
          <Typography variant="body1">Audio and Video Settings</Typography>
        </MenuItem>

        {isSupported && (
          <MenuItem
            onClick={() => {
              setIsBackgroundSelectionOpen(true);
              setIsChatWindowOpen(false);
              setMenuOpen(false);
            }}
          >
            <IconContainer>
              <BackgroundIcon />
            </IconContainer>
            <Typography variant="body1">Backgrounds</Typography>
          </MenuItem>
        )}

        <MenuItem onClick={() => setAboutOpen(true)}>
          <IconContainer>
            <InfoIconOutlined />
          </IconContainer>
          <Typography variant="body1">About</Typography>
        </MenuItem>
      </MenuContainer>
      <AboutDialog
        open={aboutOpen}
        onClose={() => {
          setAboutOpen(false);
          setMenuOpen(false);
        }}
      />
      <DeviceSelectionDialog
        open={settingsOpen}
        onClose={() => {
          setSettingsOpen(false);
          setMenuOpen(false);
        }}
      />
    </>
  );
}
