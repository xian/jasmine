describe("jasmine.Matchers", function() {
  var env;
  
  beforeEach(function() {
    env = new jasmine.Env();
  });
  
  function match(value) {
    return new jasmine.Matchers(env, value);
  }

  it("toEqual with primitives, objects, dates, html nodes, etc.", function() {
    expect(match(true).toEqual(true)).toEqual(true);

    expect(match({foo:'bar'}).toEqual(null)).toEqual(false);

    var functionA = function() { return 'hi'; };
    var functionB = function() { return 'hi'; };
    expect(match({foo:functionA}).toEqual({foo:functionB})).toEqual(false);
    expect(match({foo:functionA}).toEqual({foo:functionA})).toEqual(true);

    expect((match(false).toEqual(true))).toEqual(false);

    var circularGraph = {};
    circularGraph.referenceToSelf = circularGraph;
    expect((match(circularGraph).toEqual(circularGraph))).toEqual(true);

    var nodeA = document.createElement('div');
    var nodeB = document.createElement('div');
    expect((match(nodeA).toEqual(nodeA))).toEqual(true);
    expect((match(nodeA).toEqual(nodeB))).toEqual(false);

    expect((match(new Date(2008, 1, 3, 15, 17, 19, 1234)).toEqual(new Date(2009, 1, 3, 15, 17, 19, 1234)))).toEqual(false);
    expect((match(new Date(2008, 1, 3, 15, 17, 19, 1234)).toEqual(new Date(2008, 1, 3, 15, 17, 19, 1234)))).toEqual(true);


    expect(match(true).toNotEqual(false)).toEqual(true);
    expect((match(true).toNotEqual(true))).toEqual(false);

    expect((match(['a', 'b']).toEqual(['a', undefined]))).toEqual(false);
    expect((match(['a', 'b']).toEqual(['a', 'b', undefined]))).toEqual(false);
  });

  it("toEqual to build an Expectation Result", function() {
    var matcher = match('a');
    matcher.toEqual('b');

    var result = matcher.results().getItems()[0];
    
    expect(result.matcherName).toEqual("toEqual");
    expect(result.passed()).toEqual(false);
    expect(result.message).toEqual("Expected does not equal actual");
    expect(result.expected).toEqual("b");
    expect(result.actual).toEqual("a");
  });

  it("toNotEqual to build an Expectation Result", function() {
    var matcher = match('a');
    matcher.toNotEqual('a')

    var result = matcher.results().getItems()[0];

    expect(result.matcherName).toEqual("toNotEqual");
    expect(result.passed()).toEqual(false);
    expect(result.message).toEqual("Expected and actual are equal, but should not be");
    expect(result.expected).toEqual("a");
    expect(result.actual).toEqual("a");
  });

  it('toBe should return true only if the expected and actual items === each other', function() {
    var a = {};
    var b = {};
    //noinspection UnnecessaryLocalVariableJS
    var c = a;
    expect((match(a).toBe(b))).toEqual(false);
    expect((match(a).toBe(a))).toEqual(true);
    expect((match(a).toBe(c))).toEqual(true);
    expect((match(a).toNotBe(b))).toEqual(true);
    expect((match(a).toNotBe(a))).toEqual(false);
    expect((match(a).toNotBe(c))).toEqual(false);
  });

  it("toBe to build an ExpectationResult", function() {
    var matcher = match('a');
    matcher.toBe('b');

    var result = matcher.results().getItems()[0];

    expect(result.matcherName).toEqual("toBe");
    expect(result.passed()).toEqual(false);
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
    expect(result.passed()).toEqual(false);
    expect(result.message).toEqual("Expected and actual are the same object, but should not be");
    expect(result.expected).toEqual(a);
    expect(result.actual).toEqual(a);
  });

  it("toMatch and #toNotMatch should perform regular expression matching on strings", function() {
    expect((match('foobarbel').toMatch(/bar/))).toEqual(true);
    expect((match('foobazbel').toMatch(/bar/))).toEqual(false);

    expect((match('foobarbel').toMatch("bar"))).toEqual(true);
    expect((match('foobazbel').toMatch("bar"))).toEqual(false);

    expect((match('foobarbel').toNotMatch(/bar/))).toEqual(false);
    expect((match('foobazbel').toNotMatch(/bar/))).toEqual(true);

    expect((match('foobarbel').toNotMatch("bar"))).toEqual(false);
    expect((match('foobazbel').toNotMatch("bar"))).toEqual(true);
  });

  it("toMatch w/ RegExp to build an ExpectationResult", function() {
    var matcher = match('a');
    matcher.toMatch(/b/);

    var result = matcher.results().getItems()[0];

    expect(result.matcherName).toEqual("toMatch");
    expect(result.passed()).toEqual(false);
    expect(result.message).toEqual("a does not match the regular expression /b/");
    expect(result.expected.toString()).toEqual("/b/");
    expect(result.actual).toEqual("a");
  });

  it("toMatch w/ String to build an ExpectationResult", function() {
    var matcher = match('a');
    matcher.toMatch("b");

    var result = matcher.results().getItems()[0];

    expect(result.matcherName).toEqual("toMatch");
    expect(result.passed()).toEqual(false);
    expect(result.message).toEqual("a does not match the regular expression /b/");
    expect(result.expected.toString()).toEqual("b");
    expect(result.actual).toEqual("a");
  });

  it("toNotMatch w/ RegExp to build an ExpectationResult", function() {
    var matcher = match('a');
    matcher.toNotMatch(/a/);

    var result = matcher.results().getItems()[0];

    expect(result.matcherName).toEqual("toNotMatch");
    expect(result.passed()).toEqual(false);
    expect(result.message).toEqual("a matches the regular expression /a/, but should not");
    expect(result.expected.toString()).toEqual("/a/");
    expect(result.actual).toEqual("a");    
  });

  it("toNotMatch w/ String to build an ExpectationResult", function() {
    var matcher = match('a');
    matcher.toNotMatch('a');

    var result = matcher.results().getItems()[0];

    expect(result.matcherName).toEqual("toNotMatch");
    expect(result.passed()).toEqual(false);
    expect(result.message).toEqual("a matches the regular expression /a/, but should not");
    expect(result.expected.toString()).toEqual('a');
    expect(result.actual).toEqual("a");
  });

  it("toBeDefined", function() {
    expect(match('foo').toBeDefined()).toEqual(true);
    expect(match(undefined).toBeDefined()).toEqual(false);
  });

  it("toBeDefined to build an ExpectationResult", function() {
    var matcher = match(undefined);
    matcher.toBeDefined();

    var result = matcher.results().getItems()[0];

    expect(result.matcherName).toEqual("toBeDefined");
    expect(result.passed()).toEqual(false);
    expect(result.message).toEqual('Expected a value to be defined but it was undefined.');
    expect(result.actual).toEqual(undefined);
  });

  // TODO: IMPLEMENTTHISDAMMIT
  xit("toBeUndefined", function() {
    expect(match('foo').toBeUndefined()).toEqual(false);
    expect(match(undefined).toBeUndefined()).toEqual(true);
  });

  it("toBeNull", function() {
    expect(match(null).toBeNull()).toEqual(true);
    expect(match(undefined).toBeNull()).toEqual(false);
    expect(match("foo").toBeNull()).toEqual(false);
  });

  it("toBeNull w/ String to build an ExpectationResult", function() {
    var matcher = match('a');
    matcher.toBeNull();

    var result = matcher.results().getItems()[0];

    expect(result.matcherName).toEqual("toBeNull");
    expect(result.passed()).toEqual(false);
    expect(result.message).toEqual("Expected 'a' to be null, but it was not");
    expect(result.actual).toEqual('a');
  });

  it("toBeNull w/ Object to build an ExpectationResult", function() {
    var matcher = match({a: 'b'});
    matcher.toBeNull();

    var result = matcher.results().getItems()[0];

    expect(result.matcherName).toEqual("toBeNull");
    expect(result.passed()).toEqual(false);
    expect(result.message).toEqual("Expected [object Object] to be null, but it was not");
    expect(result.actual).toEqual({a: 'b'});
  });

  it("toBeFalsy", function() {
    expect(match(false).toBeFalsy()).toEqual(true);
    expect(match(true).toBeFalsy()).toEqual(false);
    expect(match(undefined).toBeFalsy()).toEqual(true);
    expect(match(0).toBeFalsy()).toEqual(true);
    expect(match("").toBeFalsy()).toEqual(true);
  });

  it("toBeFalsy to build an ExpectationResult", function() {
    var matcher = match('a');
    matcher.toBeFalsy();

    var result = matcher.results().getItems()[0];

    expect(result.matcherName).toEqual("toBeFalsy");
    expect(result.passed()).toEqual(false);
    expect(result.message).toEqual("Expected a value to be falsy, but it was not");
    expect(result.actual).toEqual('a');
  });

  it("toBeTruthy", function() {
    expect(match(false).toBeTruthy()).toEqual(false);
    expect(match(true).toBeTruthy()).toEqual(true);
    expect(match(undefined).toBeTruthy()).toEqual(false);
    expect(match(0).toBeTruthy()).toEqual(false);
    expect(match("").toBeTruthy()).toEqual(false);
    expect(match("hi").toBeTruthy()).toEqual(true);
    expect(match(5).toBeTruthy()).toEqual(true);
    expect(match({foo: 1}).toBeTruthy()).toEqual(true);
  });

  it("toBeTruthy to build an ExpectationResult", function() {
    var matcher = match(false);
    matcher.toBeTruthy();

    var result = matcher.results().getItems()[0];

    expect(result.matcherName).toEqual("toBeTruthy");
    expect(result.passed()).toEqual(false);
    expect(result.message).toEqual("Expected a value to be truthy, but it was not");
    expect(result.actual).toEqual(false);
  });

  it("toEqual", function() {
    expect(match(undefined).toEqual(undefined)).toEqual(true);
    expect(match({foo:'bar'}).toEqual({foo:'bar'})).toEqual(true);
    expect(match("foo").toEqual({bar: undefined})).toEqual(false);
    expect(match({foo: undefined}).toEqual("goo")).toEqual(false);
    expect(match({foo: {bar :undefined}}).toEqual("goo")).toEqual(false);
  });

  it("toEqual with jasmine.any()", function() {
    expect(match("foo").toEqual(jasmine.any(String))).toEqual(true);
    expect(match(3).toEqual(jasmine.any(Number))).toEqual(true);
    expect(match("foo").toEqual(jasmine.any(Function))).toEqual(false);
    expect(match("foo").toEqual(jasmine.any(Object))).toEqual(false);
    expect(match({someObj:'foo'}).toEqual(jasmine.any(Object))).toEqual(true);
    expect(match({someObj:'foo'}).toEqual(jasmine.any(Function))).toEqual(false);
    expect(match(function() {}).toEqual(jasmine.any(Object))).toEqual(false);
    expect(match(["foo", "goo"]).toEqual(["foo", jasmine.any(String)])).toEqual(true);
    expect(match(function() {}).toEqual(jasmine.any(Function))).toEqual(true);
    expect(match(["a", function() {}]).toEqual(["a", jasmine.any(Function)])).toEqual(true);
  });

  it("toEqual handles circular objects ok", function() {
    expect(match({foo: "bar", baz: undefined}).toEqual({foo: "bar", baz: undefined})).toEqual(true);
    expect(match({foo:['bar','baz','quux']}).toEqual({foo:['bar','baz','quux']})).toEqual(true);
    expect(match({foo: {bar:'baz'}, quux:'corge'}).toEqual({foo:{bar:'baz'}, quux:'corge'})).toEqual(true);

    var circularObject = {};
    var secondCircularObject = {};
    circularObject.field = circularObject;
    secondCircularObject.field = secondCircularObject;
    expect(match(circularObject).toEqual(secondCircularObject)).toEqual(true);
  });

  it("toNotEqual as slightly surprising behavior, but is it intentional?", function() {
    expect(match({x:"x", y:"y", z:"w"}).toNotEqual({x:"x", y:"y", z:"z"})).toEqual(true);
    expect(match({x:"x", y:"y", w:"z"}).toNotEqual({x:"x", y:"y", z:"z"})).toEqual(true);
    expect(match({x:"x", y:"y", z:"z"}).toNotEqual({w: "w", x:"x", y:"y", z:"z"})).toEqual(true);
    expect(match({w: "w", x:"x", y:"y", z:"z"}).toNotEqual({x:"x", y:"y", z:"z"})).toEqual(true);
  });

  it("toEqual handles arrays", function() {
    expect(match([1, "A"]).toEqual([1, "A"])).toEqual(true);
  });

  it("toContain and toNotContain", function() {
    expect(match('ABC').toContain('A')).toEqual(true);
    expect(match('ABC').toContain('X')).toEqual(false);
    
    expect(match(['A', 'B', 'C']).toContain('A')).toEqual(true);
    expect(match(['A', 'B', 'C']).toContain('F')).toEqual(false);
    expect(match(['A', 'B', 'C']).toNotContain('F')).toEqual(true);
    expect(match(['A', 'B', 'C']).toNotContain('A')).toEqual(false);

    expect(match(['A', {some:'object'}, 'C']).toContain({some:'object'})).toEqual(true);
    expect(match(['A', {some:'object'}, 'C']).toContain({some:'other object'})).toEqual(false);
  });

  it("toContain to build an ExpectationResult", function() {
    var matcher = match(['a','b','c']);
    matcher.toContain('x');

    var result = matcher.results().getItems()[0];

    expect(result.matcherName).toEqual("toContain");
    expect(result.passed()).toEqual(false);
    expect(result.message).toEqual('Actual does not contain expected, but it should');
    expect(result.actual).toEqual(['a','b','c']);
    expect(result.expected).toEqual('x');
  });

  it("toNotContain to build an ExpectationResult", function() {
    var matcher = match(['a','b','c']);
    matcher.toNotContain('b');

    var result = matcher.results().getItems()[0];

    expect(result.matcherName).toEqual("toNotContain");
    expect(result.passed()).toEqual(false);
    expect(result.message).toEqual("Actual contains expected, but should not");
    expect(result.actual).toEqual(['a','b','c']);
    expect(result.expected).toEqual('b');
  });

  it("toBeLessThan should pass if actual is less than expected", function() {
    expect(match(37).toBeLessThan(42)).toEqual(true);
    expect(match(37).toBeLessThan(-42)).toEqual(false);
    expect(match(37).toBeLessThan(37)).toEqual(false);
  });

  it("toBeLessThan to build an ExpectationResult", function() {
    var matcher = match(3);
    matcher.toBeLessThan(1);

    var result = matcher.results().getItems()[0];

    expect(result.matcherName).toEqual("toBeLessThan");
    expect(result.passed()).toEqual(false);
    expect(result.message).toEqual("Expected is not less than actual");
    expect(result.actual).toEqual(3);
    expect(result.expected).toEqual(1);
  });

  it("toBeGreaterThan should pass if actual is greater than expected", function() {
    expect(match(37).toBeGreaterThan(42)).toEqual(false);
    expect(match(37).toBeGreaterThan(-42)).toEqual(true);
    expect(match(37).toBeGreaterThan(37)).toEqual(false);
  });

  it("toBeGreaterThan to build an ExpectationResult", function() {
    var matcher = match(1);
    matcher.toBeGreaterThan(3);

    var result = matcher.results().getItems()[0];

    expect(result.matcherName).toEqual("toBeGreaterThan");
    expect(result.passed()).toEqual(false);
    expect(result.message).toEqual("Expected is not greater than actual");
    expect(result.actual).toEqual(1);
    expect(result.expected).toEqual(3);
  });

  it("toThrow", function() {
    var expected = new jasmine.Matchers(env, function() {
      throw new Error("Fake Error");
    });
    expect(expected.toThrow()).toEqual(true);
    expect(expected.toThrow("Fake Error")).toEqual(true);
    expect(expected.toThrow(new Error("Fake Error"))).toEqual(true);
    expect(expected.toThrow("Other Error")).toEqual(false);
    expect(expected.toThrow(new Error("Other Error"))).toEqual(false);

    expect(match(function() {}).toThrow()).toEqual(false);
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
    expect(match(TestClass.someFunction).wasCalled()).toEqual(false);
    expect(match(TestClass.someFunction).wasNotCalled()).toEqual(false);

    spec.spyOn(TestClass, 'someFunction');

    expect(match(TestClass.someFunction).wasCalled()).toEqual(false);
    expect(match(TestClass.someFunction).wasNotCalled()).toEqual(true);

    TestClass.someFunction();
    expect(match(TestClass.someFunction).wasCalled()).toEqual(true);
    expect(match(TestClass.someFunction).wasCalled('some arg')).toEqual(false);
    expect(match(TestClass.someFunction).wasNotCalled()).toEqual(false);

    TestClass.someFunction('a', 'b', 'c');
    expect(match(TestClass.someFunction).wasCalledWith('a', 'b', 'c')).toEqual(true);

    expected = match(TestClass.someFunction);
    expect(expected.wasCalledWith('c', 'b', 'a')).toEqual(false);
    expect(expected.results().getItems()[0].passed()).toEqual(false);

    TestClass.someFunction.reset();
    TestClass.someFunction('a', 'b', 'c');
    TestClass.someFunction('d', 'e', 'f');
    expect(expected.wasCalledWith('a', 'b', 'c')).toEqual(true);
    expect(expected.wasCalledWith('d', 'e', 'f')).toEqual(true);
    expect(expected.wasCalledWith('x', 'y', 'z')).toEqual(false);
  });

});
