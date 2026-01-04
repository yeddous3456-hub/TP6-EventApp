<template>
  <div class="auth-container">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input 
        v-model="email" 
        type="email" 
        placeholder="University Email" 
        required 
      />
      <input 
        v-model="password" 
        type="password" 
        placeholder="Password" 
        required 
      />
      <button type="submit" class="submit-btn">Login</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from '../firebase';

const email = ref('');
const password = ref('');
const errorMessage = ref('');

const login = async () => {
  const auth = getAuth(app);
  try {
    // we use signIn instead of createUser
    await signInWithEmailAndPassword(auth, email.value, password.value);
    alert("You are logged in!");
    errorMessage.value = '';
  } catch (error) {
    console.error(error);
    errorMessage.value = "Login error: " + error.message;
  }
};
</script>

<style scoped>
.auth-container {
  background: white;
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 0 auto;
  animation: slideIn 0.4s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  font-weight: 600;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

input {
  padding: 0.8rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: inherit;
}

input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  transform: translateY(-2px);
}

input::placeholder {
  color: #999;
}

.submit-btn {
  padding: 0.9rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 0.5rem;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.submit-btn:active {
  transform: translateY(0);
}

.error {
  color: #d32f2f;
  background: #ffebee;
  padding: 0.8rem;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  border-left: 4px solid #d32f2f;
}
</style>