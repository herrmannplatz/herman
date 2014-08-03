describe('herman AudioPlayer', function() {

    var AudioPlayer = herman.audio.AudioPlayer;

    it('is available', function() {
        expect(AudioPlayer).not.toBe(null);
    });

    describe('methods', function() {

        var manifest = [
            './audio/All.mp3',
            './audio/Bass.mp3',
            './audio/Crunch.mp3'
        ];

        it('preload', function(done) {
            AudioPlayer.preloader.preload(manifest, function() {
                done();
            });
        });

    });
    
});