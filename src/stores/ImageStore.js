
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { db } from '@/firebase/config.js'
import { collection, getDocs } from 'firebase/firestore'

export const usePicStore = defineStore('Pics', () => {
    let pics = ref([])

    let getData = async () => {
        try {
            const response = await axios.get('https://picsum.photos/v2/list?page=1&limit=30')
            const apiPics = response.data.Pics

            const picsCollection = collection(db, 'pics')
            const snapshot = await getDocs(picsCollection)
            const dbPics = snapshot.docs.map(doc => doc.data())

            Pics.value = apiPics.map(apiPics => {
                const dbPics = dbPics.find(db => db.id === apiPics.id)
                return {
                    ...apiPics,
                    completed: dbPics ? dbPics.completed : apiPics.completed,
                    isInDB: !!dbPics
                }
            })

            console.log('Pics with DB status:', Pics.value)
        } catch (error) {
            console.error('Error:', error)
        }
    }

    const count = ref(0)
    const doubleCount = computed(() => count.value * 2)

    function increment() {
        count.value++
    }

    return { count, doubleCount, increment, getData, Pics }
})


