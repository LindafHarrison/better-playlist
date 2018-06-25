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
      name: 'My favorites1',
      songs: [{ name: 'Hit me baby one more time', duration: 1345 }, { name: 'Oops I did it again', duration: 1345 }, { name: 'Rock n Roll', duration: 1345 }, { name: 'Stornger', duration: 1345 }
      ]
    },
    {
      name: 'My favorites2',
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
      name: 'My favorites3',
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
      }]
    },
    {
      name: 'My favorites4',
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
        <input type='text' onKeyUp={event => this.props.onTextChange(event.target.value)} />
      </div>
    );
  }
}

class Playlist extends Component {
  render() {
    const playlist = this.props.playlist
    return (
      <div style={{ ...defaultStyle, display: "inline-block", width: "25%" }}>
        <img />
        <h3> Playlist {playlist.name} </h3>
        <ul>
          {
            playlist.songs.map(song =>
              <li> {song.name} </li>
            )
          }
        </ul>
      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      serverData: {},
      filterString: ''
    }
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({ serverData: fakeServerData });
    }, 0);
  }


  render() {
    let playlists;
    if (this.state.serverData.user) {
      playlists = this.state.serverData.user.playlists
    }

    return (
      <div className="App">
        {this.state.serverData.user ?
          <div>
            <h1 style={{ ...defaultStyle, 'font-size': '54px' }}>
              {this.state.serverData.user.name}'s Playlist
            </h1>
            <PlaylistCounter playlists={playlists} />
            <HoursCounter playlists={playlists} />
            <Filter onTextChange={text => this.setState({ filterString: text })} />
            {playlists.filter(playlist =>
              playlist.name.toLowerCase().includes(
                this.state.filterString.toLowerCase())
            ).map(playlist =>
              <Playlist playlist={playlist} />
            )}
          </div> : <h1 style={defaultStyle}>'Loading..' </h1>
        }
      </div>
    );
  }
}

export default App;
