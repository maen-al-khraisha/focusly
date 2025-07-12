'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

const initialState = {
  tasks: [],
  finishedTasks: [],
  notes: [],
  habits: [
    { id: 1, name: 'Drink 8 glasses of water', days: {} },
    { id: 2, name: 'Exercise for 30 minutes', days: {} },
    { id: 3, name: 'Read for 20 minutes', days: {} },
    { id: 4, name: 'Meditate', days: {} },
  ],
  activeTimers: {},
};

function appReducer(state, action) {
  switch (action.type) {
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, { ...action.payload, id: Date.now() }],
      };
    
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? { ...task, ...action.payload.updates } : task
        ),
      };
    
    case 'FINISH_TASK':
    {
      const taskToFinish = state.tasks.find(task => task.id === action.payload);
      if (!taskToFinish) return state;
      
      // Stop timer if it's running
      const startTime = state.activeTimers[action.payload];
      const elapsedTime = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
      const finishedTask = {
        ...taskToFinish,
        totalTime: (taskToFinish.totalTime || 0) + elapsedTime,
        finishedAt: new Date().toISOString(),
      };
      
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
        finishedTasks: [...state.finishedTasks, finishedTask],
        activeTimers: {
          ...state.activeTimers,
          [action.payload]: undefined,
        },
      };
    }
    
    case 'DELETE_FINISHED_TASK':
      return {
        ...state,
        finishedTasks: state.finishedTasks.filter(task => task.id !== action.payload),
      };
    
    case 'START_TIMER':
      return {
        ...state,
        activeTimers: {
          ...state.activeTimers,
          [action.payload]: Date.now(),
        },
      };
    
    case 'STOP_TIMER':
    {
      const timerStartTime = state.activeTimers[action.payload];
      const elapsedTime = timerStartTime ? Math.floor((Date.now() - timerStartTime) / 1000) : 0;
      return {
        ...state,
        activeTimers: {
          ...state.activeTimers,
          [action.payload]: undefined,
        },
        tasks: state.tasks.map(task =>
          task.id === action.payload
            ? { ...task, totalTime: (task.totalTime || 0) + elapsedTime }
            : task
        ),
      };
    }
    
    case 'ADD_NOTE':
      return {
        ...state,
        notes: [...state.notes, { ...action.payload, id: Date.now() }],
      };
    
    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map(note =>
          note.id === action.payload.id ? { ...note, ...action.payload.updates } : note
        ),
      };
    
    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.filter(note => note.id !== action.payload),
      };
    
    case 'TOGGLE_HABIT':
      return {
        ...state,
        habits: state.habits.map(habit =>
          habit.id === action.payload.habitId
            ? {
                ...habit,
                days: {
                  ...habit.days,
                  [action.payload.day]: !habit.days[action.payload.day],
                },
              }
            : habit
        ),
      };
    
    case 'ADD_HABIT':
      return {
        ...state,
        habits: [...state.habits, { ...action.payload, id: Date.now() }],
      };
    
    case 'DELETE_HABIT':
      return {
        ...state,
        habits: state.habits.filter(habit => habit.id !== action.payload),
      };
    
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('productivityApp');
    if (saved) {
      try {
        const parsedState = JSON.parse(saved);
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      } catch (error) {
        console.error('Failed to load state:', error);
      }
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('productivityApp', JSON.stringify(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}