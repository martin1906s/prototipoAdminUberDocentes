import React, { createContext, useContext, useReducer } from 'react';

const StoreContext = createContext();

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore debe usarse dentro de StoreProvider');
  }
  return context;
};

// Estado inicial
const initialState = {
  currentRole: 'admin',
  userProfile: {
    id: '1',
    name: 'Administrador',
    email: 'admin@admin.com',
    role: 'admin',
  },
  teachers: [
    {
      id: '1',
      name: 'María García',
      subject: 'Matemáticas',
      rating: 4.8,
      price: 25,
      location: 'Quito',
      experience: '5 años',
      status: 'active'
    },
    {
      id: '2',
      name: 'Carlos López',
      subject: 'Física',
      rating: 4.6,
      price: 30,
      location: 'Guayaquil',
      experience: '3 años',
      status: 'active'
    },
    {
      id: '3',
      name: 'Ana Rodríguez',
      subject: 'Química',
      rating: 4.9,
      price: 28,
      location: 'Cuenca',
      experience: '7 años',
      status: 'active'
    }
  ],
  proposals: [
    {
      id: '1',
      teacherId: '1',
      studentName: 'Juan Pérez',
      subject: 'Matemáticas',
      status: 'aceptada',
      date: '2024-01-15',
      price: 25
    },
    {
      id: '2',
      teacherId: '2',
      studentName: 'María Silva',
      subject: 'Física',
      status: 'pendiente',
      date: '2024-01-16',
      price: 30
    },
    {
      id: '3',
      teacherId: '3',
      studentName: 'Pedro González',
      subject: 'Química',
      status: 'rechazada',
      date: '2024-01-17',
      price: 28
    }
  ]
};

// Reducer
const storeReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ROLE':
      return {
        ...state,
        currentRole: action.payload
      };
    case 'SET_USER_PROFILE':
      return {
        ...state,
        userProfile: action.payload
      };
    case 'ADD_TEACHER':
      return {
        ...state,
        teachers: [...state.teachers, action.payload]
      };
    case 'UPDATE_TEACHER':
      return {
        ...state,
        teachers: state.teachers.map(teacher =>
          teacher.id === action.payload.id ? action.payload : teacher
        )
      };
    case 'DELETE_TEACHER':
      return {
        ...state,
        teachers: state.teachers.filter(teacher => teacher.id !== action.payload)
      };
    case 'ADD_PROPOSAL':
      return {
        ...state,
        proposals: [...state.proposals, action.payload]
      };
    case 'UPDATE_PROPOSAL':
      return {
        ...state,
        proposals: state.proposals.map(proposal =>
          proposal.id === action.payload.id ? action.payload : proposal
        )
      };
    case 'DELETE_PROPOSAL':
      return {
        ...state,
        proposals: state.proposals.filter(proposal => proposal.id !== action.payload)
      };
    case 'CLEAR_TEACHER_DATA':
      return {
        ...state,
        teachers: [],
        proposals: []
      };
    default:
      return state;
  }
};

// Acciones
const actions = {
  setRole: (role) => ({ type: 'SET_ROLE', payload: role }),
  setUserProfile: (profile) => ({ type: 'SET_USER_PROFILE', payload: profile }),
  addTeacher: (teacher) => ({ type: 'ADD_TEACHER', payload: teacher }),
  updateTeacher: (teacher) => ({ type: 'UPDATE_TEACHER', payload: teacher }),
  deleteTeacher: (teacherId) => ({ type: 'DELETE_TEACHER', payload: teacherId }),
  addProposal: (proposal) => ({ type: 'ADD_PROPOSAL', payload: proposal }),
  updateProposal: (proposal) => ({ type: 'UPDATE_PROPOSAL', payload: proposal }),
  deleteProposal: (proposalId) => ({ type: 'DELETE_PROPOSAL', payload: proposalId }),
  clearTeacherData: () => ({ type: 'CLEAR_TEACHER_DATA' })
};

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(storeReducer, initialState);

  const dispatchAction = (action) => {
    dispatch(action);
  };

  const value = {
    state,
    actions: {
      setRole: (role) => dispatchAction(actions.setRole(role)),
      setUserProfile: (profile) => dispatchAction(actions.setUserProfile(profile)),
      addTeacher: (teacher) => dispatchAction(actions.addTeacher(teacher)),
      updateTeacher: (teacher) => dispatchAction(actions.updateTeacher(teacher)),
      deleteTeacher: (teacherId) => dispatchAction(actions.deleteTeacher(teacherId)),
      addProposal: (proposal) => dispatchAction(actions.addProposal(proposal)),
      updateProposal: (proposal) => dispatchAction(actions.updateProposal(proposal)),
      deleteProposal: (proposalId) => dispatchAction(actions.deleteProposal(proposalId)),
      clearTeacherData: () => dispatchAction(actions.clearTeacherData())
    }
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};
