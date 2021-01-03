import * as config from './config';
import React from 'react';

class Reservation extends React.Component {
    constructor(props) {
        super(props);
        this.state = { date: new Date().toISOString().slice(0, 10), rooms: null, reservations: null, isLoading: false, isChanged: false };

        this.startTimeHour = 9;
        this.handleChange = this.handleChange.bind(this);
    }

    getRoomList() {
        fetch(`${config.SERVER_URL}/room/`, { method: "GET" })
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

    getReservationOfDate() {
        if (this.state.isLoading)
            return;

        let date = this.state.date;

        fetch(`${config.SERVER_URL}/reservation/?date=${date}`, {
            method: "GET",
        })
            .then(res => res.json())
            .then(res => {
                this.setState({
                    reservations: res.reservations,
                    isLoading: false,
                    isChanged: false
                });
            })
            .catch(e => {
                console.log(e);
            });
        this.setState({
            isLoading: true
        });
    }

    generateRoomList() {
        let room = this.state.rooms;
        let roomList = [];
        for (let i of room) {
            if (i.is_available) {
                roomList.push(<th key={i._id} className="align-middle" scope="col"> {i.name} </th>)
            }
        }
        return roomList;
    }

    generateTimeList() {
        let timeList = [];
        for (let i = 0; i < 14; i++) {
            let status = [];
            for (let j = 0; j < this.state.rooms.length; j++) {
                let find = false;
                if (this.state.reservations) {
                    for (let k of this.state.reservations) {
                        const start = new Date(k.start);
                        const end = new Date(k.end);
                        if (start.getHours() <= (i + this.startTimeHour) && end.getHours() <= (i + this.startTimeHour + 1) && k.room_id === this.state.rooms[j]._id) {
                            status.push(<td key={`${i}-${j}`} className="table-active">
                                <button className="btn btn-link">{k.topic}</button>
                            </td>);
                            find = true;
                            break;
                        }
                    }
                }
                if (!find) {
                    status.push(<td key={`${i}-${j}`}>
                        <button className="btn btn-outline-success">預約</button>
                    </td>);
                }
            }

            timeList.push(<tr key={i} className="align-middle">
                <th scope="row"> {(i + this.startTimeHour).toString().padStart(2, '0') + ":00"} </th>
                {status}
            </tr>);
        }
        return timeList;
    }

    handleChange(event) {
        this.setState({ date: event.target.value, isChanged: true })
    }

    showLoading() {
        return (
            <div className="container p-12 text-center position-absolute top-50 start-50 translate-middle">
                <h1>loading...</h1>
            </div>);
    }

    render() {
        if ((!this.state.rooms || this.state.rooms.length === 0)) {
            this.getRoomList();
            return this.showLoading();
        }
        // if (this.state.isLoading) {
        //     return this.showLoading();
        // }
        if (this.state.isChanged) {
            this.getReservationOfDate();
        }

        const room = this.generateRoomList();
        const time = this.generateTimeList();

        return (
            <div className="container p-4">
                <input className="col-auto my-3 form-control" type="date" defaultValue={this.state.date} onChange={this.handleChange} />
                <div className="table-responsive">
                    <table className="table my-2 text-center">
                        <thead>
                            <tr>
                                <th className="align-middle" scope="col">#</th>
                                {room}
                            </tr>
                        </thead>
                        <tbody>
                            {time}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default Reservation;
