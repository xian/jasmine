describe("TrivialReporter", function() {
  var trivialReporter;
  var body;

  beforeEach(function() {
    body = document.createElement("body");
  });

  function fakeSpec(name) {
    return {
      getFullName: function() { return name; }
    };
  }

  it("should run only specs beginning with spec parameter", function() {
    trivialReporter = new jasmine.TrivialReporter({ location: {search: "?spec=run%20this"} });
    expect(trivialReporter.specFilter(fakeSpec("run this"))).toBeTruthy();
    expect(trivialReporter.specFilter(fakeSpec("not the right spec"))).toBeFalsy();
    expect(trivialReporter.specFilter(fakeSpec("not run this"))).toBeFalsy();
  });

  it("should display empty divs for every suite when the runner is starting", function() {
    trivialReporter = new jasmine.TrivialReporter({ body: body });
    trivialReporter.reportRunnerStarting({
      suites: function() {
        return [ new jasmine.Suite({}, "suite 1", null, null) ];
      }
    });

    var divs = body.getElementsByTagName("div");
    expect(divs.length).toEqual(2);
    expect(divs[1].innerHTML).toContain("suite 1");
  });

  describe("failure messages (integration)", function () {
    var spec, results, expectationResult;

    beforeEach(function() {
      results = {
        passed: function() {return false;},
        getItems: function(){}};

      spec = {
        suite: {
          getFullName: function() {return "suite 1";}
        },
        getFullName: function() {return "foo";},
        results: function(){return results;}
      };

      trivialReporter = new jasmine.TrivialReporter({ body: body });
      trivialReporter.reportRunnerStarting({
        suites: function() {
          return [ new jasmine.Suite({}, "suite 1", null, null) ];
        }
      });
    });

    it("should add the failure message to the DOM (non-toEquals matchers)", function() {
      expectationResult = new jasmine.ExpectationResult("toBeNull", false, "Expected 'a' to be null, but it was not");
      spyOn(results, 'getItems').andReturn([expectationResult]);

      trivialReporter.reportSpecResults(spec);

      var divs = body.getElementsByTagName("div");
      expect(divs[3].innerHTML).toEqual("Expected 'a' to be null, but it was not");
    });
  });
  describe("reportFailure", function () {
    var expectationResult, errorDiv;

    beforeEach(function() {
      errorDiv = trivialReporter.createDom('div',{display: 'none'});
    });

    it("should add the failure message to the DOM (non-toEquals matchers)", function() {
      expectationResult = new jasmine.ExpectationResult("toBeNull", false, "Expected 'a' to be null, but it was not");

      trivialReporter.reportFailure(expectationResult, errorDiv);

      var divs = errorDiv.getElementsByTagName("div");
      expect(divs[0].innerHTML).toEqual("Expected 'a' to be null, but it was not");
    });

    it("should add the failure messages to the DOM (toEquals matchers)", function() {
      expectationResult = new jasmine.ExpectationResult("toEqual",
            false,
            "Expected does not equal actual; foo; bar;",
            'foo',
            'bar',
            {
              mismatchKeys: ["a string", "another string"],
              mismatchValues: ["a value"]
            });

      trivialReporter.reportFailure(expectationResult, errorDiv);

      var divs = errorDiv.getElementsByTagName("div");
      expect(divs[0].innerHTML).toContain('Expected<span class="expected result">\'foo\'</span>but got<span class="actual result">\'bar\'</span>');
     });


  });

});
