 /*var collectionItemTemplate =*/

 var buildCollectionItemTemplate = function () {
     var template =
         '<div class="collection-album-container column fourth">' + '  <img src="styles/assets/images/album_covers/01.png"/>' + '  <div class="collection-album-info caption">' + '    <p>' + '      <a class="album-name" href="album.html"> The Colors </a>' + '      <br/>' + '      <a href="album.html"> Pablo Picasso </a>' + '      <br/>' + '      X songs' + '      <br/>' + '    </p>' + '  </div>' + '</div>';

     return $(template);
 };

 /*window.onload = function() {
 
     // #1
     var collectionContainer = document.getElementsByClassName('album-covers')[0];
     // #2
     collectionContainer.innerHTML = '';
 
     // #3
     for (var i = 0; i < 12; i++) {
         collectionContainer.innerHTML += collectionItemTemplate;
     }
 
 }*/

 $(window).load(function () {

     // Assign the album container that has the .clearfix classes on it
     var $collectionContainer = $('.album-covers.clearfix');

     // Clear the contents of the HTML just in case something else has been dynamically inserted 
     $collectionContainer.empty();

     // Insert all of the albums in the collection containers
     for (var i = 0; i < 12; i++) {
         var $newThumbnail = buildCollectionItemTemplate();
         $collectionContainer.append($newThumbnail);
     }
 });