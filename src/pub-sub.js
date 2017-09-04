var PubSub = (function() {
  'use strict';

  function PubSub() {
    this._subscribers = {};
  }

  PubSub.prototype.on = function(channel, topic, callback) {
    if (channel === undefined || channel === '') throw new Error('you must provide a channel name');
    if (topic === undefined || topic === '') throw new Error('you must provide an topic name');
    if (callback === undefined || typeof callback !== 'function') throw new Error('you must provide a subscriber callback function');

    var subscriber = {channel: channel, topic: topic, callback: callback};

    if (!this._subscribers[channel]){
      this._subscribers[channel] = [{topic: topic, callback: callback, subscriber: subscriber}]
    } else {
      this._subscribers[channel].push({topic: topic, callback: callback, subscriber: subscriber});
    }

    return subscriber;
  };

  PubSub.prototype.off = function(channel, topic, subscription) {
    if (channel === undefined || typeof channel !== 'string' ||
      topic === undefined || typeof topic !== 'string' ||
      subscription === undefined || typeof subscription !== 'object'){
      throw new Error('you must provide a channel, topic, and subscription');
    }
    if (this._subscribers[channel]) {
      var topics = this._subscribers[channel];
      for (var i = 0; i<topics.length; i++) {
        if (topic === topics[i].topic && subscription === topics[i].subscriber) {
          topics.splice(i, 1);
        }
      }
    }
  };

  PubSub.prototype.count = function() {
    var count = 0;
    for(var prop in this._subscribers) {
      if (this._subscribers.hasOwnProperty(prop)) {
        count+= this._subscribers[prop].length;
      }
    }
    return count;
  };

  PubSub.prototype.channels = function() {
    var channels = [];
    for(var prop in this._subscribers) {
      if (this._subscribers.hasOwnProperty(prop)) {
        channels.push({channel: prop, count: this._subscribers[prop].length});
      }
    }
    return channels;
  };

  PubSub.prototype.publish = function(channel, topic, data) {
    if (channel === undefined || typeof channel !== 'string' || topic === undefined || typeof topic !== 'string') {
      throw new Error('you must provide a channel and a topic');
    }

    if (this._subscribers[channel]) {
      var topics = this._subscribers[channel];

      for (var i = 0; i<topics.length; i++) {
        if(topic === topics[i].topic) {
          try {
            topics[i].callback(data);
          } catch (ex) {
            // subscribers problem if they are throwing errors - not ours
          }
        }
      }
    }
  };

  return PubSub;
})();