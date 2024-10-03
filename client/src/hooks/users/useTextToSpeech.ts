
import { useCallback, useState } from "react";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
import userApi from "@/api/userApi";

const useTextToSpeech = () => {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [polly, setPolly] = useState<PollyClient | null>(null);

  const fetchAWSCredentials = useCallback(async () => {
    try {
      const response = await userApi.get("/voice-keys");
      const { accessKeyId, secretAccessKey, region } = response.data;

      const pollyClient = new PollyClient({
        region: region || "ap-south-1",
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });

      setPolly(pollyClient);
      return pollyClient;
    } catch (err) {
      setError("Failed to fetch AWS credentials");
      console.error("Error fetching AWS credentials:", err);
      return null;
    }
  }, []);

  const convertTextToSpeech = useCallback(async (text: string) => {
    setIsLoading(true);
    setError(null);

    try {
      let pollyClient = polly;
      if (!pollyClient) {
        pollyClient = await fetchAWSCredentials();
        if (!pollyClient) {
          throw new Error("Polly client could not be initialized");
        }
      }
      

      const command = new SynthesizeSpeechCommand({
        Text: text,
        OutputFormat: "mp3",
        VoiceId: "Kajal",
        Engine: "neural",
      });
      const data = await pollyClient.send(command);
      console.log(data)

      if (data.AudioStream instanceof ReadableStream) {
        const reader = data.AudioStream.getReader();
        let chunks: Uint8Array[] = [];
        let done = false;
        while (!done) {
          const { value, done: readerDone } = await reader.read();
          if (value) chunks.push(value);
          done = readerDone;
        }
        const audioBlob = new Blob(chunks, { type: "audio/mpeg" });
        setAudioBlob(audioBlob);
      }
    } catch (error) {
      setError("Failed to convert text to speech");
      console.error("Error converting text to speech:", error);
    } finally {
      setIsLoading(false);
    }
  }, [polly, fetchAWSCredentials]);

  return { audioBlob, convertTextToSpeech, isLoading, error };
};

export default useTextToSpeech;