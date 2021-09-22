import React from "react";
import { shallow } from "enzyme";

import useVideoContext from "../../../../hooks/useVideoContext/useVideoContext";
import AvatarIcon from "../../../../icons/AvatarIcon";
import { IVideoContext } from "../../../VideoProvider";

import LocalVideoPreview from "./LocalVideoPreview";

jest.mock("../../../../hooks/useVideoContext/useVideoContext");
jest.mock("../../../../hooks/useMediaStreamTrack/useMediaStreamTrack");

const mockedVideoContext = useVideoContext as jest.Mock<IVideoContext>;

describe("the LocalVideoPreview component", () => {
  it('it should render a VideoTrack component when there is a "camera" track', () => {
    mockedVideoContext.mockImplementation(() => {
      return {
        localTracks: [
          {
            name: "camera-123456",
            attach: jest.fn(),
            detach: jest.fn(),
            mediaStreamTrack: { getSettings: () => ({}) }
          }
        ]
      } as any;
    });
    const wrapper = shallow(<LocalVideoPreview identity="Test User" />);
    expect(wrapper.find("VideoTrack").exists()).toEqual(true);
  });

  it('should render the AvatarIcon when there are no "camera" tracks', () => {
    mockedVideoContext.mockImplementation(() => {
      return {
        localTracks: [{ name: "microphone", attach: jest.fn(), detach: jest.fn() }]
      } as any;
    });
    const wrapper = shallow(<LocalVideoPreview identity="Test User" />);
    expect(wrapper.find(AvatarIcon).exists()).toEqual(true);
  });
});
