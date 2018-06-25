import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

let defaultStyle = {
  color: '#fff'
}

let fakeServerData = {
  user: {
    name: 'David',
    playlists: [{
      name: 'My favorites',
      songs: [{ name: 'Hit me baby one more time', duration: 1345 }, { name: 'Oops I did it again', duration: 1345 }, { name: 'Rock n Roll', duration: 1345 }, { name: 'Stornger', duration: 1345 }
      ]
    },
    {
      name: 'My favorites',
      songs: [
        {
          name: 'Hit me baby one more time',
          duration: 1345
        },
        {
          name: 'Oops I did it again',
          duration: 1345
        },
        {
          name: 'Rock n Roll',
          duration: 1345
        },
        {
          name: 'Stornger',
          duration: 1345
        }
      ]
    },
    {
      name: 'My favorites',
      songs: [{
        name: 'Hit me baby one more time',
        duration: 1345
      }, {
        name: 'Oops I did it again',
        duration: 1345
      }, {
        name: 'Rock n Roll',
        duration: 1345
      }],
      songs: [{
        name: 'Hit me baby one more time',
        duration: 1345
      }, {
        name: 'Oops I did it again',
        duration: 1345
      }, {
        name: 'Rock n Roll',
        duration: 1345
      }, {
        name: 'Stornger',
        duration: 1345
      }
      ]
    },
    {
      name: 'My favorites',
      songs: [{
        name: 'Hit me baby one more time',
        duration: 1345
      }, {
        name: 'Oops I did it again',
        duration: 1345
      }, {
        name: 'Rock n Roll',
        duration: 1345
      }, {
        name: 'Stornger',
        duration: 1345
      }
      ]
    },
    ]
  }
}

class PlaylistCounter extends Component {
  render() {
    return (
      <div style={{ ...defaultStyle, width: "40%", display: "inline-block" }}>
        <h2> {this.props.playlists.length} playlist </h2>
      </div>
    );
  }
}

class HoursCounter extends Component {
  render() {
    let allSongs = this.props.playlists.reduce((songs, eachPlaylist) => {
      return songs.concat(eachPlaylist.songs)
    }, [])
    let totalDuration = allSongs.reduce((sum, eachSong) => {
      return sum + eachSong.duration
    }, 0)
    return (
      <div style={{ ...defaultStyle, width: "40%", display: "inline-block" }}>
        <h2> {Math.round(totalDuration / 60)} hours </h2>
      </div>
    );
  }
}

class Filter extends Component {
  render() {
    return (
      <div style={defaultStyle} >
        <img />
        <input type='text' />
      </div>
    );
  }
}

class Playlist extends Component {
  render() {
    return (
      <div style={{ ...defaultStyle, display: "inline-block", width: "25%" }}>
        <img />
        <h3> Playlist Name </h3>
        <ul>
          <li> Song 1 </li>
          <li> Song 2 </li>
          <li> Song 3 </li>
        </ul>
      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = { serverData: {} }
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({ serverData: fakeServerData });
    }, 1000);
  }

  render() {
    return (
      <div className="App">
        {this.state.serverData.user ?
          <div>
            <h1 style={{ ...defaultStyle, 'font-size': '54px' }}>
              {this.state.serverData.user.name}'s Playlist
            </h1>
            <PlaylistCounter playlists={this.state.serverData.user.playlists} />
            <HoursCounter playlists={this.state.serverData.user.playlists} />
            <Filter />
            <Playlist />
            <Playlist />
            <Playlist />
            <Playlist />
          </div> : <h1 style={defaultStyle}>'Loading..' </h1>
        }
      </div>
    );
  }
}

export default App;
