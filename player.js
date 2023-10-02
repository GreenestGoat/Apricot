var videoPlayerContainer = document.getElementById('video-player-container');
var video = document.getElementById('video');
var customControls = document.getElementById('custom-controls');
var controlBar = document.getElementById('control-bar')
var playButton = document.getElementById('play-button');
var pauseButton = document.getElementById('pause-button');
var timeBar = document.getElementById('time-bar');
var timeBarWrapper = document.getElementById('time-bar-wrapper')
var bufferedBar = document.getElementById('buffered-bar');
var playedBar = document.getElementById('played-bar');
var timeDisplay = document.getElementById('time-display');
var muteButton = document.getElementById('mute-button');
var volumeSlider = document.getElementById('volume-slider');
var fullscreenButton = document.getElementById('fullscreen-button');
var shrinkButton = document.getElementById('shrink-button');
var pipButton = document.getElementById('pip-button');
var isDragging = false;
var captionsButton = document.getElementById ('captions-button')
var forward30s = document.getElementById('forward-button')
var backward30s = document.getElementById('backward-button')
var skipIntroButton = document.getElementById('skip-intro-button');
var textOverlay = document.getElementById('text-overlay')
var lockButton = document.getElementById('lock-button')
var elapsedTime = document.getElementById('elapsed-time')
var remainingTime = document.getElementById('remaining-time')
var captionsEnabled = false; // Default value is true, assuming captions are initially enabled
var rightButtons = document.getElementById('right-buttons')
var volumeButtons = document.getElementById('volume-buttons')
var leftButtons = document.getElementById('left-buttons')
var shadow1 = document.getElementById('shadow1')
var shadow2 = document.getElementById('shadow2')
var shadowFull = document.getElementById('shadow-full')
var exitButton = document.getElementById('exit-button')
var qualityStat = document.getElementById('quality')
var containButton = document.getElementById('contain-button')
var fillButton = document.getElementById('fill-button')
var coverButton = document.getElementById('cover-button')
var overlaySettings = document.getElementById('overlay')

containButton.addEventListener('click', function() {
  video.style.objectFit = "contain";
});

fillButton.addEventListener('click', function() {
  video.style.objectFit = "fill";
});  

coverButton.addEventListener('click', function() {
  video.style.objectFit = "cover";
});  


// Disable right-click context menu
document.addEventListener('contextmenu', function(event) {
  event.preventDefault();
});

// var introStartTime = 3; // Start time of the intro in seconds
// var introEndTime = 95; // End time of the intro in seconds
// var skipToTime = 95; // Time to skip to in seconds

// Save video progress when the video is played
video.addEventListener('play', function() { 
  localStorage.setItem('videoProgress-' + currentEpisodeIndex, video.currentTime);
  localStorage.setItem('videoIndex', currentEpisodeIndex);
  localStorage.setItem('videoProgress-' + currentEpisodeIndex, 0);
  localStorage.setItem('videoProgress', video.currentTime);
  playButton.style.display = 'none';
  pauseButton.style.display = 'block';
});

// Save video index and progress when the video is paused
video.addEventListener('pause', function() {
  playButton.style.display = 'block';
  pauseButton.style.display = 'none';
  localStorage.setItem('videoProgress', video.currentTime);
  localStorage.setItem('videoProgress-' + currentEpisodeIndex, 0);
  localStorage.setItem('videoIndex', currentEpisodeIndex); 
  localStorage.setItem('videoProgress-' + currentEpisodeIndex, video.currentTime);
});

// Save video progress when the user leaves the page
window.addEventListener('beforeunload', function() {
  localStorage.setItem('videoProgress', video.currentTime);
  localStorage.setItem('videoProgress-' + currentEpisodeIndex, 0);
  localStorage.setItem('videoIndex', currentEpisodeIndex);
  localStorage.setItem('videoProgress-' + currentEpisodeIndex, video.currentTime);
});


document.addEventListener('DOMContentLoaded', function() {
  var SettingsButton = document.getElementById('settings-button');
  var overlay = document.getElementById('overlay');

  SettingsButton.addEventListener('click', function() {
    overlay.classList.toggle('hidden');
  });

  // Retrieve the caption state from localStorage
  captionsEnabled = localStorage.getItem('captionsEnabled') === 'true';

  // Update the caption display based on the caption state
  if (captionsEnabled) {
    video.textTracks[0].mode = 'showing';
  } else {
    video.textTracks[0].mode = 'hidden';
  }

  var savedIndex = parseInt(localStorage.getItem('videoIndex'));  
  var savedProgress = parseFloat(localStorage.getItem('videoProgress-' + savedIndex));
  
  if (!isNaN(savedIndex) && !isNaN(savedProgress)) {
    currentEpisodeIndex = savedIndex; 
    
    const currentEpisode = episodes[currentEpisodeIndex];
    video.src = currentEpisode.video;
    video.currentTime = savedProgress;
    
    showTitle.innerText = `Star Trek: The Next Generation S1 E${currentEpisode.id}`;
    episodeTitle.innerText = currentEpisode.title; 
            
     // Set captions
    const captionsTrack = video.querySelector('track[kind="captions"]');
    if (captionsTrack) {
      video.removeChild(captionsTrack);
    }       
    const newCaptionsTrack = document.createElement('track');
    newCaptionsTrack.kind = 'captions';
    newCaptionsTrack.label = 'English';  
    newCaptionsTrack.src = currentEpisode.captions;     
    video.appendChild(newCaptionsTrack);
  }
});

video.addEventListener('timeupdate', function() {
  localStorage.setItem('videoProgress', video.currentTime);
  localStorage.setItem('videoIndex', currentEpisodeIndex);
  if (video.currentTime >= introStartTime && video.currentTime <= introEndTime) {
    skipIntroButton.style.display = 'block';
  } else {
    skipIntroButton.style.display = 'none';
  }
});

// skipIntroButton.addEventListener('click', function() {
  // video.currentTime = skipToTime;
  // video.play();
  // playButton.style.display = 'none';
  // pauseButton.style.display = 'block';
// });

// 
forward30s.addEventListener('click', function() {
  video.currentTime += 10;
  playButton.style.display = 'none';
  pauseButton.style.display = 'block';
  video.play()
});

backward30s.addEventListener('click', function() {
  video.currentTime -= 10;
  playButton.style.display = 'none';
  pauseButton.style.display = 'block';
  video.play()
});

// Get the captions button
var captionsButton = document.getElementById('captions-button');

// Check the initial state of captions from localStorage
var captionsEnabled = localStorage.getItem('captionsEnabled') === 'true';

// Update the captions button color based on initial state
captionsButton.innerHTML = captionsEnabled ? '<svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" fill="rgba(255, 255, 255, 1)" class="bi bi-badge-cc-fill" viewBox="0 0 16 16"><path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2zm3.027 4.002c-.83 0-1.319.642-1.319 1.753v.743c0 1.107.48 1.727 1.319 1.727.69 0 1.138-.435 1.186-1.05H7.36v.114c-.057 1.147-1.028 1.938-2.342 1.938-1.613 0-2.518-1.028-2.518-2.729v-.747C2.5 6.051 3.414 5 5.018 5c1.318 0 2.29.813 2.342 2v.11H6.213c-.048-.638-.505-1.108-1.186-1.108zm6.14 0c-.831 0-1.319.642-1.319 1.753v.743c0 1.107.48 1.727 1.318 1.727.69 0 1.139-.435 1.187-1.05H13.5v.114c-.057 1.147-1.028 1.938-2.342 1.938-1.613 0-2.518-1.028-2.518-2.729v-.747c0-1.7.914-2.751 2.518-2.751 1.318 0 2.29.813 2.342 2v.11h-1.147c-.048-.638-.505-1.108-1.187-1.108z"/></svg>' : '<svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" fill="rgba(255, 255, 255, 1)" class="bi bi-badge-cc" viewBox="0 0 16 16"><path d="M3.708 7.755c0-1.111.488-1.753 1.319-1.753.681 0 1.138.47 1.186 1.107H7.36V7c-.052-1.186-1.024-2-2.342-2C3.414 5 2.5 6.05 2.5 7.751v.747c0 1.7.905 2.73 2.518 2.73 1.314 0 2.285-.792 2.342-1.939v-.114H6.213c-.048.615-.496 1.05-1.186 1.05-.84 0-1.319-.62-1.319-1.727v-.743zm6.14 0c0-1.111.488-1.753 1.318-1.753.682 0 1.139.47 1.187 1.107H13.5V7c-.053-1.186-1.024-2-2.342-2C9.554 5 8.64 6.05 8.64 7.751v.747c0 1.7.905 2.73 2.518 2.73 1.314 0 2.285-.792 2.342-1.939v-.114h-1.147c-.048.615-.497 1.05-1.187 1.05-.839 0-1.318-.62-1.318-1.727v-.743z"/><path d="M14 3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h12zM2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2z"/></svg>';

// Add a click event listener to the captions button
captionsButton.addEventListener('click', function() {
  if (captionsEnabled) {
    captionsEnabled = false;
    video.textTracks[0].mode = 'hidden';
    captionsButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" fill="rgba(255, 255, 255, 1)" class="bi bi-badge-cc" viewBox="0 0 16 16"><path d="M3.708 7.755c0-1.111.488-1.753 1.319-1.753.681 0 1.138.47 1.186 1.107H7.36V7c-.052-1.186-1.024-2-2.342-2C3.414 5 2.5 6.05 2.5 7.751v.747c0 1.7.905 2.73 2.518 2.73 1.314 0 2.285-.792 2.342-1.939v-.114H6.213c-.048.615-.496 1.05-1.186 1.05-.84 0-1.319-.62-1.319-1.727v-.743zm6.14 0c0-1.111.488-1.753 1.318-1.753.682 0 1.139.47 1.187 1.107H13.5V7c-.053-1.186-1.024-2-2.342-2C9.554 5 8.64 6.05 8.64 7.751v.747c0 1.7.905 2.73 2.518 2.73 1.314 0 2.285-.792 2.342-1.939v-.114h-1.147c-.048.615-.497 1.05-1.187 1.05-.839 0-1.318-.62-1.318-1.727v-.743z"/><path d="M14 3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h12zM2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2z"/></svg>';
  } else {
    captionsEnabled = true;
    video.textTracks[0].mode = 'showing';
    captionsButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" fill="rgba(255, 255, 255, 1)" class="bi bi-badge-cc-fill" viewBox="0 0 16 16"><path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2zm3.027 4.002c-.83 0-1.319.642-1.319 1.753v.743c0 1.107.48 1.727 1.319 1.727.69 0 1.138-.435 1.186-1.05H7.36v.114c-.057 1.147-1.028 1.938-2.342 1.938-1.613 0-2.518-1.028-2.518-2.729v-.747C2.5 6.051 3.414 5 5.018 5c1.318 0 2.29.813 2.342 2v.11H6.213c-.048-.638-.505-1.108-1.186-1.108zm6.14 0c-.831 0-1.319.642-1.319 1.753v.743c0 1.107.48 1.727 1.318 1.727.69 0 1.139-.435 1.187-1.05H13.5v.114c-.057 1.147-1.028 1.938-2.342 1.938-1.613 0-2.518-1.028-2.518-2.729v-.747c0-1.7.914-2.751 2.518-2.751 1.318 0 2.29.813 2.342 2v.11h-1.147c-.048-.638-.505-1.108-1.187-1.108z"/></svg>';
  }

  // Save the caption state to localStorage
  localStorage.setItem('captionsEnabled', captionsEnabled);
});


// lockButton.addEventListener('click', function() {
  // customControls.style.opacity = '0';
  // customControls.style.transition = 'bottom 0.5s ease-in-out, opacity 0.5s ease-in-out';
// })

// Hide the pause button by default
pauseButton.style.display = 'none';

var hideCursorTimer;
var isMouseMoving = false;
var isButtonClicked = false;

function hideCursor() {
  if (!video.paused && !isMouseMoving && !isButtonClicked) {
    video.style.cursor = 'none';
    captionContainer.style.bottom = '50px';
    captionContainer.style.transition = 'bottom 0.19s ease-in-out';
    exitButton.style.top = '-100px';
    exitButton.style.opacity = '0';
    exitButton.style.transition = 'top 0.5s ease, opacity 0.5s ease';
    controlBar.style.bottom = '-100px';
    controlBar.style.opacity = '0';
    controlBar.style.transition = 'bottom 0.5s ease, opacity 0.5s ease';
    shadowFull.style.opacity = '0';
    shadowFull.style.transition = 'opacity 0.6s ease';
    shadow2.style.top = '-100px';
    shadow2.style.opacity = '0';
    shadow2.style.transition = 'top 0.6s ease, opacity 0.6s ease';
    shadow1.style.bottom = '-100px';
    shadow1.style.opacity = '0';
    shadow1.style.transition = 'bottom 0.6s ease, opacity 0.6s ease';
    timeBarWrapper.style.bottom = '-100px';
    timeBarWrapper.style.opacity = '0';
    timeBarWrapper.style.transition = 'bottom 0.5s ease, opacity 0.5s ease';
    document.body.style.cursor = 'none'; // Hide the cursor
  }
}

function resetHideCursorTimer() {
  clearTimeout(hideCursorTimer);
  hideCursorTimer = setTimeout(hideCursor, 4000);
}

videoPlayerContainer.addEventListener('mousemove', function () {
  if (!video.paused) {
    captionContainer.style.bottom = '160px';
    exitButton.style.opacity = '1';
    exitButton.style.top = '4.5%';
    controlBar.style.opacity = '1';
    controlBar.style.bottom = '0px';
    shadowFull.style.opacity = '1';
    shadow2.style.opacity = '1';
    shadow2.style.top = '0px';
    shadow1.style.opacity = '1';
    shadow1.style.bottom = '0px';
    timeBarWrapper.style.opacity = '1';
    timeBarWrapper.style.bottom = '96px';
    videoPlayerContainer.style.cursor = 'auto';
    isMouseMoving = true;
    resetHideCursorTimer();
    setTimeout(function() {
      isMouseMoving = false;
    }, 200);
  }
});

videoPlayerContainer.addEventListener('mouseleave', function () {
  if (!video.paused && !isDragging) {
    resetHideCursorTimer();
    captionContainer.style.bottom = '50px';
    captionContainer.style.transition = 'bottom 0.19s ease-in-out';
    exitButton.style.top = '-100px';
    exitButton.style.opacity = '0';
    exitButton.style.transition = 'top 0.2s ease, opacity 0.2s ease';
    controlBar.style.bottom = '-100px';
    controlBar.style.opacity = '0';
    controlBar.style.transition = 'bottom 0.2s ease, opacity 0.2s ease';
    shadowFull.style.opacity = '0';
    shadowFull.style.transition = 'opacity 0.3s ease';
    shadow2.style.top = '-100px';
    shadow2.style.opacity = '0';
    shadow2.style.transition = 'top 0.3s ease, opacity 0.3s ease';
    shadow1.style.bottom = '-100px';
    shadow1.style.opacity = '0';
    shadow1.style.transition = 'bottom 0.3s ease, opacity 0.3s ease';
    timeBarWrapper.style.bottom = '-100px';
    timeBarWrapper.style.opacity = '0';
    timeBarWrapper.style.transition = 'bottom 0.2s ease, opacity 0.2s ease';
    videoPlayerContainer.style.cursor = 'none'; // Hide the cursor when the mouse leaves the container
  }
});

document.addEventListener('click', function () {
  isButtonClicked = true;
  setTimeout(function() {
    isButtonClicked = false;
  }, 200);
});


timeBarWrapper.addEventListener('mousedown', function (event) {
  isDragging = true;
  updatePlayedBar(event.clientX);
});

document.addEventListener('mousemove', function (event) {
  if (isDragging) {
    updatePlayedBar(event.clientX);
  }
});

document.addEventListener('mouseup', function () {
  isDragging = false;
});

function updatePlayedBar(mouseX) {
  var rect = timeBar.getBoundingClientRect();
  var progressBarWidth = rect.width;
  var clickX = mouseX - rect.left;
  var progressPercentage = clickX / progressBarWidth;
  var currentTime = video.duration * progressPercentage;
  playedBar.style.width = progressPercentage * 100 + '%';
  video.currentTime = currentTime;
}

document.addEventListener('keydown', function(e) {
  switch (e.code) {
    case 'KeyP':
      if (video.currentTime >= introStartTime && video.currentTime <= introEndTime) {
        skipIntroButton.style.display = 'block';
        video.currentTime = skipToTime;
        video.play();
        playButton.style.display = 'none';
        pauseButton.style.display = 'block';
      } else {
        skipIntroButton.style.display = 'none';
      }
      break;
    case 'KeyL':
      video.currentTime += 10;
      playButton.style.display = 'none';
      pauseButton.style.display = 'block';
      video.play();
      break;
    case 'KeyJ':
      video.currentTime -= 10;
      playButton.style.display = 'none';
      pauseButton.style.display = 'block';
      video.play();
      break;
    case 'Digit1':  
      video.currentTime = video.duration * 0.1;
      break;
    case 'Digit2':  
      video.currentTime = video.duration * 0.2;
      break;
    case 'Digit3':  
      video.currentTime = video.duration * 0.3;
      break;
    case 'Digit4':  
      video.currentTime = video.duration * 0.4;
      break;
    case 'Digit5':  
      video.currentTime = video.duration * 0.5;
      break;
    case 'Digit6':  
      video.currentTime = video.duration * 0.6;
      break;
    case 'Digit7':  
      video.currentTime = video.duration * 0.7;
      break;
    case 'Digit8':  
      video.currentTime = video.duration * 0.8;
      break;
    case 'Digit9':  
      video.currentTime = video.duration * 0.9;
      break;
    case 'Digit0':
      video.currentTime = 0;
      break;
    case 'KeyK':
    case 'Enter':
    case 'Space':
      if (video.paused) {
        video.play();
        playButton.style.display = 'none';
        pauseButton.style.display = 'block';
      } else {
        video.pause();
        captionContainer.style.bottom = '160px';
        exitButton.style.opacity = '1';
        exitButton.style.top = '4.5%';
        controlBar.style.opacity = '1';
        controlBar.style.bottom = '0px';
        shadowFull.style.opacity = '1';
        shadow2.style.opacity = '1';
        shadow2.style.top = '0px';
        shadow1.style.opacity = '1';
        shadow1.style.bottom = '0px';
        timeBarWrapper.style.opacity = '1';
        timeBarWrapper.style.bottom = '96px';
        videoPlayerContainer.style.cursor = 'auto';
      }
      break;
    case 'KeyC':
      if (captionsEnabled) {
        captionsEnabled = false;
        video.textTracks[0].mode = 'hidden';
        captionsButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" fill="rgba(255, 255, 255, 1)" class="bi bi-badge-cc" viewBox="0 0 16 16"><path d="M3.708 7.755c0-1.111.488-1.753 1.319-1.753.681 0 1.138.47 1.186 1.107H7.36V7c-.052-1.186-1.024-2-2.342-2C3.414 5 2.5 6.05 2.5 7.751v.747c0 1.7.905 2.73 2.518 2.73 1.314 0 2.285-.792 2.342-1.939v-.114H6.213c-.048.615-.496 1.05-1.186 1.05-.84 0-1.319-.62-1.319-1.727v-.743zm6.14 0c0-1.111.488-1.753 1.318-1.753.682 0 1.139.47 1.187 1.107H13.5V7c-.053-1.186-1.024-2-2.342-2C9.554 5 8.64 6.05 8.64 7.751v.747c0 1.7.905 2.73 2.518 2.73 1.314 0 2.285-.792 2.342-1.939v-.114h-1.147c-.048.615-.497 1.05-1.187 1.05-.839 0-1.318-.62-1.318-1.727v-.743z"/><path d="M14 3a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h12zM2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2z"/></svg>';
      } else {
        captionsEnabled = true;
        video.textTracks[0].mode = 'showing';
        captionsButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" fill="rgba(255, 255, 255, 1)" class="bi bi-badge-cc-fill" viewBox="0 0 16 16"><path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2zm3.027 4.002c-.83 0-1.319.642-1.319 1.753v.743c0 1.107.48 1.727 1.319 1.727.69 0 1.138-.435 1.186-1.05H7.36v.114c-.057 1.147-1.028 1.938-2.342 1.938-1.613 0-2.518-1.028-2.518-2.729v-.747C2.5 6.051 3.414 5 5.018 5c1.318 0 2.29.813 2.342 2v.11H6.213c-.048-.638-.505-1.108-1.186-1.108zm6.14 0c-.831 0-1.319.642-1.319 1.753v.743c0 1.107.48 1.727 1.318 1.727.69 0 1.139-.435 1.187-1.05H13.5v.114c-.057 1.147-1.028 1.938-2.342 1.938-1.613 0-2.518-1.028-2.518-2.729v-.747c0-1.7.914-2.751 2.518-2.751 1.318 0 2.29.813 2.342 2v.11h-1.147c-.048-.638-.505-1.108-1.187-1.108z"/></svg>';
      }
      break
    case 'KeyI':
      if (video !== document.pictureInPictureElement) {
        video.requestPictureInPicture();
        shrinkButton.style.display = 'none'
        fullscreenButton.style.display = 'block'
        pipButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" fill="rgba(255, 255, 255, 1)" class="bi bi-pip-fill" viewBox="0 0 16 16"><path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm7 6h5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5z"/></svg>';
      } else {
        document.exitPictureInPicture();
        pipButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" fill="rgba(255, 255, 255, 1)" class="bi bi-pip" viewBox="0 0 16 16"><path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h13A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5v-9zM1.5 3a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z"/><path d="M8 8.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-3z"/></svg>';
      }
      break
    case 'ArrowLeft':
      video.currentTime -= 10;
      video.play();
      playButton.style.display = 'none';
      pauseButton.style.display = 'block';
      break;
    case 'ArrowRight':
      video.currentTime += 10;
      playButton.style.display = 'none';
      pauseButton.style.display = 'block';
      video.play();
      break;
    // case 'Escape':
    case 'KeyF':
      toggleFullscreen();
      if (!isFullscreen) {
        shrinkButton.style.display = 'none'
        fullscreenButton.style.display = 'block'
      }
      else {
        shrinkButton.style.display = 'block'
        fullscreenButton.style.display = 'none'
      }

      break;
    case 'ArrowUp':
      increaseVolume();
      break;
    case 'ArrowDown':
      decreaseVolume();
      break;
  }
});

var isFullscreen = false;

function toggleFullscreen() {
  if (!isFullscreen) {
    if (videoPlayerContainer.requestFullscreen) {
      videoPlayerContainer.requestFullscreen();
    } else if (videoPlayerContainer.webkitRequestFullscreen) {
      videoPlayerContainer.webkitRequestFullscreen();
    } else if (videoPlayerContainer.msRequestFullscreen) {
      videoPlayerContainer.msRequestFullscreen();
    }

    customControls.classList.add('fullscreen');
    isFullscreen = true;
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }

    customControls.classList.remove('fullscreen');
    isFullscreen = false;
  }
}

fullscreenButton.addEventListener('click', function() {
  toggleFullscreen();
  shrinkButton.style.display = 'block'
  fullscreenButton.style.display = 'none'
});

shrinkButton.addEventListener('click', function() {
  toggleFullscreen();
  shrinkButton.style.display = 'none'
  fullscreenButton.style.display = 'block'
})

document.addEventListener('fullscreenchange', function() {
  if (!document.fullscreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement) {
    customControls.classList.remove('fullscreen');
    isFullscreen = false;
  }
});

playButton.addEventListener('click', function() {
  if (video.paused) {
    video.play();
    playButton.style.display = 'none';
    pauseButton.style.display = 'block';
  }
});

pauseButton.addEventListener('click', function() {
  if (!video.paused) {
    video.pause();
    pauseButton.style.display = 'none';
    playButton.style.display = 'block';
  }
});

// textOverlay.addEventListener('click', function() {
  // if (video.paused) {
    // video.play();
    // playButton.style.display = 'none';
    // pauseButton.style.display = 'block';
  // } else {
    // video.pause();
    // pauseButton.style.display = 'none';
    // playButton.style.display = 'block';
  // }
// })

video.addEventListener('timeupdate', function() {
  var bufferedEnd = video.buffered.end(video.buffered.length - 1);
  bufferedBar.style.width = (bufferedEnd / video.duration) * 100 + '%';
  playedBar.style.width = (video.currentTime / video.duration) * 100 + '%';
  timeDisplay.textContent = formatTime(Math.floor(video.currentTime)) + ' / ' + formatTime(Math.floor(video.duration));
});

timeBar.addEventListener('click', function(e) {
  var rect = timeBar.getBoundingClientRect();
  var x = e.clientX - rect.left;
  var percentage = x / timeBar.offsetWidth;
  playedBar.style.width = percentage * 100 + '%';
  video.currentTime = percentage * video.duration;
});

muteButton.addEventListener('click', function() {
  if (video.volume == 0) {
    video.volume = volumeSlider.value;
    muteButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" fill="rgba(255, 255, 255, 0.7)" class="bi bi-volume-mute-fill" viewBox="0 0 16 16"><path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z"/></svg>';
    volumeSlider.value = video.volume;
  } else {
    video.volume = 1;
    muteButton.innerHTML = '<svg width="54px" height="54px" viewBox="-2.4 -2.4 28.80 28.80" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>volume_fill</title> <g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Media" transform="translate(-1344.000000, -48.000000)" fill-rule="nonzero"> <g id="volume_fill" transform="translate(1344.000000, 48.000000)"> <path d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z" id="MingCute" fill-rule="nonzero"> </path> <path d="M13.2606,3.29912 C13.9570435,2.80169043 14.9125962,3.25623123 14.9943712,4.07969721 L15,4.19422 L15,19.8056 C15,20.6614 14.0747274,21.1747403 13.3570692,20.7626806 L13.2606,20.7007 L6.67953,15.9999 L4,15.9999 C2.94563773,15.9999 2.08183483,15.18405 2.00548573,14.1491661 L2,13.9999 L2,9.99991 C2,8.94554773 2.81587733,8.08174483 3.85073759,8.00539573 L4,7.99991 L6.67953,7.99991 L13.2606,3.29912 Z M19.6669,6.78255 C21.0974,8.06287 21.9999957,9.92664 21.9999957,11.9999 C21.9999957,14.0732 21.0974,15.9369 19.6669,17.2172 C19.2554,17.5856 18.6232,17.5506 18.2549,17.139 C17.8865,16.7275 17.9216,16.0953 18.3331,15.727 C19.3576,14.81 19.9999957,13.4806 19.9999957,11.9999 C19.9999957,10.5192 19.3576,9.18979 18.3331,8.27282 C17.9216,7.9045 17.8865,7.2723 18.2549,6.86078 C18.6232,6.44925 19.2554,6.41423 19.6669,6.78255 Z M17.6669,9.01867 C18.4837,9.74967 18.9999957,10.8151 18.9999957,11.9999 C18.9999957,13.1847 18.4837,14.2502 17.6669,14.9812 C17.2554,15.3495 16.6232,15.3145 16.2549,14.9029 C15.9148385,14.5230538 15.9185876,13.9551556 16.2448325,13.5803563 L16.3331,13.4909 C16.7439,13.1232 16.9999957,12.5921 16.9999957,11.9999 C16.9999957,11.46692 16.7925582,10.983431 16.4515975,10.6240097 L16.3331,10.5089 C15.9216,10.1406 15.8865,9.50842 16.2549,9.09689 C16.6232,8.68536 17.2554,8.65034 17.6669,9.01867 Z" id="形状" fill="#ffffff"> </path> </g> </g> </g> </g></svg>';
    volumeSlider.value = 1;
  }
});

volumeSlider.addEventListener('input', function() {
  video.volume = volumeSlider.value;
  if (video.volume == 0) {
    muteButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" fill="rgba(255, 255, 255, 0.7)" class="bi bi-volume-mute-fill" viewBox="0 0 16 16"><path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z"/></svg>';
  } else {
    muteButton.innerHTML = '<svg width="54px" height="54px" viewBox="-2.4 -2.4 28.80 28.80" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>volume_fill</title> <g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Media" transform="translate(-1344.000000, -48.000000)" fill-rule="nonzero"> <g id="volume_fill" transform="translate(1344.000000, 48.000000)"> <path d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z" id="MingCute" fill-rule="nonzero"> </path> <path d="M13.2606,3.29912 C13.9570435,2.80169043 14.9125962,3.25623123 14.9943712,4.07969721 L15,4.19422 L15,19.8056 C15,20.6614 14.0747274,21.1747403 13.3570692,20.7626806 L13.2606,20.7007 L6.67953,15.9999 L4,15.9999 C2.94563773,15.9999 2.08183483,15.18405 2.00548573,14.1491661 L2,13.9999 L2,9.99991 C2,8.94554773 2.81587733,8.08174483 3.85073759,8.00539573 L4,7.99991 L6.67953,7.99991 L13.2606,3.29912 Z M19.6669,6.78255 C21.0974,8.06287 21.9999957,9.92664 21.9999957,11.9999 C21.9999957,14.0732 21.0974,15.9369 19.6669,17.2172 C19.2554,17.5856 18.6232,17.5506 18.2549,17.139 C17.8865,16.7275 17.9216,16.0953 18.3331,15.727 C19.3576,14.81 19.9999957,13.4806 19.9999957,11.9999 C19.9999957,10.5192 19.3576,9.18979 18.3331,8.27282 C17.9216,7.9045 17.8865,7.2723 18.2549,6.86078 C18.6232,6.44925 19.2554,6.41423 19.6669,6.78255 Z M17.6669,9.01867 C18.4837,9.74967 18.9999957,10.8151 18.9999957,11.9999 C18.9999957,13.1847 18.4837,14.2502 17.6669,14.9812 C17.2554,15.3495 16.6232,15.3145 16.2549,14.9029 C15.9148385,14.5230538 15.9185876,13.9551556 16.2448325,13.5803563 L16.3331,13.4909 C16.7439,13.1232 16.9999957,12.5921 16.9999957,11.9999 C16.9999957,11.46692 16.7925582,10.983431 16.4515975,10.6240097 L16.3331,10.5089 C15.9216,10.1406 15.8865,9.50842 16.2549,9.09689 C16.6232,8.68536 17.2554,8.65034 17.6669,9.01867 Z" id="形状" fill="#ffffff"> </path> </g> </g> </g> </g></svg>';
  }
});

function increaseVolume() {
  var newVolume = Math.min(video.volume + 0.1, 1);
  setVolume(newVolume);
}

function decreaseVolume() {
  var newVolume = Math.max(video.volume - 0.1, 0);
  setVolume(newVolume);
}

function setVolume(volume) {
  video.volume = volume;
  volumeSlider.value = volume;
  if (volume === 0) {
    muteButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" fill="currentColor" class="bi bi-volume-mute-fill" viewBox="0 0 16 16"><path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z"/></svg>';
  } else {
    muteButton.innerHTML = '<svg width="54px" height="54px" viewBox="-2.4 -2.4 28.80 28.80" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>volume_fill</title> <g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Media" transform="translate(-1344.000000, -48.000000)" fill-rule="nonzero"> <g id="volume_fill" transform="translate(1344.000000, 48.000000)"> <path d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z" id="MingCute" fill-rule="nonzero"> </path> <path d="M13.2606,3.29912 C13.9570435,2.80169043 14.9125962,3.25623123 14.9943712,4.07969721 L15,4.19422 L15,19.8056 C15,20.6614 14.0747274,21.1747403 13.3570692,20.7626806 L13.2606,20.7007 L6.67953,15.9999 L4,15.9999 C2.94563773,15.9999 2.08183483,15.18405 2.00548573,14.1491661 L2,13.9999 L2,9.99991 C2,8.94554773 2.81587733,8.08174483 3.85073759,8.00539573 L4,7.99991 L6.67953,7.99991 L13.2606,3.29912 Z M19.6669,6.78255 C21.0974,8.06287 21.9999957,9.92664 21.9999957,11.9999 C21.9999957,14.0732 21.0974,15.9369 19.6669,17.2172 C19.2554,17.5856 18.6232,17.5506 18.2549,17.139 C17.8865,16.7275 17.9216,16.0953 18.3331,15.727 C19.3576,14.81 19.9999957,13.4806 19.9999957,11.9999 C19.9999957,10.5192 19.3576,9.18979 18.3331,8.27282 C17.9216,7.9045 17.8865,7.2723 18.2549,6.86078 C18.6232,6.44925 19.2554,6.41423 19.6669,6.78255 Z M17.6669,9.01867 C18.4837,9.74967 18.9999957,10.8151 18.9999957,11.9999 C18.9999957,13.1847 18.4837,14.2502 17.6669,14.9812 C17.2554,15.3495 16.6232,15.3145 16.2549,14.9029 C15.9148385,14.5230538 15.9185876,13.9551556 16.2448325,13.5803563 L16.3331,13.4909 C16.7439,13.1232 16.9999957,12.5921 16.9999957,11.9999 C16.9999957,11.46692 16.7925582,10.983431 16.4515975,10.6240097 L16.3331,10.5089 C15.9216,10.1406 15.8865,9.50842 16.2549,9.09689 C16.6232,8.68536 17.2554,8.65034 17.6669,9.01867 Z" id="形状" fill="#ffffff"> </path> </g> </g> </g> </g></svg>';
  }
}

const captionContainer = document.createElement('div');
captionContainer.id = 'captionContainer';
document.body.appendChild(captionContainer);

video.addEventListener('timeupdate', () => {
  const activeCues = video.textTracks[0].activeCues;
  if (activeCues.length > 0) {
    captionContainer.style.display = 'block';
    captionContainer.textContent = activeCues[0].text;
  } else {
    captionContainer.style.display = 'none';
    captionContainer.textContent = '';
  }
});


function updateTime() {
  var elapsedTime = formatTime(video.currentTime);
  document.getElementById("elapsed-time").innerHTML = elapsedTime;
  
  var remainingTime;
  if (isNaN(video.duration)) {
    remainingTime = '00:00';
  } else {
    remainingTime = formatTime(video.duration - video.currentTime);
  }
  document.getElementById("remaining-time").innerHTML = remainingTime; 
}

setInterval(updateTime, 0.01);

function formatTime(seconds) {
  var hours = Math.floor(seconds / 3600);
  var minutes = Math.floor((seconds % 3600) / 60);
  var remainingSeconds = Math.floor(seconds % 60);
  if (hours > 0) {
    return hours + ':' + (minutes < 10 ? '0' : '') + minutes + ':' + (remainingSeconds < 10 ? '0' : '') + remainingSeconds;
  } else {
    return minutes + ':' + (remainingSeconds < 10 ? '0' : '') + remainingSeconds;
  }
}

pipButton.addEventListener('click', function() {
  if (video !== document.pictureInPictureElement) {
    video.requestPictureInPicture();
    shrinkButton.style.display = 'none'
    fullscreenButton.style.display = 'block'
  } else {
    document.exitPictureInPicture();
  }
});

// Event listener for 'leavepictureinpicture' event
video.addEventListener('leavepictureinpicture', function() {
  updatePiPIcon(false);
});

// Event listener for 'enterpictureinpicture' event
video.addEventListener('enterpictureinpicture', function() {
  updatePiPIcon(true);
});

function updatePiPIcon(inPiPMode) {
  pipButton.innerHTML = getPiPIcon(inPiPMode);
}

function getPiPIcon(inPiPMode) {
  if (inPiPMode) {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" fill="rgba(255, 255, 255, 1)" class="bi bi-pip-fill" viewBox="0 0 16 16"><path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm7 6h5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5z"/></svg>';
  } else {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" fill="rgba(255, 255, 255, 1)" class="bi bi-pip" viewBox="0 0 16 16"><path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h13A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5v-9zM1.5 3a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z"/><path d="M8 8.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-3z"/></svg>';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  if (!('pictureInPictureEnabled' in document)) {
    // Browser does not support PiP
    pipButton.style.display = 'none';
  }
});


/* if (Hls.isSupported()) {
  var video = document.getElementById('video');

  var hls = new Hls();
  hls.loadSource('https://storage.googleapis.com/shaka-demo-assets/angel-one-widevine-hls/hls.m3u8'); // Replace with your HLS stream URL
  hls.attachMedia(video);

  hls.on(Hls.Events.MANIFEST_PARSED, function() {
    video.play();
  });

  video.addEventListener('encrypted', function(e) {
    var keySystem = 'https://cwip-shaka-proxy.appspot.com/no_auth'; // Replace with the key system for Widevine DRM

    if (typeof video.mediaKeys === 'undefined') {
      navigator.requestMediaKeySystemAccess(keySystem, [{
        initDataTypes: ['cenc'],
        videoCapabilities: [{
          contentType: 'video/mp4; codecs="avc1.42E01E"'
        }]
      }]).then(function(keySystemAccess) {
        return keySystemAccess.createMediaKeys();
      }).then(function(createdMediaKeys) {
        video.mediaKeys = createdMediaKeys;
        video.setMediaKeys(video.mediaKeys);
        return video.mediaKeys.createSession();
      }).then(function(keySession) {
        keySession.addEventListener('message', function(event) {
          // Handle the license request and response
          // You need to implement this part based on the EME APIs for Widevine DRM
        });
        keySession.generateRequest('cenc', e.initData);
      }).catch(function(error) {
        console.error('Failed to initialize DRM:', error);
      });
    }
  });
} else {
  console.error('HLS.js is not supported.');
} */

const dashManifestUri = 'https://storage.googleapis.com/shaka-demo-assets/angel-one-widevine/dash.mpd';
const hlsManifestUri = 'https://storage.googleapis.com/shaka-demo-assets/angel-one-widevine-hls/hls.m3u8';
const licenseServer = 'https://cwip-shaka-proxy.appspot.com/no_auth';

const spinner = document.querySelector(".spinner");
let currentEpisodeIndex = localStorage.getItem('videoIndex') || 0;

const savedTime = localStorage.getItem('videoTime');

function initApp() {
  shaka.polyfill.installAll();

  if (shaka.Player.isBrowserSupported()) {
    initPlayer();
  } else {
    console.error('Browser not supported!');
  }
}

async function initPlayer() {
  const video = document.getElementById('video');
  const player = new shaka.Player(video);

  window.player = player;

  player.addEventListener('error', onErrorEvent);

  player.configure({
    drm: {
      servers: { 'com.widevine.alpha': licenseServer }
    }
  });

  try {
    // Try loading DASH manifest
    await player.load(dashManifestUri);
    console.log('DASH manifest loaded!');
  } catch (dashError) {
    console.error('Error loading DASH manifest:', dashError);

    try {
      // Fallback to HLS if DASH failed
      await player.load(hlsManifestUri);
      console.log('HLS manifest loaded!');
    } catch (hlsError) {
      console.error('Error loading HLS manifest:', hlsError);
      onError(hlsError);
    }
  }

  window.addEventListener("load", showSpinner);
  // Event listener for video buffering
  video.addEventListener("waiting", showSpinner);

  // Event listener for video playing
  video.addEventListener("playing", hideSpinner);
  video.play();

  video.addEventListener("loadeddata", function() {
    hideSpinner();
    enableSkip();
    video.play();
  });

  // Rest of the code...
}

function onErrorEvent(event) {
  onError(event.detail);
}

function onError(error) {
  console.error('Error code:', error.code, 'object:', error);
}

function enableSkip() {
  backward30s.style.opacity = "1";
  forward30s.style.opacity = "1";
  forward30s.style.pointerEvents = "all";
  backward30s.style.pointerEvents = "all";
}

function showLeftButtons() {
  playButton.style.display = "none";
  pauseButton.style.display = "block";
  backward30s.style.marginright = "5px";
  forward30s.style.marginLeft = "5px";
}

function hideLeftButtons() {
  backward30s.style.marginright = "113px";
  forward30s.style.marginLeft = "113px";
  playButton.style.display = "none";
  pauseButton.style.display = "none";
}

function showSpinner() {
  backward30s.style.marginright = "113px";
  forward30s.style.marginLeft = "113px";
  spinner.style.display = "block";
  captionContainer.style.bottom = '160px';
  exitButton.style.opacity = '1';
  exitButton.style.top = '4.5%';
  controlBar.style.opacity = '1';
  controlBar.style.bottom = '0px';
  shadowFull.style.opacity = '1';
  shadow2.style.opacity = '1';
  shadow2.style.top = '0px';
  shadow1.style.opacity = '1';
  shadow1.style.bottom = '0px';
  timeBarWrapper.style.opacity = '1';
  timeBarWrapper.style.bottom = '96px';
  videoPlayerContainer.style.cursor = 'auto';
  pauseButton.style.opacity = "0";
  pauseButton.style.pointerEvents = "none";
  playButton.style.opacity = "0";
  playButton.style.pointerEvents = "none";
  hideLeftButtons();
}

function hideSpinner() {
  backward30s.style.marginright = "5px";
  forward30s.style.marginLeft = "5px";
  spinner.style.display = "none";
  playButton.style.opacity = "1";
  playButton.style.pointerEvents = "all";
  pauseButton.style.opacity = "1";
  pauseButton.style.pointerEvents = "all";
  showLeftButtons();
  video.play();
}

// Update buffered bar on timeupdate
video.addEventListener("timeupdate", function() {
  bufferedRanges = [];

  for (let i = 0; i < video.buffered.length; i++) {
    if (video.buffered.start(i) < video.currentTime) {
      bufferedRanges.push({
        start: video.buffered.start(i),
        end: video.buffered.end(i)
      });
    }
  }

  let totalBuffered = 0;

  for (let i = 0; i < bufferedRanges.length; i++) {
    totalBuffered += bufferedRanges[i].end - bufferedRanges[i].start;
  }

  const bufferedWidth = (totalBuffered / video.duration) * 100 + "%";
  bufferedBar.style.width = bufferedWidth;
});

setInterval(function() {
  localStorage.setItem('videoTime', video.currentTime);
}, 1000);

document.addEventListener('DOMContentLoaded', initApp);

// Initial setup with the first episode
if (savedTime) {
  video.currentTime = parseFloat(savedTime);
}

/* 
// Parse the JSON database
fetch("episodes.json")
  .then(response => response.json())
  .then(data => {
    const episodes = data.episodes;
    const video = document.getElementById("video");
    const spinner = document.querySelector(".spinner");
    let currentEpisodeIndex = localStorage.getItem('videoIndex') || 0;
    let hls;

    const savedTime = localStorage.getItem('videoTime');

    if (savedTime) {
      video.currentTime = parseFloat(savedTime);
    }

    function showLeftButtons() {
      playButton.style.display = "none"; 
      pauseButton.style.display = "block";
      backward30s.style.marginright = "5px";
      forward30s.style.marginLeft = "5px";
    }
    
    function hideLeftButtons() {
      backward30s.style.marginright = "113px";
      forward30s.style.marginLeft = "113px";  
      playButton.style.display = "none";
      pauseButton.style.display = "none";
    }
    
    function showSpinner() {
      spinner.style.display = "block";
      captionContainer.style.bottom = '160px';
      exitButton.style.opacity = '1';
      exitButton.style.top = '4.5%';
      controlBar.style.opacity = '1';
      controlBar.style.bottom = '0px';
      shadowFull.style.opacity = '1';
      shadow2.style.opacity = '1';
      shadow2.style.top = '0px';
      shadow1.style.opacity = '1';
      shadow1.style.bottom = '0px';
      timeBarWrapper.style.opacity = '1';
      timeBarWrapper.style.bottom = '96px';
      videoPlayerContainer.style.cursor = 'auto';
      hideLeftButtons();
    }
    
    function hideSpinner() {
      spinner.style.display = "none";
      showLeftButtons();
      video.play();
    }

    function playNextEpisode() {
      localStorage.setItem('videoIndex', currentEpisodeIndex);
      localStorage.setItem('videoProgress-' + currentEpisodeIndex, video.currentTime);  
      currentEpisodeIndex++;
      if (currentEpisodeIndex >= episodes.length) {
        // No more episodes, reset to the first episode
        currentEpisodeIndex = 0;
      }

      setInterval(function() {
        localStorage.setItem('videoTime', video.currentTime);
      }, 1000); 

      const currentEpisode = episodes[currentEpisodeIndex];
      const videoUrl = currentEpisode.video;

      if (hls) {
        hls.destroy();
      }
      hls = new Hls({
      });
      hls.loadSource(videoUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function() {
        controlBar.style.display = 'flex';
        backward30s.style.opacity = "1";
        forward30s.style.opacity = "1";
        forward30s.style.pointerEvents = "all";
        backward30s.style.pointerEvents = "all";
        hls.startLevel = hls.levels.length - 1;
        hideSpinner();
        playButton.style.display = 'none';
        pauseButton.style.display = 'block';
        video.play();
      });
      hls.on(Hls.Events.LEVEL_SWITCHED, function(event, data) {
        const currentLevel = data.level;
        const levels = hls.levels;
        const currentResolution = levels[currentLevel].height + 'p';
        const currentBitrate = levels[currentLevel].bitrate / 1000 + 'kbps';
        const resolutionElement = document.getElementById("resolution");
        resolutionElement.textContent = currentResolution + ' / ' + currentBitrate;
        const videoFramerate = levels[currentLevel].frameRate + 'fps';
      });

      // Remove previous captions  
      const captionsTrack = video.querySelector('track[kind="captions"]');
      if (captionsTrack) {
        video.removeChild(captionsTrack);
      }
    
      // Set the captions track
      const newCaptionsTrack = document.createElement('track');
      newCaptionsTrack.kind = 'captions';
      newCaptionsTrack.label = 'English';
      newCaptionsTrack.srclang = 'en';
      newCaptionsTrack.src = currentEpisode.captions;
      video.appendChild(newCaptionsTrack);
    }

    // Event listener for video end
    video.addEventListener("ended", playNextEpisode);

    // Event listener for video buffering
    video.addEventListener("waiting", showSpinner);

    // Event listener for video playing
    video.addEventListener("playing", hideSpinner);

    // Update buffered bar on timeupdate
    video.addEventListener("timeupdate", function() {
      bufferedRanges = [];

      for (let i = 0; i < video.buffered.length; i++) {
        if (video.buffered.start(i) < video.currentTime) {
          bufferedRanges.push({
            start: video.buffered.start(i),
            end: video.buffered.end(i) 
          });
        }
      }

      let totalBuffered = 0;

      for (let i = 0; i < bufferedRanges.length; i++) {
        totalBuffered += bufferedRanges[i].end - bufferedRanges[i].start;
      }

      const bufferedWidth = (totalBuffered / video.duration) * 100 + "%";
      bufferedBar.style.width = bufferedWidth;
    });

    setInterval(function() {
      localStorage.setItem('videoTime', video.currentTime);
    }, 1000); 
  

    // Initial setup with the first episode
    if (savedTime) {
      video.currentTime = parseFloat(savedTime); 
    }

    const currentEpisode = episodes[currentEpisodeIndex];
    const videoUrl = currentEpisode.video;

    hls = new Hls({
    });
    hls.loadSource(videoUrl);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function() {
      controlBar.style.display = 'flex';
      backward30s.style.opacity = "1";
      forward30s.style.opacity = "1";
      forward30s.style.pointerEvents = "all";
      backward30s.style.pointerEvents = "all";
      hls.startLevel = hls.levels.length - 1;
      // Enable adaptive streaming (default behavior)
      video.play(); 
      playButton.style.display = 'none';
      pauseButton.style.display = 'block';
    });
    hls.on(Hls.Events.LEVEL_SWITCHED, function(event, data) {
      const currentLevel = data.level;
      const levels = hls.levels;
      const currentResolution = levels[currentLevel].height + 'p';
      const currentBitrate = levels[currentLevel].bitrate / 1000 + 'kbps';
      const resolutionElement = document.getElementById("resolution");
      resolutionElement.textContent = currentResolution + ' / ' + currentBitrate;
      const videoFramerate = levels[currentLevel].frameRate + 'fps';
    });

    // Remove previous captions  
    const captionsTrack = video.querySelector('track[kind="captions"]');
    if (captionsTrack) {
      video.removeChild(captionsTrack);
    }

    // Set the captions track
    const newCaptionsTrack = document.createElement('track');
    newCaptionsTrack.kind = 'captions'; 
    newCaptionsTrack.label = 'English';
    newCaptionsTrack.srclang = 'en';
    newCaptionsTrack.src = currentEpisode.captions;
    video.appendChild(newCaptionsTrack);
    
    playNextEpisode();
  })
  .catch(error => {
    console.error("Error loading episodes:", error);
  }); */


