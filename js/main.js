/* global $, console, getSpotifyApi, localStorage */

var chartbeat = {};

//////////////////////////////////////////////////////////////////////
// chartbeat.App
/**
 * Main Application. Automatically starts tracking
 */
chartbeat.App = function() {
  console.log("App()");

  this.frequency = 3000;

  var sp = getSpotifyApi();
  this.models = sp.require('$api/models');
  this.models.application.observe(this.models.EVENT.LINKSCHANGED,
                                  this.handleLink.bind(this));

  $("#setupform").sisyphus({"timeout": 3});

  // TODO: Check that all settings have been filled in before
  // starting.
  this.checkApi();
};

/**
 * Get a configuration value.
 */
chartbeat.App.prototype.getSetting = function(setting) {
  return $('#' + setting)[0].value;
};

/**
 * Set a configuration value.
 */
chartbeat.App.prototype.setSetting = function(setting, value) {
  $('#' + setting)[0].value = value;
  $.sisyphus().saveAllData();
};

/**
 * Get's called with the Chartbeat API data.
 */
chartbeat.App.prototype.handleApi = function(data) {
  var threshold = this.getSetting("concurrents");
  if (threshold && data.people >= threshold) {
    console.log("Concurrents: " + data.people + " > " + threshold);
    var songToPlay = this.getSetting("songtoplay");
    var player = this.models.player;
    // TODO: This will keep on playing the song > threshold. Probably
    // not what you normally want....
    if (!player.playing || player.track.data.uri != songToPlay) {
      player.play(songToPlay);
    };
  }
  window.setTimeout(this.checkApi.bind(this), this.frequency);
};

/**
 * Call the Chartbeat API -- every this.frequency
 */
chartbeat.App.prototype.checkApi = function() {
  var domain = this.getSetting("domain");
  var apikey = this.getSetting("apikey");
  var url = "http://api.chartbeat.com/live/quickstats/v3/?apikey=" + apikey + "&host=" + domain;
  $.getJSON(url, this.handleApi.bind(this));
};

/**
 * Handles drag'n'drop of links on to the app.
 */
chartbeat.App.prototype.handleLink = function() {
  console.log("handleLink()");
  var link = this.models.application.links;
  console.log("setting song to play: " + link);
  this.setSetting("songtoplay", link);
};


//////////////////////////////////////////////////////////////////////
// main()
function main() {
  console.log("main()");
  var app = new chartbeat.App();
};
$(document).ready(main);
