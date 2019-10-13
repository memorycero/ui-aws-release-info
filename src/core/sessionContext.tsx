
import * as React from 'react';
import { defaultRefreshTimeout } from 'core';

export interface SessionContextProps {
  refreshTimeout: number;
  updateRefreshTimeout: (value: number) => void;
}

export const SessionContext =
  React.createContext <SessionContextProps>({refreshTimeout:defaultRefreshTimeout, updateRefreshTimeout:(value)=>{}});

export const SessionProvider: React.StatelessComponent = props => {
  const [refreshTimeout, setRefreshTimeout] = React.useState<number>(defaultRefreshTimeout);

  return (
    <SessionContext.Provider value={{ refreshTimeout, updateRefreshTimeout: setRefreshTimeout }}>
      {props.children}
    </SessionContext.Provider>
  );
};