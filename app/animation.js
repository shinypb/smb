defineClass('SMAnimation',  function (arr) {
  this.spriteArray = arr;
  this.currentIndex = 0;
  this.currentSprite = arr[this.currentIndex];
}, {
  nextSprite: function() {
    this.currentIndex = (this.currentIndex + 1) % this.spriteArray.length;
    this.currentSprite = this.spriteArray[this.currentIndex];
    return this.currentSprite;
  },
  setTimer: function(time, agent) {
    this.interval = setInterval(this.nextSprite, time);
  },
  clearTimer: function() {
    clearInterval(this.interval);
  }
});