/**
 * Created by barakedry on 6/21/15.
 */
'use strict';
var mocha = require('mocha');
var chai = require('chai');
var expect = chai.expect;
var MergeDiff = require('../');


function createBaseObject () {
    return {
        string: "string",
        number: 5,
        boolean: true,
        array: [0, 1, '2', false, {prop: 'val'}],
        obj: {
            property: "value1",
            property2: "value2"
        },
        nested: {
            a: {
                b: {
                    c: {
                        d: {
                            property: "value1",
                            property2: "value2"
                        }
                    }
                }
            }
        }
/*
        func: function () {
            return "hello";
        }
*/
    }
}

describe('Merge diff tests', function () {

    describe("merging", function() {
        describe('merging the number 20 to the path "string"', function () {

            var merger = new MergeDiff(createBaseObject());
            var expectedObject = createBaseObject();

            expectedObject.string = 20;

            it('merged object should be the same as expected object', function() {
                merger.merge(20, 'string');
                expect(merger.object).to.deep.equal(expectedObject);
            });


        });

        describe('merging the string "test" to 3 existing properties with no path (to root)', function () {

            var merger = new MergeDiff(createBaseObject());
            var originalObject = createBaseObject();



            it('merged object should be the same as expected object', function() {

                merger.merge({
                    string: "test",
                    boolean: "test",
                    number: "test"
                });

                expect(merger.object).to.have.deep.property('string', 'test');
                expect(merger.object).to.have.deep.property('boolean', 'test');
                expect(merger.object).to.have.deep.property('number', 'test');
                expect(merger.object).to.have.property('array').not.equal('test');
                expect(merger.object).to.have.property('nested').to.deep.equal(originalObject.nested);
            });

        });


        describe('merging 2 string properties and a new object with no path (to root)', function () {

            var merger = new MergeDiff(createBaseObject());

            it('merged object should be the same as expected object', function() {

                merger.merge({
                    string: "test",
                    boolean: false,
                    newobject: {"test": "test"}
                });

                expect(merger.object).to.have.deep.property('string', 'test');
                expect(merger.object).to.have.deep.property('boolean', false);
                expect(merger.object).to.have.property('newobject').to.deep.equal({test: 'test'});
            });

        });


        describe('merging 4 items to array existing, modified, new and deleted', function () {

            var merger = new MergeDiff(createBaseObject());

            it('1 item should be modified 1 deleted and one added', function() {

                merger.differences.on("array", function(diff) {
                    console.log('diff', diff);
                });

                merger.merge({
                    array: {1: 1, '2': 'test', 4: merger.options.deleteKeyword, 7: "test2"}
                });

                //[0, 1, '2', false, {prop: 'val'}]
                //[0, 1, 'test', false, null, null, 'test2]

                //expect(merger.object.array).to.deep.equal([0, 1, 'test', false, undefined, undefined, 'test2']);
            });

        });


        describe('delete a string and boolean', function () {

            var merger = new MergeDiff(createBaseObject());

            it('merged object should be the same as expected object', function() {

                merger.merge({
                    boolean: merger.options.deleteKeyword,
                    string: merger.options.deleteKeyword
                });


            });

        });

        describe('merge nested object to "nested.a"', function () {

            var merger = new MergeDiff(createBaseObject());

            it('merged object should be the same as expected object', function() {

                merger.differences.on("nested", function(diff) {
                    console.log('diff', diff);
                });

                merger.merge({
                   b: {'added': 'asd'}
                }, 'nested.a');

                //[0, 1, '2', false, {prop: 'val'}]
                //[0, 1, 'test', false, null, null, 'test2]

                //expect(merger.object).property('array').to.deep.equal([0, 1, 'test', false, undefined, undefined, 'test2']);
            });

        });


    });

    describe("differences events", function() {


    });

});