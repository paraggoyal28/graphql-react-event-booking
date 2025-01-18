import React, { Component } from "react";
import "./Auth.css";

class AuthPage extends Component {
  constructor(props) {
    super(props);
    this.emailRef = React.createRef();
    this.passwordRef = React.createRef();
    this.state = {
      isLogin: true,
    };
  }

  switchModeHandler = () => {
    this.setState((prevState) => {
      return { isLogin: !prevState.isLogin };
    });
  };

  submitHandler = (event) => {
    event.preventDefault();
    const email = this.emailRef.current.value;
    const password = this.passwordRef.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
        query {
          login(email: "${email}", password: "${password}") {
            userId
            token
            tokenExpirationInHours
          }
        }
      `,
    };

    if (!this.state.isLogin) {
      requestBody = {
        query: `
        mutation { 
          createUser (userInput: { email: "${email}", password: "${password}"}) {
            _id
            email
          }
        }
      `,
      };
    }
    // send a request to the backend
    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  render() {
    return (
      <>
        <h1 className="auth-title">
          {this.state.isLogin ? "Login" : "Signup"}
        </h1>
        <form className="auth-form" onSubmit={this.submitHandler}>
          <div className="form-control">
            <label htmlFor="email">E-Mail</label>
            <input type="email" id="email" name="email" ref={this.emailRef} />
          </div>
          <div className="form-control">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              ref={this.passwordRef}
            />
          </div>
          <div className="form-actions">
            <button type="submit">Submit</button>
            <button type="button" onClick={this.switchModeHandler}>
              {this.state.isLogin ? "SignUp" : "Login"}
            </button>
          </div>
        </form>
      </>
    );
  }
}

export default AuthPage;
