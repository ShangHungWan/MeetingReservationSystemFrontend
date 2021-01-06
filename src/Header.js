import React from 'react';
import * as config from './config';
import { setCookie } from './tool';
import $ from 'jquery';
import './css/Header.css';
import Reservation from './Reservation';
import MyMeeting from './MyMeeting';
import Review from './Review';
import { BrowserRouter as Router, Link, Switch, Route } from 'react-router-dom';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            role: -1
        };
    }

    handelBtn(event) {
        event.preventDefault();
    }

    login() {
        const account = document.querySelector('#loginAccount').value;
        const password = document.querySelector('#loginPassword').value;

        let formData = new FormData();

        formData.append('username', account);
        formData.append('password', password);

        fetch(`${config.SERVER_URL}/login/`, {
            method: "POST",
            body: formData,
            credentials: 'include'
        })
            .then(res => res.json())
            .then(function (res) {
                setCookie('sessionid', res.sessionid, 1);
                $('#login').modal('hide');

                this.checkRole();
            }.bind(this))
            .catch(e => {
                console.log(e);
            });
    }

    signup() {
        const account = document.querySelector('#signupAccount').value;
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#signupPassword').value;

        let formData = new FormData();

        formData.append('username', account);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('role', '0');

        fetch(`${config.SERVER_URL}/signup/`, {
            method: "POST",
            body: formData,
            credentials: 'include'
        })
            .then(res => {
                console.log(res);
                $('#signup').modal('hide');
            })
            .catch(e => {
                console.log(e);
            });
    }

    checkRole() {
        console.log('a');
        fetch(`${config.SERVER_URL}/login/current/`, {
            method: "GET",
            credentials: 'include'
        })
            .then(res => res.json())
            .then(res => {
                console.log(res);
                this.setState({ role: res.role });
            })
            .catch(e => {
                console.log(e);
            });
    }

    render() {
        let navUlDiv = "", navButton = "";
        if (this.state.role === -1) {
            navButton =
                <form className="form-inline my-2 my-lg-0">
                    <button className="mx-2 btn btn-outline-primary" data-toggle="modal" data-target="#login" onClick={this.handelBtn}>Log in</button>
                    <button className="mx-2 btn btn-primary" data-toggle="modal" data-target="#signup" onClick={this.handelBtn}>Sign up</button>
                </form>;
            navUlDiv =
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <Link to="/reservation" className="p-2 text-dark navbar-brand">預約狀況</Link>
                    </li>
                </ul>;
        } else if (this.state.role === 2) {
            navUlDiv =
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <Link to="/reservation" className="p-2 text-dark navbar-brand">預約狀況</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/myMeeting" className="p-2 text-dark navbar-brand">我的會議</Link>
                    </li>
                </ul>;
        } else {
            navUlDiv =
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <Link to="/reservation" className="p-2 text-dark navbar-brand">預約狀況</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/myMeeting" className="p-2 text-dark navbar-brand">我的會議</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/review" className="p-2 text-dark navbar-brand">審核會議</Link>
                    </li>
                </ul>;
        }

        return (
            <Router>
                <nav className="navbar navbar-expand-lg navbar-light bg-light p-4 border-bottom shadow-sm">
                    <Link to="/" className="navbar-brand">空間管理系統</Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    {navUlDiv}
                    {navButton}
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
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={this.signup}>Submit</button>
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
                <Switch>
                    <Route path="/" exact component={Reservation} />
                    <Route path="/reservation" component={Reservation} />
                    <Route path="/myMeeting" component={MyMeeting} />
                    <Route path="/review" component={Review} />
                </Switch>
            </Router >
        );
    }
}

export default Header;
