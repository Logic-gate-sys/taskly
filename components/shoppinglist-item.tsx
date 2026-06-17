import { TouchableOpacity, View, Alert, StyleSheet, Text } from 'react-native'
import { theme } from '../theme'
import Entypo from '@expo/vector-icons/Entypo'

type Props = {
  name: string
  isCompleted?: boolean
}

export function ShoppingListItem({ name, isCompleted }: Props) {
  const handleDelete = () => {
    Alert.alert(
      `Are you sure you want to delete ${name}?`,
      'It will be gone for good',
      [
        {
          text: 'Yes',
          onPress: () => console.log('Ok, deleting.'),
          style: 'destructive',
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    )
  }

  return (
    <View style={styles.itemContainer}>
      <Text style={[styles.itemText, isCompleted && styles.completedText]}>
        {name}
      </Text>
      <TouchableOpacity
        onPress={handleDelete}
        style={styles.button}
        activeOpacity={0.7}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Entypo
          name={isCompleted ? 'check' : 'circle-with-cross'}
          size={22}
          color={isCompleted ? theme.colorGrey : theme.colorRed}
        />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  itemContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomColor: theme.colorCerulean,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  itemText: {
    fontSize: 16,
    fontWeight: '400',
    color: theme.colorBlack || '#1a1a1a',
    flex: 1, // Prevents long text from pushing the button off-screen
    marginRight: 16,
  },
  completedText: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    color: theme.colorGrey || '#9ca3af',
  },
  button: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
