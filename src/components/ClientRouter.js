import React, { lazy, Suspense } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { HOME_PAGE, NOT_FOUND, ADMIN_SIGN_IN, SIGN_IN } from './../locations';
import Loading from "./Loading";

const HomePage = lazy(() => import("./HomePage"));
const NotFoundPage = lazy(() => import("./NotFoundPage"));
const AdminSignInPage = lazy(() => import("./AdminSignInPage"));
const SignInPage = lazy(() => import("./SignInPage"));

export default function ClientRouter() {
  return (
    <Suspense fallback={<Loading />}>
      <Switch>
        <Route exact path={HOME_PAGE()} component={HomePage} />
        <Route exact path={NOT_FOUND()} component={NotFoundPage} />
        <Route exact path={ADMIN_SIGN_IN()} component={AdminSignInPage} />
        <Route exact path={SIGN_IN()} component={SignInPage} />
        <Route path="*">
          <Redirect to="/404" />
        </Route>
      </Switch>
    </Suspense>
  );
}