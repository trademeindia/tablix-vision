
import { Navigate } from 'react-router-dom';

const IntegrationsPageRedirect = () => {
  return <Navigate to="/settings/integrations" replace />;
};

export default IntegrationsPageRedirect;
