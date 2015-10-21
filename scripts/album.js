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
    + '  <td class="song-item-title">' + songName + '</td>' + '  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>' + '</tr>';

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

            setSong(songNumber);
            currentSoundFile.play();
            updatePlayerBarSong();
            updateSeekBarWhileSongPlays();

            var $volumeFill = $('.volume .fill');
            var $volumeThumb = $('.volume .thumb');
            $volumeFill.width(currentVolume + '%');
            $volumeThumb.css({
                left: currentVolume + '%'
            });

        } else if (currentlyPlayingSongNumber === songNumber) {
            // Switch from Pause -> Play button to pause currently playing song.
            $(this).html(playButtonTemplate);


            // Replace setSong with a conditional statement that checks if the currentSoundFile is paused:
            if (currentSoundFile.isPaused()) {
                currentSoundFile.play();
                $(this).html(playButtonTemplate);
                $('.left-controls .play-pause').html(playerBarPlayButton);
            } else {
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
        formats: ['mp3'],
        preload: true
    });

    setVolume(currentVolume);


};




// Click on the previousButton/nextButton to update the song's name and its artist's name in the play bar.
var previousSong = function () {

    var getLastSongNumber = function (index) {
        return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
    };

    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);

    currentSongIndex--;

    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }


    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();


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

    currentSongIndex++;

    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }


    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();


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





// Toggle play/pause in the play bar
var togglePlayFromPlayerBar = function () {

    var currentlyPlayingCell = $(getSongNumberCell(currentlyPlayingSongNumber));

    if (currentSoundFile) {
        if (currentSoundFile.isPaused()) {
            currentlyPlayingCell.html(pauseButtonTemplate);
            $('.left-controls .play-pause').html(playerBarPauseButton);
            currentSoundFile.play();
        } else {
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




// Update seek bar while playing song
var updateSeekBarWhileSongPlays = function () {

    if (currentSoundFile) {
        // #1
        currentSoundFile.bind('timeupdate', function (event) {
            // #2
            var seekBarFillRatio = this.getTime() / this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');

            updateSeekPercentage($seekBar, seekBarFillRatio);
            setCurrentTimeInPlayerBar(this.getTime());
            setTotalTimeInPlayerBar(this.getDuration());
        });
    }

};




// Seek bars' interface
var updateSeekPercentage = function ($seekBar, seekBarFillRatio) {

    var offsetXPercent = seekBarFillRatio * 100;

    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);


    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({
        left: percentageString
    });

}




// Set up the seek bars - Add mouse events to the seek bars
var setupSeekBars = function () {

    var $seekBars = $('.player-bar .seek-bar');

    $seekBars.click(function (event) {

        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();
        var seekBarFillRatio = offsetX / barWidth;


        if ($(this).parent().attr('class') == 'seek-control') {

            seek(seekBarFillRatio * currentSoundFile.getDuration());

        }
        else
        {

            setVolume(seekBarFillRatio * 100);
        }


        updateSeekPercentage($(this), seekBarFillRatio);

    });


    $seekBars.find('.thumb').mousedown(function (event) {

        var $seekBar = $(this).parent();

        $(document).bind('mousemove.thumb', function (event) {
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;


            if ($seekBar.parent().attr('class') == 'seek-control') {

                seek(seekBarFillRatio * currentSoundFile.getDuration());

        $(document).bind('mouseup.thumb', function () {
            $(document).unbind('mousemove.thumb');
            $(document).unbind('mouseup.thumb');
        });

    });

};




// Set seek method to change the current song's playback location
var seek = function (time) {

    if (currentSoundFile) {
        currentSoundFile.setTime(time);
    }

}



// Set volume method
var setVolume = function (volume) {

    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }

};




// Set current time in the play bar 
var setCurrentTimeInPlayerBar = function (currentTime) {
    $('.current-time').text(filterTimeCode(currentTime));
}




// Convert the timecode in seconds to in miutes:seconds 
var filterTimeCode = function(timeInSeconds) {
    var totalSeconds = parseFloat(timeInSeconds);
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = Math.floor(totalSeconds % 60);
    
    
    return (minutes + ":" + seconds);

}



// Set the total time in player bar 
var setTotalTimeInPlayerBar = function(totalTime) {
    $('.total-time').text( filterTimeCode(totalTime));
}





// Execute the functions and events as soon as the window is ready. 

$(document).ready(function () {

    setCurrentAlbum(albumPicasso);

    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    $playerBarPlayPauseButton.click(togglePlayFromPlayerBar);
    setupSeekBars();

});