import React from "react";
import Svg, { Path } from "react-native-svg";

type IconTerritoriosProps = {
  iconColor: string;
  width: number;
  height: number;
  widthVB: number;
  heightVB: number;
};

export default function IconTerritorios({ iconColor, width = 87, height = 87, widthVB = 87, heightVB = 87, ...rest }: IconTerritoriosProps) {
  return (
    <Svg
    // xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 512 512"
    {...rest}
  >
    <Path d="M93.3 1.4c-14 3.4-26.6 13.7-32.8 26.8-8 16.9-6.7 43.4 2.9 57.7 1.9 2.8 3.1 5.2 2.8 5.5-.4.2-2.5.9-4.7 1.6-20.1 6.4-38.3 22.7-47.9 43.1-7 14.6-7.1 15.9-7.1 60.4v40l2.8 5.3c5.9 11.2 16 18.5 27.6 19.8l5.8.6-6.9 16.4c-3.8 9.1-6.8 17.8-6.8 19.6 0 3.6 2.2 6.9 5.7 8.7 2.2 1.1 2.2 1.3 2.5 32.7l.3 31.6 2.8 2.4c2.3 2 3.9 2.4 8.8 2.4H55v55.5c0 53.1.1 55.7 2 60.8 2.7 7.3 7.9 13 14.8 16.4 4.7 2.3 7 2.8 13.3 2.8 6.6 0 8.4-.4 13.7-3.2l6.2-3.2 6.2 3.2c5.3 2.8 7.1 3.2 13.7 3.2 5.6 0 8.8-.6 12.2-2.2 6-2.7 12.5-9.2 15.3-15.2 2.1-4.5 2.1-5.7 2.4-61.4l.3-56.7h7c6.5 0 7.3-.2 10-2.9l2.9-2.9v-62.1l2.7-1.3c1.5-.7 3.7-2.8 4.9-4.6 1.2-1.8 4.4-4.7 7-6.5 2.7-1.7 6.3-5.1 8.1-7.5 6.4-8.5 6.4-8.6 6-73.9-.4-66.2 0-63.2-8.3-79.8-5.4-10.9-12.2-19.7-21.1-27-6.8-5.6-18.7-12.3-25.8-14.5-2.2-.7-4.3-1.4-4.7-1.7-.4-.2.6-2.5 2.2-5 5.7-9 7.3-14.7 7.8-28.7.3-8.2 0-15-.8-18.5C147.2 12.4 119.7-5 93.3 1.4zm20.5 20.1c3.4 1 6.9 3.2 10.6 6.6C132 35 134 40.6 134 54.8c0 9.7-.3 11.3-2.8 16.7C122.4 90 99 94.2 84.3 79.8c-6.6-6.4-8.6-12.3-8.7-24.8-.1-11.6 1-16 5.5-22.7 3.5-5.1 7.8-8.2 14.4-10.5 6.2-2.2 11.6-2.2 18.3-.3zm23.5 89.1c17.8 4.6 32.6 16.7 40.3 32.9 6.4 13.5 6.4 13.3 6.4 74 0 53.1-.1 55.1-2 58.2-1.1 1.8-2.6 3.3-3.3 3.3-.7 0-3.7-6.4-7-15.3l-5.7-15.2V176.2l-3.1-2.6c-4.2-3.6-8.9-3.5-13.1.3l-3.3 2.9V254.5l6.3 16c3.4 8.8 6.2 16.3 6.2 16.7 0 .5-23.7.8-52.6.8-49.7 0-52.6-.1-52-1.8.4-.9 2.8-6.8 5.3-13l4.7-11.2H113l3.2-2.9 3.3-2.9v-90.4l-3.3-2.9-3.2-2.9H48.8l-2.9 2.9-2.9 2.9v24.7c0 15 .4 25.4 1 26.6 2.4 4.3 5.7 4.9 27.9 4.9H93l3.2 2.9c4.7 4.1 4.7 10.1 0 14.2L93 242H65.3c-27.6 0-27.6 0-31.8-2.5-7.4-4.3-7.5-4.7-7.5-43.2 0-26.4.4-35.2 1.5-40.1 5.1-21.7 22.8-39.7 44.6-45.6 8.1-2.2 56.8-2.2 65.2 0zm-37.3 81v11.7l-3.7-.7c-2.1-.3-10.4-.6-18.5-.6H63v-22h37v11.6zM155 332v24H57v-48h98v24zm-60 98.6v54.6l-3.4 3.4c-3.7 3.7-7 4.3-11.5 2-1.5-.8-3.2-2.6-3.9-4.1-.9-1.9-1.2-16.8-1.2-56.5v-54h20v54.6zm40 0v54.6l-3.4 3.4c-3.7 3.7-7 4.3-11.5 2-1.5-.8-3.2-2.6-3.9-4.1-.9-1.9-1.2-16.8-1.2-56.5v-54h20v54.6zM339.3 1.4c-14 3.4-26.6 13.7-32.8 26.8-7.7 16.1-7 40.2 1.6 55.5 2.5 4.5 2.7 5.3 1.2 5.3-3.7 0-15.1 3.4-20.7 6.1-13.3 6.6-23.4 16.5-29.6 29.2-7.3 14.9-7.1 12.2-6.8 90.3l.3 69.9 3 5.3c3.4 6.3 7.1 9.7 14.2 12.9 5.3 2.5 13.1 3.2 19.1 1.9l3.2-.8v90.1c0 89.7 0 90 2.2 95.8 2.6 7.2 10.2 15.3 17.2 18.8 10.9 5.3 23.9 4.2 34.6-3 5.3-3.6 5.3-3.6 7.4-1.6 1.2 1.1 4.8 3.2 8.1 4.8 5.1 2.4 7.2 2.8 14.5 2.8 10.6-.1 17.4-3.1 24.4-10.5 9.2-9.8 9.1-9.1 9.4-52.7l.3-38.2 45-.3 45.1-.3 2.9-3.3 2.9-3.2V292.2l-2.6-3.1-2.6-3.1h-51.3l.4-15.5c.4-17.4-.4-20.7-5.2-23.1-3.8-2-8.7-1.1-11.8 2.2-2.2 2.4-2.4 3.5-2.9 16.5-.5 13.3-.6 14-3.1 16.5-2.9 2.8-8 3.5-11.8 1.5-5-2.7-5.1-3.4-5.1-56V179l-2.7-3c-3.7-4-7.8-4.7-12.1-2-1.8 1.1-3.7 3.2-4.2 4.6-.6 1.4-1 16.3-1 35V246h-78v-32c0-36.2-.3-38-6.5-40.6-4.3-1.7-7.6-1.1-11 2.3l-2.5 2.6v48.9c0 52.4-.2 54.2-5 56.8-4.3 2.3-9.2 1.5-12.2-1.9l-2.9-3.2.3-68.2c.3-68.1.3-68.2 2.5-73.7 4.6-11.1 14.2-20.7 25.3-25.3 5.4-2.1 6.6-2.2 48.9-2.5 41.3-.3 43.8-.2 50.2 1.8 7.5 2.2 16.8 8.6 21.2 14.3 1.5 2.1 4.2 6.7 6 10.5 3.1 6.6 3.2 7 3.7 25.5l.5 18.9 3.3 2.9c4.7 4.2 10.3 3.6 14.4-1.5 2.7-3.3 2.6-33.3-.2-44-4.7-18.5-17.1-33.7-34.1-41.9-5.2-2.5-12.3-5.1-15.9-5.8-3.6-.6-6.6-1.3-6.8-1.4-.1-.1.9-2.2 2.3-4.6 4.8-8.4 6.5-16 6.5-29.3 0-18.7-3.7-29.1-14.1-39.6-12-12.2-30.3-17.5-46.6-13.6zm20.5 20.1c3.4 1 6.9 3.2 10.6 6.6C378 35 380 40.6 380 54.8c0 9.7-.3 11.3-2.8 16.7-8.8 18.5-32.2 22.7-46.9 8.3-6.6-6.4-8.6-12.3-8.7-24.8-.1-11.6 1-16 5.5-22.7 3.5-5.1 7.8-8.2 14.4-10.5 6.2-2.2 11.6-2.2 18.3-.3zM390 276v10h-43.2l-2.9 2.9-2.9 2.9V386c0 84.8-.2 94.5-1.6 97.6-4.8 10.1-18.8 11-25.1 1.5l-2.3-3.4V266h78v10zm96 41v11h-52.7l-1.1-2.5c-.6-1.3-2.6-3.1-4.3-4.1-4.4-2.2-10.4-.5-12.7 3.7l-1.7 2.9H361v-22h125v11zm-70.7 34c2.5 4.2 8.2 5.8 12.6 3.6 1.7-1 3.7-2.8 4.3-4.1l1.1-2.5H486v42H361v-42h52.6l1.7 3zM390 445.2c0 38.9-.1 39.7-6.3 44.2-3.9 2.9-12.5 2.9-16.4 0-6.2-4.5-6.3-5.3-6.3-44.2V410h29v35.2z" fill={iconColor}/>
    <Path d="M433.8 208.9c-2.7 2.4-3.3 3.6-3.3 7.1 0 7.2 7.6 12.1 13.8 8.9 9.6-4.9 6.1-18.9-4.7-18.9-1.4 0-4 1.3-5.8 2.9z" fill={iconColor}/>
  </Svg>
  )
}