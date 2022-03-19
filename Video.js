module.exports = async function video(req, res, next) {
    let params = req.params, body = req.body
    if (body.videoname) return res.redirect(`/video/bul/${body.videoname}`)
    if (req.url == "/") return res.render('video', { search: null, video: null, videos: null, related: null })
    let search = params.search ? await yts(params.search) : null
    let videos = search ? search.videos.slice(0, 15) : null
    if (videos) return res.render('video', {  search: params.search, video: null, videos, related: null })

    let findvideo = params.videoid ? await ytdl.getInfo(`https://www.youtube.com/watch?v=${params.videoid}`) : null
    let formats = findvideo ? findvideo.formats : null
    let hasAll = formats ? formats.filter(f => f.hasAudio == true && f.hasVideo == true) : null
    let mp4 = formats ? hasAll.filter(f => f.container == "mp4") : null
    let p144 = formats ? mp4.filter(f => f.qualityLabel == "144p") : null
    let p360 = formats ? mp4.filter(f => f.qualityLabel == "360p") : null
    let p480 = formats ? mp4.filter(f => f.qualityLabel == "480p") : null
    let p720 = formats ? mp4.filter(f => f.qualityLabel == "720p") : null
    let p1080 = formats ? mp4.filter(f => f.qualityLabel == "1080p") : null
    let p1440 = formats ? mp4.filter(f => f.qualityLabel == "1440p") : null
    let p2160 = formats ? mp4.filter(f => f.qualityLabel == "2160p") : null
    let pSelect = p2160[0] ? p2160[0] : p1440[0] ? p1440[0] : p1080[0] ? p1080[0] :
        p720[0] ? p720[0] : p480[0] ? p480[0] : p360[0] ? p360[0] : p144[0] ? p144[0] : null
    let details = findvideo.player_response.videoDetails
    let video = {
        details: {
            title: details.title,
            videoId: details.videoId,
            channelId: details.channelId,
            lengthSeconds: details.lengthSeconds,
            viewCount: details.viewCount,
            author: details.author,
            isLiveContent: details.isLiveContent
        },
        player: {
            hasVideo: pSelect.hasVideo,
            hasAudio: pSelect.hasAudio,
            container: pSelect.container,
            isLive: pSelect.isLive,
            url: pSelect.url,
        }
    }
    return res.render('video', { search: params.search, video, videos: null, related: findvideo.related_videos })
}
