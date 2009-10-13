jasmine.Matchers = function(env, actual, results, opt_isNot) {
  this.env = env;
  this.actual = actual;
  this.passing_message = 'Passed.';
  this.results_ = results || new jasmine.NestedResults();
  this.isNot_ = opt_isNot || false;
};

jasmine.Matchers.pp = function(str) {
  return jasmine.util.htmlEscape(jasmine.pp(str));
};

/** @deprecated */
jasmine.Matchers.prototype.getResults = function() {
  return this.results_;
};

jasmine.Matchers.prototype.results = function() {
  return this.results_;
};

// TODO: no need to call w/ actual
jasmine.Matchers.prototype.report = function(matcherName, result, failing_message, expected, details) {
  if (this.isNot_) {
    result = !result;
  }
  var expectationResult = new jasmine.ExpectationResult(
      matcherName,
      result,
      result ? this.passing_message : failing_message,
      expected,
      this.actual,
      details
      );
  this.results_.addResult(expectationResult);
  return expectationResult;
};

/**
 * Matcher that compares the actual to the expected using ===.
 *
 * @param expected
 */
jasmine.Matchers.prototype.toBe = function(expected) {
  return this.report(
    "toBe",
    this.actual === expected,
    "Expected and actual are not the same object",
    expected
  );
};

/**
 * Matcher that compares the actual to the expected using !==
 * @param expected
 */
jasmine.Matchers.prototype.toNotBe = function(expected) {
  return this.report(
    "toNotBe",
    this.actual !== expected,
    "Expected and actual are the same object, but should not be",
    expected
  );
};

/**
 * Matcher that compares the actual to the expected using common sense equality. Handles Objects, Arrays, etc.
 *
 * @param expected
 */
jasmine.Matchers.prototype.toEqual = function(expected) {
  var mismatchKeys = [];
  var mismatchValues = [];
  var isEqual = this.env.equals_(this.actual, expected, mismatchKeys, mismatchValues);
  var failMessage = "Expected does not equal actual";

  return this.report(
    "toEqual",
    isEqual,
    failMessage,
    expected,
    {
      type: "diff",
      mismatchKeys: mismatchKeys,
      mismatchValues: mismatchValues
    }
  );
};
/** @deprecated */
jasmine.Matchers.prototype.should_equal = jasmine.Matchers.prototype.toEqual;

/**
 * Matcher that compares the actual to the expected using the ! of jasmine.Matchers.toEqual
 * @param expected
 */
jasmine.Matchers.prototype.toNotEqual = function(expected) {
  return this.report(
    "toNotEqual",
    !this.env.equals_(this.actual, expected),
    "Expected and actual are equal, but should not be",
    expected
  );
};
/** @deprecated */
jasmine.Matchers.prototype.should_not_equal = jasmine.Matchers.prototype.toNotEqual;

/**
 * Matcher that compares the actual to the expected using a regular expression.  Constructs a RegExp, so takes
 * a pattern or a String.
 *
 * @param reg_exp
 */
jasmine.Matchers.prototype.toMatch = function(reg_exp) {

  var regExp = new RegExp(reg_exp);
  var failMessage = this.actual + " does not match the regular expression " + regExp.toString();

  return this.report(
    "toMatch",
    (regExp.test(this.actual)),
    failMessage,
    reg_exp
  );
};
/** @deprecated */
jasmine.Matchers.prototype.should_match = jasmine.Matchers.prototype.toMatch;

/**
 * Matcher that compares the actual to the expected using the boolean inverse of jasmine.Matchers.toMatch
 * @param reg_exp
 */
jasmine.Matchers.prototype.toNotMatch = function(reg_exp) {

  var regExp = new RegExp(reg_exp);
  var failMessage = this.actual + " matches the regular expression " + regExp.toString() + ", but should not";

  return this.report(
    "toNotMatch",
    !(regExp.test(this.actual)),
    failMessage,
    reg_exp
  );
};
/** @deprecated */
jasmine.Matchers.prototype.should_not_match = jasmine.Matchers.prototype.toNotMatch;

/**
 * Matcher that compares the acutal to undefined.
 */
jasmine.Matchers.prototype.toBeDefined = function() {
  return this.report(
    "toBeDefined",
    (this.actual !== undefined),
    'Expected a value to be defined but it was undefined.'
  );
};
/** @deprecated */
jasmine.Matchers.prototype.should_be_defined = jasmine.Matchers.prototype.toBeDefined;

/**
 * Matcher that compares the actual to null.
 *
 */
jasmine.Matchers.prototype.toBeNull = function() {
  var failMessage = '';

  if (this.actual) {
    var objectAsString = typeof this.actual == 'string' ? "'" + this.actual +"'" : this.actual.toString();
    failMessage = "Expected " + objectAsString +" to be null, but it was not";
  }

  return this.report(
    "toBeNull",
    (this.actual === null),
    failMessage
  );
};
/** @deprecated */
jasmine.Matchers.prototype.should_be_null = jasmine.Matchers.prototype.toBeNull;

/**
 * Matcher that boolean not-nots the actual.
 */
jasmine.Matchers.prototype.toBeTruthy = function() {
  return this.report(
    "toBeTruthy",
    !!this.actual,
    "Expected a value to be truthy, but it was not"
  );
};
/** @deprecated */
jasmine.Matchers.prototype.should_be_truthy = jasmine.Matchers.prototype.toBeTruthy;

/**
 * Matcher that boolean nots the actual.
 */
jasmine.Matchers.prototype.toBeFalsy = function() {
  return this.report(
    "toBeFalsy",
    !this.actual,
    "Expected a value to be falsy, but it was not");
};
/** @deprecated */
jasmine.Matchers.prototype.should_be_falsy = jasmine.Matchers.prototype.toBeFalsy;

/**
 * Matcher that checks to see if the acutal, a Jasmine spy, was called.
 */
jasmine.Matchers.prototype.wasCalled = function() {
  if (!this.actual || !this.actual.isSpy) {
    return this.report(
      "wasCalled",
      false,
      'Expected a spy, but got something else'
    );
  }
  if (arguments.length > 0) {
    return this.report(
      "wasCalled",
      false,
      'wasCalled matcher does not take arguments'
    );
  }
  return this.report(
    "wasCalled",
    (this.actual.wasCalled),
    'Expected spy to have been called, but it was not.');
};
/** @deprecated */
jasmine.Matchers.prototype.was_called = jasmine.Matchers.prototype.wasCalled;

/**
 * Matcher that checks to see if the acutal, a Jasmine spy, was not called.
 */
jasmine.Matchers.prototype.wasNotCalled = function() {
  if (!this.actual || !this.actual.isSpy) {
    return this.report(
      "wasNotCalled",
      false,
      'Expected a spy, but got something else'
    );
  }
  return this.report(
    "wasNotCalled",
    (!this.actual.wasCalled),
    'Expected spy to not have been called, but it was.'
  );
};
/** @deprecated */
jasmine.Matchers.prototype.was_not_called = jasmine.Matchers.prototype.wasNotCalled;

/**
 * Matcher that checks to see if the acutal, a Jasmine spy, was called with a set of parameters.
 *
 * @example
 *
 */
jasmine.Matchers.prototype.wasCalledWith = function() {
  if (!this.actual || !this.actual.isSpy) {
    return this.report(
      "wasCalledWith",
      false,
      'Expected a spy, but got something else.'
    );
  }

  var args = jasmine.util.argsToArray(arguments);

  return this.report(
    "wasCalledWith",
    this.env.contains_(this.actual.argsForCall, args),
    'Expected spy to have been called with certain arguments, but was not',
    args
  );
};

/**
 * Matcher that checks that the expected item is an element in the actual Array.
 *
 * @param {Object} item
 */
jasmine.Matchers.prototype.toContain = function(item) {
  return this.report(
    "toContain",
    this.env.contains_(this.actual, item),
    'Actual does not contain expected, but it should',
    item,
    {
      type: "diff"
    }
  );
};

/**
 * Matcher that checks that the expected item is NOT an element in the actual Array.
 *
 * @param {Object} item
 */
jasmine.Matchers.prototype.toNotContain = function(item) {

  return this.report(
    "toNotContain",
    !this.env.contains_(this.actual, item),
    "Actual contains expected, but should not",
    item
  );
};

jasmine.Matchers.prototype.toBeLessThan = function(expected) {
  return this.report(
    "toBeLessThan",
    this.actual < expected,
    "Expected is not less than actual",
    expected
  );
};

jasmine.Matchers.prototype.toBeGreaterThan = function(expected) {
  return this.report(
    "toBeGreaterThan",
    this.actual > expected,
    "Expected is not greater than actual",
    expected
  );
};

/**
 * Matcher that checks that the expected exception was thrown by the actual.
 *
 * @param {String} expectedException
 */
jasmine.Matchers.prototype.toThrow = function(expectedException) {
  var exception = null;
  try {
    this.actual();
  } catch (e) {
    exception = e;
  }

  if (expectedException !== undefined) {
    if (exception == null) {
      return this.report(
        "toThrow",
        false,
        "Expected function to throw an exception, but it did not.",
        expectedException);
    }
    return this.report(
      "toThrow",
      this.env.equals_(
        exception.message || exception,
        expectedException.message || expectedException),
        "Expected function to throw a certain exception, but it threw another",
        expectedException
        );
  } else {
    return this.report(
        "toThrow",
        exception != null,
        "Expected function to throw an exception, but it did not.",
        expectedException);
  }
};

jasmine.Matchers.Any = function(expectedClass) {
  this.expectedClass = expectedClass;
};

jasmine.Matchers.Any.prototype.matches = function(other) {
  if (this.expectedClass == String) {
    return typeof other == 'string' || other instanceof String;
  }

  if (this.expectedClass == Number) {
    return typeof other == 'number' || other instanceof Number;
  }

  if (this.expectedClass == Function) {
    return typeof other == 'function' || other instanceof Function;
  }

  if (this.expectedClass == Object) {
    return typeof other == 'object';
  }

  return other instanceof this.expectedClass;
};

jasmine.Matchers.Any.prototype.toString = function() {
  return '<jasmine.any(' + this.expectedClass + ')>';
};

