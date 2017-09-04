describe('Pub Sub Tests', function () {
  it('should be an object', function () {
    var ps = new PubSub();

    expect(ps).toBeTruthy();
  });

  it('should error when you don\'t provide an channel name', function () {
    var ps = new PubSub();
    expect(function () {
      ps.on();
    }).toThrow(new Error('you must provide a channel name'));
  });

  it('should error when you don\'t provide an topic name', function () {
    var ps = new PubSub();
    expect(function () {
      ps.on('main');
    }).toThrow(new Error('you must provide an topic name'));
  });

  it('should error when you don\'t provide a subscriber callback function', function () {
    var ps = new PubSub();

    expect(function () {
      var s = ps.on('main', 'item.changed');
    }).toThrow(new Error('you must provide a subscriber callback function'));
  });

  it('should have 1 registered subscriber', function () {
    var ps = new PubSub();
    var sub = ps.on('main', 'item.changed', function () {});

    expect(ps.count()).toBe(1);
  });

  it('should have 2 registered subscribers', function () {
    var ps = new PubSub();
    ps.on('main', 'item.changed', function () {});
    ps.on('main', 'item.changed', function () {});

    expect(ps.count()).toBe(2);
  });

  it('should have 3 total registered subscribers on two channels', function () {
    var ps = new PubSub();
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

    var ps = new PubSub();
    ps.on('main', 'item.changed', function () {
      obj.called = true;
    });
    ps.publish('main', 'item.changed');

    expect(obj.called).toBeTruthy();
  });

  it('should throw an error because a valid callback function was not provided', function () {
    var ps = new PubSub();

    expect(function () {
      ps.on('main', 'item.changed', 'callback');
    }).toThrow(new Error('you must provide a subscriber callback function'));
  });

  it('should unregister a subscription', function () {
    var ps = new PubSub();
    var s1 = ps.on('main', 'item.added', function () {});
    var s2 = ps.on('main', 'item.changed', function () {});

    ps.off('main', 'item.changed', s2);

    expect(ps.count()).toBe(1);
  });

  it('should output the current channel list and subscriber count', function() {
    var ps = new PubSub();
    var s1 = ps.on('main', 'item.added', function () {});
    var s2 = ps.on('main', 'item.deleted', function () {});
    var s3 = ps.on('other', 'item.added', function () {});

    var channels = ps.channels();

    expect(channels.length).toBe(2);
    expect(channels[0].count).toBe(2);
    expect(channels[1].count).toBe(1);
  });

  it('should register two callbacks and execute one callback', function () {
    var data = {
      called1: false,
      called2: false
    };

    var ps = new PubSub();
    ps.on('main', 'item.added', function () {
      data.called1 = true
    });
    ps.on('main', 'item.changed', function () {
      data.called2 = true
    });

    ps.publish('main', 'item.added');

    expect(data.called1).toBeTruthy();
    expect(data.called2).toBeFalsy();
  });

  it('should register two callbacks and execute both callbacks', function () {
    var called1 = false;
    var called2 = false;

    var ps = new PubSub();
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

    var ps = new PubSub();
    ps.on('main', 'item.added', function (response) {
      data = response;
    });
    ps.publish('main', 'item.added', {name: 'foo', hasData: true});

    expect(data.hasData).toBeTruthy();
  });
});