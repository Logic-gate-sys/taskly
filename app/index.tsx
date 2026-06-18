import { StyleSheet, TextInput, View, FlatList, Text } from 'react-native'
import { theme } from '../theme'
import { ShoppingListItem } from '../components/shoppinglist-item'
import { useEffect, useState } from 'react'
import { type ShoppingListItemType } from '../types'
import { getFromStorage, setToStorage } from '../utils/device-storage'
const initialList: ShoppingListItemType[] = [
  { id: '1', name: 'Coffee' },
  { id: '2', name: 'Olive Oil', isCompleted: true },
  { id: '3', name: 'Banana' },
]

const storage_key: string = 'list-index-key'
export default function App() {
  const [shoppinglist, setShoppingList] = useState<ShoppingListItemType[]>([])
  const [value, setValue] = useState<string>()
  const orderList = (list: ShoppingListItemType[]) => {
    return list.sort((itm1, itm2) => {
      if (itm1.completedAt && itm2.completedAt) {
        return itm2.completedAt - itm1.completedAt
      } else if (itm1.completedAt && !itm2.completedAt) {
        return 1
      } else if (!itm1.completedAt && itm2.completedAt) {
        return -1
      } else if (!itm1.completedAt && !itm2.completedAt) {
        return itm2.lastUpdated - itm1.lastUpdated
      }

      return 0
    })
  }
  const handleToggleComplete = (id: string) => {
    const newList = shoppinglist.map((itm: ShoppingListItemType, _) => {
      if (itm.id === id) {
        return {
          ...itm,
          isCompleted: itm.isCompleted ? false : true,
          completedAt: itm.completedAt ? undefined : Date.now(),
          lastUpdated: Date.now(),
        }
        // set new list to storage
        setToStorage(storage_key, newList)
      } else {
        return itm
      }
    })
    // set shopping list
    setShoppingList(newList)
  }
  const handleSubmit = () => {
    if (value) {
      const newList: ShoppingListItemType[] = [
        {
          id: new Date().toISOString(),
          name: value.trim(),
          lastUpdated: Date.now(),
        },
        ...shoppinglist,
      ]
      // --- set new value --
      setShoppingList(newList)
      setValue(undefined)
      // set new list to storage
      setToStorage(storage_key, newList)
    }
  }
  const handleDelete = (id: string) => {
  const newList = shoppinglist.filter((itm) => itm.id !== id)
    setShoppingList(newList)
    // set new list to storage
    setToStorage(storage_key, newList)
  }

  useEffect(() => {
    const fetchAll = async () => {
      const jsonDate = await getFromStorage(storage_key)
      if (jsonDate) {
        setShoppingList(jsonDate)
      }
    }
    fetchAll()
  }, [])

  return (
    <FlatList
      ListHeaderComponent={
        <TextInput
          value={value}
          style={styles.textInput}
          onChangeText={setValue}
          placeholder="E.g Coffee"
          onSubmitEditing={handleSubmit}
          returnKeyType="done"
        />
      }
      data={orderList(shoppinglist)}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      stickyHeaderIndices={shoppinglist.length >= 1 ? [0] : []}
      renderItem={({ item }) => (
        <ShoppingListItem
          name={item.name}
          isCompleted={item.isCompleted}
          onDelete={() => handleDelete(item?.id)}
          onToggleComplete={() => handleToggleComplete(item?.id)}
        />
      )}
      ListEmptyComponent={
        <View style={styles.listEmptyContainer}>
          <Text>Your shopping list is empty</Text>
        </View>
      }
    ></FlatList>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // justifyContent: 'center',
  },
  contentContainer: {
    paddingVertical: 12,
  },
  listEmptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 18,
  },
  textInput: {
    backgroundColor: theme.colorWhite,
    borderColor: theme.colorLightGrey,
    borderWidth: 2,
    padding: 12,
    fontSize: 18,
    borderRadius: 50,
    marginHorizontal: 12,
    marginBottom: 12,
  },
})
