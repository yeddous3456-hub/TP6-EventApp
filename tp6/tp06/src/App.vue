<script setup>
import { ref, onMounted } from 'vue';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from './firebase';


import SingUp from './components/SingUp.vue';
import Login from './components/Login.vue';
import EventList from './components/EventList.vue'; // <--- NOUVEAU

const user = ref(null);
const showLogin = ref(true);

const auth = getAuth(app);

onMounted(() => {
  onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      user.value = currentUser;
    } else {
      user.value = null;
    }
  });
});

const logout = async () => {
  await signOut(auth);
};
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <h1>Vote Application </h1>
    </header>

<!-- user connected     -->
<div v-if="user">
      <div class="dashboard">
        <p>Bienvenue, <strong>{{ user.email }}</strong> !</p>
        <button @click="logout" class="logout-btn">log out</button>
      </div>
      
      <hr>
      
      <!-- <event list -->
      <EventList /> 
    </div>

    <!-- user not connected -->
    <div v-else class="auth-wrapper">
      <Login v-if="showLogin" />
      <SingUp v-else />

      <p class="switch-auth">
        <span v-if="showLogin">
          Pas encore de compte ? 
          <a @click="showLogin = false" href="#">Sign up</a>
        </span>
        <span v-else>
          already have an account ? 
          <a @click="showLogin = true" href="#">Log in</a>
        </span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  margin-bottom: 2rem;
}

h1 {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dashboard {
  background: white;
  border-radius: 12px;
  padding: 1.5rem 2rem;
  margin: 0 auto 2rem;
  max-width: 1280px;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard p {
  margin: 0;
  color: #333;
  font-size: 1.1rem;
}

.dashboard strong {
  color: #667eea;
  font-weight: 600;
}

.logout-btn {
  padding: 0.7rem 1.5rem;
  background: linear-gradient(135deg, #f44336 0%, #e91e63 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.logout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(244, 67, 54, 0.4);
}

.logout-btn:active {
  transform: translateY(0);
}

hr {
  border: none;
  height: 2px;
  background: linear-gradient(90deg, transparent, #ddd, transparent);
  margin: 1.5rem auto;
  max-width: 1280px;
  width: 100%;
}

.auth-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 2rem 1rem;
}

.switch-auth {
  text-align: center;
  color: white;
  margin-top: 2rem;
  font-size: 1rem;
}

.switch-auth a {
  color: #4caf50;
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.switch-auth a:hover {
  color: #81c784;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .app-header {
    padding: 1.5rem 1rem;
  }

  h1 {
    font-size: 1.8rem;
  }

  .dashboard {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .dashboard p {
    font-size: 1rem;
  }

  .logout-btn {
    width: 100%;
  }

  .switch-auth {
    font-size: 0.9rem;
  }
}
</style>