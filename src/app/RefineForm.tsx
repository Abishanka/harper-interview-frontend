'use client';

import { useState } from 'react';

export default function RefineForm(
  {selectedCompany, setPdfLoading, pdfReady, setPdfReady}: 
  {selectedCompany: string, setPdfLoading: (pdfLoading: boolean) => void, pdfReady: boolean, setPdfReady: (pdfReady: boolean) => void}) 
  {

  const [pdfLoading_, setPdfLoading_] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const handleRefine = async () => {
    setPdfLoading(true);
    setPdfLoading_(true);
    setPdfReady(false);
    try {
      const response = await fetch(`http://localhost:8000/api/refine-form?company_id=${selectedCompany}&refine_task=${customInput}`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Failed to refine form');
      }
      const data = await response.json();
      console.log(data.message);

      startPolling();
    } catch (error) {
      console.error('Error refining form:', error);
      setPdfLoading(false);
      setPdfLoading_(false);
      setPdfReady(true);
    }
  };

  const startPolling = async () => {
    const deletePdfs = async () => {
        try {
            const response = await fetch('/api/reset-pdf-directory', {
                method: 'POST',
            });
            if (!response.ok) {
                throw new Error('Failed to reset PDF directory');
            }
            console.log('PDF directory reset successfully');
        } catch (error) {
            console.error('Error resetting PDF directory:', error);
        }
    };

    await deletePdfs();
    const interval = setInterval(async () => {
      try {
        const statusResponse = await fetch('/api/check-pdf-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ selectedCompany }),
        });

        const { ready } = await statusResponse.json();

        if (ready) {
          clearInterval(interval);
          clearTimeout(timeout);
          setPdfLoading(false);
          setPdfLoading_(false);
          setPdfReady(true);
        }
      } catch (error) {
        console.error("Error checking refine status:", error);
        clearInterval(interval);
        clearTimeout(timeout);
        }
    }, 5000);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      console.error("Polling timed out after 100 seconds.");
    }, 100000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      setPdfLoading(false);
      setPdfLoading_(false);
      setPdfReady(false);
    };
  };

  // Function to handle audio recording
  const handleAudioRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks: BlobPart[] = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.start();

    const stopRecording = () => {
      return new Promise<Blob>((resolve) => {
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks);
          setAudioBlob(audioBlob);
          resolve(audioBlob);
        };
        mediaRecorder.stop();
      });
    };

    return stopRecording;
  };

  // Function to transcribe audio
  const transcribeAudio = async (audioBlob: Blob) => {
    const arrayBuffer = await audioBlob.arrayBuffer();

    const response = await fetch('http://localhost:8000/api/transcribe-audio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      body: arrayBuffer,
    });

    if (!response.ok) {
      throw new Error('Failed to transcribe audio');
    }

    const { transcription } = await response.json();
    setCustomInput(transcription);
  };

  return (
    <div className="mt-6 mb-6">
      <h1 className="text-2xl font-bold text-[#ff6d63]">Refine Form</h1>
      <div className="flex items-center gap-4">
        <input
          className="flex-grow p-2 border border-[#ff6d63] rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff6d63] text-black"
          placeholder="Additional instructions for refinement (optional)"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
        />
        <button
          className={`px-4 py-2 rounded-md text-white font-medium ${
            pdfLoading_ || !pdfReady
              ? 'bg-[#ff6d63] cursor-not-allowed opacity-50' 
              : 'bg-[#ff6d63] hover:bg-[#e55c53] active:bg-[#d44c43]'
          }`}
          onClick={handleRefine}
          disabled={pdfLoading_ || !pdfReady}
        >
          {pdfLoading_ ? 'Loading...' : 'Refine'}
        </button>
        <button
          className="px-4 py-2 rounded-md text-white font-medium bg-[#ff6d63] hover:bg-[#e55c53] active:bg-[#d44c43]"
          onMouseDown={async () => {
            const stopRecording = await handleAudioRecording();
            // Wait for the user to release the mouse button
            document.addEventListener('mouseup', async () => {
              const audioBlob = await stopRecording();
              await transcribeAudio(audioBlob);
            }, { once: true });
          }}
        >
          🎤
        </button>
      </div>
    </div>
  );
} 