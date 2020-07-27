/**
 * ClientRouter component module
 * @module client/components/ClientRouter
 */

import React, { lazy, Suspense } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { HOME_PAGE, NOT_FOUND, ADMIN_SIGN_IN, SIGN_IN, ADMIN_LANDING, ADD_SONG, ADMIN_SONGS, SIGN_UP, ADMIN_REQUESTS_USERS, ADMIN_USERS, COLLAB_SIGN_IN, ADMIN_ADD_COLLABORATORS, ADMIN_COLLABORATORS, COLLAB_LANDING, COLLAB_ADD_SONG, COLLAB_PENDING_SONGS, ADMIN_PENDING_SONGS } from '../../locations';
import Loading from "../Loading";
import PrivateRoute from "./components/PrivateRoute";
import { ADMIN, USER, COLLABORATOR } from "../../constants/roles";

/**
 * NotFoundPage lazy loader
 * @constant
 * @type {React.LazyExoticComponent<JSX.Element>}
 */
const NotFoundPage = lazy(() => import("../NotFoundPage"));

/**
 * AdminSignInPage lazy loader
 * @constant
 * @type {React.LazyExoticComponent<JSX.Element>}
 */
const AdminSignInPage = lazy(() => import("../AdminSignInPage"));

/**
 * AdminLandingPage lazy loader
 * @constant
 * @type {React.LazyExoticComponent<JSX.Element>}
 */
const AdminLandingPage = lazy(() => import("../AdminLandingPage"));

/**
 * AdminSongsPage lazy loader
 * @constant
 * @type {React.LazyExoticComponent<JSX.Element>}
 */
const AdminSongsPage = lazy(() => import("../AdminSongsPage"));

/**
 * AddSongPage lazy loader
 * @constant
 * @type {React.LazyExoticComponent<JSX.Element>}
 */
const AddSongPage = lazy(() => import("../AddSongPage"));

/**
 * HomePage lazy loader
 * @constant
 * @type {React.LazyExoticComponent<JSX.Element>}
 */
const HomePage = lazy(() => import("../HomePage"));

/**
 * SignInPage lazy loader
 * @constant
 * @type {React.LazyExoticComponent<JSX.Element>}
 */
const SignInPage = lazy(() => import("../SignInPage"));

/**
 * SignUpPage lazy loader
 * @constant
 * @type {React.LazyExoticComponent<JSX.Element>}
 */
const SignUpPage = lazy(() => import("../SignUpPage"));

/**
 * AdminAccessRequestPage lazy loader
 * @constant
 * @type {React.LazyExoticComponent<JSX.Element>}
 */
const AdminAccessRequestPage = lazy(() => import("../AdminAccessRequestPage"));

/**
 * AdminUsers lazy loader
 * @constant
 * @type {React.LazyExoticComponent<JSX.Element>}
 */
const AdminUsers = lazy(() => import("../AdminUsers"));

/**
 * CollabSignInPage lazy loader
 * @constant
 * @type {React.LazyExoticComponent<JSX.Element>}
 */
const CollabSignInPage = lazy(() => import("../CollabSignInPage"));

/**
 * AdminAddCollaborator lazy loader
 * @constant
 * @type {React.LazyExoticComponent<JSX.Element>}
 */
const AdminAddCollaborator = lazy(() => import("../AdminAddCollaborator"));

/**
 * AdminCollaborators lazy loader
 * @constant
 * @type {React.LazyExoticComponent<JSX.Element>}
 */
const AdminCollaborators = lazy(() => import("../AdminCollaborators"));

/**
 * AdminPendingSongs lazy loader
 * @constant
 * @type {React.LazyExoticComponent<JSX.Element>}
 */
const AdminPendingSongs = lazy(() => import("../AdminPendingSongs"));

/**
 * CollabLandingPage lazy loader
 * @constant
 * @type {React.LazyExoticComponent<JSX.Element>}
 */
const CollabLandingPage = lazy(() => import("../CollabLandingPage"));

/**
 * CollabAddSongPage lazy loader
 * @constant
 * @type {React.LazyExoticComponent<JSX.Element>}
 */
const CollabAddSongPage = lazy(() => import("../CollabAddSongPage"));

/**
 * CollabPendingSongs lazy loader
 * @constant
 * @type {React.LazyExoticComponent<JSX.Element>}
 */
const CollabPendingSongs = lazy(() => import("../CollabPendingSongs"));

/**
 * Client router component
 * - Uses React Router DOM as client router, see: [React Router DOM documentation]{@link https://reactrouter.com/web/guides/quick-start}
 * - Uses React Suspense to [lazy load]{@link https://en.wikipedia.org/wiki/Lazy_loading} page components, see: [React Suspense documentation]{@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 * @function ClientRouter
 * @returns {JSX.Element} ClientRouter component template
 */
export default function ClientRouter() {
  return (
    <Suspense fallback={<Loading />}>
      <Switch>
        <Route exact path={NOT_FOUND()} component={NotFoundPage} />
        <Route exact path={ADMIN_SIGN_IN()} component={AdminSignInPage} />
        <Route exact path={SIGN_IN()} component={SignInPage} />
        <Route exact path={SIGN_UP()} component={SignUpPage} />
        <Route exact path={COLLAB_SIGN_IN()} component={CollabSignInPage} />
        <PrivateRoute exact path={HOME_PAGE()} component={HomePage} roles={[USER]} redirect={SIGN_IN()} />
        <PrivateRoute exact path={ADMIN_LANDING()} component={AdminLandingPage} roles={[ADMIN]} redirect={ADMIN_SIGN_IN()} />
        <PrivateRoute exact path={ADMIN_SONGS()} component={AdminSongsPage} roles={[ADMIN]} redirect={ADMIN_SIGN_IN()} />
        <PrivateRoute exact path={ADD_SONG()} component={AddSongPage} roles={[ADMIN]} redirect={ADMIN_SIGN_IN()} />
        <PrivateRoute exact path={ADMIN_REQUESTS_USERS()} component={AdminAccessRequestPage} roles={[ADMIN]} redirect={ADMIN_SIGN_IN()} />
        <PrivateRoute exact path={ADMIN_USERS()} component={AdminUsers} roles={[ADMIN]} redirect={ADMIN_SIGN_IN()} />
        <PrivateRoute exact path={ADMIN_ADD_COLLABORATORS()} component={AdminAddCollaborator} roles={[ADMIN]} redirect={ADMIN_SIGN_IN()} />
        <PrivateRoute exact path={ADMIN_COLLABORATORS()} component={AdminCollaborators} roles={[ADMIN]} redirect={ADMIN_SIGN_IN()} />
        <PrivateRoute exact path={ADMIN_PENDING_SONGS()} component={AdminPendingSongs} roles={[ADMIN]} redirect={ADMIN_SIGN_IN()} />
        <PrivateRoute exact path={COLLAB_LANDING()} component={CollabLandingPage} roles={[COLLABORATOR]} redirect={COLLAB_SIGN_IN()} />
        <PrivateRoute exact path={COLLAB_ADD_SONG()} component={CollabAddSongPage} roles={[COLLABORATOR]} redirect={COLLAB_SIGN_IN()} />
        <PrivateRoute exact path={COLLAB_PENDING_SONGS()} component={CollabPendingSongs} roles={[COLLABORATOR]} redirect={COLLAB_SIGN_IN()} />
        <Route path="*">
          <Redirect to="/404" />
        </Route>
      </Switch>
    </Suspense>
  );
}