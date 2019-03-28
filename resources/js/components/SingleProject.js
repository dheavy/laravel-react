import axios from 'axios';
import React, {Component} from 'react';

class SingleProject extends Component {
  constructor(props) {
    super(props);

    this.state = {
      project: {},
      tasks: [],
      title: '',
      errors: []
    };

    this.onMarkProjectCompleted = this.onMarkProjectCompleted.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.onAddNewTask = this.onAddNewTask.bind(this);
    this.hasErrorFor = this.hasErrorFor.bind(this);
    this.renderErrorFor = this.renderErrorFor.bind(this);
  }

  onFieldChange(e) {
    this.setState({
      title: e.target.value
    });
  }

  onAddNewTask(e) {
    e.preventDefault();

    const task = {
      title: this.state.title,
      project_id: this.state.project.id
    };

    axios.post('http://localhost:8000/api/tasks', task)
      .then(response => {
        this.setState({
          title: ''
        })

        this.setState(prevState => ({
          tasks: prevState.tasks.concat(response.data)
        }))
      })
      .catch(error => {
        this.setState({
          errors: error.response.data.errors
        })
      })
  }

  hasErrorFor(field) {
    return !!this.state.errors[field];
  }

  renderErrorFor(field) {
    if (this.hasErrorFor(field)) {
      return (
        <span className="invalid-feedback">
          <strong>{this.state.errors[field][0]}</strong>
        </span>
      );
    }
  }

  onMarkProjectCompleted() {
    const {history} = this.props;

    axios.put(`http://localhost:8000/api/projects/${this.state.project.id}`)
      .then(reponse => history.push('/'));
  }

  onMarkProjectCompleted(taskId) {
    axios.put(`http://localhost:8000/api/tasks/${taskId}`)
      .then(response => {
        this.setState(prevState => ({
          tasks: prevState.tasks.filter(task => {
            return task.id !== taskId
          })
        }));
      })
  }

  componentDidMount() {
    const projectId = this.props.match.params.id;

    axios.get(`http://localhost:8000/api/projects/${projectId}`).then(response => {
      this.setState({
        project: response.data,
        tasks: response.data.tasks
      });
    })
  }

  render() {
    const {project, tasks} = this.state;

    return (
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">{project.name}</div>
              <div className="card-body">
                <p>{project.description}</p>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={this.onMarkProjectCompleted}
                >
                  Mark as completed
                </button>
                <hr/>
                <form onSubmit={this.onAddNewTask}>
                  <div className="input-group">
                    <input
                      type="text"
                      name="title"
                      className={`form-control ${this.hasErrorFor('title') ? 'is-invalid': ''}`}
                      placeholder="Task title"
                      value={this.state.title}
                      onChange={this.onFieldChange}
                    />
                  </div>
                  <div className="input-group-append">
                    <button className="btn btn-primary">Add</button>
                  </div>
                  {this.renderErrorFor('title')}
                </form>
                <ul className="list-group mt-3">
                  {tasks.map(task => (
                    <li
                      className="list-group-item d-flex justify-content-between align-items-center"
                      key={task.id}
                    >
                      {task.title}

                      <button
                        className="btn btn-primary btn-sm"
                        onClick={this.onMarkProjectCompleted.bind(this, task.id)}
                      >
                        Mark as completed
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SingleProject;
