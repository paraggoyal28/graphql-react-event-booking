import "./App.css";
import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import AuthPage from "./pages/Auth";
import EventsPage from "./pages/Events";
import BookingsPage from "./pages/Bookings";
import MainNavigation from "./components/Navigation/MainNavigation";
import AuthContext from "./context/auth-context";
import React from "react";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      userId: null,
    };
  }

  login = (token, userId, tokenExpirationInHours) => {
    this.setState({ token: token, userId: userId });
  };

  logout = () => {
    this.setState({ token: null, userId: null });
  };

  render() {
    return (
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            token: this.state.token,
            userId: this.state.userId,
            login: this.login,
            logout: this.logout,
          }}
        >
          <MainNavigation />
          <main className="main-content">
            <Routes>
              {this.state.token && (
                <Route
                  path="/"
                  element={<Navigate replace to="/events" />}
                  exact
                />
              )}
              {this.state.token && (
                <Route
                  path="/auth"
                  element={<Navigate replace to="/events" />}
                  exact
                />
              )}
              {!this.state.token && (
                <Route path="/auth" element={<AuthPage />} />
              )}
              <Route path="/events" element={<EventsPage />} />
              {this.state.token && (
                <Route path="/bookings" element={<BookingsPage />} />
              )}
              {!this.state.token && (
                <Route element={<Navigate replace to="/auth" />} />
              )}
            </Routes>
          </main>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  }
}

export default App;
