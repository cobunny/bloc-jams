 // Example Album 1
 var albumPicasso = {
     name: 'The Colors',
     artist: 'Pablo Picasso',
     label: 'Cubism',
     year: '1881',
     albumArtUrl: 'styles/assets/images/album_covers/01.png',
     songs: [
         { name: 'Blue', length: '4:26' },
         { name: 'Green', length: '3:14' },
         { name: 'Red', length: '5:01' },
         { name: 'Pink', length: '3:21'},
         { name: 'Magenta', length: '2:15'}
     ]
 };

// Example Album 2
 var albumMarconi = {
     name: 'The Telephone',
     artist: 'Guglielmo Marconi',
     label: 'EM',
     year: '1909',
     albumArtUrl: 'styles/assets/images/album_covers/20.png',
     songs: [
         { name: 'Hello, Operator?', length: '1:01' },
         { name: 'Ring, ring, ring', length: '5:01' },
         { name: 'Fits in your pocket', length: '3:21'},
         { name: 'Can you hear me now?', length: '3:14' },
         { name: 'Wrong phone number', length: '2:15'}  
     ]
 };

// Example Album 3
 var albumMothership = {
     name: 'Whole Lotta Love',
     artist: 'Led Zeppelin',
     label: 'Atlantic',
     year: '2007',
     albumArtUrl: 'styles/assets/images/album_covers/22.png',
     songs: [
         { name: 'Trampled Under Foot', length: '5:35' },
         { name: 'Whole Lotta Love', length: '5:32' },
         { name: 'Heartbreaker', length: '4:14'},
         { name: 'Achiles Last Stand', length: '10:22' },
         { name: 'Good Times Bad Times', length: '2:47'}
     ]
 };

var createSongRow = function(songNumber, songName, songLength) {   
    var template =
        '<tr class="album-view-song-item">'
        + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
        /* + '  <td class="song-item-number">' + songNumber + '</td>'*/
        + '  <td class="song-item-title">' + songName + '</td>'
        + '  <td class="song-item-duration">' + songLength + '</td>'
        + '</tr>'
        ;

    return template;
};


 // #1
var albumTitle = document.getElementsByClassName('album-view-title')[0];
var albumArtist = document.getElementsByClassName('album-view-artist')[0];
var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
var albumImage = document.getElementsByClassName('album-cover-art')[0];
var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

var setCurrentAlbum = function(album) {
     // #2
     albumTitle.firstChild.nodeValue = album.name;
     albumArtist.firstChild.nodeValue = album.artist;
     albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
     albumImage.setAttribute('src', album.albumArtUrl);
 
     // #3
     albumSongList.innerHTML = '';
 
     // #4
     for (i = 0; i < album.songs.length; i++) {
         albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].name, album.songs[i].length);
     }
 
 };


var songListContainer = document.getElementsByClassName('album-view-song-list')[0];



// Album button templates 
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

var currentlyPlayingSong = null;



window.onload = function() {
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
      
 };
     
     
