import { db } from '../firebase/config.js'
import { collection, doc, setDoc, deleteDoc, getDocs } from 'firebase/firestore'

// Add character to favorites
export const addToFavorites = async (userId, character) => {
  try {
    const favRef = doc(db, 'users', userId, 'favorites', character.id.toString())
    await setDoc(favRef, character)
    return { ok: true }
  } catch (error) {
    return { ok: false, error }
  }
}

// Get all user favorites
export const getUserFavorites = async (userId) => {
  try {
    const favsCollection = collection(db, 'users', userId, 'favorites')
    const snapshot = await getDocs(favsCollection)
    const favorites = snapshot.docs.map(doc => doc.data())
    return { ok: true, favorites }
  } catch (error) {
    return { ok: false, favorites: [] }
  }
}

