import { createApp } from 'vue'
import { createPinia, storeToRefs } from 'pinia'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import { auth } from '@/firebase/config.js'

import App from './App.vue'
import router from './router'

let app

auth.onAuthStateChanged(() => {
    if (!app) {
        app = createApp(App)

        app.use(createPinia())
        app.use(router)
        app.use(Toast, {
            timeout: 3000,
            closeOnClick: true,
            pauseOnFocusLoss: true,
            pauseOnHover: true,
            draggable: true,
            draggablePercent: 0.6,
            showCloseButtonOnHover: false,
            hideProgressBar: false,
            closeButton: "button",
            icon: true,
            rtl: false
        })

        app.mount('#app')
    }
})
