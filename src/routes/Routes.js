import React from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import Home from "../components/Home";
import Signup from "../components/Signup";
import Signin from "../components/Signin";
import Activate from "../components/Activate";
import Forgot from "../components/Forgot";
import Reset from "../components/Reset";
import Dashboard from "../components/Dashboard";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <PublicRoute path="/" exact component={Home} />
        <PublicRoute restricted path="/signup" exact component={Signup} />
        <PublicRoute restricted path="/signin" exact component={Signin} />
        <PublicRoute
          restricted
          path="/auth/activate/:token"
          exact
          component={Activate}
        />
        <PublicRoute
          restricted
          path="/auth/password/forgot"
          exact
          component={Forgot}
        />
        <PublicRoute
          restricted
          path="/auth/password/reset/:token"
          exact
          component={Reset}
        />
        <PrivateRoute path="/dashboard" exact component={Dashboard} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
