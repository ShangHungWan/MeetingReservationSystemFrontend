import React from 'react';
import './css/Header.css';
import Reservation from './Reservation';
import MyMeeting from './MyMeeting';
import Login from './Login';
import Signup from './Signup';
import { BrowserRouter as Router, Link, Switch, Route } from 'react-router-dom';

class Header extends React.Component {
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
                            <Link to="/login" className="mx-2 btn btn-outline-primary">Log in</Link>
                            <Link to="/signup" className="mx-2 btn btn-primary">Sign up</Link>
                        </form>
                    </div>
                </nav>
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
