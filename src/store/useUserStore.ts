import { create } from 'zustand';
import { auth, db } from '../firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateEmail,
  updatePassword,
  sendPasswordResetEmail,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot, collection } from 'firebase/firestore';

export interface UserNotification {
  id: string;
  message: string;
  date: string;
  read: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  businessType: string;
  role: 'user' | 'admin';
  wishlist: string[];
  notifications?: UserNotification[];
  isNew?: boolean;
}

interface UserState {
  user: User | null;
  users: User[];
  isAuthReady: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, name: string, businessType: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (id: string, data: Partial<User>) => Promise<void>;
  updateEmail: (newEmail: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  addUserNotification: (userId: string, message: string) => Promise<void>;
  markNotificationsAsRead: (userId: string) => Promise<void>;
  markAllUsersAsRead: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => {
  // Initialize auth listener
  onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      
      // Listen to user document changes
      onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data() as User;
          
          set({ user: userData, isAuthReady: true });
          
          // If admin, listen to all users
          if (userData.role === 'admin' || firebaseUser.email === 'salmanalsabahi775@gmail.com' || firebaseUser.email === 'admin@alshifa.com') {
            onSnapshot(collection(db, 'users'), (usersSnapshot) => {
              const allUsers = usersSnapshot.docs.map(d => d.data() as User);
              set({ users: allUsers });
            });
          }
        } else {
          // Only auto-create if it's a Google Sign-In (email/password creates the doc during registration)
          const isGoogleSignIn = firebaseUser.providerData.some(p => p.providerId === 'google.com');
          
          if (isGoogleSignIn) {
            const newUser: User = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'مستخدم جديد',
              email: firebaseUser.email || '',
              businessType: 'صيدلية', // Default
              role: (firebaseUser.email === 'salmanalsabahi775@gmail.com' || firebaseUser.email === 'admin@alshifa.com') ? 'admin' : 'user',
              wishlist: [],
              notifications: []
            };
            setDoc(userDocRef, newUser).then(() => {
              set({ user: newUser, isAuthReady: true });
              if (newUser.role === 'admin') {
                 onSnapshot(collection(db, 'users'), (usersSnapshot) => {
                   const allUsers = usersSnapshot.docs.map(d => d.data() as User);
                   set({ users: allUsers });
                 });
              }
            });
          }
        }
      });
    } else {
      set({ user: null, users: [], isAuthReady: true });
    }
  });

  return {
    user: null,
    users: [],
    isAuthReady: false,
    
    loginWithGoogle: async () => {
      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(auth, provider);
      } catch (error) {
        console.error("Error signing in with Google", error);
        throw error;
      }
    },
    
    loginWithEmail: async (email, password) => {
      await signInWithEmailAndPassword(auth, email, password);
    },
    
    registerWithEmail: async (email, password, name, businessType) => {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      const newUser: User = {
        id: firebaseUser.uid,
        name: name,
        email: email,
        businessType: businessType,
        role: (email === 'salmanalsabahi775@gmail.com' || email === 'admin@alshifa.com') ? 'admin' : 'user',
        wishlist: [],
        notifications: [],
        isNew: true
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
    },
    
    logout: async () => {
      try {
        await signOut(auth);
      } catch (error) {
        console.error("Error signing out", error);
      }
    },
    
    updateUser: async (id, data) => {
      try {
        const userRef = doc(db, 'users', id);
        await updateDoc(userRef, data);
      } catch (error) {
        console.error("Error updating user", error);
      }
    },

    updateEmail: async (newEmail) => {
      if (!auth.currentUser) throw new Error('No user logged in');
      try {
        await updateEmail(auth.currentUser, newEmail);
        // Also update the Firestore document
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, { email: newEmail });
      } catch (error) {
        console.error("Error updating email", error);
        throw error;
      }
    },

    updatePassword: async (newPassword) => {
      if (!auth.currentUser) throw new Error('No user logged in');
      try {
        await updatePassword(auth.currentUser, newPassword);
      } catch (error) {
        console.error("Error updating password", error);
        throw error;
      }
    },
    
    forgotPassword: async (email) => {
      try {
        await sendPasswordResetEmail(auth, email);
      } catch (error) {
        console.error("Error sending password reset email", error);
        throw error;
      }
    },
    
    toggleWishlist: async (productId) => {
      const { user } = get();
      if (!user) return;
      
      const userRef = doc(db, 'users', user.id);
      const isWishlisted = user.wishlist?.includes(productId);
      
      try {
        if (isWishlisted) {
          await updateDoc(userRef, {
            wishlist: arrayRemove(productId)
          });
        } else {
          await updateDoc(userRef, {
            wishlist: arrayUnion(productId)
          });
        }
      } catch (error) {
        console.error("Error toggling wishlist", error);
      }
    },
    
    addUserNotification: async (userId, message) => {
      const newNotification: UserNotification = {
        id: `notif-${Date.now()}`,
        message,
        date: new Date().toLocaleDateString('ar-YE'),
        read: false
      };
      
      try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          notifications: arrayUnion(newNotification)
        });
      } catch (error) {
        console.error("Error adding notification", error);
      }
    },
    
    markNotificationsAsRead: async (userId) => {
      const { user } = get();
      if (!user || user.id !== userId || !user.notifications) return;
      
      const updatedNotifications = user.notifications.map(n => ({ ...n, read: true }));
      
      try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          notifications: updatedNotifications
        });
      } catch (error) {
        console.error("Error marking notifications as read", error);
      }
    },

    markAllUsersAsRead: async () => {
      const { users } = get();
      
      // Update local state instantly so notification badge vanishes
      const updatedUsers = users.map(u => ({ ...u, isNew: false }));
      set({ users: updatedUsers });

      for (const user of users) {
        if (user.isNew) {
          await updateDoc(doc(db, 'users', user.id), { isNew: false });
        }
      }
    }
  };
});
