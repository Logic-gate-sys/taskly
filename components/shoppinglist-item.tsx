import {
  TouchableOpacity,
  View,
  Alert,
  StyleSheet,
  Text,
  Pressable,
} from 'react-native'
import { theme } from '../theme'
import Entypo from '@expo/vector-icons/Entypo'
import { type ShoppingListItemType } from '../types'
import * as Haptics from 'expo-haptics'

export function ShoppingListItem({
  name,
  isCompleted,
  onDelete,
  onToggleComplete,
}: ShoppingListItemType) {
  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
    Alert.alert(
      `Are you sure you want to delete ${name}?`,
      'It will be gone for good',
      [
        {
          text: 'Yes',
          onPress: () => onDelete(),
          style: 'destructive',
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    )
  }

  return (
    <Pressable
      style={[
        styles.itemContainer,
        isCompleted ? styles.completedContainer : undefined,
      ]}
      onPress={onToggleComplete}
    >
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
    </Pressable>
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
    backgroundColor: theme.colorLightGrey,
  },
  completedContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomColor: theme.colorCerulean,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb', // Slightly darker/muted background for completed items
    opacity: 0.7, // Mutes the entire row slightly,
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
