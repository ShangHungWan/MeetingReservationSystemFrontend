import * as config from './config';
import React from 'react';

class MyMeeting extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: 'all', meetings: null };

        this.handleChange = this.handleChange.bind(this);
    }

    getMeetings() {
        fetch(`${config.SERVER_URL}/myReservation/`, {
            method: "GET",
        })
            .then(res => res.json())
            .then(res => {
                this.setState({
                    review_ids: res.reviewList
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
        for (let i = 0; i < 30; i++) {
            const action = Math.floor(Math.random() * 5) === 0 ? <td>
                <button className="btn btn-primary mx-1">邀請</button>
                <button className="btn btn-danger mx-1">解散</button>
            </td> : <td>
                    <button className="btn btn-danger">退出</button>
                </td>;

            const meetingInfo = <tr key={i} className="align-middle">
                <td> {i + 'RR'} </td>
                <td>qweiu1jh2guv34i</td>
                <td>123ijp123</td>
                <td>room122</td>
                <td>2020/12/31 20:00 ~ 2020/12/31 21:00</td>
                <td>10/10</td>
                {action}
            </tr>;

            meetingList.push(meetingInfo);
        }
        return meetingList;
    }

    render() {
        this.getMeetings();
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
                                <th className="align-middle" scope="col">參與人數</th>
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
