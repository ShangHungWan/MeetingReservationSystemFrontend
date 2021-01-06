import * as config from './config';
import React from 'react';

class Reservation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            review_ids: null,
            reviews: null,
            rooms: null,
            isLoadedReview: false,
            isLoadedRoom: false,
            action: "",
            idx: -1
        };

        this.handleChange = this.handleChange.bind(this);
        this.showNewReservation = this.showNewReservation.bind(this);
        this.generateList = this.generateList.bind(this);
    }

    getReviews() {
        this.setState({ isLoadedReview: true });
        fetch(`${config.SERVER_URL}/review/`, {
            method: "GET",
        })
            .then(res => res.json())
            .then(res => {
                this.setState({
                    reviews: res.reservations
                });
            })
            .catch(e => {
                console.log(e);
            });
    }

    getRoomList() {
        this.setState({ isLoadedRoom: true });
        fetch(`${config.SERVER_URL}/room/`, {
            method: "GET",
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

    getRoomName(id) {
        for (let ele of this.state.rooms) {
            if (ele._id === id) {
                return ele.name;
            }
        }
    }

    generateList() {
        let reviews = this.state.reviews;
        let list = [];
        for (let ele of reviews) {
            console.log(ele._id);
            list.push(<tr key={ele._id}>
                <td className="align-middle">
                    {ele.topic}
                </td>
                <td className="align-middle">
                    {ele.detail}
                </td>
                <td className="align-middle">
                    {this.getRoomName(ele.room_id)}
                </td>
                <td className="align-middle">
                    {ele.start.slice(0, 16)} ~ {ele.end.slice(0, 16)}
                </td>
                <td className="align-middle">
                    <button type="button" className="btn btn-outline-success mx-1" data-id={ele._id} data-action="allow" onClick={this.handleChange}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check" viewBox="0 0 16 16">
                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
                        </svg>
                        通過
                    </button>
                    <button type="button" className="btn btn-outline-danger mx-1" data-id={ele._id} data-action="refuse" onClick={this.handleChange}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                        </svg>
                        拒絕
                    </button>
                </td>
            </tr>)
        }
        return list;
    }

    showNewReservation(event) {
        const idx = event.target.dataset.room.split('-');
        const time = this.startTimeHour + parseInt(idx[0]);
        const room = this.state.rooms[idx[1]];

        this.generateTimeOption(idx);

        document.querySelector('#start').value = `${document.querySelector('#date').value} ${time}:00`;
        document.querySelector('#room').value = room.name;
    }

    handleChange(event) {
        console.log(event.target.dataset);
        event.preventDefault();
        this.submitReview(event.target.dataset.id, event.target.dataset.action);
    }

    submitReview(id, action) {
        let actionIdx = action === "allow" ? "0" : "5";
        let formData = new FormData();

        formData.append('status', actionIdx);

        fetch(`${config.SERVER_URL}/review/${id}/`, {
            method: "POST",
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
        for (let ele of this.state.reviews) {
            if (ele._id !== id) {
                newList.push(ele);
            }
        }
        this.setState({ reviews: newList });
    }

    isInitDone() {
        if (!this.state.reviews || (!this.state.rooms || this.state.rooms.length === 0)) {
            return false;
        }
        for (let i = 0; i < this.state.reviews.length; i++) {
            if (!this.state.reviews[i]) {
                return false;
            }
        }
        return true;
    }

    showLoading() {
        return (<div className="d-flex p-5">
            <div className="d-flex w-100 justify-content-center align-self-center">
                <h1>Loading...</h1>
            </div>
        </div>);
    }

    render() {
        if (!this.state.isLoadedRoom) {
            this.getRoomList();
        }
        if (!this.state.isLoadedReview) {
            this.getReviews();
        }
        if (!this.isInitDone()) {
            return this.showLoading();
        }

        const reviews = this.generateList();

        return (
            <div className="container p-4">
                <div className="table-responsive">
                    <table className="table my-2 text-center table-hove">
                        <thead>
                            <tr>
                                <th className="align-middle" scope="col">標題</th>
                                <th className="align-middle" scope="col">描述</th>
                                <th className="align-middle" scope="col">會議室</th>
                                <th className="align-middle" scope="col">時間</th>
                                <th className="align-middle" scope="col">動作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default Reservation;
