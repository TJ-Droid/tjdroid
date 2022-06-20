import { Dimensions } from 'react-native'

const deviceHeight = Dimensions.get('window').height;
// const deviceWidth = Dimensions.get('window').height;

export const ResponsiveSize = (size: number) => {
    if(deviceHeight<568) { return size }
    else if(deviceHeight<667) { return size * 1.17 } 
    else if(deviceHeight<736) { return size * 1.29 }
    else if(deviceHeight<1024) { return size * 1.4 }
    else if(deviceHeight<1920) { return size * 2.0 }
}


