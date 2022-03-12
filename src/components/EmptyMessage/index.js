import React from 'react'
import { Text, View } from 'react-native'
import IconSmileTristeSvg from '../../images/svg/IconSmileTristeSvg'

export default function EmptyMessage({title, message}) {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', paddingHorizontal: 20}}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', paddingTop: 30}}>
        <IconSmileTristeSvg/>
        <Text style={{fontSize: 28, color:'#ababab', textAlign: 'center', marginTop: 10, marginBottom: 10}}>{title}</Text>
        <Text style={{fontSize: 22, color:'#ababab', textAlign: 'center', marginBottom: 10, opacity: 0.6}}>{message}</Text>
      </View>
    </View>
  )
}
