import "./Times.css";
import { useState, useEffect, useRef } from "react";

function Times() {
  const form = useRef(null);
  const [times, setTimes] = useState([]);

  const deleteTime = (id) => {
    let url = `/api/times/${id}`;

    fetch(url, { method: "DELETE" })
      .then((res) => res.text())
      .then((text) => console.log(text));
    fetch("/update");
    setTimes(times.filter((time) => time._id !== id));
  };

  const createTime = (event) => {
    event.preventDefault();
    const formData = new FormData(form.current);

    const data = JSON.stringify(Object.fromEntries(formData));
    console.log(data);
    let url = `/api/times`;

    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: data,
    });
    fetch("/update");
    setTimes([]);
  };

  const GetTime = async (data) => {
    let url = `/api/times`;

    const apiCall = await fetch(url);
    const timeData = await apiCall.json();
    setTimes(timeData);
  };

  useEffect(() => {
    GetTime();
  }, [times.length]);

  return (
    <div className="Times-input">
      <h1>Times</h1>
      <ul>
        {times.length > 0 ? (
          times.map((item) => (
            <div>
              <li>
                {item.hour}:{item.min}
                <div className="buttons">
                  <button id={item._id} onClick={() => deleteTime(item._id)}>
                    Delete
                  </button>
                </div>
              </li>
            </div>
          ))
        ) : (
          <h1>Loading ...</h1>
        )}
      </ul>

      <form ref={form} onSubmit={createTime}>
        <div>
          <div className="form-field">
            <label htmlFor="hour">Hour</label>
            <input type="number" name="hour" id="hour" />
          </div>
          <div className="form-field">
            <label htmlFor="min">Minute</label>
            <input type="number" name="min" id="min" />
          </div>
          <input id="addTime" type="submit" value="Add Time" />
        </div>
      </form>

      <button class="feed-now" onClick={() => fetch("/servo")}>
        Feed now
      </button>
    </div>
  );
}

export default Times;
