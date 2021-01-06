import React from 'react';
import * as config from './config';
import './css/Header.css';
import Reservation from './Reservation';
import MyMeeting from './MyMeeting';
import Review from './Review';
import { BrowserRouter as Router, Link, Switch, Route } from 'react-router-dom';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.checkToken = this.checkToken.bind(this);
    }

    login() {
        const account = document.querySelector('#loginAccount').value;
        const password = document.querySelector('#loginPassword').value;
        fetch(`${config.SERVER_URL}/login/`, {
            method: "POST",
            body: {
                username: account,
                password: password
            }
        })
            .then(res => {
                console.log(res);
            })
            .catch(e => {
                console.log(e);
            });
    }

    render() {
        return (
            <Router>
                <nav className="navbar navbar-expand-lg navbar-light bg-light p-4 border-bottom shadow-sm">
                    <Link to="/" className="navbar-brand">空間管理系統</Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <Link to="/reservation" className="p-2 text-dark navbar-brand">預約狀況</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/myMeeting" className="p-2 text-dark navbar-brand">我的會議</Link>
                            </li>
                        </ul>
                        <form className="form-inline my-2 my-lg-0">
                            <button className="mx-2 btn btn-outline-primary" data-toggle="modal" data-target="#login" onClick={this.checkToken}>Log in</button>
                            <button className="mx-2 btn btn-primary" data-toggle="modal" data-target="#signup" onClick={this.checkToken}>Sign up</button>
                        </form>
                    </div>
                </nav>

                <div className="modal fade" id="login" tabIndex="-1" aria-labelledby="loginLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="loginLabel">登入</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">

                                <div className="form-group">
                                    <label htmlFor="title">帳號</label>
                                    <input type="text" className="form-control" id="loginAccount" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="detail">密碼</label>
                                    <input type="password" className="form-control" id="loginPassword" />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={this.login}>Submit</button>
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="signup" tabIndex="-1" aria-labelledby="signupLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="signupLabel">註冊</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label htmlFor="title">帳號</label>
                                    <input type="text" className="form-control" id="signupAccount" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">E-mail</label>
                                    <input type="email" className="form-control" id="email" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="detail">密碼</label>
                                    <input type="password" className="form-control" id="signupPassword" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="checkPassword">確認密碼</label>
                                    <input type="password" className="form-control" id="signupCheckPassword" />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary">Submit</button>
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
                <Switch>
                    <Route path="/" exact component={Reservation} />
                    <Route path="/reservation" component={Reservation} />
                    <Route path="/myMeeting" component={MyMeeting} />
                    <Route path="/login" component={Login} />
                    <Route path="/signup" component={Signup} />
                </Switch>
            </Router >
        );
    }
}

export default Header;
