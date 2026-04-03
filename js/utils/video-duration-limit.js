
document.addEventListener('DOMContentLoaded', function() {
  const videos = document.querySelectorAll('video[data-duration="5"]');
  videos.forEach(video => {
    video.addEventListener('timeupdate', function() {
      if (this.currentTime >= 5) {
        this.currentTime = 0;
      }
    });
  });
});
