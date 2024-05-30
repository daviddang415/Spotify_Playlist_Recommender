# Spotify Playlist Recommender

Spotify Playlist Recommender is a web application that suggests new songs for Spotify users according to their playlists. The web app prompts the user to log in to the site using their Spotify account and will then display their public playlists as rows of cards. Each card can be clicked on and will display the playlist's songs. Additionally, a card will have a button that will create a playlist with songs that are similar to songs from the chosen playlist. The web app uses machine learning, specifically cosine similarity, to recommend new songs based on a given song's audio features and genre (obtained through the Spotify API). Once a newly recommended playlist is generated, the web app stores it in a database and displays this playlist as another card. This card allows the user to add the corresponding recommended playlist to their Spotify account.

## Getting Started

### Installing

Enter a directory and clone this repo:

```
git clone https://github.com/daviddang415/Spotify_Playlist_Recommender.git
```

Install dependencies:

```
npm install
```

### Running application

Start the server (which will also start the database) in the ```backend``` directory:

```
cd backend
nodemon server.js
```

Start the react application in the ```frontend``` directory:

```
cd frontend
npm start
```

## Built With

### Backend
* [Spotify API](https://developer.spotify.com/documentation/web-api) - Access user's public playlists and song data
* [Scikit-learn](https://scikit-learn.org/0.21/documentation.html) - Machine learning Python library 
* [Node](https://nodejs.org/en) - Server environment
* [Express](https://expressjs.com/) - Node web framework
* [MySQL](https://maven.apache.org/) - Relational database

### Frontend
* [React](https://react.dev/) - Frontend Javascript library
* [Bootstrap](https://getbootstrap.com/) - CSS library
