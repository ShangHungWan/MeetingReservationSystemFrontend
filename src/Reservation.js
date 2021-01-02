const startTimeHour = 9;
const roomLen = 10;

function generateRoomList() {
    let room = [];
    for (let i = 0; i < 10; i++) {
        room.push('00' + i);
    }
    let roomList = [];
    for (let i of room) {
        roomList.push(<th className="align-middle" scope="col"> {i} </th>)
    }
    return roomList;
}

function generateTimeList() {
    let timeList = [];
    for (let i = 0; i <= 12; i++) {
        let status = [];
        for (let j = 0; j < roomLen; j++) {
            const num = Math.floor(Math.random() * 5);
            if (num === 0) { // 被預約且不能加入
                status.push(<td className="table-active">會議標題 20/20人</td>);
            }
            else if (num === 1) { // 被預約且不顯示資訊
                status.push(<td className="table-active">私人會議</td>);
            }
            else if (num === 2) { // 被預約且可以加入
                status.push(<td className="table-active">會議標題 10/20人<button className="btn btn-outline-primary">加入</button></td>);
            }
            else { // 閒置
                status.push(<td><button className="btn btn-outline-success">預約</button></td>);
            }
        }

        timeList.push(<tr className="align-middle"><th scope="row"> {(i + startTimeHour).toString().padStart(2, '0') + ":00"} </th> {status} </tr>);
    }
    return timeList;
}

function Reservation() {
    const room = generateRoomList();
    const time = generateTimeList();

    return (
        <div className="container p-4">
            <form className="row align-items-center mb-5">
                <div className="col-md-11">
                    <input className="form-control" type="text" placeholder="Search meeting title" aria-label="search" />
                </div>
                <div className="col-md-1">
                    <button type="submit" className="btn btn-primary">Serach</button>
                </div>
            </form>
            <input className="col-auto my-3 form-control" type="date" id="date" defaultValue={new Date().toISOString().slice(0, 10)} />
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

export default Reservation;
