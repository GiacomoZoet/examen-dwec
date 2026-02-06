import {auth} from '../firebase/config.js'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,

} from 'firebase/auth'
import { ref } from 'vue'

// global user variable
const user = ref(null)

// escuchar los cambios de la autenticación: logueado | no logueado
onAuthStateChanged(auth, (userFirebase) => {
  user.value = userFirebase
})

// register user
export const register = async (email, password) => {
  try {
    const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
    return {
      ok: true,
      message: "user created successfully",
      user: userCredentials
    }
  } catch (error) {
    console.error(error)
    return {
      ok: false,
      error: "an error has occurred"
    }
  }
}


export const login = async (email, password) => {
  try {
    const userCredentials = await signInWithEmailAndPassword(auth, email, password)

    return {
      ok: true,
      message: "Logged in",
      user: userCredentials,
    }
  } catch (error) {
    console.error(error)
    return {
      ok: false,
      error: "an error has occurred"
    }
  }
}

export const logout = async () => {
  try{
    await signOut(auth)
    console.log("Logged out")
    return {ok: true}
  } catch (error) {
    console.error(error)
    return {ok: false, error: error.message}
  }
}

export const sendEmailVerificationDB = async (currentUser = null) => {
  try {
    const user = currentUser || auth.currentUser
    if(user.emailVerified) {
      console.log("Email verified")
      return {
        ok: true,
        message: "Email verified",
      }
    }
    await sendEmailVerification(user, {url: window.location.origin + '/dashboard'})
    return {ok: true, message: "Email verification sent"}
  } catch (error){
    console.log(error, "an error has occurred when verifying the email")
  }
}

export const isAuthenticated = () => {
  return user.value !== null
}

// get user if it exists
export const getUser =  () => {
  return user
}

