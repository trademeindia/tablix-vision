
// This file re-exports from the modular auth utilities
// to maintain backwards compatibility

export {
  signInWithEmail,
  signUpWithEmail,
  signInDemoAccount,
  signOutUser,
  checkCurrentSession
} from './auth/index';
