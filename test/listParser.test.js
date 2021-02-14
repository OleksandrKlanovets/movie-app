'use strict';

const assert = require('assert');

const {
  WrongParameterValueError, InvalidFileFormatError
} = require('../src/server/errors');

const { parseList }= require('../src/server/utils/listParser');

describe('ListParser', () => {
  it('Parse valid file', () => {
    const validFile = Buffer.from(
      'Title: Blazing Saddles\n' +
      'Release Year: 1974\n' +
      'Format: VHS\n' +
      'Stars: Mel Brooks, Clevon Little, Harvey Korman, Gene Wilder, Slim Pickens, Madeline Kahn\n\n' +
      'Title: Casablanca\n' +
      'Release Year: 1942\n' +
      'Format: DVD\n' +
      'Stars: Humphrey Bogart, Ingrid Bergman, Claude Rains, Peter Lorre'
    );

    const parsed = parseList(validFile);

    assert.deepStrictEqual(
      parsed,
      [
        {
          title: 'Blazing Saddles',
          year: 1974,
          format: 'VHS',
          actors: [
            'Mel Brooks', 'Clevon Little', 'Harvey Korman',
            'Gene Wilder', 'Slim Pickens', 'Madeline Kahn',
          ],
        },
        {
          title: 'Casablanca',
          year: 1942,
          format: 'DVD',
          actors: [
            'Humphrey Bogart', 'Ingrid Bergman', 'Claude Rains', 'Peter Lorre',
          ],
        },
      ],
    );
  });

  it('Invalid file format', () => {
    const invalidFile = Buffer.from(
      'Title 2001 A Space Odyssey\n' +
      'Release Year: 1968\n' +
      'Format: DVD\n' +
      'Title: Harvey\n' +
      'Release Year: 1950\n' +
      'Format: DVD\n' +
      'Stars: James Stewart, Josephine Hull, Peggy Dow, Charles Drake'
    );

    assert.throws(
      () => parseList(invalidFile),
      (err) => {
        assert(err instanceof WrongParameterValueError);
        return true;
      },
    );
  });

  it('Empty file', () => {
    const emptyFile = '';

    assert.throws(
      () => parseList(emptyFile),
      (err) => {
        assert(err instanceof InvalidFileFormatError);
        return true;
      },
    );
  });

  it('No file provided', () => {
    const nullFile = null;

    assert.throws(
      () => parseList(nullFile),
      (err) => {
        assert(err instanceof InvalidFileFormatError);
        return true;
      },
    );
  });
});
