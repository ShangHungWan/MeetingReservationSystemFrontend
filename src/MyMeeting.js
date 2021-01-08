import * as config from './config';
import React from 'react';
import { getRoomName } from './tool';

class MyMeeting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 'all',
            meetings: null,
            isLoadedRoom: false,
            isLoadedMeeting: false,
            isCheckRole: true,
            name: "",
        };

        this.handleChange = this.handleChange.bind(this);
        this.getMeetings = this.getMeetings.bind(this);
        this.leave = this.leave.bind(this);
    }

    getMeetings() {
        this.setState({ isLoadedMeeting: true });
        fetch(`${config.SERVER_URL}/myReservation/`, {
            method: "GET",
            credentials: 'include'
        })
            .then(res => res.json())
            .then(res => {
                this.setState({
                    meetings: res.reservations
                });
            })
            .catch(e => {
                this.getMeetings();
                console.log(e);
            });
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    leave(event) {
        event.preventDefault();
        const id = event.target.dataset.id;

        let formData = new FormData();
        formData.append('arID', id);

        fetch(`${config.SERVER_URL}/dropOut/`, {
            method: "POST",
            credentials: 'include',
            body: formData
        })
            .then(res => {
                this.removeElement(id);
                console.log(res);
            })
            .catch(e => {
                console.log(e);
            });
    }

    removeElement(id) {
        let newList = [];
        for (let ele of this.state.meetings) {
            if (ele._id !== id) {
                newList.push(ele);
            }
        }
        this.setState({ meetings: newList });
    }

    findMyId(idx) {
        for (let ele of this.state.meetings[idx].attendees) {
            if (ele.username === this.state.name) {
                return ele.ar_id;
            }
        }
        return "";
    }

    disband(event) {
        event.preventDefault();
        const id = event.target.dataset.id;

        let formData = new FormData();

        formData.append('arID', id);

        fetch(`${config.SERVER_URL}/disband/`, {
            method: "POST",
            credentials: 'include',
            body: formData
        })
            .then(res => {
                this.removeElement(id);
                console.log(res);
            })
            .catch(e => {
                console.log(e);
            });
    }

    generateMeetingList() {
        let meetingList = [];
        let idx = 0;
        for (let ele of this.state.meetings) {
            let action;
            if (this.state.name === ele.host_name) {
                action = <td>
                    <button className="btn btn-danger" data-id={ele.ar_id} onClick={this.disband}>解散</button>
                </td>;
            } else {
                action = <td>
                    <button className="btn btn-danger" data-id={this.findMyId(idx)} onClick={this.leave}>退出</button>
                </td>;
            }

            const status = ele.status;
            let statusTxt;
            switch (status) {
                case "0":
                    statusTxt = "正常舉辦"
                    break;
                case "3":
                    statusTxt = "主辦人審核中"
                    break;
                case "5":
                    statusTxt = "申請已被拒絕"
                    break;
                case "6":
                    statusTxt = "申請審核中"
                    break;
                default:
                    statusTxt = ""
                    break;
            }

            const meetingInfo = <tr key={ele._id} className="align-middle">
                <td> {ele.topic} </td>
                <td>{ele.detail}</td>
                <td>{ele.host_name}</td>
                <td>{getRoomName(ele.room_id, this.state.rooms)}</td>
                <td>{ele.start.slice(0, 19)} ~ {ele.end.slice(0, 19)}</td>
                {/* <td>{ele.attendees.length}</td>
                <td>{ele.askers.length}</td> */}
                <td>{statusTxt}</td>
                {action}
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

    render() {
        if (this.state.isCheckRole) {
            this.checkRole();
        }
        if (!this.state.isLoadedRoom) {
            this.getRoomList();
        }
        if (!this.state.isLoadedMeeting) {
            this.getMeetings();
        }
        if (!this.state.meetings || !this.state.rooms) {
            return null;
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
                                {/* <th className="align-middle" scope="col">參與人數</th>
                                <th className="align-middle" scope="col">要求參與人數</th> */}
                                <th className="align-middle" scope="col">狀態</th>
                                <th className="align-middle" scope="col">動作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {meetingList}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default MyMeeting;
