import React from "react";
import { Route, Redirect, useHistory } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
export const getAccessToken = () => Cookies.get("access_token");
export const getUser = async () => await axios.get("/api/auth/user");
export const isAuthenticated = () => {
  if (getAccessToken()) {
    axios.defaults.headers.common.Authorization = "Bearer " + getAccessToken();
    // eslint-disable-next-line no-undef,camelcase
    axios.defaults.headers.common["X-CSRF-TOKEN"] = csrf_token;
  }
  return !!getAccessToken();
};
export const history = () => useHistory();
const redirectToLogin = () => {
  history.push("/");
};
export const authenticate = async () => {
  if (getAccessToken()) {
    try {
      // eslint-disable-next-line no-undef
      const res = await axios.get("/api/auth/user");
      console.log(res);
      return true;
    } catch (error) {
      redirectToLogin();
      return false;
    }
  }

  redirectToLogin();
  return false;
};

export const AuthenticatedRoute = ({
  // eslint-disable-next-line react/prop-types
  component: Component,
  // eslint-disable-next-line react/prop-types
  exact,
  // eslint-disable-next-line react/prop-types
  path
}) => (
  <Route
    exact={exact}
    path={path}
    render={props =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <AuthenticateBeforeRender render={() => <Component {...props} />} />
      )
    }
  />
);
class AuthenticateBeforeRender extends React.Component {
    state = {
      isAuthenticated: false
    }

    componentDidMount () {
      authenticate().then(isAuthenticated => {
        this.setState({ isAuthenticated });
      });
    }

    render () {
      // eslint-disable-next-line react/prop-types
      return this.state.isAuthenticated ? this.props.render() : <Redirect to="/" />;
    }
}
