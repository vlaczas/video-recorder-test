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

navigator.mediaDevices.getUserMedia({video: true, audio: true}).then(st => {
  stream = st
  fun()
})

async function fun () {
  download.removeAttribute("href")
  preview.controls = false;
  videoChunks = []
  if (videoUrl) URL.revokeObjectURL(videoUrl)
  
  preview.srcObject = stream;
  await new Promise(resolve => preview.onplaying = resolve);
  let supportedVideo = 'video/mp4'
  if (MediaRecorder.isTypeSupported("video/webm")) supportedVideo = 'video/webm'
  mimetype.innerText = supportedVideo
  const recorder = new MediaRecorder(stream, {mimeType: supportedVideo})
  console.log(recorder)

  recorder.ondataavailable = (event) => {
    console.log("recorder stopped");
    if (event.data.size > 0) videoChunks.push(event.data)
    const blob = new Blob(videoChunks, { 'type' : supportedVideo });
    const videoURL = window.URL.createObjectURL(blob);
    const name = Date.now() + "." + supportedVideo.split("/")[1]
    console.log(blob)
    preview.srcObject = null
    preview.src = videoURL;
    preview.controls = true;
    download.href = videoURL;
    download.download = name
  };

  recorder.start();
  setTimeout(() => {
    recorder.stop()
    stop.removeEventListener("click", () => recorder.stop())
  }, 30000)
  stop.addEventListener("click", () => recorder.stop(), {once: true})
}
