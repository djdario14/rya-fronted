import React, { createContext, useContext } from 'react';

// Calcula el offset en minutos respecto a UTC (positivo para UTC+, negativo para UTC-)
const timezoneOffset = new Date().getTimezoneOffset() * -1;

export const TimezoneContext = createContext<number>(timezoneOffset);

export const TimezoneProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <TimezoneContext.Provider value={timezoneOffset}>
      {children}
    </TimezoneContext.Provider>
  );
};

export const useTimezoneOffset = () => useContext(TimezoneContext);
