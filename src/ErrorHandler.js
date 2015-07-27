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
    UnexpectedSyntaxException = require('./Exception/UnexpectedSyntaxException');

function ErrorHandler(stderr, state) {
    this.state = state;
    this.stderr = stderr;
}

_.extend(ErrorHandler.prototype, {
    handle: function (parseException) {
        var handler = this,
            text = parseException.getText(),
            error,
            what;

        if (parseException.unexpectedEndOfInput()) {
            what = '$end';
        } else {
            what = '\'' + text.substr(parseException.getFurthestMatchEnd(), 1) + '\'';
        }

        error = new UnexpectedSyntaxException(
            handler.state.getPath(),
            parseException.getLineNumber(),
            what
        );

        if (handler.state.isMainProgram() && handler.stderr) {
            handler.stderr.write(error.message);
        }

        throw error;
    }
});

module.exports = ErrorHandler;
