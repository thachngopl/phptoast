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
    tools = require('../../../tools');

describe('PHP Parser grammar modulo "%" operator integration', function () {
    var parser;

    beforeEach(function () {
        parser = tools.createParser();
    });

    _.each({
        'calculating modulus of 21 and 10': {
            code: 'return 21 % 10;',
            expectedAST: {
                name: 'N_PROGRAM',
                statements: [{
                    name: 'N_RETURN_STATEMENT',
                    expression: {
                        name: 'N_EXPRESSION',
                        left: {
                            name: 'N_INTEGER',
                            number: '21'
                        },
                        right: [{
                            operator: '%',
                            operand: {
                                name: 'N_INTEGER',
                                number: '10'
                            }
                        }]
                    }
                }]
            }
        },
        'calculating modulus of 100, 27 and a variable': {
            code: 'return 100 % 27 % $myVar;',
            expectedAST: {
                name: 'N_PROGRAM',
                statements: [{
                    name: 'N_RETURN_STATEMENT',
                    expression: {
                        name: 'N_EXPRESSION',
                        left: {
                            name: 'N_EXPRESSION',
                            left: {
                                name: 'N_INTEGER',
                                number: '100'
                            },
                            right: [{
                                operator: '%',
                                operand: {
                                    name: 'N_INTEGER',
                                    number: '27'
                                }
                            }]
                        },
                        right: [{
                            operator: '%',
                            operand: {
                                name: 'N_VARIABLE',
                                variable: 'myVar'
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
