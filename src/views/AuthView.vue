<template>
    <div class="auth-container">
        <div>
            <div v-if="isLogin">
                <h1>Log in</h1>
                <form @sumbit.prevent="handleLogin">
                    <div class="form-group">
                        <label for="loin-email">
                            <i class="fa-solid fa-envelope"></i>
                            Email
                        </label>
                        <input type="email" id="login-email" v-model="loginData.email" placeholder="your@email.com" required >

                    </div>
                    <div class="form-group">
                        <label for="loin-password">
                            <i class="fa-solid fa-lock"></i>
                            Email
                        </label>
                        <input type="password" id="login-password" v-model="loginData.password" placeholder="Password" required >
                        
                    </div>

                    <button type="submit" class="btn-primary" :disabled="loading">
                        <span v-if="!loading">Login</span>
                        <span v-else>Loading...</span>
                    </button>
                </form>
                <p @click="isLogin=false">Dont have an account? Register</p>
            </div>

            <div v-else>
                <h1>Register</h1>
                <form @sumbit.prevent="handleRegister">
                    <div class="form-group">
                        <label for="register-email">
                            <i class="fa-solid fa-envelope"></i>
                            Email
                        </label>
                        <input type="email" id="register-email" v-model="registerData.email" placeholder="your@email.com" required >

                    </div>
                    <div class="form-group">
                        <label for="register-password">
                            <i class="fa-solid fa-lock"></i>
                            Password
                        </label>
                        <input type="password" id="register-password" v-model="RegisterData.password" placeholder="Password" required >
                        
                    </div>
                    <div class="form-group">
                        <label for="confirm-password">
                            <i class="fa-solid fa-lock"></i>
                            Confirm password
                        </label>
                        <input type="password" id="confirm-password" v-model="RegisterData.confirmPasswordpassword" placeholder="Password" required >
                        
                    </div>

                    <button type="submit" class="btn-primary" :disabled="loading">
                        <span v-if="!loading">Login</span>
                        <span v-else>Loading...</span>
                    </button>
                </form>
                <p @click="isLogin=true">Already have an account? Login</p>
            </div>
        </div>
    </div>


</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';
import { login, register, sendEmailVerificationDB, logout } from '@/services/authentication';

const router = useRouter
const toast = useToast

const isLogin = ref(true)
const loading = ref(false)

const loginData = ref({
    email: '',
    password: ''
})

const registerData = ref({
    email: '',
    password: '',
    confirmPassword: ''
})

const handleLogin = async () => {
    loading.value = true

    try{
        const result = await login(loginData.value.email, loginData.value.password)

        if (!result.ok){
            toast.error("Error logging in")
            return
        }

        if (!result.user.user.emailVerified) {
            toast.error("Email should be verified before logging in")
            await logout()
            return
        }

        toast.success("Logged in successfully")
        router.push("/favorites")
    } catch(error){
        console.error(error)
        toast.error(error.message || "Error logging in check credentials and try again")
    } finally {
        loading.value = false
    }
}


const handleRegister = async () => {
    if (registerData.value.password !== registerData.value.confirmPassword) {
        toast.error("Passwords are not the same")
        
        return
    }

    loading.value = true

    try{
        const result = await register(registerData.value.email, registerData.value.password)


        if (!result.ok){
            toast.error("Error registering user")
            return
        }

        const verificationResult = await sendEmailVerificationDB(result.user.user)

        if (verificationResult.ok) {
        toast.success("User registered successfully")
        toast.info("Email verification sent")
        } else {
            toast.error("Error registering user please try again")
        }



        isLogin.value = true

        registerData.value = {
            email: '',
            password: '',
            confirmPassword: ''
        }
    } catch(error){
        toast.error("Error registering user. Please try again")
        registerData.value = {
            email: '',
            password: '',
            confirmPassword: ''
        }
    } finally {
        loading.value = false
    }
}
</script>

<style>

</style>