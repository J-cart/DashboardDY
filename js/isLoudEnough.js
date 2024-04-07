function isAudioLoudEnough(audioBlob, threshold) {
    const reader = new FileReader();
  
    return new Promise((resolve, reject) => {
      reader.onload = function() {
        const audioData = reader.result;
  
        // Create an audio context
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
        // Decode the audio data
        audioContext.decodeAudioData(audioData, function(buffer) {
          // Get the audio buffer
          const audioBuffer = buffer.getChannelData(0); // Assuming mono audio
  
          // Calculate the average energy of the audio buffer
          const energy = calculateAverageEnergy(audioBuffer);
  console.log(energy)
          // Check if the energy is above the threshold
          resolve(energy > threshold);
        }, function(err) {
          reject('Error decoding audio data: ' + err);
        });
      };
  
      // Read the audio blob as an ArrayBuffer
      reader.readAsArrayBuffer(audioBlob);
    });
  }
  
  function calculateAverageEnergy(buffer) {
    let sum = 0;
  
    // Calculate the sum of squared values
    for (let i = 0; i < buffer.length; i++) {
      sum += buffer[i] * buffer[i];
    }
  
    // Calculate the average energy
    const averageEnergy = sum / buffer.length;
  
    return averageEnergy;
  }
  
  // Example usage:
//   const audioBlob = /* your Blob object */;
//   const threshold = 0.5; // Adjust this value according to your needs
  
//   isAudioLoudEnough(audioBlob, threshold)
//     .then(result => {
//       if (result) {
//         console.log('Audio is loud enough');
//       } else {
//         console.log('Audio is not loud enough');
//       }
//     })
//     .catch(error => {
//       console.error(error);
//     });
  