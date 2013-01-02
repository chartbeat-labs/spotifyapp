Chartbeat Spotify Application. Very beta :)

Prerequisites
=============

You need a [Spotify developer account](https://developer.spotify.com/technologies/apps/#developer-account) to use the application.

Installation
============

    mkdir ~/Spotify
    cd ~/Spotify
    git clone git@github.com:chartbeat/spotifyapp.git apps-chartbeat
    (restart Spotify)
    enter 'spotify:app:chartbeat' in the Search box

Known Issues
============

Not a lot of time was spent on this, so there are *plenty* of issues :)

* it seems like you can't "favorite" a developer app, at least not on
  OS X, so you have to search for the app on each app start. Pretty
  tedious.

* the app plays the song over and over as long as you are over the
  threshold. Obviously not optimal.

* it is fairly unclear what the lifetime of a Spotify app actually is,
  since
  [the docs](https://developer.spotify.com/technologies/apps/guidelines/integration/#applicationlifetime)
  are clearly wrong. Currently on OS X, the app works fine "in the background".

Links
=====

* [Spotify App Integration Guidelines](https://developer.spotify.com/technologies/apps/guidelines/integration/)
* [Spotify App JS Docs](https://developer.spotify.com/technologies/apps/docs/)
* [Spotify Tutorial App](https://github.com/spotify/apps-tutorial)
* [Chartbeat API Documentation](http://chartbeat.com/docs/api/)
