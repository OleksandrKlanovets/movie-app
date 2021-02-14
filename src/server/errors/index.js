'use strict';

class NotFoundError extends Error { }
class WrongParameterValueError extends Error { }
class UnsupportedFileError extends Error { }
class InvalidFileFormatError extends Error { }

module.exports = {
  NotFoundError,
  WrongParameterValueError,
  UnsupportedFileError,
  InvalidFileFormatError,
};
