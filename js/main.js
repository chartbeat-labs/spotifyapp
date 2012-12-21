/* global $, console, getSpotifyApi, localStorage */

var chartbeat = {};

//////////////////////////////////////////////////////////////////////
// chartbeat.App
/**
 * Main Application. Automatically starts tracking
 */
chartbeat.App = function() {
  console.log("App()");

  /** How often should we call the Chartbeat API */
  this.frequency = 3000;

  this.checkFirstRun();

  var sp = getSpotifyApi();
  this.models = sp.require('$api/models');
  this.models.application.observe(this.models.EVENT.LINKSCHANGED,
                                  this.handleLink.bind(this));

  $("#setupform").sisyphus();

  // TODO: Check that all settings have been filled in before
  // starting.
  this.checkApi();
};

chartbeat.App.prototype.checkFirstRun = function() {
  if (localStorage["firstRunDone"]) {
    return;
  }
  console.log("First run!");

  // Set up to run for gizmodo.com by default
  this.setSetting("domain", "gizmodo.com", true);
  this.setSetting("apikey", "317a25eccba186e0f6b558f45214c0e7", true);
  this.setSetting("concurrents", "30000", true);
  this.setSetting("songtoplay", "spotify:track:5Y55FgnTswJip7H7HfCOpa", true);

  localStorage["firstRunDone"] = true;
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
chartbeat.App.prototype.setSetting = function(setting, value, dontsave) {
  $('#' + setting)[0].value = value;
  if (!dontsave) {
    $.sisyphus().saveAllData();
  }
};

chartbeat.App.prototype.setErrorMessage = function(msg) {
  $("#error")[0].innerHTML = msg;
};

/**
 * Get's called with the Chartbeat API data.
 */
chartbeat.App.prototype.handleApi = function(data) {
  var threshold = this.getSetting("concurrents");
  var concurrents = data.people;
  $("#current")[0].innerHTML = "" + concurrents;
  this.setErrorMessage("");
  if (threshold && concurrents >= threshold) {
    console.log("Concurrents: " + concurrents + " > " + threshold);
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
 * Get's called when there is an error fetching the data.
 */
chartbeat.App.prototype.handleApiError = function(req) {
  console.log("handleApiError(status: " + req.status + ")");
  try {
    var data = JSON.parse(req.responseText);
    console.log("Error: " + data.error);
    this.setErrorMessage(data.error + " (" + req.status + ")");
  } catch (e) {
    console.log("Could not parse JSON response: " + req.responseText);
    this.setErrorMessage("Unknown error (" + req.status + ")");
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
  $.getJSON(url, this.handleApi.bind(this))
   .error(this.handleApiError.bind(this));
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
