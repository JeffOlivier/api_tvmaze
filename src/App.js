import React, { Component } from "react";
import SingleShow from "./components/singleShow";
import SingleEpisode from "./components/singleEpisode";

import "./App.css";

class App extends Component { 
  constructor(props) {
    super(props);
    this.state = {
      hasSearchedBefore: false,
      searchTerm: '',
      loading: false,
      shows: [],
      isSearchFormValid: true,
      loadingEpisodes: false,
      episodes: [],
      showWhat: ''
    };

    this.handleValidateInput = this.handleValidateInput.bind(this);
  }

  handleValidateInput = e => {
    const validChars = /^[a-zA-Z0-9]+$/i;
    const searchInput = e.target.value;

    const isFormInputValid = validChars.test(searchInput);
    this.setState({ isSearchFormValid: isFormInputValid });

    document.getElementById('searchBtn').disabled = !(isFormInputValid);
  
    if (isFormInputValid) {
      document.getElementById("findSearchTerm").classList.remove("textInputError");
      document.getElementById("searchBtn").classList.remove("submitButtonDisable");
      document.getElementById("inputErrorMessage").style.display = "none";
    } else {
      document.getElementById("findSearchTerm").classList.add("textInputError");
      document.getElementById("searchBtn").classList.add("submitButtonDisable");
      document.getElementById("inputErrorMessage").style.display = "block";
    }
  }

  fetchShows = (searchTerm1) => {
    const searchTerm = searchTerm1.trim();
    const apiFullUrl = `https://api.tvmaze.com/search/shows?q=${searchTerm}`;

    if ((searchTerm == null) || (searchTerm === '')) return;
    
    this.setState({ loading: true });
    
    fetch(apiFullUrl)
        .then(response => response.json())
        .then(response => this.setState({ shows: response, hasSearchedBefore: true, loading: false, searchTerm: searchTerm }))
        .catch(err => { console.log(err); });
    
    this.setState({ showWhat: 'shows' });
  }

  fetchEpisodes = (showId) => {
    const apiEpisodesUrl = `https://api.tvmaze.com/shows/${showId}/episodes`;
    
// console.log('Request to get episodes for show ID:'+showId);
console.log('apiEpisodesUrl', apiEpisodesUrl);

    this.setState({ loadingEpisodes: true });
    
    fetch(apiEpisodesUrl)
        .then(response => response.json())
        .then(response => this.setState({ episodes: response, loadingEpisodes: false }))
// .then(response => console.log('EPISODES', this.state.episodes))
        .catch(err => { console.log(err); });
    
    this.setState({ showWhat: 'episodes' });
  }

  render() {
    let foundShowsOutput;
    if (!this.state.hasSearchedBefore) {
      foundShowsOutput = <div className="centerMe">Use the search field above to find TV shows</div> 
    } else if (this.state.loading) {
       return <div className="centerMe">finding TV shows ...</div>
    } else if (this.state.showWhat === 'episodes') {
      foundShowsOutput = this.state.episodes.map((episode) => (
        <SingleEpisode {...episode} key={episode.id} />
      ))
    } else if (this.state.hasSearchedBefore && this.state.shows.length === 0) {
      foundShowsOutput = <div className="centerMe">Could not find any shows matching "<strong>{this.state.searchTerm}</strong>"</div>
    } else {
      foundShowsOutput = this.state.shows.map((show) => (
        <SingleShow {...show.show} key={show.show.id} showEpisodes={this.fetchEpisodes}/>
      ))
    }

    return (
      <React.Fragment>
        <div className="searchContainer">
            <div id="inputErrorMessage" className="inputErrorMessage">Only letters and numbers are allowed in this search form</div>
            <span className="fas fa-search fa-2x"></span>
            <input id="findSearchTerm" className="input_searchterm" type="text" onKeyUp={this.handleValidateInput} placeholder="Enter search term" required />
            <button id="searchBtn" className="btn btn_search" type='button' onClick={() => this.fetchShows(document.getElementById('findSearchTerm').value)}>SEARCH</button>
        </div>

        <div id="listOfShows" className="results_block">
          {foundShowsOutput}
        </div>
      </React.Fragment>
    );
  }

}

export default App;
