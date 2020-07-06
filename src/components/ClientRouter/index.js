import React, { lazy, Suspense } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { HOME_PAGE, NOT_FOUND, ADMIN_SIGN_IN, SIGN_IN, ADMIN_LANDING, ADD_SONG, ADMIN_SONGS, SIGN_UP, ADMIN_REQUESTS_USERS, ADMIN_USERS, COLLAB_SIGN_IN } from '../../locations';
import Loading from "../Loading";
import PrivateRoute from "./components/PrivateRoute";
import { ADMIN, USER } from "../../constants/roles";

const NotFoundPage = lazy(() => import("../NotFoundPage"));
const AdminSignInPage = lazy(() => import("../AdminSignInPage"));
const AdminLandingPage = lazy(() => import("../AdminLandingPage"));
const AdminSongsPage = lazy(() => import("../AdminSongsPage"));
const AddSongPage = lazy(() => import("../AddSongPage"));
const HomePage = lazy(() => import("../HomePage"));
const SignInPage = lazy(() => import("../SignInPage"));
const SignUpPage = lazy(() => import("../SignUpPage"));
const AdminAccessRequestPage = lazy(() => import("../AdminAccessRequestPage"));
const AdminUsers = lazy(() => import("../AdminUsers"));
const CollabSignInPage = lazy(() => import("../CollabSignInPage"));

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
        <Route path="*">
          <Redirect to="/404" />
        </Route>
      </Switch>
    </Suspense>
  );
}