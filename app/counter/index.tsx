import { Text, View, StyleSheet, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { TouchableOpacity } from 'react-native'
import { registerForPushNotification } from '../../utils/register-for-push'
import { theme } from '../../theme'
import * as Notifications from 'expo-notifications'

export default function CounterScreen() {
  const sendScheduledNotification = async () => {
    const status = await registerForPushNotification()
    console.log(`Permission: ${status}`)
    if (status === 'granted') {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "I'm  a notification from your app",
          body: 'This message will now show up successfully! 🎉', // Added body text
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 10,
        },
      })
      Alert.alert('Notifications Scheduled', 'Wait for 10 seconds...')
    } else {
      Alert.alert(
        'Unable to schedule notification',
        'Enable the notification permission for Expo Go in your settings'
      )
    }
  }
  const router = useRouter()
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={sendScheduledNotification}
        activeOpacity={0.6}
      >
        <Text style={styles.buttonText}>Schedule notification: 10 sec</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
  },
  button: {
    backgroundColor: theme.colorBlack,
    padding: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
})
