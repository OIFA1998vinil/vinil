import React, { lazy, Suspense } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { HOME_PAGE, NOT_FOUND, ADMIN_SIGN_IN, SIGN_IN, ADMIN_LANDING, ADD_SONG } from '../../locations';
import Loading from "../Loading";
import PrivateRoute from "./components/PrivateRoute";
import { ADMIN } from "../../constants/roles";

const HomePage = lazy(() => import("../HomePage"));
const NotFoundPage = lazy(() => import("../NotFoundPage"));
const AdminSignInPage = lazy(() => import("../AdminSignInPage"));
const SignInPage = lazy(() => import("../SignInPage"));
const AdminLandingPage = lazy(() => import("../AdminLandingPage"));
const AddSongPage = lazy(() => import("../AddSongPage"));

export default function ClientRouter() {
  return (
    <Suspense fallback={<Loading />}>
      <Switch>
        <Route exact path={ADMIN_SIGN_IN()} component={AdminSignInPage} />
        <Route exact path={SIGN_IN()} component={SignInPage} />
        <Route exact path={HOME_PAGE()} component={HomePage} />
        <Route exact path={NOT_FOUND()} component={NotFoundPage} />
        <PrivateRoute exact path={ADMIN_LANDING()} component={AdminLandingPage} roles={[ADMIN]} redirect={ADMIN_SIGN_IN()} />
        <PrivateRoute exact path={ADD_SONG()} component={AddSongPage} roles={[ADMIN]} redirect={ADMIN_SIGN_IN()} />
        <Route path="*">
          <Redirect to="/404" />
        </Route>
      </Switch>
    </Suspense>
  );
}