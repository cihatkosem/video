module.exports = async function index(req, res, next) {
    
    try {
        let query = req.query

        if (req.url == "/") return res.render('index', { search: null, video: null, audio: null, videos: null, related: null })

        let search = query.search ? await yts(query.search) : null
        let videos = search ? search.videos.slice(0, 15) : null

        if (videos) return res.render('index', { search: query.search, video: null, audio: null, videos, related: null })

        let selectQuery = query.watch ? query.watch : query.listen ? query.listen : null
            findvideo = selectQuery ? await ytdl.getInfo(`https://www.youtube.com/watch?v=${selectQuery}`) : null,
            formats = findvideo ? findvideo.formats : null,
            mp4 = formats ? formats.filter(f => f.container == "mp4" && f.hasAudio == true && f.hasVideo == true) : null,
            mp3 = formats ? formats.filter(f => f.container == "webm" && f.mimeType == `audio/webm; codecs="opus"`) : null

        let details = findvideo.player_response
        let publishDate = await Functions.day("true", "true", details.microformat.playerMicroformatRenderer.publishDate)

        let video = {
            title: details.videoDetails.title,
            videoId: details.videoDetails.videoId,
            channelId: details.videoDetails.channelId,
            publishDate: publishDate.slice(0, publishDate.search("00.00.00")),
            viewCount: details.videoDetails.viewCount,
            category: details.videoDetails.category,
            lengthSeconds: details.videoDetails.lengthSeconds,
            viewCount: details.videoDetails.viewCount,
            author: details.videoDetails.author,
            isLiveContent: details.videoDetails.isLiveContent,
            formats: { mp3: mp3[0].url, mp4: mp4[0].url }
        }

        return res.render('index', { 
            search: query.search, 
            video: req.url == "/listen" || query.listen ? null : video, 
            audio: req.url == "/listen" || query.listen ? video : null,
            videos: null, 
            related: findvideo.related_videos 
        })
        
    } catch (error) {
        console.log(error)
        return res.status(404).render("error")
    }
}