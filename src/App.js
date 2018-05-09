import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navn: '',
      instrument: '',
      debug: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  addDebug(text) {
    this.setState({debug: this.state.debug.concat([<li key={this.state.debug.length}>{text}</li>])});
  }

  handleChange(event) {
    if(event.target.name === "navn") {
      this.setState({navn: event.target.value});
    }
    if(event.target.name === "instrument") {
      this.setState({instrument: event.target.value});
    }
  }

  handleSubmit(event) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = () => {
      if(request.readyState === 4 && request.status >= 200 && request.status < 300) {
        this.addDebug(request.response);
        this.props.update(JSON.parse(request.response));
      }
    };
    request.open('POST', 'http://localhost:10010/medlemmer', true);
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.send(JSON.stringify({
        navn: this.state.navn,
        hovedinstrument: this.state.instrument.toLowerCase()
      }));
    event.preventDefault();
    this.addDebug('request for save sent');
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
      <div><input type="text" name="navn" value={this.state.navn} onChange={this.handleChange}/></div>
      <div><input type="text" name="instrument" value={this.state.instrument} onChange={this.handleChange}/></div>
      <div><input type="submit" value="Nytt medlem"/></div>
      <ul>{this.state.debug}</ul>
      </form>
    );
  }
}

function Medlemmer(props) {
  return (
    <ul>
    {props.data.map((element,i) =>
      <li key={i}>{element.object.navn} ({element.object.hovedinstrument})</li>)
    }
    </ul>
  );
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      medlemmer: [],
    };
    this.hentMedlemmer();
  }

  hentMedlemmer() {
    var request = new XMLHttpRequest();
    //request.responseType = "json";
    request.onreadystatechange = () => {
      if(request.readyState === 4 && request.status >= 200 && request.status < 300) {
        this.setState({medlemmer: JSON.parse(request.response)});
      }
    };
    request.open('GET', 'http://localhost:10010/medlemmer', true);
    request.send();
  }

  updateData(data) {
    this.setState({medlemmer: this.state.medlemmer.concat([data])});
  }

  render() {
    return (
      <div className="App">
        <Form update={(data) => this.updateData(data)}/>
        <Medlemmer data={this.state.medlemmer}/>
        <div>{this.state.debug}</div>
      </div>
    );
  }
}

export default App;
