/*
 * PHP-To-AST - PHP parser
 * Copyright (c) Dan Phillimore (asmblah)
 * http://uniter.github.com/phptoast/
 *
 * Released under the MIT license
 * https://github.com/uniter/phptoast/raw/master/MIT-LICENSE.txt
 */

'use strict';

var _ = require('lodash'),
    expect = require('chai').expect,
    tools = require('../../tools');

describe('PHP Parser grammar include(...) expression integration', function () {
    var parser;

    beforeEach(function () {
        parser = tools.createParser();
    });

    _.each({
        'include with no brackets around empty string path': {
            code: 'include "abc.php";',
            expectedAST: {
                name: 'N_PROGRAM',
                statements: [{
                    name: 'N_EXPRESSION_STATEMENT',
                    expression: {
                        name: 'N_INCLUDE_EXPRESSION',
                        path: {
                            name: 'N_STRING_LITERAL',
                            string: 'abc.php'
                        }
                    }
                }]
            }
        },
        'assigning result of include to variable': {
            code: '$map = include "abc.php";',
            expectedAST: {
                name: 'N_PROGRAM',
                statements: [{
                    name: 'N_EXPRESSION_STATEMENT',
                    expression: {
                        name: 'N_EXPRESSION',
                        left: {
                            name: 'N_VARIABLE',
                            variable: 'map'
                        },
                        right: [{
                            operator: '=',
                            operand: {
                                name: 'N_INCLUDE_EXPRESSION',
                                path: {
                                    name: 'N_STRING_LITERAL',
                                    string: 'abc.php'
                                }
                            }
                        }]
                    }
                }]
            }
        }
    }, function (scenario, description) {
        describe(description, function () {
            var code = '<?php ' + scenario.code;

            // Pretty-print the code strings so any non-printable characters are readable
            describe('when the code is ' + JSON.stringify(code) + ' ?>', function () {
                it('should return the expected AST', function () {
                    expect(parser.parse(code)).to.deep.equal(scenario.expectedAST);
                });
            });
        });
    });
});
