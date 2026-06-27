import { Navigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext'

const ProtactedRout = ({ children }) => {
  const { token } = useAuth()
  return token ? children : <Navigate to="/admin" />
}

export default ProtactedRout