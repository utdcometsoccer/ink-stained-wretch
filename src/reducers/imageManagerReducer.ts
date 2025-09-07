import type { ManagedImage } from '../types/ManagedImage';

export type ImageManagerState = {
  images: ManagedImage[];
  loading: boolean;
  error: string | null;
};

export type ImageManagerAction =
  | { type: 'SET_IMAGES'; payload: ManagedImage[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'DELETE_IMAGE'; payload: string };

export function imageManagerReducer(state: ImageManagerState, action: ImageManagerAction): ImageManagerState {
  switch (action.type) {
    case 'SET_IMAGES':
      return { ...state, images: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'DELETE_IMAGE':
      return { ...state, images: state.images.filter(img => img.id !== action.payload) };
    default:
      return state;
  }
}
