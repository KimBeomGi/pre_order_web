import { create } from 'zustand'

interface CounterState {
  count: number;
  incrementOne: () => void;
  incrementNum: (by:number) => void;
  decrementOne: () => void;
  decrementNum: (by:number) => void;
  clearNum: () => void
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  incrementOne: () => set((state) => ({ count: state.count + 1 })),
  incrementNum: (by) => set((state) => ({ count: state.count + by })),
  decrementOne: () => set((state) => ({ count: state.count - 1 })),
  decrementNum: (by) => set((state) => ({ count: state.count - by })),
  clearNum: () => set((state) => ({ count: 0 })),
}));