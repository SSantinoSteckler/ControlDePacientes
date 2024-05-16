import { create } from 'zustand';
import { DraftPatient, Patient } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { devtools, persist } from 'zustand/middleware';

type PatientState = {
  patients: Patient[];
  addPatient: (data: DraftPatient) => void;
  deletePatient: (id: Patient['id']) => void;
  activeId: Patient['id'];
  getPatientById: (id: Patient['id']) => void;
  updatePatient: (data: DraftPatient) => void;
};

const createPatient = (patient: DraftPatient): Patient => {
  return {
    ...patient,
    id: uuidv4(),
  };
};

export const usePatientStore = create<PatientState>(
  devtools(
    persist(
      (set) => ({
        patients: [],
        activeId: '',
        addPatient: (data) => {
          const newPatient = createPatient(data);

          set((state) => ({
            patients: [...state.patients, newPatient],
          }));
        },

        deletePatient: (id) => {
          set((state) => ({
            patients: state.patients.filter((elem) => elem.id !== id),
          }));
        },
        getPatientById: (id) => {
          set(() => ({
            activeId: id,
          }));
        },
        updatePatient: (data) => {
          set((state) => ({
            patients: state.patients.map((elem) =>
              elem.id === state.activeId ? { id: elem.id, ...data } : elem
            ),
            activeId: '',
          }));
        },
      }),
      {
        name: 'patient-storage',
      }
    )
  )
);
