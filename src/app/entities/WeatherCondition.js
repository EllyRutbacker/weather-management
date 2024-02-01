const { Entity, PrimaryGeneratedColumn, Column } = require('typeorm');

@Entity()
class WeatherCondition {
  @PrimaryGeneratedColumn()
  id;

  @Column()
  adjective;

  constructor(id, adjective) {
    this.id = id;
    this.adjective = adjective;
  }
}

module.exports = WeatherCondition;