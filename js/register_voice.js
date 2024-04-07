let isMobile = isMobileBrowser();
let key_phrase = "Access Identity Verification Required";
let $ = (id) => document.getElementById(id);
let transcript = "";
let userID = localStorage.getItem("UserID");

//check if users just created an account and hasnt progressed to any other action
if (!userID) {
    alert("you have to create an account to access this page");
    window.open("/", "_self");
}

document.addEventListener("DOMContentLoaded", () => {
    const voiceForm = document.getElementById("form");
    const userIdInput = document.getElementById("userId");
    //  const recordingsList = document.getElementById('recordingsList');
    const startRecordingButton = document.getElementById("startRecording");
    const stopRecordingButton = document.getElementById("stopRecording");
    const submitFormButton = document.getElementById("submitForm");

    let mediaRecorder;
    let mediaStream;
    let chunks = [];

    // Start recording when the button is clicked
    startRecordingButton.addEventListener("click", () => {
        //chunks = [];
        navigator.mediaDevices
            .getUserMedia({
                audio: true,
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
                        type: "audio/wav",
                    });
                    const audioUrl = URL.createObjectURL(blob);
                    console.log(audioUrl);

                    //we clear all tracks avilable after recording has been completed
                    if (mediaStream) {
                        mediaStream.getTracks().forEach((track) => track.stop());
                        mediaStream = null;
                    }

                    //if our medium is not mobile we use the transcript as is
                    if (false) {
                        let result = areSentencesAlmostSame(key_phrase, transcript);
                        if (result) {
                            //console.log(result);
                            startRecordingButton.style.display = "none";
                            $("submit").style.display = "flex";
                            document.getElementById("error").innerHTML = "";
                            return $("submit").click();
                        }

                        document.getElementById("error").innerHTML =
                            "Your provided phrase ('[" +
                            transcript +
                            "]') doesn't match the expected key phrase. Please double-check and try again.";
                        startRecordingButton.style.display = "flex";

                        $("submit").style.display = "none";
                    } else {
                        startRecordingButton.style.display = "none";
                        $("submit").style.display = "flex";
                        $('mobile').value = "true"
                        return $("submit").click();
                    }


                };

                //then we start the recording
                mediaRecorder.start();


                //if our medium is mobile we use annyang instead of webkitSpeechRecognition as it doesnt work on mobile
                //  if (isMobile) {

                //we add a callback to annyang to detgect when a user has made a speech
                // annyang.addCallback("result", function(phrases) {

                //     $("modal").style.display = "none";
                //     var results = phrases[0];
                //     transcript = results;

                //     let result = areSentencesAlmostSame(key_phrase, transcript);

                //     //if the sentenses is closely thesame as the key phrase we proceed
                //     if (result) {
                //         document.getElementById("error").innerHTML = "";
                //         startRecordingButton.style.display = "none";
                //         $("submit").style.display = "flex";
                //         $("submit").click();

                //         //after speech is done we stop annyang from recording
                //         return annyang.abort();
                //     }
                //     //else if the word spoken does not correspiond with the key phrase we show 
                //     //the error to the user andprompt the user to re register his voice
                //     document.getElementById("error").innerHTML =
                //         "Your provided phrase ('[" +
                //         transcript +
                //         "]') doesn't match the expected key phrase. Please double-check and try again.";
                //     startRecordingButton.style.display = "flex";

                //     $("submit").style.display = "none";
                //     annyang.abort();
                // });
                // //then we start annyang instance
                // annyang.start();

                //else if its a desktob browser we use the windows Speech recognition api
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

                //we only want to record for 7 seconds then stop the recording 
                $("modal").style.display = "flex";
                setTimeout(() => {
                    stopRecordingButton.click();
                }, 7000);
            })
            .catch((err) =>
                console.log(err)(
                    (document.getElementById("error").innerHTML =
                        "Please allow microphone access to record")
                )
            );
    });

    // Stop recording when the button is clicked
    stopRecordingButton.addEventListener("click", () => {
        mediaRecorder.stop();
        $("modal").style.display = "none";

    });

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

        // Create FormData object and append the audio blob
        userIdInput.value = localStorage.getItem("UserID"); // get user id from localstorage
        const formData = new FormData(voiceForm);
        formData.append(
            "voice",
            new Blob(chunks, {
                type: "audio/wav",
            }),
            "voice2.wav"
        );

        // console.log(new URLSearchParams(formData).toString());
        // Use fetch API to send form data to the server
        axios
            .post("/register-voice", formData)
            .then((response) => {
                let data = response.data
                if (!data.done) {
                    document.getElementById("progress").innerHTML = `You have registered your voice ${data.count} times, \b ${3-data.count} to go`
                    document.getElementById("error").innerHTML = ''
                    $("submit").style.display = "none";
                    startRecordingButton.style.display = "flex";
                    transcript = ''
                    return
                }
                console.log(data)
                $("submit").innerHTML = `Register Voice`;
                window.open("/login_with_voice.html", "_self");
            })
            .catch((error) => {
                $("submit").style.display = "none";
                startRecordingButton.style.display = "flex";

                document.getElementById("error").innerHTML =
                    error.response.data.message ||
                    "Please try again, an unexpected error occured.";
            });
    });
});
