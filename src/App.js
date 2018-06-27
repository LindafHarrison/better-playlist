import React, { Component } from 'react';
import logo from './logo.svg';
import 'reset-css/reset.css';
import './App.css';
import queryString from 'query-string';

let defaultStyle = {
  color: '#fff',
  'font-family': 'Helvetica Neue',
  font: '80%',
  padding: '10px'
}

let counterStyle = {
  ...defaultStyle,
  width: "40%",
  display: "inline-block",
  'margin-top': '10px',
  'font-size': '30px',
  'line-height': '30px'
}

class PlaylistCounter extends Component {
  render() {

    return (
      <div style={counterStyle}>
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
    let isTooLow = (totalDuration / 3600000) < 10
    let hoursCounterStyle = {
      ...counterStyle,
      color: isTooLow ? 'red' : 'white',
      'font-weight': isTooLow ? 'bold' : 'normal'
    }
    return (
      <div style={hoursCounterStyle}>
        <h2> {Math.round(totalDuration / 3600000)} hours </h2>
      </div>
    );
  }
}

class Filter extends Component {
  render() {
    return (
      <div style={defaultStyle} >
        <img />
        <input style={{
          ...defaultStyle,
          color: 'black',
          'font-size': '20px'
        }} placeholder="Filter" type='text'
          onKeyUp={event => this.props.onTextChange(event.target.value)} />
      </div>
    );
  }
}

class Playlist extends Component {
  render() {

    const playlist = this.props.playlist
    let matches;
    playlist.name.toLowerCase().includes(this.props.filterString.toLowerCase())
      ? matches = playlist.songs
      : matches = playlist.songs.filter(song => {

        let matchesSong = song.name.toLowerCase().includes(
          this.props.filterString.toLowerCase()
        )

        let matchesArtist = song.artist.toLowerCase().includes(
          this.props.filterString.toLowerCase()
        )

        return matchesSong || matchesArtist
      })

    return (
      <div style={{
        ...defaultStyle,
        'text-align': 'center',
        display: "inline-block",
        width: "23%",
        'vertical-align': 'top'
      }}>
        <img src={playlist.imageUrl} style={{
          width: "170px",
          'border-radius': '50%',
          padding: '15px',
        }} />
        <h3 style={{
          'font-size': '24px',
          'font-weight': 'bold'
        }}> {playlist.name} </h3>
        <ul>
          {
            matches.slice(0, 3).map(song =>
              <li style={{
                'padding-top': '2px',
                color: '#D7DBDD',
                'font-size': '16px',
                'line-height': '1.5'
              }}> {song.name} </li>
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
                artist: trackData.artists[0].name,
                name: trackData.name,
                duration: trackData.duration_ms
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
            songs: item.trackDatas
          }
        })
      }))

  }


  render() {
    let playlistToRender =
      this.state.user &&
        this.state.playlists
        ? this.state.playlists.filter(playlist => {
          let matchesPlaylist = playlist.name.toLowerCase().includes(
            this.state.filterString.toLowerCase()
          )
          let matchesSong = playlist.songs.filter(song => song.name.toLowerCase().includes(
            this.state.filterString.toLowerCase())
          )
          let matchesArtist = playlist.songs.filter(song => song.artist.toLowerCase().includes(
            this.state.filterString.toLowerCase())
          )
          return matchesPlaylist || matchesSong.length > 0 || matchesArtist.length > 0
        }) : []

    return (
      <div className="App" >
        {
          this.state.user
            ? <div>
              <h1 style={{
                ...defaultStyle,
                'fontSize': '54px',
                'margin-top': '5px'
              }}>
                {this.state.user.name}'s Playlist
            </h1>
              <PlaylistCounter playlists={playlistToRender} />
              <HoursCounter playlists={playlistToRender} />
              <Filter onTextChange={text => this.setState({ filterString: text })} />
              <div>
                {playlistToRender.map((playlist, i) =>
                  <Playlist index={i} filterString={this.state.filterString} playlist={playlist} />
                )}
              </div>
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
