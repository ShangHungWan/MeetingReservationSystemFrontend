import * as config from './config';
import React from 'react';
import { getRoomName } from './tool';

class MyReservation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reservations: null,
            name: "",
            askers: null,
            askers_list: null,
            isLoadedRoom: false,
            isLoadedMeeting: false,
            isCheckRole: true,
        };

        this.handleChange = this.handleChange.bind(this);
        this.leave = this.leave.bind(this);
        this.disband = this.disband.bind(this);
        this.getReservation = this.getReservation.bind(this);
        this.showList = this.showList.bind(this);
    }

    getReservation() {
        this.setState({ isLoadedMeeting: true });
        fetch(`${config.SERVER_URL}/myReservation/`, {
            method: "GET",
            credentials: 'include'
        })
            .then(res => res.json())
            .then(res => {
                this.setState({
                    reservations: res.reservations
                });
            })
            .catch(e => {
                this.getReservation();
                console.log(e);
            });
    }

    leave(event) {
        event.preventDefault();
        console.log(event.target.dataset);
        const arId = event.target.dataset.id;

        let formData = new FormData();
        formData.append('ar_id', arId);

        fetch(`${config.SERVER_URL}/dropOut/`, {
            method: "POST",
            credentials: 'include',
            body: formData
        })
            .then(res => {
                this.removeElement(arId);
                console.log(res);
            })
            .catch(e => {
                console.log(e);
            });
    }

    removeElementFromAskers(id) {
        let askers;
        let find = false;
        console.log(id);
        for (let ele of this.state.reservations) {
            if ('askers' in ele) {
                askers = [];
                for (let asker of ele.askers) {
                    console.log(asker.ar_id);
                    if (asker.ar_id !== id) {
                        askers.push(asker);
                    } else {
                        find = true;
                    }
                }
                if (find) {
                    break;
                }
            }
        }
        console.log(askers);
        this.getAsker(askers);
        this.setState({ askers_list: askers });
    }

    removeElement(id) {
        let newList = [];
        for (let ele of this.state.reservations) {
            if (ele.user_res_id !== id) {
                newList.push(ele);
            }
        }
        this.setState({ reservations: newList });
    }

    disband(event) {
        event.preventDefault();
        const arId = event.target.dataset.id;

        let formData = new FormData();
        formData.append('ar_id', arId);

        fetch(`${config.SERVER_URL}/disband/`, {
            method: "POST",
            credentials: 'include',
            body: formData
        })
            .then(res => {
                this.removeElement(arId);
                console.log(res);
            })
            .catch(e => {
                console.log(e);
            });
    }

    handleChange(event) {
        event.preventDefault();
        const action = event.target.dataset.action;
        const id = event.target.dataset.id;

        let actionIdx = action === "allow" ? "0" : "2";

        let formData = new FormData();
        formData.append('ar_id', id);
        formData.append('status', actionIdx);

        fetch(`${config.SERVER_URL}/arChange/`, {
            method: "POST",
            credentials: 'include',
            body: formData
        })
            .then(res => {
                event.target.parentNode.parentNode.remove();
                console.log(res);
            })
            .catch(e => {
                console.log(e);
            });
    }

    getAsker(arr) {
        let list = [];
        for (let asker of arr) {
            list.push(<tr key={asker.ar_id}>
                <td className="align-middle">
                    {asker.username}
                </td>
                <td className="align-middle">
                    <button type="button" className="btn btn-outline-success mx-1" data-id={asker.ar_id} data-action="allow" onClick={this.handleChange}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check" viewBox="0 0 16 16">
                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
                        </svg>
                        通過
                    </button>
                    <button type="button" className="btn btn-outline-danger mx-1" data-id={asker.ar_id} data-action="refuse" onClick={this.handleChange}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                        </svg>
                        拒絕
                    </button>
                </td>
            </tr>)
        }
        this.setState({ askers: list });
    }

    showList(event) {
        const idx = event.target.dataset.idx;
        const reservation = this.state.reservations[idx];
        document.querySelector('#listLabel > span').innerHTML = reservation.topic;

        this.getAsker(reservation.askers);
    }

    generateMeetingList() {
        let meetingList = [];
        let idx = 0;
        for (let ele of this.state.reservations) {
            let btnVisible = true;
            const status = ele.status;
            let statusTxt;
            switch (status) {
                case "0":
                    statusTxt = "正常舉辦";
                    break;
                case "2":
                    statusTxt = "主辦人已拒絕要求";
                    btnVisible = false;
                    break;
                case "3":
                    statusTxt = "主辦人審核中";
                    break;
                case "5":
                    statusTxt = "申請已被拒絕";
                    break;
                case "6":
                    statusTxt = "申請審核中";
                    break;
                default:
                    statusTxt = "";
                    break;
            }

            let action = "";
            if (this.state.name === ele.host_name) {
                action = <button className="btn btn-danger" data-id={ele.user_res_id} onClick={this.disband}>解散</button>;
            } else if (this.state.name !== "" && btnVisible) {
                action = <button className="btn btn-danger" data-id={ele.user_res_id} onClick={this.leave}>退出</button>;
            }

            let askers;
            if ('askers' in ele && ele.askers.length > 0) {
                askers = <button className="btn btn-link btn-sm" data-toggle="modal" data-target="#list" data-idx={idx} onClick={this.showList}>查看</button>;
            } else if ('askers' in ele && ele.askers.length === 0) {
                askers = "無";
            } else {
                askers = "非主辦人";
            }
            const meetingInfo = <tr key={ele._id} className="align-middle">
                <td className="align-middle"> {ele.topic} </td>
                <td className="align-middle">{ele.detail}</td>
                <td className="align-middle">{ele.host_name}</td>
                <td className="align-middle">{getRoomName(ele.room_id, this.state.rooms)}</td>
                <td className="align-middle">{ele.start.slice(0, 19)} ~ {ele.end.slice(0, 19)}</td>
                <td className="align-middle">{askers}</td>
                <td className="align-middle">{statusTxt}</td>
                <td className="align-middle">{action}</td>
            </tr>;

            meetingList.push(meetingInfo);
            idx++;
        }
        return meetingList;
    }

    getRoomList() {
        this.setState({ isLoadedRoom: true });
        fetch(`${config.SERVER_URL}/room/`, {
            method: "GET",
            credentials: 'include'
        })
            .then(res => res.json())
            .then(res => {
                this.setState({
                    rooms: res.rooms
                });
            })
            .catch(e => {
                console.log(e);
            });
    }

    checkRole() {
        this.setState({ isCheckRole: false });
        fetch(`${config.SERVER_URL}/login/current/`, {
            method: "GET",
            credentials: 'include'
        })
            .then(res => res.json())
            .then(res => {
                if (!res.status) {
                    window.location.href = '/';
                } else {
                    this.setState({ name: res.account.username });
                }
            })
            .catch(e => {
                console.log(e);
            });
    }

    showLoading() {
        return (<div className="d-flex p-5">
            <div className="d-flex w-100 justify-content-center align-self-center">
                <h1>Loading...</h1>
            </div>
        </div>);
    }

    render() {
        if (this.state.isCheckRole) {
            this.checkRole();
        }
        if (!this.state.isLoadedRoom) {
            this.getRoomList();
        }
        if (!this.state.isLoadedMeeting) {
            this.getReservation();
        }
        if (!this.state.reservations || !this.state.rooms) {
            return this.showLoading();
        }
        const meetingList = this.generateMeetingList();

        return (
            <div className="container p-4">
                <div className="table-responsive">
                    <table className="table my-2 text-center table-hove">
                        <thead>
                            <tr>
                                <th className="align-middle" scope="col">標題</th>
                                <th className="align-middle" scope="col">描述</th>
                                <th className="align-middle" scope="col">主辦者</th>
                                <th className="align-middle" scope="col">會議室</th>
                                <th className="align-middle" scope="col">時間</th>
                                {/* <th className="align-middle" scope="col">參與人數</th> */}
                                <th className="align-middle" scope="col">要求參與人數</th>
                                <th className="align-middle" scope="col">狀態</th>
                                <th className="align-middle" scope="col">動作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {meetingList}
                        </tbody>
                    </table>
                </div>

                <div className="modal fade" id="list" tabIndex="-1" aria-labelledby="listLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="listLabel">要求參與列表 - <span></span></h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="table-responsive">
                                    <table className="table my-2 text-center table-hove">
                                        <thead>
                                            <tr>
                                                <th className="align-middle" scope="col">帳號</th>
                                                <th className="align-middle" scope="col">動作</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.askers}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default MyReservation;
