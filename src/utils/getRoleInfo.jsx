export const getRoleInfo = (roles) => {
  if (roles?.Admin === 5150) {
    return { label: 'Admin', color: 'red' };
  }
  if (roles?.User === 2001) {
    return { label: 'Pentester', color: 'green' };
  }
  return { label: 'Unknown', color: 'gray' };
};