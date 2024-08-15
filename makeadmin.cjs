const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, deleteDoc } = require('firebase/firestore');
const readline = require('readline');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPp-Rg1RNUwsupUytyiv-jOGXJaEuyF2c",
  authDomain: "dash-80ac3.firebaseapp.com",
  projectId: "dash-80ac3",
  storageBucket: "dash-80ac3.appspot.com",
  messagingSenderId: "891554325290",
  appId: "1:891554325290:web:ee89d73277d4cd7ff33453",
  measurementId: "G-G3MWQR4101"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to prompt user for input
const promptUser = (query) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => rl.question(query, (ans) => {
    rl.close();
    resolve(ans);
  }));
};

// Add or update a user document
const addOrUpdateUser = async (uid, email, isAdmin) => {
  const userDocRef = doc(db, 'users', uid);
  try {
    console.log(`Attempting to add/update user with UID: ${uid}`);
    await setDoc(userDocRef, {
      email,
      isAdmin,
      createdAt: new Date(),
    }, { merge: true });
    console.log(`User with UID: ${uid} has been added/updated.`);
  } catch (error) {
    console.error('Error adding/updating user:', error);
  }
};

// Delete a user document
const deleteUser = async (uid) => {
  const userDocRef = doc(db, 'users', uid);
  try {
    console.log(`Attempting to delete user with UID: ${uid}`);
    await deleteDoc(userDocRef);
    console.log(`User with UID: ${uid} has been deleted.`);
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};

// Main function
const run = async () => {
  try {
    const action = await promptUser('Enter action (add/update/delete): ');
    const uid = await promptUser('Enter user UID: ');

    if (action === 'add' || action === 'update') {
      const email = await promptUser('Enter user email: ');
      const isAdminInput = await promptUser('Is the user an admin? (yes/no): ');
      const isAdmin = isAdminInput.toLowerCase() === 'yes';
      await addOrUpdateUser(uid, email, isAdmin);
    } else if (action === 'delete') {
      await deleteUser(uid);
    } else {
      console.log('Invalid action.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

run();
