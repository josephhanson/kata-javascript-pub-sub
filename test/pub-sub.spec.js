describe('Pub Sub Tests', function () {
  var ps;

  beforeEach(function() {
    ps = new PubSub();
  });

  it('should be an object', function () {
    expect(ps).toBeTruthy();
  });

  it('should error when you don\'t provide an channel name', function () {
    expect(function () {
      ps.on();
    }).toThrow(new Error('you must provide a channel name'));
  });

  it('should error when you don\'t provide an topic name', function () {
    expect(function () {
      ps.on('main');
    }).toThrow(new Error('you must provide an topic name'));
  });

  it('should error when you don\'t provide a subscriber callback function', function () {
    expect(function () {
      var s = ps.on('main', 'item.changed');
    }).toThrow(new Error('you must provide a subscriber callback function'));
  });

  it ('should error if you dont provide a channel when you publish', function () {
    expect(function() {
      ps.publish();
    }).toThrow(new Error('you must provide a channel and a topic'));
  });

  it ('should error if you dont provide a topic when you publish', function () {
    expect(function() {
      ps.publish('main');
    }).toThrow(new Error('you must provide a channel and a topic'));
  });

  it ('should error if you only provide channel || topic and data when you publish', function () {
    expect(function() {
      ps.publish('main', {data: true});
    }).toThrow(new Error('you must provide a channel and a topic'));
  });

  it ('should error if you dont provide a channel, topic, and subscription when you remove a subscription', function () {
    var subscription = ps.on('main', 'item.changed', function () {});

    expect(function() {
      ps.off('main');
    }).toThrow(new Error('you must provide a channel, topic, and subscription'));

    expect(function() {
      ps.off('main', 'item.changed');
    }).toThrow(new Error('you must provide a channel, topic, and subscription'));

    expect(function() {
      ps.off('main', subscription);
    }).toThrow(new Error('you must provide a channel, topic, and subscription'));
  });

  it('should have 1 registered subscriber', function () {
    var sub = ps.on('main', 'item.changed', function () {});

    expect(ps.count()).toBe(1);
  });

  it('should have 2 registered subscribers', function () {
    ps.on('main', 'item.changed', function () {});
    ps.on('main', 'item.changed', function () {});

    expect(ps.count()).toBe(2);
  });

  it('should have 3 total registered subscribers on two channels', function () {
    ps.on('main', 'item.changed', function () {});
    ps.on('main', 'item.changed', function () {});
    ps.on('private', 'item.changed', function () {});

    expect(ps.count()).toBe(3);
  });

  it('should receive a publish topic', function () {
    var obj = {
      called: false,
      cb: function () {
        this.called = true;
      }
    };

    ps.on('main', 'item.changed', function () {
      obj.called = true;
    });
    ps.publish('main', 'item.changed');

    expect(obj.called).toBeTruthy();
  });

  it('should throw an error because a valid callback function was not provided', function () {
    expect(function () {
      ps.on('main', 'item.changed', 'callback');
    }).toThrow(new Error('you must provide a subscriber callback function'));
  });

  it('should unregister a subscription', function () {
    var s1 = ps.on('main', 'item.added', function () {});
    var s2 = ps.on('main', 'item.changed', function () {});

    ps.off('main', 'item.changed', s2);

    expect(ps.count()).toBe(1);
  });

  it('should output the current channel list and subscriber count', function() {
    var s1 = ps.on('main', 'item.added', function () {});
    var s2 = ps.on('main', 'item.deleted', function () {});
    var s3 = ps.on('other', 'item.added', function () {});

    var channels = ps.channels();

    expect(channels.length).toBe(2);
    expect(channels[0].count).toBe(2);
    expect(channels[1].count).toBe(1);
  });

  it('should register two callbacks and execute one callback', function () {
    var called1 = false;
    var called2 = false;

    ps.on('main', 'item.added', function () {
      called1 = true
    });
    ps.on('main', 'item.changed', function () {
      called2 = true
    });

    ps.publish('main', 'item.added');

    expect(called1).toBeTruthy();
    expect(called2).toBeFalsy();
  });

  it('should register two callbacks and execute both callbacks', function () {
    var called1 = false;
    var called2 = false;

    ps.on('main', 'item.added', function () {
      called1 = true
    });
    ps.on('main', 'item.added', function () {
      called2 = true
    });

    ps.publish('main', 'item.added');

    expect(called1).toBeTruthy();
    expect(called2).toBeTruthy();
  });

  it('should receive a callback with data', function () {
    var data = null;

    ps.on('main', 'item.added', function (response) {
      data = response;
    });
    ps.publish('main', 'item.added', {name: 'foo', hasData: true});

    expect(data.hasData).toBeTruthy();
  });
});