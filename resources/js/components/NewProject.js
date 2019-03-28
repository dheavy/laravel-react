import axios from 'axios';
import React, {Component} from 'react';

class NewProject extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      description: '',
      errors: []
    };

    this.onFieldChange = this.onFieldChange.bind(this);
    this.onCreateNewProject = this.onCreateNewProject.bind(this);
    this.hasErrorFor = this.hasErrorFor.bind(this);
    this.renderErrorFor = this.renderErrorFor.bind(this);
  }

  onFieldChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  onCreateNewProject(e) {
    e.preventDefault();

    const {history} = this.props;

    const project = {
      name: this.state.name,
      description: this.state.description
    };

    axios.post('/api/projects', project)
      .then(response => {
        history.push('/');
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

  render() {
    return (
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">Create new project</div>
              <div className="card-body">
                <form onSubmit={this.onCreateNewProject}>
                  <div className="form-group">
                    <label htmlFor="name">Project name</label>
                    <input
                      id="name"
                      type="text"
                      className={`form-control ${this.hasErrorFor('name') ? 'is-invalid' : ''}`}
                      name="name"
                      value={this.state.name}
                      onChange={this.onFieldChange}
                    />
                    {this.renderErrorFor('name')}
                  </div>
                  <div className="form-group">
                    <label htmlFor="description">Project description</label>
                    <textarea
                      id="description"
                      className={`form-control ${this.hasErrorFor('description') ? 'is-invalid' : ''}`}
                      name="description"
                      rows="10"
                      value={this.state.description}
                      onChange={this.onFieldChange}
                    />
                    {this.renderErrorFor('description')}
                  </div>
                  <button className="btn btn-primary">Create</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NewProject;