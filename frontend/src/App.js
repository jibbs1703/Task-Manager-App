import React, { Component } from "react";
import Modal from "./components/modal";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewCompleted: false,
      JobList: [],
      modal: false,
      activeItem: {
        name: "",
        address: "",
        date: "",
        time: "",
        service : "",
        cell: "",
        price: "",
        completed: false,
      },
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    axios
      .get("/api/tasks/")
      .then((res) => this.setState({ JobList: res.data }))
      .catch((err) => console.log(err));
  };
  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  handleSubmit = (item) => {
    this.toggle();
     if (item.id) {
      axios
        .put(`/api/tasks/${item.id}/`, item)
        .then((res) => this.refreshList());
      return;
    }
    axios
      .post("/api/tasks/", item)
      .then((res) => this.refreshList());
  };

  handleDelete = (item) => {
    axios
      .delete(`/api/tasks/${item.id}/`)
      .then((res) => this.refreshList());
  };

  createItem = () => {
    const item = { name : "", address : "", date : "" , time : "", service : "", cell: "", price: "" , completed : false};

    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  editItem = (item) => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  displayCompleted = (status) => {
    if (status) {
      return this.setState({ viewCompleted: true });
    }

    return this.setState({ viewCompleted: false });
  };

  renderTabList = () => {
    return (
      <div className="nav nav-tabs">

        <span
          className={this.state.viewCompleted ? "nav-link active" : "nav-link"}
          onClick={() => this.displayCompleted(true)}
        >
          Complete
        </span>

        <span
          className={this.state.viewCompleted ? "nav-link" : "nav-link active"}
          onClick={() => this.displayCompleted(false)}
        >
          Incomplete
        </span>
      </div>
    );
  };

  renderItems = () => {
    const { viewCompleted } = this.state;
    const newItems = this.state.JobList.filter(
      (item) => item.completed === viewCompleted
    );

    return newItems.map((item) => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className={`todo-title mr-2 ${
            this.state.viewCompleted ? "completed-todo" : ""
          }`}
          title={item.name}
        >
          {item.name}, {item.service}
        </span>
        <span>
          <button
            className="btn btn-secondary mr-2"
            onClick={() => this.editItem(item)}
          >
            Edit
          </button>
          <button
            className="btn btn-danger"
            onClick={() => this.handleDelete(item)}
          >
            Delete
          </button>
        </span>
      </li>
    ));
  };

  render() {
    return (
      <main className="container">
        <h1 className="text-white text-uppercase text-center my-4">Tasks App</h1>
        <div className="row">
          <div className="col-md-6 col-sm-10 mx-auto p-0">
            <div className="card p-3">
              <div className="mb-4">
                <button
                  className="btn btn-primary"
                  onClick={this.createItem}
                >
                  Add More Tasks
                </button>
              </div>
              {this.renderTabList()}
              <ul className="list-group list-group-flush border-top-0">
                {this.renderItems()}
              </ul>
            </div>
          </div>
        </div>
         {this.state.modal ? (
          <Modal
            activeItem={this.state.activeItem}
            toggle={this.toggle}
            onSave={this.handleSubmit}
          />
        ) : null}
      </main>
    );
  }
}
export default App;
