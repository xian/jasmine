describe('jasmine.NestedResults', function() {
  it('#addResult increments counters', function() {
    // Leaf case
    var results = new jasmine.NestedResults();

    results.addResult(new jasmine.ExpectationResult("foo", true, 'Passed.', 'bar', 'bar'));

    expect(results.getItems().length).toEqual(1);
    expect(results.totalCount).toEqual(1);
    expect(results.passedCount).toEqual(1);
    expect(results.failedCount).toEqual(0);

    results.addResult(new jasmine.ExpectationResult("baz", false, 'FAIL.', "corge", "quux"));

    expect(results.getItems().length).toEqual(2);
    expect(results.totalCount).toEqual(2);
    expect(results.passedCount).toEqual(1);
    expect(results.failedCount).toEqual(1);
  });

  it('should roll up counts for nested results', function() {
    // Branch case
    var leafResultsOne = new jasmine.NestedResults();
    leafResultsOne.addResult(new jasmine.ExpectationResult("toSomething", true, 'message', '', ''));
    leafResultsOne.addResult(new jasmine.ExpectationResult("toSomethingElse", false, 'message', 'a', 'b'));

    var leafResultsTwo = new jasmine.NestedResults();
    leafResultsTwo.addResult(new jasmine.ExpectationResult("toSomething", true, 'message', '', ''));
    leafResultsTwo.addResult(new jasmine.ExpectationResult("toSomethineElse", false, 'message', 'c', 'd'));

    var branchResults = new jasmine.NestedResults();
    branchResults.addResult(leafResultsOne);
    branchResults.addResult(leafResultsTwo);

    expect(branchResults.getItems().length).toEqual(2);
    expect(branchResults.totalCount).toEqual(4);
    expect(branchResults.passedCount).toEqual(2);
    expect(branchResults.failedCount).toEqual(2);
  });

});
