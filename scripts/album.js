// Album button templates 
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';



// Player bar element selectors
var $previousButton = $('.left-controls .previous');
var $nextButton = $('.left-controls .next');
var $playerBarPlayPauseButton = $('.left-controls .play-pause');



// Create variables in the global scope to hold current song/album information
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;



// Set the current album
var setCurrentAlbum = function (album) {

    currentAlbum = album;

    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');

    $albumTitle.text(album.name);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);

    $albumSongList.empty();

    for (i = 0; i < album.songs.length; i++) {
        var $newRow = createSongRow(i + 1, album.songs[i].name, album.songs[i].length);
        $albumSongList.append($newRow);
    }

};



//Switch albums
var albums = [albumPicasso, albumMarconi, albumMothership];
var index = 1;
$('.album-cover-art').click(function () {
    setCurrentAlbum(albums[index]);
    index++;
    if (index == albums.length) {
        index = 0;
    }
});



var songListContainer = document.getElementsByClassName('album-view-song-list')[0];



// Create a template for each song row
var createSongRow = function (songNumber, songName, songLength) {
    var template =
        '<tr class="album-view-song-item">' + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
    /* + '  <td class="song-item-number">' + songNumber + '</td>'*/
    + '  <td class="song-item-title">' + songName + '</td>' + '  <td class="song-item-duration">' + songLength + '</td>' + '</tr>';

    var $row = $(template);

    // Create a click handler
    var clickHandler = function () {

        var songNumber = parseInt($(this).attr('data-song-number'));
        

        if (currentlyPlayingSongNumber !== null) {
            // Revert to song number for currently playing song because user started playing new song.
            var currentlyPlayingCell = $(getSongNumberCell(currentlyPlayingSongNumber));
            currentlyPlayingCell.html(currentlyPlayingSongNumber);

        }

        if (currentlyPlayingSongNumber !== songNumber) {
            // Switch from Play -> Pause button to indicate new song is playing.
            $(this).html(pauseButtonTemplate);

            // Replaced with setSong;
            /*currentlyPlayingSongNumber = songNumber;
            currentSongFromAlbum = currentAlbum.songs[songNumber - 1];*/
            setSong(songNumber);
            
            currentSoundFile.play();
            

            updatePlayerBarSong();

        } else if (currentlyPlayingSongNumber === songNumber) {
            // Switch from Pause -> Play button to pause currently playing song.
            $(this).html(playButtonTemplate);

            //Replaced with setSong;
            /*currentlyPlayingSongNumber = null;
            currentSongFromAlbum = null;
            setSong(null);*/
            
            // Replace setSong with a conditional statement that checks if the currentSoundFile is paused:
            if(currentSoundFile.isPaused()){
                currentSoundFile.play();
                $(this).html(playButtonTemplate);
                $('.left-controls .play-pause').html(playerBarPlayButton); 
            }
            else 
            {
                currentSoundFile.pause();
                $(this).html(pauseButtonTemplate);
                $('.left-controls .play-pause').html(playerBarPauseButton);
            }
            
        }

    };

    var onHover = function (event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
    };

    var offHover = function (event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        }

    };


    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);

    return $row;
};




// Create trackIndex Method to track the index of a song
var trackIndex = function (album, song) {
    return album.songs.indexOf(song);
};



// Create getSongNumberCell method 
var getSongNumberCell = function (number) {
    return $('.song-item-number[data-song-number="' + number + '"]');
};




// Create setSong method to set a new current song
var setSong = function (songNumber) {
    
    //Prevent Multiple Songs From Playing Concurrently
    if (currentSoundFile) {
        currentSoundFile.stop();
    }
    
    
    currentlyPlayingSongNumber = parseInt(songNumber);
        currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        // #2
        formats: [ 'mp3' ],
        preload: true
    });
    
    setVolume(currentVolume);

};



// Set volume method
var setVolume = function(volume) {

    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }

};





// Toggle play/pause in the play bar
var togglePlayFromPlayerBar = function(){
    
    var currentlyPlayingCell = $(getSongNumberCell(currentlyPlayingSongNumber));
    
    if(currentSoundFile) {
        if(currentSoundFile.isPaused()) {
            currentlyPlayingCell.html(pauseButtonTemplate);
            $('.left-controls .play-pause').html(playerBarPauseButton);
            currentSoundFile.play();
        }
        else
        {
            currentlyPlayingCell.html(playButtonTemplate);
            $('.left-controls .play-pause').html(playerBarPlayButton);
            currentSoundFile.pause();
        }  
    }
};





// Click to update the song's name and its artist's name in the song rows
var updatePlayerBarSong = function () {

    $('.currently-playing .song-name').text(currentSongFromAlbum.name);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentAlbum.artist);

    $('.left-controls .play-pause').html(playerBarPauseButton);

};




// Click on the previousButton/nextButton to update the song's name and its artist's name in the play bar.

var previousSong = function () {

    // Note the difference between this implementation and the one in
    // nextSong()
    var getLastSongNumber = function (index) {
        return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
    };

    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _decrementing_ the index here
    currentSongIndex--;

    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }

    //Replaced with setSong
    /* currentlyPlayingSongNumber = currentSongIndex + 1;
     currentSongFromAlbum = currentAlbum.songs[currentSongIndex];*/
    setSong(currentSongIndex + 1);
    
    
    currentSoundFile.play();

    
    // Update the Player Bar information
    $('.currently-playing .song-name').text(currentSongFromAlbum.name);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentAlbum.name);
    $('.left-controls .play-pause').html(playerBarPauseButton);

    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);

};


var nextSong = function () {
    var getLastSongNumber = function (index) {
        return index == 0 ? currentAlbum.songs.length : index;
    };

    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _incrementing_ the song here
    currentSongIndex++;

    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }

    // Set a new current song
    /*currentlyPlayingSongNumber = currentSongIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];*/
    setSong(currentSongIndex + 1);
    
    
    
    currentSoundFile.play();


    // Update the Player Bar information
    $('.currently-playing .song-name').text(currentSongFromAlbum.name);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentAlbum.name);
    $('.left-controls .play-pause').html(playerBarPauseButton);

    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};



// Execute as soon as the window is ready. 

$(document).ready(function () {

    setCurrentAlbum(albumPicasso);

    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    $playerBarPlayPauseButton.click(togglePlayFromPlayerBar);

});





/*window.onload = function() {
    // Click on the album image to change the album view
    setCurrentAlbum(albumPicasso);
    
    var albums =[albumPicasso, albumMarconi, albumMothership];
    var index = 1; 
    
    albumImage.addEventListener('click', function(){
         setCurrentAlbum(albums[index]);
         index++;
         if (index == albums.length) {
             index = 0;
         }
    });
    
    //Find the parent by the element's class name method
    var findParentByClassName = function(element, nameOfClass){
        if(element.parentNode.length<0){
            alert("No parent found");
        }
        else
        {
            var parentOfElement = element.parentElement;
            while(parentOfElement.className !== nameOfClass) {
                parentOfElement = parentOfElement.parentElement;
            }
            return parentOfElement;
        }
    };


    //Get the song number for the activated element method
    var getSongItem = function(element){
        switch(element.className){
            case 'album-song-button':
            case 'ion-play':    
            case 'ion-pause':
                return findParentByClassName(element, 'song-item-number');
            case 'album-view-song-item':
                return element.querySelector('.song-item-number');
            case 'song-item-title':
            case 'song-item-duration':
                return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
            case 'song-item-number':
                return element;
            default:
                return;       
        }
    };
    
      // Add a clickHandler() Function
    var clickHandler = function(targetElement) {        
        var songItem = getSongItem(targetElement);
         
        if (currentlyPlayingSong === null) {
             songItem.innerHTML = pauseButtonTemplate;
             currentlyPlayingSong = songItem.getAttribute('data-song-number');
         }
         else if(currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
             songItem.innerHTML = playButtonTemplate;
             currentlyPlayingSong = null;
         }
         else if(currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
             var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
             currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
             songItem.innerHTML = pauseButtonTemplate;
             currentlyPlayingSong = songItem.getAttribute('data-song-number');
         }
    };
    
    
    // Elements we'll be adding listeners to
     var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
     var songRows = document.getElementsByClassName('album-view-song-item');

    
    // Add mouseover Event
    songListContainer.addEventListener('mouseover', function(event) {
        // Only target individual song rows during event delegation
        if (event.target.parentElement.className === 'album-view-song-item') {
              // Change the content from the number to the play button's HTML
               event.target.parentElement.querySelector('.song-item-number').innerHTML = playButtonTemplate;
            var songItem = getSongItem(event.target);
            
            if (songItem.getAttribute('data-song-number') !== currentlyPlayingSong) {
                  songItem.innerHTML = playButtonTemplate;
             }  
        }
     
     });
    
    
    // Add mouseleave Event
    for (i = 0; i < songRows.length; i++) {
        songRows[i].addEventListener('mouseleave', function(event) {
            // Selects first child element, which is the song-item-number element
            //this.children[0].innerHTML = this.children[0].getAttribute('data-song-number'); 
            var songItem = getSongItem(event.target);
            var songItemNumber = songItem.getAttribute('data-song-number');

            if (songItemNumber !== currentlyPlayingSong) {
                songItem.innerHTML = songItemNumber;
            }
        });
            
        songRows[i].addEventListener('click', function(event) {
            clickHandler(event.target);
        });       
    }
      
 };*/