describe("jasmine.Matchers", function() {
  var env, spec;
  
  beforeEach(function() {
    env = new jasmine.Env();
    spec = new jasmine.Spec(env, {}, "");

    this.addMatchers({
      toPass: function() {
        this.actual = this.actual.passed();
        var result = this.toEqual(true);
        result.matcherName = "toPass";
        return result;
      },
      toFail: function() {
        this.actual = this.actual.passed();
        var result = this.toEqual(false);
        result.matcherName = "toFail";
        return result;
      }
    });
  });
  
  function match(value) {
    return spec.expect(value);
  }

  it("toEqual with primitives, objects, dates, html nodes, etc.", function() {
    expect(match(true).toEqual(true)).toPass();

    expect(match({foo:'bar'}).toEqual(null)).toFail();

    var functionA = function() { return 'hi'; };
    var functionB = function() { return 'hi'; };
    expect(match({foo:functionA}).toEqual({foo:functionB})).toFail();
    expect(match({foo:functionA}).toEqual({foo:functionA})).toPass();

    expect((match(false).toEqual(true))).toFail();

    var circularGraph = {};
    circularGraph.referenceToSelf = circularGraph;
    expect((match(circularGraph).toEqual(circularGraph))).toPass();

    var nodeA = document.createElement('div');
    var nodeB = document.createElement('div');
    expect((match(nodeA).toEqual(nodeA))).toPass();
    expect((match(nodeA).toEqual(nodeB))).toFail();

    expect((match(new Date(2008, 1, 3, 15, 17, 19, 1234)).toEqual(new Date(2009, 1, 3, 15, 17, 19, 1234)))).toFail();
    expect((match(new Date(2008, 1, 3, 15, 17, 19, 1234)).toEqual(new Date(2008, 1, 3, 15, 17, 19, 1234)))).toPass();


    expect(match(true).toNotEqual(false)).toPass();
    expect((match(true).toNotEqual(true))).toFail();

    expect((match(['a', 'b']).toEqual(['a', undefined]))).toFail();
    expect((match(['a', 'b']).toEqual(['a', 'b', undefined]))).toFail();
  });

  it("toEqual to build an Expectation Result", function() {
    var matcher = match('a');
    matcher.toEqual('b');

    var result = matcher.results().getItems()[0];
    
    expect(result.matcherName).toEqual("toEqual");
    expect(result).toFail();
    expect(result.message).toEqual("Expected does not equal actual");
    expect(result.expected).toEqual("b");
    expect(result.actual).toEqual("a");
  });

  describe(".not", function() {
    it(".toEqual should be inverted from regular .toEqual", function() {
      expect(match(true).not.toEqual(true)).toFail();
      expect(match(true).toEqual(true)).not.toFail();
    });

    it("should work with custom matchers", function() {
      var customMatcher = function() {
      };
      spec.addMatchers({
        someCustomMatcher: customMatcher
      });

      expect(match(true).someCustomMatcher).toBeDefined();
      expect(match(true).not.someCustomMatcher).toBeDefined();
    });
  });

  it("toNotEqual to build an Expectation Result", function() {
    var matcher = match('a');
    matcher.toNotEqual('a')

    var result = matcher.results().getItems()[0];

    expect(result.matcherName).toEqual("toNotEqual");
    expect(result).toFail();
    expect(result.message).toEqual("Expected and actual are equal, but should not be");
    expect(result.expected).toEqual("a");
    expect(result.actual).toEqual("a");
  });

  it('toBe should return true only if the expected and actual items === each other', function() {
    var a = {};
    var b = {};
    //noinspection UnnecessaryLocalVariableJS
    var c = a;
    expect((match(a).toBe(b))).toFail();
    expect((match(a).toBe(a))).toPass();
    expect((match(a).toBe(c))).toPass();
    expect((match(a).toNotBe(b))).toPass();
    expect((match(a).toNotBe(a))).toFail();
    expect((match(a).toNotBe(c))).toFail();
  });

  it("toBe to build an ExpectationResult", function() {
    var matcher = match('a');
    matcher.toBe('b');

    var result = matcher.results().getItems()[0];

    expect(result.matcherName).toEqual("toBe");
    expect(result).toFail();
    expect(result.message).toEqual("Expected and actual are not the same object");
    expect(result.expected).toEqual("b");
    expect(result.actual).toEqual("a");
  });

  it("toNotBe to build an ExpectationResult", function() {
    var a = 'a';
    var matcher = match(a);
    matcher.toNotBe(a);

    var result = matcher.results().getItems()[0];

    expect(result.matcherName).toEqual("toNotBe");
    expect(result).toFail();
    expect(result.message).toEqual("Expected and actual are the same object, but should not be");
    expect(result.expected).toEqual(a);
    expect(result.actual).toEqual(a);
  });

  it("toMatch and #toNotMatch should perform regular expression matching on strings", function() {
    expect((match('foobarbel').toMatch(/bar/))).toPass();
    expect((match('foobazbel').toMatch(/bar/))).toFail();

    expect((match('foobarbel').toMatch("bar"))).toPass();
    expect((match('foobazbel').toMatch("bar"))).toFail();

    expect((match('foobarbel').toNotMatch(/bar/))).toFail();
    expect((match('foobazbel').toNotMatch(/bar/))).toPass();

    expect((match('foobarbel').toNotMatch("bar"))).toFail();
    expect((match('foobazbel').toNotMatch("bar"))).toPass();
  });

  it("toMatch w/ RegExp to build an ExpectationResult", function() {
    var matcher = match('a');
    matcher.toMatch(/b/);

    var result = matcher.results().getItems()[0];

    expect(result.matcherName).toEqual("toMatch");
    expect(result).toFail();
    expect(result.message).toEqual("a does not match the regular expression /b/");
    expect(result.expected.toString()).toEqual("/b/");
    expect(result.actual).toEqual("a");
  });

  it("toMatch w/ String to build an ExpectationResult", function() {
    var matcher = match('a');
    matcher.toMatch("b");

    var result = matcher.results().getItems()[0];

    expect(result.matcherName).toEqual("toMatch");
    expect(result).toFail();
    expect(result.message).toEqual("a does not match the regular expression /b/");
    expect(result.expected.toString()).toEqual("b");
    expect(result.actual).toEqual("a");
  });

  it("toNotMatch w/ RegExp to build an ExpectationResult", function() {
    var matcher = match('a');
    matcher.toNotMatch(/a/);

    var result = matcher.results().getItems()[0];

    expect(result.matcherName).toEqual("toNotMatch");
    expect(result).toFail();
    expect(result.message).toEqual("a matches the regular expression /a/, but should not");
    expect(result.expected.toString()).toEqual("/a/");
    expect(result.actual).toEqual("a");    
  });

  it("toNotMatch w/ String to build an ExpectationResult", function() {
    var matcher = match('a');
    matcher.toNotMatch('a');

    var result = matcher.results().getItems()[0];

    expect(result.matcherName).toEqual("toNotMatch");
    expect(result).toFail();
    expect(result.message).toEqual("a matches the regular expression /a/, but should not");
    expect(result.expected.toString()).toEqual('a');
    expect(result.actual).toEqual("a");
  });

  it("toBeDefined", function() {
    expect(match('foo').toBeDefined()).toPass();
    expect(match(undefined).toBeDefined()).toFail();
  });

  it("toBeDefined to build an ExpectationResult", function() {
    var matcher = match(undefined);
    matcher.toBeDefined();

    var result = matcher.results().getItems()[0];

    expect(result.matcherName).toEqual("toBeDefined");
    expect(result).toFail();
    expect(result.message).toEqual('Expected a value to be defined but it was undefined.');
    expect(result.actual).toEqual(undefined);
  });

  // TODO: IMPLEMENTTHISDAMMIT
  xit("toBeUndefined", function() {
    expect(match('foo').toBeUndefined()).toFail();
    expect(match(undefined).toBeUndefined()).toPass();
  });

  it("toBeNull", function() {
    expect(match(null).toBeNull()).toPass();
    expect(match(undefined).toBeNull()).toFail();
    expect(match("foo").toBeNull()).toFail();
  });

  it("toBeNull w/ String to build an ExpectationResult", function() {
    var matcher = match('a');
    matcher.toBeNull();

    var result = matcher.results().getItems()[0];

    expect(result.matcherName).toEqual("toBeNull");
    expect(result).toFail();
    expect(result.message).toEqual("Expected 'a' to be null, but it was not");
    expect(result.actual).toEqual('a');
  });

  it("toBeNull w/ Object to build an ExpectationResult", function() {
    var matcher = match({a: 'b'});
    matcher.toBeNull();

    var result = matcher.results().getItems()[0];

    expect(result.matcherName).toEqual("toBeNull");
    expect(result).toFail();
    expect(result.message).toEqual("Expected [object Object] to be null, but it was not");
    expect(result.actual).toEqual({a: 'b'});
  });

  it("toBeFalsy", function() {
    expect(match(false).toBeFalsy()).toPass();
    expect(match(true).toBeFalsy()).toFail();
    expect(match(undefined).toBeFalsy()).toPass();
    expect(match(0).toBeFalsy()).toPass();
    expect(match("").toBeFalsy()).toPass();
  });

  it("toBeFalsy to build an ExpectationResult", function() {
    var matcher = match('a');
    matcher.toBeFalsy();

    var result = matcher.results().getItems()[0];

    expect(result.matcherName).toEqual("toBeFalsy");
    expect(result).toFail();
    expect(result.message).toEqual("Expected a value to be falsy, but it was not");
    expect(result.actual).toEqual('a');
  });

  it("toBeTruthy", function() {
    expect(match(false).toBeTruthy()).toFail();
    expect(match(true).toBeTruthy()).toPass();
    expect(match(undefined).toBeTruthy()).toFail();
    expect(match(0).toBeTruthy()).toFail();
    expect(match("").toBeTruthy()).toFail();
    expect(match("hi").toBeTruthy()).toPass();
    expect(match(5).toBeTruthy()).toPass();
    expect(match({foo: 1}).toBeTruthy()).toPass();
  });

  it("toBeTruthy to build an ExpectationResult", function() {
    var matcher = match(false);
    matcher.toBeTruthy();

    var result = matcher.results().getItems()[0];

    expect(result.matcherName).toEqual("toBeTruthy");
    expect(result).toFail();
    expect(result.message).toEqual("Expected a value to be truthy, but it was not");
    expect(result.actual).toEqual(false);
  });

  it("toEqual", function() {
    expect(match(undefined).toEqual(undefined)).toPass();
    expect(match({foo:'bar'}).toEqual({foo:'bar'})).toPass();
    expect(match("foo").toEqual({bar: undefined})).toFail();
    expect(match({foo: undefined}).toEqual("goo")).toFail();
    expect(match({foo: {bar :undefined}}).toEqual("goo")).toFail();
  });

  it("toEqual with jasmine.any()", function() {
    expect(match("foo").toEqual(jasmine.any(String))).toPass();
    expect(match(3).toEqual(jasmine.any(Number))).toPass();
    expect(match("foo").toEqual(jasmine.any(Function))).toFail();
    expect(match("foo").toEqual(jasmine.any(Object))).toFail();
    expect(match({someObj:'foo'}).toEqual(jasmine.any(Object))).toPass();
    expect(match({someObj:'foo'}).toEqual(jasmine.any(Function))).toFail();
    expect(match(function() {}).toEqual(jasmine.any(Object))).toFail();
    expect(match(["foo", "goo"]).toEqual(["foo", jasmine.any(String)])).toPass();
    expect(match(function() {}).toEqual(jasmine.any(Function))).toPass();
    expect(match(["a", function() {}]).toEqual(["a", jasmine.any(Function)])).toPass();
  });

  it("toEqual handles circular objects ok", function() {
    expect(match({foo: "bar", baz: undefined}).toEqual({foo: "bar", baz: undefined})).toPass();
    expect(match({foo:['bar','baz','quux']}).toEqual({foo:['bar','baz','quux']})).toPass();
    expect(match({foo: {bar:'baz'}, quux:'corge'}).toEqual({foo:{bar:'baz'}, quux:'corge'})).toPass();

    var circularObject = {};
    var secondCircularObject = {};
    circularObject.field = circularObject;
    secondCircularObject.field = secondCircularObject;
    expect(match(circularObject).toEqual(secondCircularObject)).toPass();
  });

  it("toNotEqual as slightly surprising behavior, but is it intentional?", function() {
    expect(match({x:"x", y:"y", z:"w"}).toNotEqual({x:"x", y:"y", z:"z"})).toPass();
    expect(match({x:"x", y:"y", w:"z"}).toNotEqual({x:"x", y:"y", z:"z"})).toPass();
    expect(match({x:"x", y:"y", z:"z"}).toNotEqual({w: "w", x:"x", y:"y", z:"z"})).toPass();
    expect(match({w: "w", x:"x", y:"y", z:"z"}).toNotEqual({x:"x", y:"y", z:"z"})).toPass();
  });

  it("toEqual handles arrays", function() {
    expect(match([1, "A"]).toEqual([1, "A"])).toPass();
  });

  it("toContain and toNotContain", function() {
    expect(match('ABC').toContain('A')).toPass();
    expect(match('ABC').toContain('X')).toFail();
    
    expect(match(['A', 'B', 'C']).toContain('A')).toPass();
    expect(match(['A', 'B', 'C']).toContain('F')).toFail();
    expect(match(['A', 'B', 'C']).toNotContain('F')).toPass();
    expect(match(['A', 'B', 'C']).toNotContain('A')).toFail();

    expect(match(['A', {some:'object'}, 'C']).toContain({some:'object'})).toPass();
    expect(match(['A', {some:'object'}, 'C']).toContain({some:'other object'})).toFail();
  });

  it("toContain to build an ExpectationResult", function() {
    var matcher = match(['a','b','c']);
    matcher.toContain('x');

    var result = matcher.results().getItems()[0];

    expect(result.matcherName).toEqual("toContain");
    expect(result).toFail();
    expect(result.message).toEqual('Actual does not contain expected, but it should');
    expect(result.actual).toEqual(['a','b','c']);
    expect(result.expected).toEqual('x');
  });

  it("toNotContain to build an ExpectationResult", function() {
    var matcher = match(['a','b','c']);
    matcher.toNotContain('b');

    var result = matcher.results().getItems()[0];

    expect(result.matcherName).toEqual("toNotContain");
    expect(result).toFail();
    expect(result.message).toEqual("Actual contains expected, but should not");
    expect(result.actual).toEqual(['a','b','c']);
    expect(result.expected).toEqual('b');
  });

  it("toBeLessThan should pass if actual is less than expected", function() {
    expect(match(37).toBeLessThan(42)).toPass();
    expect(match(37).toBeLessThan(-42)).toFail();
    expect(match(37).toBeLessThan(37)).toFail();
  });

  it("toBeLessThan to build an ExpectationResult", function() {
    var matcher = match(3);
    matcher.toBeLessThan(1);

    var result = matcher.results().getItems()[0];

    expect(result.matcherName).toEqual("toBeLessThan");
    expect(result).toFail();
    expect(result.message).toEqual("Expected is not less than actual");
    expect(result.actual).toEqual(3);
    expect(result.expected).toEqual(1);
  });

  it("toBeGreaterThan should pass if actual is greater than expected", function() {
    expect(match(37).toBeGreaterThan(42)).toFail();
    expect(match(37).toBeGreaterThan(-42)).toPass();
    expect(match(37).toBeGreaterThan(37)).toFail();
  });

  it("toBeGreaterThan to build an ExpectationResult", function() {
    var matcher = match(1);
    matcher.toBeGreaterThan(3);

    var result = matcher.results().getItems()[0];

    expect(result.matcherName).toEqual("toBeGreaterThan");
    expect(result).toFail();
    expect(result.message).toEqual("Expected is not greater than actual");
    expect(result.actual).toEqual(1);
    expect(result.expected).toEqual(3);
  });

  it("toThrow", function() {
    var expected = new jasmine.Matchers(env, function() {
      throw new Error("Fake Error");
    });
    expect(expected.toThrow()).toPass();
    expect(expected.toThrow("Fake Error")).toPass();
    expect(expected.toThrow(new Error("Fake Error"))).toPass();
    expect(expected.toThrow("Other Error")).toFail();
    expect(expected.toThrow(new Error("Other Error"))).toFail();

    expect(match(function() {}).toThrow()).toFail();
  });

  it("wasCalled, wasNotCalled, wasCalledWith", function() {
    var currentSuite;
    var spec;
    currentSuite = env.describe('default current suite', function() {
      spec = env.it();
    });

    var TestClass = { someFunction: function() {
    } };

    var expected;
    expect(match(TestClass.someFunction).wasCalled()).toFail();
    expect(match(TestClass.someFunction).wasNotCalled()).toFail();

    spec.spyOn(TestClass, 'someFunction');

    expect(match(TestClass.someFunction).wasCalled()).toFail();
    expect(match(TestClass.someFunction).wasNotCalled()).toPass();

    TestClass.someFunction();
    expect(match(TestClass.someFunction).wasCalled()).toPass();
    expect(match(TestClass.someFunction).wasCalled('some arg')).toFail();
    expect(match(TestClass.someFunction).wasNotCalled()).toFail();

    TestClass.someFunction('a', 'b', 'c');
    expect(match(TestClass.someFunction).wasCalledWith('a', 'b', 'c')).toPass();

    expected = match(TestClass.someFunction);
    expect(expected.wasCalledWith('c', 'b', 'a')).toFail();
    expect(expected.results().getItems()[0]).toFail();

    TestClass.someFunction.reset();
    TestClass.someFunction('a', 'b', 'c');
    TestClass.someFunction('d', 'e', 'f');
    expect(expected.wasCalledWith('a', 'b', 'c')).toPass();
    expect(expected.wasCalledWith('d', 'e', 'f')).toPass();
    expect(expected.wasCalledWith('x', 'y', 'z')).toFail();
  });

});
