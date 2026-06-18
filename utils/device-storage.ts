import AsyncStorage from "@react-native-async-storage/async-storage";


export async function getFromStorage(key: string) {
    try {
        const data = await AsyncStorage.getItem(key)
        return data && JSON.parse(data)
    } catch (err) {
        return null
    }
}


export async function setToStorage(key: string, item: object) {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(item))
        console.log("Saved to storage successful")
    } catch (err) {
        return null
    }
}