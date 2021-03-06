/**
 *
* Author: Maximo Mena
 * GitHub: mmenavas
 * Twitter: @menamaximo
 * Author-Update: Ilton Garcia
 * GitHub: TonGarcia
 *
 * Project: Memory Workout
 * Description: A JS, HTML and CSS based memory game.
 * The goal is to match pairs of cards in the least
 * number of matching attempts.
 */

/**
 * @namespace Card object
 */
MemoryGame.Card = function(value) {
  this.value = value;
  this.isRevealed = false;

  this.reveal = function() {
    this.isRevealed = true;
  };

  this.conceal = function() {
    this.isRevealed = false;
  }
};
