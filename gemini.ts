
import { GoogleGenAI, Type, Modality } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generatePortrait = async (char: any) => {
  const ai = getAI();
  try {
    const prompt = `A professional cinematic 8k character portrait of ${char.name}. 
    Biometrics: ${char.gender}, ${char.ethnicity} ethnicity, ${char.skinTone} skin. 
    Body: ${char.bodyType} physique, ${char.breastSize} bust profile, ${char.buttSize} lower profile. 
    Hair: ${char.hairStyle} (${char.hairColor}). Eyes: ${char.eyeColor}. 
    Clothing: ${char.upperDressColor} ${char.upperDressType}. 
    Setting: Character is ${char.pose} in a ${char.background} environment. 
    Highly detailed, photorealistic, cinematic lighting, masterpiece.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: "1:1" } },
    });
    
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return null;
  } catch { return null; }
};

export const generateSpeech = async (text: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Dossier overview: ${text.substring(0, 200)}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } }
      }
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch { return null; }
};

export function decodeBase64(base64: string) {
  const binaryString = atob(base64.split(',')[1] || base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

export async function decodeAudioData(data: Uint8Array, ctx: AudioContext) {
  const dataInt16 = new Int16Array(data.buffer);
  const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
  return buffer;
}
