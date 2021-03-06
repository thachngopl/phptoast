/*
 * PHP-To-AST - PHP parser
 * Copyright (c) Dan Phillimore (asmblah)
 * http://uniter.github.com/phptoast/
 *
 * Released under the MIT license
 * https://github.com/uniter/phptoast/raw/master/MIT-LICENSE.txt
 */

'use strict';

var _ = require('microdash'),
    expect = require('chai').expect,
    nowdoc = require('nowdoc'),
    tools = require('../../tools');

describe('PHP Parser grammar string literal expression integration', function () {
    var parser;

    beforeEach(function () {
        parser = tools.createParser();
    });

    _.each({
        'single-quoted string literal with double-quote embedded': {
            code: nowdoc(function () {/*<<<EOS
<?php
return 'My str"ing contents';
EOS
*/;}), //jshint ignore:line
            expectedAST: {
                name: 'N_PROGRAM',
                statements: [{
                    name: 'N_RETURN_STATEMENT',
                    expression: {
                        name: 'N_STRING_LITERAL',
                        string: 'My str"ing contents'
                    }
                }]
            }
        },
        'single-quoted string literal with escaped single-quote embedded': {
            code: nowdoc(function () {/*<<<EOS
<?php
return 'My str\'ing contents';
EOS
*/;}), //jshint ignore:line
            expectedAST: {
                name: 'N_PROGRAM',
                statements: [{
                    name: 'N_RETURN_STATEMENT',
                    expression: {
                        name: 'N_STRING_LITERAL',
                        string: 'My str\'ing contents'
                    }
                }]
            }
        },
        'single-quoted string literal with escaped backslash embedded': {
            code: nowdoc(function () {/*<<<EOS
<?php
return 'My str\\ing contents';
EOS
*/;}), //jshint ignore:line
            expectedAST: {
                name: 'N_PROGRAM',
                statements: [{
                    name: 'N_RETURN_STATEMENT',
                    expression: {
                        name: 'N_STRING_LITERAL',
                        string: 'My str\\ing contents'
                    }
                }]
            }
        },
        'single-quoted string literal with unescaped backslash embedded before special and non-special chars': {
            code: nowdoc(function () {/*<<<EOS
<?php
return 'My str\ing conte\nts';
EOS
*/;}), //jshint ignore:line
            expectedAST: {
                name: 'N_PROGRAM',
                statements: [{
                    name: 'N_RETURN_STATEMENT',
                    expression: {
                        name: 'N_STRING_LITERAL',
                        string: 'My str\\ing conte\\nts'
                    }
                }]
            }
        }
    }, function (scenario, description) {
        describe(description, function () {
            // Pretty-print the code strings so any non-printable characters are readable
            describe('when the code is ' + JSON.stringify(scenario.code) + ' ?>', function () {
                it('should return the expected AST', function () {
                    expect(parser.parse(scenario.code)).to.deep.equal(scenario.expectedAST);
                });
            });
        });
    });
});
