import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Nav } from "react-bootstrap";

const PublicRoute =({children}) => {
  const {token} = useSelector(state => state.user);

  if(token){
    return <Nav to="/" replace/>;

  }
  return children;
}

export default PublicRoute;