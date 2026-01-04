<template>
  <div class="event-container">
    <h2>Upcoming Events</h2>
    <div v-if="loading">Loading events...</div>
    <div v-else-if="events.length === 0">No events found.</div>
    
    <div v-else class="event-list">
      <div v-for="event in events" :key="event.id" class="event-card">
        <h3>{{ event.title }}</h3>
        <p>{{ event.description }}</p>
        <p class="date">Date : {{ event.date }}</p>
        
        <div class="vote-section">
          <!-- BOUTON YES -->
          <button 
            @click="castVote(event, 'yes')" 
            class="vote-btn yes"
            :disabled="isVoting"
          >
            <span>👌 Yes</span>
            <span class="count">{{ event.yesVotes }}</span>
          </button>

          <!-- BOUTON NO -->
          <button 
            @click="castVote(event, 'no')" 
            class="vote-btn no"
            :disabled="isVoting"
          >
            <span>👎 No</span>
            <span class="count">{{ event.noVotes }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { 
  getFirestore, collection, onSnapshot, 
  doc, updateDoc, increment, addDoc, query, where, getDocs 
} from "firebase/firestore";
import { getAuth } from "firebase/auth"; // To know WHO votes
import { app } from '../firebase';

const db = getFirestore(app);
const auth = getAuth(app);

const events = ref([]);
const loading = ref(true);
const isVoting = ref(false); // To avoid rapid double-click

// 1. Fetching events from Firestore in real-time
onMounted(() => {
  const eventsCollection = collection(db, "Events");
  onSnapshot(eventsCollection, (snapshot) => {
    events.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    loading.value = false;
  });
});

// 2. Voting 
const castVote = async (event, choice) => {
  const user = auth.currentUser;
  if (!user) return alert("you have to log in to vote.");

  isVoting.value = true; // We block the buttons

  try {
    // A. CHECK: Has this user already voted for this event?
    // We look in the 'Votes' collection if a document exists with this userId AND this eventId
    const q = query(
      collection(db, "Votes"), 
      where("userId", "==", user.uid),
      where("eventId", "==", event.id)
    );
    
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // If the search is not empty, it means the user has already voted!
      alert("You have already voted for this event!");
      isVoting.value = false;
      return;
    }

    // B. RECORDING THE VOTE (If not voted yet)
    // 1. We create the proof of the vote in the 'Votes' collection
    await addDoc(collection(db, "Votes"), {
      eventId: event.id,
      userId: user.uid,
      vote: choice,
      email: user.email, // Optional, for information
      createdAt: new Date().toISOString()
    });

    // 2. We update the counter in the event (Atomic incrementation)
    // If choice is 'yes', we increase yesVotes, otherwise noVotes
    const eventRef = doc(db, "Events", event.id);
    const fieldToUpdate = choice === 'yes' ? 'yesVotes' : 'noVotes';

    await updateDoc(eventRef, {
      [fieldToUpdate]: increment(1) // increment(1) is safer than "value + 1"
    });

    alert(`Vote "${choice}" recorded!`);

  } catch (error) {
    console.error("Error during voting:", error);
    alert("An error occurred.");
  } finally {
    isVoting.value = false; // We unlock the buttons
  }
};
</script>

<style scoped>
.event-container {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
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
  color: #333;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.8rem;
  font-weight: 600;
}

.event-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.event-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #f0f2f5 100%);
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.event-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.event-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.2);
  border-color: #667eea;
}

h3 {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 0.8rem;
  font-weight: 600;
}

p {
  color: #666;
  margin-bottom: 0.8rem;
  line-height: 1.5;
  font-size: 0.95rem;
}

.date {
  color: #999;
  font-size: 0.9rem;
  font-style: italic;
  margin-bottom: 1.2rem;
}

.vote-section {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.vote-btn {
  flex: 1;
  padding: 0.9rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
}

.vote-btn.yes {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(139, 195, 74, 0.1) 100%);
  color: #2e7d32;
}

.vote-btn.yes:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(139, 195, 74, 0.2) 100%);
  border-color: #4caf50;
  transform: scale(1.05);
}

.vote-btn.no {
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(229, 57, 53, 0.1) 100%);
  color: #c62828;
}

.vote-btn.no:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.2) 0%, rgba(229, 57, 53, 0.2) 100%);
  border-color: #f44336;
  transform: scale(1.05);
}

.vote-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.vote-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.count {
  font-size: 1.1rem;
  font-weight: 700;
  display: inline-block;
  min-width: 24px;
  text-align: center;
}

.event-container > div:first-of-type {
  text-align: center;
  padding: 2rem;
  color: #999;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .event-list {
    grid-template-columns: 1fr;
  }

  .vote-section {
    flex-direction: column;
  }

  .vote-btn {
    flex-direction: row;
    justify-content: space-between;
  }

  .event-card {
    padding: 1.2rem;
  }

  h3 {
    font-size: 1.1rem;
  }
}
</style>
