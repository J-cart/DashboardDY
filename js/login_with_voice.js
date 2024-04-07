// annyang.setPreference('continuous',false)
let isMobile = isMobileBrowser();
let key_phrase = "Whispering winds, dancing leaves, under the Whispering leaves";
let transcript = "";
let $ = (id) => document.getElementById(id);
document.addEventListener("DOMContentLoaded", () => {
    const voiceForm = document.getElementById("form");
    const userIdInput = document.getElementById("userId");
    //  const recordingsList = document.getElementById('recordingsList');
    const startRecordingButton = document.getElementById("startRecording");
    const stopRecordingButton = document.getElementById("stopRecording");
    const submitFormButton = document.getElementById("submitForm");

    let mediaRecorder;
    let chunks = [];
    let mediaStream;

    // Start recording when the button is clicked
    startRecordingButton.addEventListener("click", () => {
        //  chunks = [];
        navigator.mediaDevices
            .getUserMedia({
                audio: true
            })
            .then((stream) => {
                mediaStream = stream;
                mediaRecorder = new MediaRecorder(stream);

                mediaRecorder.ondataavailable = (e) => {
                    if (e.data.size > 0) {
                        chunks.push(e.data);
                    }
                };

                mediaRecorder.onstop = () => {
                    const blob = new Blob(chunks, {
                        type: "audio/wav"
                    });
                    const audioUrl = URL.createObjectURL(blob);
                    // alert(audioUrl);

                    if (mediaStream) {
                        mediaStream.getTracks().forEach((track) => track.stop());
                        mediaStream = null;
                    }
                    if (!isMobile) {
                        let result = transcript.length > 25;
                        console.log(transcript);
                        if (result) {

                            startRecordingButton.style.display = "none";
                            $("submit").style.display = "flex";
                            document.getElementById("error").innerHTML = "";
                            return $("submit").click();
                        }

                        document.getElementById("error").innerHTML = "Voice provided was too short, please try again";
                        startRecordingButton.style.display = "flex";

                        $("submit").style.display = "none";
                    } else {
                        startRecordingButton.style.display = "none";
                        $("submit").style.display = "flex";
                        $('mobile').value = "true"
                        return $("submit").click();
                    }

                };

                mediaRecorder.start();
                // if (isMobile) {
                // annyang.addCallback("result", function(phrases) {
                //     $("modal").style.display = "none";
                //     var results = phrases[0];
                //     transcript = results;
                //     console.log(results);
                //     let result = areSentencesAlmostSame(key_phrase, transcript);
                //     if (result) {
                //         //console.log(result);
                //         document.getElementById("error").innerHTML = "";
                //         startRecordingButton.style.display = "none";
                //         $("submit").style.display = "flex";
                //         annyang.abort();
                //         return $("submit").click();
                //     }

                //     document.getElementById("error").innerHTML =
                //         "Your provided phrase ('[" +
                //         transcript +
                //         "]') doesn't match the expected key phrase. Please double-check and try again.";
                //     startRecordingButton.style.display = "flex";

                //     $("submit").style.display = "none";
                //     annyang.abort();

                // });
                // annyang.start();
                // } else {
                window.SpeechRecognition = window.webkitSpeechRecognition;
                let recognition = new SpeechRecognition();
                recognition.interimResults = true;

                recognition.addEventListener("result", (r) => {
                    transcript = r.results[0][0].transcript;
                    //console.log(r);
                });
                recognition.start();
                // }
                $("modal").style.display = "flex";
                setTimeout(() => {
                    stopRecordingButton.click();

                }, 6000);
            })
            .catch(
                (err) =>
                (document.getElementById("error").innerHTML =
                    "Please allow microphone access to record")
            );
    });

    // Stop recording when the button is clicked
    stopRecordingButton.addEventListener("click", () => {
        mediaRecorder.stop();
        $("modal").style.display = "none";
    });

    // Update the userId in the form before submitting
    voiceForm.addEventListener("submit", (e) => {
        $("submit").innerHTML = `
<div role="status">
<svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
   <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
   <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
</svg>
<span class="sr-only">Loading...</span>
</div>
`;
        e.preventDefault();


        const formData = new FormData(voiceForm);
        formData.append(
            "voice",
            new Blob(chunks, {
                type: "audio/wav"
            }),
            "voice2.wav"
        );


        axios
            .post("/verify-voice", formData)
            .then((response) => {
                $("submit").innerHTML = `Sign in`;
                return response.data;
            })
            .then((data) => {
                if (data.error) {
                    startRecordingButton.style.display = "flex";
                    $("submit").style.display = "none";
                    if (data.message == "voice_not_registered") {
                        localStorage.setItem("UserID", data.userId);
                        let anchor = `Voice not registered yet! click <a class="text-indigo-600" href="/reg_voice.html">here</a> to register`;
                        document.getElementById("error").innerHTML = anchor;
                        return;
                    }
                    document.getElementById("error").innerHTML = data.message;
                    return;
                }
                document.getElementById("error").innerHTML = "";
                localStorage.removeItem("UserID");
                localStorage.setItem("userToken", data.token);
                document.getElementById('logged_user').style.display = 'flex'
                FetchUser().then(response => {
                        //console.log(response)
                        if (response.error) {

                            //alert(response.message)
                            return window.open('/', '_self')
                        }

                        $('full_name').innerText = response.full_name
                    })
                    //window.open("/dashboard.html", "_self");
            })
            .catch((error) => {
                startRecordingButton.style.display = "flex";
                $("submit").style.display = "none";
                $("submit").innerHTML = `Sign in`;
                document.getElementById("error").innerHTML =
                    error.response.data.message;
            });
    });
});