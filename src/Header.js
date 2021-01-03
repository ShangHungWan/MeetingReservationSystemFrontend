import React from 'react';
import './css/bootstrap.min.css';
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
                <header className="d-flex flex-column flex-md-row align-items-center p-4 px-md-5 mb-4 bg-white border-bottom shadow-sm">
                    <p className="h4 my-0 me-md-auto fw-normal">空間管理系統</p>
                    <nav className="my-2 my-md-0 me-md-3">
                        <Link to="/reservation" className="p-2 text-dark navbar-brand">預約狀況</Link>
                        <Link to="/myMeeting" className="p-2 text-dark navbar-brand">我的會議</Link>
                    </nav>
                    <Link to="/login" className="mx-2 btn btn-outline-primary">Log in</Link>
                    <Link to="/signup" className="mx-2 btn btn-primary">Sign up</Link>
                </header>
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
