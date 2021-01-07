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
                console.log(e);
            });
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    generateMeetingList() {
        let meetingList = [];
        for (let ele of this.state.meetings) {
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
            </tr>;

            meetingList.push(meetingInfo);
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
                <select value={this.state.value} onChange={this.handleChange}>
                    <option value="all">全部</option>
                    <option value="scheduled">尚未開始</option>
                    <option value="finished">已結束</option>
                    <option value="applying">申請中</option>
                </select>
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
