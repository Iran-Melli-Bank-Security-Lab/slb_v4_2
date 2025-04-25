import * as React from 'react';

export const SessionContext = React.createContext({
  session: {},
  setSession: () => {},
  clearSession: () => {},
  loading: true,
});

export function SessionProvider({ children }) {
  const [session, setSessionState] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  // Load session from localStorage
  React.useEffect(() => {
    const storedSession = localStorage.getItem('session');
    if (storedSession) {
      setSessionState(JSON.parse(storedSession));
    }
    setLoading(false); // loading finished
  }, []);

  const setSession = (newSession) => {
    setSessionState(newSession);
    localStorage.setItem('session', JSON.stringify(newSession));
  };

  const clearSession = () => {
    setSessionState(null);
    localStorage.removeItem('session');
  };

  return (
    <SessionContext.Provider value={{ session, setSession, clearSession, loading }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return React.useContext(SessionContext);
}
