const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

router.get('/', (req, res, next) => {


    let artist = req.query.artist;
    let track = req.query.track;

    // Calling api to extract correct artist and track name given as parameters
    fetch('http://ws.audioscrobbler.com/2.0/?method=track.getcorrection&artist=' + artist + 
    '&track=' + track +'&api_key=0da936d76ab6be123b460ce7fa0bbd8b&format=json')
    .then(response => response.json())
    .then(data => {
        let correctedArtist = data.corrections.correction.track.artist.name;
        let correctedTrack = data.corrections.correction.track.name;

        console.log(correctedArtist + " " + correctedTrack);

        let musicData = [];

        // Calling api to extract similar track info
        fetch('http://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=' + correctedArtist +
        '&track=' + correctedTrack + '&limit=10&api_key=0da936d76ab6be123b460ce7fa0bbd8b&format=json')
        .then(response => response.json())
        .then(data => {
            for(track of data.similartracks.track) {
                let newTrack = {
                    name: track.name,
                    url: track.url,
                    artist: track.artist.name,
                };
                musicData.push(newTrack);
            }

            res.status(200).json({
                message: 'Handling GET requests to /tracks',
                data: musicData,
            });
        })
        .catch(error => {
            res.status(500).json({
                message: error.message,
                data: [],
            })
        });
    })
    .catch(error => {
        res.status(500).json({
            message: error.message,
            data: [],
        })
    });
});

module.exports = router;