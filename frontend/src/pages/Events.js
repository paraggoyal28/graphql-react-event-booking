import React, { Component } from "react";
import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import AuthContext from "../context/auth-context";
import "./Events.css";

class EventsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      creating: false,
      events: [],
    };
    this.titleRef = React.createRef();
    this.priceRef = React.createRef();
    this.descriptionRef = React.createRef();
    this.dateRef = React.createRef();
  }

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchEvents();
  }

  createEventHandler = () => {
    this.setState({ creating: true });
  };

  modalConfirmHandler = () => {
    this.setState({ creating: false });
    const title = this.titleRef.current.value;
    const price = +this.priceRef.current.value;
    const date = this.dateRef.current.value;
    const description = this.descriptionRef.current.value;

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }

    const event = { title, price, date, description };
    console.log(event);

    const createEventRequestBody = {
      query: `
        mutation { 
          createEvent (eventInput: { title: "${title}", description: "${description}", date: "${date}", price: ${price}}) {
            _id
            title
            description
            date
            price
            creator {
              _id
              email
            }
          }
        }
      `,
    };

    const token = this.context.token;

    // send a request to the backend
    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(createEventRequestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        this.fetchEvents();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  modelCancelHandler = () => {
    this.setState({ creating: false });
  };

  fetchEvents = () => {
    const requestBody = {
      query: `
        query { 
          events {
            _id
            title
            description
            date
            price
          }
        }
      `,
    };

    // send a request to the backend
    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        const events = resData.data.events;
        this.setState({ events: events });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  render() {
    const eventList = this.state.events.map((event) => (
      <li className="events__list-item" key={event._id}>
        {event.title}
      </li>
    ));

    return (
      <>
        {this.state.creating && <Backdrop />}
        {this.state.creating && (
          <Modal
            title="Add Event"
            canCancel
            canConfirm
            onCancel={this.modelCancelHandler}
            onConfirm={this.modalConfirmHandler}
          >
            <form>
              <div className="form-control">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" ref={this.titleRef} />
              </div>
              <div className="form-control">
                <label htmlFor="price">Price</label>
                <input type="number" id="price" ref={this.priceRef} />
              </div>
              <div className="form-control">
                <label htmlFor="date">Date</label>
                <input type="datetime-local" id="date" ref={this.dateRef} />
              </div>
              <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea
                  rows="4"
                  id="description"
                  ref={this.descriptionRef}
                ></textarea>
              </div>
            </form>
          </Modal>
        )}
        {this.context.token && (
          <div className="events-control">
            <p>Share your own events!</p>
            <button className="btn" onClick={this.createEventHandler}>
              Create Event
            </button>
          </div>
        )}
        <ul className="events__list">{eventList}</ul>
      </>
    );
  }
}

export default EventsPage;
