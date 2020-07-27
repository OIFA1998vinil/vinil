/**
 * PrivateRoute component module
 * @module client/components/ClientRouter/components/PrivateRoute
 */

import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ADMIN, USER, COLLABORATOR } from '../../../constants/roles';
import { selectAuth } from '../../../redux/selectors';
import { NOT_FOUND } from '../../../locations';

/**
 * Private route component
 * @function PrivateRoute
 * @param {Object} props Component props
 * @param {String[]} props.roles Authorized roles to access page
 * @param {String} props.redirect Location to redirect if the user is not authorized or has not signed in
 * @returns {JSX.Element} PrivateRoute component template
 */
export default function PrivateRoute(props) {
  const { roles = [ADMIN, USER] } = props;
  const { redirect = NOT_FOUND() } = props;
  const adminAuth = useSelector(selectAuth(ADMIN));
  const userAuth = useSelector(selectAuth(USER));
  const collabAuth = useSelector(selectAuth(COLLABORATOR));
  if (
    (roles.includes(ADMIN) && adminAuth) ||
    (roles.includes(USER) && userAuth) ||
    (roles.includes(COLLABORATOR) && collabAuth)
  ) {
    return <Route  {...props} />
  } else {
    return <Redirect to={redirect} />
  }
}