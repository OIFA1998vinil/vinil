import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ADMIN, USER } from '../../../constants/roles';
import { selectAuth } from '../../../redux/selectors';
import { NOT_FOUND } from '../../../locations';

export default function PrivateRoute(props) {
  const { roles = [ADMIN, USER] } = props;
  const { redirect = NOT_FOUND() } = props;
  const adminAuth = useSelector(selectAuth(ADMIN));
  const userAuth = useSelector(selectAuth(USER));

  if (
    (roles.includes(ADMIN) && adminAuth) ||
    (roles.includes(USER) && userAuth)
  ) {
    return <Route  {...props} />
  } else {
    return <Redirect to={redirect} />
  }
}