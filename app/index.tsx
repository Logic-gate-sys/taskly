import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import { theme } from '../theme'
import { ShoppingListItem } from '../components/shoppinglist-item'
import { Link } from 'expo-router'

export default function App() {
  return (
    <View style={styles.container}>
      {/*----- to counter scree -----------*/}
      <Link
        href="/counter"
        style={{ textAlign: 'center', marginBottom: 18, fontSize: 24 }}
      >
        {' '}
        Go to Counter{' '}
      </Link>
      <ShoppingListItem name="Coffee" isCompleted={true} />
      <ShoppingListItem name="Banana" />
      <ShoppingListItem name="Carrot" />
      <ShoppingListItem name="Tea" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
})
