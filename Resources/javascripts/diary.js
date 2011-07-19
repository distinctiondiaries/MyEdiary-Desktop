/* DO NOT MODIFY. This file was compiled Thu, 14 Jul 2011 09:29:49 GMT from
 * /Users/ritchiey/Projects/getpositive/myediary/app/coffeescripts/diary.coffee
 */

(function() {
  var MyEDiaryApp, extend, include, root;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  extend = function(obj, mixin) {
    var method, name, _results;
    _results = [];
    for (name in mixin) {
      method = mixin[name];
      _results.push(obj[name] = method);
    }
    return _results;
  };
  include = function(klass, mixin) {
    return extend(klass.prototype, mixin);
  };
  root = typeof window !== "undefined" && window !== null ? window : global;
  root.DateRange = (function() {
    function DateRange(start, finish) {
      this.start = start;
      this.finish = finish;
    }
    DateRange.weekFor = function(date, weekStartsOn) {
      var firstDay, lastDay;
      if (weekStartsOn == null) {
        weekStartsOn = 0;
      }
      firstDay = date.getDay() === weekStartsOn ? new Date(date) : new Date(date).moveToDayOfWeek(weekStartsOn, -1);
      lastDay = new Date(firstDay).add(6).days();
      return new this(firstDay, lastDay);
    };
    DateRange.prototype.includes = function(date) {
      return date.between(this.start, this.finish);
    };
    DateRange.prototype.days = function() {
      var milliseconds_per_day;
      milliseconds_per_day = 1000 * 60 * 60 * 24;
      return (this.finish - this.start) / milliseconds_per_day;
    };
    DateRange.prototype.day = function(index) {
      return new Date(this.start).add(index).days();
    };
    return DateRange;
  })();
  root.SchoolEvent = (function() {
    function SchoolEvent(data) {
      var attr, val;
      for (attr in data) {
        val = data[attr];
        if (attr === 'start' || attr === 'finish') {
          this[attr] = this.parseJsonDate(val);
        } else {
          this[attr] = val;
        }
      }
    }
    SchoolEvent.prototype.parseJsonDate = function(dateStr) {
      var a;
      a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(dateStr);
      if (a) {
        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
      }
    };
    SchoolEvent.prototype.occursOn = function(date) {
      return this.start.clearTime().compareTo(date.clearTime()) === 0;
    };
    return SchoolEvent;
  })();
  root.SchoolEventCollection = (function() {
    SchoolEventCollection.prototype.model = SchoolEvent;
    function SchoolEventCollection(data) {
      if (data == null) {
        data = {};
      }
      this.update = __bind(this.update, this);
      this.update(data);
    }
    SchoolEventCollection.prototype.fetch = function() {
      return $.retrieveJSON('/events.json', this.update);
    };
    SchoolEventCollection.prototype.update = function(data) {
      var object;
      this.models = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          object = data[_i];
          _results.push(new SchoolEvent(object.event));
        }
        return _results;
      })();
      return this.trigger('updated');
    };
    SchoolEventCollection.prototype.all = function() {
      var event, _i, _len, _ref, _results;
      _ref = this.models;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        event = _ref[_i];
        _results.push(event);
      }
      return _results;
    };
    SchoolEventCollection.prototype.during = function(dateRange) {
      var event, _i, _len, _ref, _results;
      _ref = this.models;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        event = _ref[_i];
        if (dateRange.includes(event.start)) {
          _results.push(event);
        }
      }
      return _results;
    };
    return SchoolEventCollection;
  })();
  include(SchoolEventCollection, Backbone.Events);
  MyEDiaryApp = (function() {
    function MyEDiaryApp() {
      this.showWeekView = __bind(this.showWeekView, this);
      this.updateCurrentView = __bind(this.updateCurrentView, this);      this.schoolEvents = new SchoolEventCollection();
      this.schoolEvents.bind('updated', this.updateCurrentView);
      this.currentDay = new Date();
    }
    MyEDiaryApp.prototype.updateCurrentView = function() {
      return this.showWeekView();
    };
    MyEDiaryApp.prototype.pageReady = function() {
      $('#hide-widgets-button').click(this.hideWidgetsPanel);
      $('#show-widgets-button').click(this.showWidgetsPanel);
      $('a[href="#export"]').click(this.showTaskView);
      $('a[href="#calendar"]').click(this.showWeekView);
      return this.schoolEvents.fetch();
    };
    MyEDiaryApp.prototype.showWeekView = function() {
      this.drawWeekView(this.currentDay);
      $('#week-view').show();
      return $('#task-view').hide();
    };
    MyEDiaryApp.prototype.drawWeekView = function(date) {
      var $day, day, dayNames, daysEvents, event, i, week, weeksEvents, _ref, _results;
      dayNames = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
      week = DateRange.weekFor(date);
      weeksEvents = this.schoolEvents.during(week);
      _results = [];
      for (i = 0, _ref = week.days() - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
        day = week.day(i);
        daysEvents = (function() {
          var _i, _len, _results2;
          _results2 = [];
          for (_i = 0, _len = weeksEvents.length; _i < _len; _i++) {
            event = weeksEvents[_i];
            if (event.occursOn(day)) {
              _results2.push(event);
            }
          }
          return _results2;
        })();
        $day = $("#" + dayNames[i]);
        $day.find('.date').html(day.getDate());
        _results.push($day.find('ul.events').html($('#event-template').tmpl(daysEvents)));
      }
      return _results;
    };
    MyEDiaryApp.prototype.showTaskView = function() {
      $('#week-view').hide();
      return $('#task-view').show();
    };
    MyEDiaryApp.prototype.hideWidgetsPanel = function() {
      $('#widgets').hide();
      return $('#show-widgets-button').show();
    };
    MyEDiaryApp.prototype.showWidgetsPanel = function() {
      $('#widgets').show();
      return $('#show-widgets-button').hide();
    };
    return MyEDiaryApp;
  })();
  jQuery(function() {
    var app;
    app = new MyEDiaryApp();
    return app.pageReady();
  });
}).call(this);
