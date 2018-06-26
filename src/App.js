import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import queryString from 'query-string';

let defaultStyle = {
  color: '#fff'
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
        <img src={playlist.imageUrl} style={{ width: "100px" }} />
        <h3> {playlist.name} </h3>
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
    let parsed = queryString.parse(window.location.search);
    let accessToken = parsed.access_token
    if (!accessToken) return;

    fetch('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    }).then((res) => res.json())
      .then(data => this.setState({
        user: {
          name: data.display_name
        }
      }))

    fetch('https://api.spotify.com/v1/me/playlists', {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    }).then((res) => res.json())
      .then(playlistData => {
        let playlists = playlistData.items
        let trackDataPromises = playlists.map(playlist => {
          let responsePromise = fetch(playlist.tracks.href, {
            headers: { 'Authorization': 'Bearer ' + accessToken }
          })
          let trackDataPromise = responsePromise
            .then(res => res.json())
          return trackDataPromise
        })
        let allTracksDatasPromises =
          Promise.all(trackDataPromises)
        let playlistsPromise = allTracksDatasPromises.then(trackDatas => {
          trackDatas.forEach((trackData, i) => {
            playlists[i].trackDatas = trackData.items
              .map(item => item.track)
              .map(trackData => ({
                name: trackData.name,
                duration: trackData.duration_ms / 1000
              }))
          })
          return playlists
        })
        return playlistsPromise
      })
      .then(playlists => this.setState({
        playlists: playlists.map(item => {
          return {
            name: item.name,
            imageUrl: item.images[0].url,
            songs: item.trackDatas.slice(0, 3)
          }
        })
      }))

  }


  render() {
    let playlistToRender =
      this.state.user &&
        this.state.playlists
        ? this.state.playlists.filter(playlist =>
          playlist.name.toLowerCase().includes(
            this.state.filterString.toLowerCase()))
        : []

    return (
      <div className="App">
        {this.state.user
          ? <div>
            <h1 style={{ ...defaultStyle, 'fontSize': '54px' }}>
              {this.state.user.name}'s Playlist
            </h1>
            <PlaylistCounter playlists={playlistToRender} />
            <HoursCounter playlists={playlistToRender} />
            <Filter onTextChange={text => this.setState({ filterString: text })} />
            {playlistToRender.map(playlist =>
              <Playlist playlist={playlist} />
            )}
          </div>
          : <button onClick={() => {
            window.location = window.location.href.includes('localhost')
              ? 'http://localhost:8888/login'
              : 'https://filtered-playlists-backend.herokuapp.com/login'
          }
          }
            style={{ padding: '20px', 'fontSize': '90px', 'marginTop': '20px' }}>Sign in with Spotify</button>
        }
      </div>
    );
  }
}

export default App;
