import {
  Text,
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Dimensions,
  useWindowDimensions,
} from 'react-native'
import { TouchableOpacity } from 'react-native'
import { registerForPushNotification } from '../../utils/register-for-push'
import { theme } from '../../theme'
import * as Notifications from 'expo-notifications'
import { useEffect, useState, useRef } from 'react'
import { isBefore, intervalToDuration } from 'date-fns'
import { TimeSegment } from '../../components/time-segments'
import {
  CountDownStatus,
  PersistedCountdownState,
  countDownStorageKey,
} from '../../types'
import { getFromStorage, setToStorage } from '../../utils/device-storage'
import * as Haptics from 'expo-haptics'
import ConfettiCannon from 'react-native-confetti-cannon'

// 10 sec from now
const frequency = 10 * 1000

export default function CounterScreen() {
  const { width } = useWindowDimensions()
  const confettiRef = useRef<any>(null)
  const [status, setStatus] = useState<CountDownStatus>({
    isOverdue: false,
    distance: {},
  })
  const [isLoading, setIsLoading] = useState(true)
  const [countDownState, setCountDownState] =
    useState<PersistedCountdownState>()
  useEffect(() => {
    const init = async () => {
      const state = await getFromStorage(countDownStorageKey)
      if (state) {
        setCountDownState(state)
      }
    }
    init()
  }, [])

  const lastCompletedAt = countDownState?.completedAtTimestamps[0]
  useEffect(() => {
    const intervalId = setInterval(() => {
      const timestamp = lastCompletedAt
        ? lastCompletedAt + frequency
        : Date.now()
      setIsLoading(false)
      const isOverdue = isBefore(timestamp, Date.now())
      const distance = intervalToDuration(
        isOverdue
          ? { end: Date.now(), start: timestamp }
          : { start: Date.now(), end: timestamp }
      )
      setStatus({ isOverdue, distance })
    }, 1000)

    // clean up
    return () => {
      clearInterval(intervalId)
    }
  }, [lastCompletedAt])

  const schedulePushNotification = async () => {
    let pushNotificationId
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    confettiRef.current.start()
    const status = await registerForPushNotification()
    console.log(`Permission: ${status}`)
    if (status === 'granted') {
      pushNotificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Task is due',
          body: "This is to remind you that your task that you've schedule is due 🎉", // Added body text
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: frequency / 1000,
        },
      })
      Alert.alert('Notifications Scheduled', 'Wait for 10 seconds...')
    } else {
      Alert.alert(
        'Unable to schedule notification',
        'Enable the notification permission for Expo Go in your settings'
      )
    }
    // if alread a notification is scheduele
    if (countDownState?.currentNotificationId) {
      await Notifications.cancelScheduledNotificationAsync(
        countDownState.currentNotificationId
      )
    }
    // create a new notification
    const newCountdownState: PersistedCountdownState = {
      currentNotificationId: pushNotificationId,
      completedAtTimestamps: countDownState
        ? [Date.now(), ...countDownState.completedAtTimestamps]
        : [Date.now()],
    }
    setCountDownState(newCountdownState)
    // persist storage
    await setToStorage(countDownStorageKey, newCountdownState)
  }

  if (isLoading) {
    return <ActivityIndicator style={styles.activityIndicator} />
  }

  return (
    <View
      style={[
        styles.container,
        status.isOverdue ? styles.containerLate : undefined,
      ]}
    >
      {!status.isOverdue ? (
        <Text style={[styles.heading]}>Thing due in</Text>
      ) : (
        <Text style={[styles.heading, styles.whiteText]}>Thing overdue by</Text>
      )}
      <View style={styles.row}>
        {/*----------- Days ----------------*/}
        <TimeSegment
          unit="Days"
          number={status.distance?.days ?? 0}
          textStyle={status.isOverdue ? styles.whiteText : undefined}
        />
        {/*------------- Hours ----------------*/}
        <TimeSegment
          unit="Hours"
          number={status.distance?.hours ?? 0}
          textStyle={status.isOverdue ? styles.whiteText : undefined}
        />
        {/*------------- Minutes ------------------*/}
        <TimeSegment
          unit="Minutes"
          number={status.distance?.minutes ?? 0}
          textStyle={status.isOverdue ? styles.whiteText : undefined}
        />
        {/*------------------ Seconds --------------*/}
        <TimeSegment
          unit="Seconds"
          number={status.distance?.seconds ?? 0}
          textStyle={status.isOverdue ? styles.whiteText : undefined}
        />
      </View>
      <TouchableOpacity
        onPress={schedulePushNotification}
        style={styles.button}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>I've done the thing!</Text>
      </TouchableOpacity>
      <ConfettiCannon
        ref={confettiRef}
        count={50}
        origin={{ x: width / 2, y: -30 }}
        autoStart={false}
        fadeOut={true}
      />
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
  row: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: theme.colorBlack,
  },
  containerLate: {
    backgroundColor: theme.colorRed,
  },
  whiteText: {
    color: theme.colorWhite,
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: theme.colorWhite,
  },
})
