const startBtn = document.getElementById("start")
const preview = document.getElementById("preview")
const stop = document.getElementById("stop")
const download = document.getElementById("download")

let videoChunks = []
let videoUrl = ""
let stream = null
startBtn.onclick = () => fun()
console.log(navigator.mediaDevices.getSupportedConstraints());
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

  const recorder = new MediaRecorder(stream, {mimeType: supportedVideo})
  console.log(recorder)

  recorder.ondataavailable = (event) => {
    console.log("recorder stopped");
    if (event.data.size > 0) videoChunks.push(event.data)
    const blob = new Blob(videoChunks, { 'type' : supportedVideo });
    const videoURL = window.URL.createObjectURL(blob);
    console.log(blob)
    console.log(preview)
    preview.srcObject = null
    preview.src = videoURL;
    preview.controls = true;
    download.href = videoURL;
    download.download = Date.now() + ".mp4"
  };

  recorder.start();
  stop.addEventListener("click", () => recorder.stop(), {once: true})
}
