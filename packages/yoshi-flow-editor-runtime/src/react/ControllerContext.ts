import { createContext } from 'react';

// TODO - props + state + methods of create controller return value
export interface IControllerContext {
  methods: any;
  state: any;
}

export const ControllerContext = createContext<IControllerContext>({
  methods: undefined,
  state: undefined,
});
