import { ExamAnxietyCategory, ExamAnxietyAnswer, ExamAnxietyResult } from '../types';
import { examAnxietyCategories } from '../constants/examAnxietyData';

/**
 * Sınav Kaygısı Ölçeği Cevap Anahtarı
 * Doğru cevaplar için 1 puan, yanlış cevaplar için 0 puan verilir.
 */
const ANSWER_KEY: { [key: number]: boolean } = {
  // I. Başkalarının görüşü ile ilgili endişeler
  3: true, 14: true, 17: true, 25: true, 32: true, 37: false, 41: true, 46: true,
  
  // II. Kendinizi nasıl gördüğünüzle ilgili endişeler  
  2: false, 9: true, 16: false, 24: false, 31: true, 38: true, 40: true,
  
  // III. Gelecekle ilgili endişeler
  1: true, 8: true, 15: true, 23: false, 30: true, 49: true,
  
  // IV. Yeterince hazırlanamamakla ilgili endişeler
  6: true, 11: true, 18: true, 26: true, 33: true, 42: true,
  
  // V. Bedensel tepkiler
  5: true, 12: true, 19: true, 27: true, 34: true, 39: true, 43: true,
  
  // VI. Zihinsel tepkiler
  4: true, 13: true, 20: true, 21: true, 28: true, 35: true, 36: true, 48: true, 50: true,
  
  // VII. Genel sınav kaygısı
  7: false, 10: false, 22: true, 29: true, 44: true, 47: true
};

/**
 * Cevaplara göre sınav kaygısı ölçeği sonuçlarını hesaplar.
 * @param answers Öğrencinin verdiği cevaplar
 * @returns Kategori bazında puan ve yorumlar
 */
export function evaluateExamAnxiety(answers: ExamAnxietyAnswer[]): ExamAnxietyResult[] {
  return examAnxietyCategories.map((category: ExamAnxietyCategory) => {
    // Bu kategorideki sorular için puanı hesapla
    let score = 0;
    category.questions.forEach(questionId => {
      const answer = answers.find(a => a.questionId === questionId);
      if (answer && ANSWER_KEY[questionId] === answer.answer) {
        score += 1;
      }
    });

    // Puan aralığına göre yorumu belirle
    const highRange = category.interpretations.high.range.split('-');
    const lowRange = category.interpretations.low.range.split('-');
    
    const highMin = parseInt(highRange[1], 10); // Minimum değer
    const highMax = parseInt(highRange[0], 10); // Maksimum değer
    const lowMin = parseInt(lowRange[1], 10);   // Minimum değer
    const lowMax = parseInt(lowRange[0], 10);   // Maksimum değer

    let interpretation = '';
    
    // Yüksek kaygı aralığında mı?
    if (score >= highMin && score <= highMax) {
      interpretation = category.interpretations.high.text;
    }
    // Düşük kaygı aralığında mı?
    else if (score >= lowMin && score <= lowMax) {
      interpretation = category.interpretations.low.text;
    }
    // Aralık dışında ise en yakın yorumu seç
    else {
      interpretation = score > highMax ? category.interpretations.high.text : category.interpretations.low.text;
    }

    return {
      categoryId: category.id,
      score,
      interpretation,
    };
  });
}
