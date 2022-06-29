const startBtn = document.getElementById("start")
const preview = document.getElementById("preview")
const stop = document.getElementById("stop")
const download = document.getElementById("download")
const feature = document.getElementById("features")
const mimetype = document.getElementById("mimetype")

let videoChunks = []
let videoUrl = ""
let stream = null
startBtn.onclick = () => fun()
feature.innerText = JSON.stringify(navigator.mediaDevices.getSupportedConstraints(), null, 2)

navigator.mediaDevices.getUserMedia({video: {width: {ideal: 400}, height: {ideal: 400}}, audio: true}).then(st => {
  stream = st
  fun()
})

async function fun () {
  download.removeAttribute("href")
  preview.controls = false;
  videoChunks = []
  if (videoUrl) URL.revokeObjectURL(videoUrl)
  
  preview.srcObject = stream;
  preview.oncanplay = () => preview.play()
  await new Promise(resolve => preview.onplaying = resolve);
  let supportedVideo;
  if (MediaRecorder.isTypeSupported("video/webm")) supportedVideo = 'video/webm'
  if (MediaRecorder.isTypeSupported("video/mp4")) supportedVideo = 'video/mp4'
  if (MediaRecorder.isTypeSupported("video/mp4; codecs=avc1.4d002a")) supportedVideo = 'video/mp4; codecs=avc1.4d002a'
  if (MediaRecorder.isTypeSupported("video/webm;codecs=h264")) supportedVideo = 'video/webm;codecs=h264'
  mimetype.innerText = supportedVideo
  let options = {bitsPerSecond: 128000};
  if (supportedVideo) options.mimetype = supportedVideo
  const recorder = new MediaRecorder(stream, options)

  recorder.ondataavailable = (event) => {
    console.log("recorder stopped");
    if (event.data.size > 0) videoChunks.push(event.data)
    const blob = new Blob(videoChunks, { 'type' : supportedVideo });
    const videoURL = window.URL.createObjectURL(blob);
    console.log(blob)
    preview.srcObject = null
    preview.src = videoURL;
    preview.controls = true;
    download.href = videoURL;
    const name = Date.now() + "." + supportedVideo.split("/")[1].split(';')[0] || "mp4"
    download.download = name
  };

  recorder.start();
  setTimeout(() => {
    recorder.stop()
    stop.removeEventListener("click", () => recorder.stop())
  }, 30000)
  stop.addEventListener("click", () => recorder.stop(), {once: true})
}
