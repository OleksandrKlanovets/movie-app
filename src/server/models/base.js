'use strict';

const { Sequelize } = require('sequelize');
const { NotFoundError } = require('../errors');

class Base extends Sequelize.Model {
  static init(sequelize, options = {}) {
    super.init(this.schema, { ...options, sequelize, timestamps: false });
  }

  static async findById(id) {
    const entity = await this.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundError(
        `There is no ${this.name} with id = "${id}"`,
      );
    }

    return entity;
  }
}

module.exports = Base;
