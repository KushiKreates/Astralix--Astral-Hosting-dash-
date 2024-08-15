import { auth, db } from './firebase';
import { GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { createPetrodactylUser } from './Petro'; // Import the Petrodactyl API handler

const provider = new GoogleAuthProvider();

const generatePassword = (length = 12) => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:',.<>?/";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

// Function to generate a random numeric username
const generateRandomUsername = (length = 8) => {
  let username = "";
  for (let i = 0; i < length; i++) {
    const randomDigit = Math.floor(Math.random() * 10); // Generate a random digit from 0 to 9
    username += randomDigit;
  }
  return username;
};

// Function to generate a random name from a list of names
const generateRandomName = () => {
  const names = ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace', 'Hannah', 'Ivy', 'Jack'];
  const randomIndex = Math.floor(Math.random() * names.length);
  return names[randomIndex];
};

// Function to generate a random last name from a list of last names
const generateRandomLastName = () => {
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor'];
  const randomIndex = Math.floor(Math.random() * lastNames.length);
  return lastNames[randomIndex];
};

export const signInWithGoogle = async () => {
  const userCredential = await signInWithPopup(auth, provider);
  await createUserDocument(userCredential.user);
  return userCredential;
};

export const signUp = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await createUserDocument(userCredential.user);
  return userCredential;
};

const createUserDocument = async (user) => {
  const userDocRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userDocRef);
  if (!userDoc.exists()) {
    const password = generatePassword(); // Generate a password
    const username = generateRandomUsername(); // Generate a random numeric username
    const firstName = generateRandomName(); // Generate a random first name
    const lastName = generateRandomLastName(); // Generate a random last name
    
    // Step 1: Create the Petrodactyl user
    const petrodactylResponse = await createPetrodactylUser(user.email, username, firstName, lastName, password);
    const petrodactylUserId = petrodactylResponse.attributes.id;

    // Log the response and Petrodactyl ID
    console.log(`Petrodactyl user created with ID: ${petrodactylUserId}`);
    
    // Step 2: Store user data in Firestore
    await setDoc(userDocRef, {
      email: user.email,
      password, // Store the generated password
      isAdmin: false,
      isBan: false,
      createdAt: new Date(),
      isPaid: false, // New field indicating if the user has a paid plan
      slots: 0,     // New field for number of slots
      cpu: 0,       // New field for CPU count
      ram: 0,       // New field for RAM in MB
      db: 0,        // New field for database amount
      port: 0,
      disk: 0,
      etc: 0, 
      coins: 0,     // New field for ports
      Convoy: [],   // Existing field
      Serversinfo: [], // Existing field
      petro: petrodactylUserId // Save Petrodactyl user ID
    });
  }
};

export const logOut = () => {
  return signOut(auth);
};

// Function to add a free server
export const addFreeServer = async (userId) => {
  const userDocRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userDocRef);
  const slots = userDoc.exists() ? userDoc.data().slots || 0 : 0;
  await setDoc(userDocRef, { slots: slots + 1 }, { merge: true });
};

// Function to fetch user document
export const getUserDocument = async (uid) => {
  if (!uid) return null;
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    return { uid, ...userDoc.data() };
  } catch (error) {
    console.error('Error fetching user', error.message);
  }
};
