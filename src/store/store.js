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
  // Perfil del docente actual
  teacherProfile: null,
  teacherSchedule: null,
  currentTeacher: null,
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
      user: { nombre: 'Juan Pérez', email: 'juan@example.com', telefono: '+593 99 123 4567' },
      mensaje: 'Necesito ayuda con matemáticas para mi examen final',
      estado: 'aceptada',
      date: '2024-01-15',
      price: 25
    },
    {
      id: '2',
      teacherId: '2',
      user: { nombre: 'María Silva', email: 'maria@example.com', telefono: '+593 98 765 4321' },
      mensaje: 'Clases de física para preparar examen de admisión',
      estado: 'pendiente',
      date: '2024-01-16',
      price: 30
    },
    {
      id: '3',
      teacherId: '3',
      user: { nombre: 'Pedro González', email: 'pedro@example.com', telefono: '+593 97 654 3210' },
      mensaje: 'Ayuda con química orgánica para la universidad',
      estado: 'rechazada',
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
    case 'SAVE_TEACHER_PROFILE':
      return {
        ...state,
        teacherProfile: action.payload
      };
    case 'UPDATE_TEACHER_SCHEDULE':
      return {
        ...state,
        teacherSchedule: action.payload
      };
    case 'SET_CURRENT_TEACHER':
      return {
        ...state,
        currentTeacher: action.payload
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
    case 'CREATE_PROPOSAL':
      const newProposal = { id: `p_${Date.now()}`, estado: 'pendiente', ...action.payload };
      return {
        ...state,
        proposals: [newProposal, ...state.proposals]
      };
    case 'UPDATE_PROPOSAL_STATUS':
      const { proposalId, status } = action.payload;
      return {
        ...state,
        proposals: state.proposals.map((p) => (p.id === proposalId ? { ...p, estado: status } : p)),
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
        teacherProfile: null,
        teacherSchedule: null,
        currentTeacher: null,
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
  saveTeacherProfile: (profile) => ({ type: 'SAVE_TEACHER_PROFILE', payload: profile }),
  updateTeacherSchedule: (schedule) => ({ type: 'UPDATE_TEACHER_SCHEDULE', payload: schedule }),
  setCurrentTeacher: (teacher) => ({ type: 'SET_CURRENT_TEACHER', payload: teacher }),
  addTeacher: (teacher) => ({ type: 'ADD_TEACHER', payload: teacher }),
  updateTeacher: (teacher) => ({ type: 'UPDATE_TEACHER', payload: teacher }),
  deleteTeacher: (teacherId) => ({ type: 'DELETE_TEACHER', payload: teacherId }),
  createProposal: (payload) => ({ type: 'CREATE_PROPOSAL', payload }),
  updateProposalStatus: (proposalId, status) => ({ type: 'UPDATE_PROPOSAL_STATUS', payload: { proposalId, status } }),
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
      saveTeacherProfile: (profile) => dispatchAction(actions.saveTeacherProfile(profile)),
      updateTeacherSchedule: (schedule) => dispatchAction(actions.updateTeacherSchedule(schedule)),
      setCurrentTeacher: (teacher) => dispatchAction(actions.setCurrentTeacher(teacher)),
      addTeacher: (teacher) => dispatchAction(actions.addTeacher(teacher)),
      updateTeacher: (teacher) => dispatchAction(actions.updateTeacher(teacher)),
      deleteTeacher: (teacherId) => dispatchAction(actions.deleteTeacher(teacherId)),
      createProposal: (payload) => dispatchAction(actions.createProposal(payload)),
      updateProposalStatus: (proposalId, status) => dispatchAction(actions.updateProposalStatus(proposalId, status)),
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
