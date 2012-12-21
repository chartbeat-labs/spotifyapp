/* global $, console, getSpotifyApi */

function main() {
  console.log("main()");

  $("#play").click(function(event) {
    console.log("play()");
    var sp = getSpotifyApi();
    var models = sp.require('$api/models');
    var player = models.player;
    player.play("spotify:track:5Y55FgnTswJip7H7HfCOpa");
  });
};

$(document).ready(main);
