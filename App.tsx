import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import { theme } from './theme'
import { ShoppingListItem } from './components/shoppinglist-item'

export default function App() {
  return (
    <View style={styles.container}>
          <ShoppingListItem name='Coffee' />
          <ShoppingListItem name='Banana' />
          <ShoppingListItem name='Carrot' />
           <ShoppingListItem name='Tea' />
          
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  }
})
