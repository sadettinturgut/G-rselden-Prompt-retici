
import { GoogleGenAI, Type } from "@google/genai";

export interface GeneratedPrompts {
  turkish: string;
  english: string;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64String = result.split(',')[1];
      if (base64String) {
        resolve(base64String);
      } else {
        reject(new Error("Could not convert file to base64."));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

export const generatePromptFromImage = async (imageFile: File): Promise<GeneratedPrompts> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const base64Data = await fileToBase64(imageFile);
  
  const imagePart = {
    inlineData: {
      mimeType: imageFile.type,
      data: base64Data,
    },
  };

  const textPart = {
    text: `Bu resmi son derece ayrıntılı bir şekilde analiz et. Midjourney veya DALL-E 3 gibi bir yapay zeka görüntü oluşturucu için neredeyse aynı bir görüntü oluşturacak iki adet yüksek kaliteli, açıklayıcı prompt üret. Prompt'lardan birini Türkçe, diğerini İngilizce olarak sağla.

    Her iki prompt için de analizi şu bileşenlere ayır:
    - **Konu:** Ana konu nedir? Görünüşünü, kıyafetini, ifadesini ve eylemini tanımla.
    - **Ortam/Arka Plan:** Konu nerede? Çevreyi, günün saatini ve arka plandaki unsurları tanımla.
    - **Kompozisyon ve Işıklandırma:** Çekim nasıl çerçevelenmiş? Işıklandırmayı ayrıntılı olarak tanımla (örneğin, sinematik ışıklandırma, yumuşak ışık, hacimsel ışık).
    - **Kamera Detayları:** Kamera açısını (örneğin, alçak açı, göz hizası çekim), lens türünü (örneğin, 35mm, 85mm) ve çekim türünü (örneğin, yakın çekim, geniş çekim) belirt.
    - **Sanat Tarzı:** Stili tanımla (örneğin, fotogerçekçi, sinematik, fantezi sanatı).
    - **Renk Paleti:** Baskın renkleri ve genel ruh halini tanımla.

    Bu unsurları her dil için tek bir, tutarlı paragrafta birleştir. Zengin bir kelime dağarcığı kullan. **ÇOK ÖNEMLİ: Her iki dildeki prompt'un da mutlaka ışıklandırma, kamera bilgisi (lens, tür) ve kamera açısı hakkında belirli ayrıntılarla bittiğinden emin ol.** Çıktıyı "turkish" ve "english" anahtarlarına sahip bir JSON nesnesi olarak biçimlendir.
    `,
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            turkish: { type: Type.STRING },
            english: { type: Type.STRING },
          },
          required: ["turkish", "english"],
        },
      },
    });

    const jsonResponse = JSON.parse(response.text);
    return jsonResponse;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate prompt from Gemini API.");
  }
};
