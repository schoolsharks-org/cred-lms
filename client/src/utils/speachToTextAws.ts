import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
// import { fromEnv } from "@aws-sdk/credential-provider-env";

const polly = new PollyClient({
  region: "us-east-2",
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});



export const convertTextToSpeech = async (text: string): Promise<Blob | null> => {
    try {
      const command = new SynthesizeSpeechCommand({
        Text: text,
        OutputFormat: "mp3",
        VoiceId: "Aditi",
      });
  
      const data = await polly.send(command);
  
      if (data.AudioStream instanceof ReadableStream) {
        const reader = data.AudioStream.getReader();
        let chunks = [];
        let done = false;
        while (!done) {
          const { value, done: readerDone } = await reader.read();
          if (value) {
            chunks.push(value);
          }
          done = readerDone;
        }
        const audioBlob = new Blob(chunks, { type: "audio/mpeg" });
        return audioBlob;
      }
      return null;
    } catch (error) {
      console.error("Error converting text to speech:", error);
      return null;
    }
  };
  