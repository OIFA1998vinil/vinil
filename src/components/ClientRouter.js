import React, { lazy, Suspense } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { HOME_PAGE, NOT_FOUND } from './../locations';
import Loading from "./Loading";

const HomePage = lazy(() => import("./HomePage"));
const NotFoundPage = lazy(() => import("./NotFoundPage"));

export default function ClientRouter() {
  return (
    <Suspense fallback={<Loading />}>
      <Switch>
        <Route exact path={HOME_PAGE()} component={HomePage} />
        <Route exact path={NOT_FOUND()} component={NotFoundPage} />
        <Route path="*">
          <Redirect to="/404" />
        </Route>
      </Switch>
    </Suspense>
  );
}