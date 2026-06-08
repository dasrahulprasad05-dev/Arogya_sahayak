import React, { useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, Calendar } from 'lucide-react';

interface Tip {
  title: Record<string, string>;
  desc: Record<string, string>;
}

const healthTips: Tip[] = [
  {
    title: {
      or: 'ହଳଦୀ କ୍ଷୀର (ହଳଦୀ ଦୁଧ)',
      hi: 'हल्दी दूध (Golden Milk)',
      en: 'Turmeric Milk (Haldi Doodh)'
    },
    desc: {
      or: 'ପ୍ରତିଦିନ ରାତିରେ ଶୋଇବା ପୂର୍ବରୁ ହଳଦୀ କ୍ଷୀର ପିଇବା ଦ୍ୱାରା ରୋଗ ପ୍ରତିରୋଧକ ଶକ୍ତି ବୃଦ୍ଧି ହୋଇଥାଏ ଏବଂ ଶରୀରର ଯନ୍ତ୍ରଣା ଉପସମ ହୁଏ।',
      hi: 'प्रतिदिन रात को सोने से पहले हल्दी वाला दूध पीने से रोग प्रतिरोधक क्षमता बढ़ती है और शरीर का दर्द कम होता है।',
      en: 'Drinking turmeric milk before bed boosts immunity, reduces inflammation, and promotes deep recovery.'
    }
  },
  {
    title: {
      or: 'ତୁଳସୀ ଏବଂ ମହୁ ଚା\'',
      hi: 'तुलसी और शहद की चाय',
      en: 'Tulsi & Honey Tea'
    },
    desc: {
      or: 'ଥଣ୍ଡା କିମ୍ବା କାଶ ହେଲେ ତୁଳସୀ ପତ୍ର ଏବଂ ମହୁ ମିଶ୍ରିତ ଗରମ ପାଣି ପିଇବା ଦ୍ୱାରା ତୁରନ୍ତ ଆରାମ ମିଳିଥାଏ।',
      hi: 'सर्दी या खांसी होने पर तुलसी के पत्ते और शहद की चाय पीने से गले की खराश और कफ में तुरंत आराम मिलता है।',
      en: 'Brewing tulsi leaves with honey relieves throat congestion, coughs, and minor respiratory stresses.'
    }
  },
  {
    title: {
      or: 'ଆଁଲା ଏବଂ ଆଲୋଭେରା ରସ',
      hi: 'आंवला और एलोवेरा जूस',
      en: 'Amla & Aloe Vera Juice'
    },
    desc: {
      or: 'ସକାଳେ ଖାଲି ପେଟରେ ଆଁଲା ଏବଂ ଆଲୋଭେରା ରସ ମିଶାଇ ପିଇବା ଦ୍ୱାରା ହଜମ ପ୍ରକ୍ରିୟା ଠିକ୍ ରହେ ଓ ଚର୍ମ ଉଜ୍ଜ୍ୱଳ ହୁଏ।',
      hi: 'सुबह खाली पेट आंवला और एलोवेरा का रस पीने से पाचन क्रिया सुधरती है और त्वचा में चमक आती है।',
      en: 'Consuming amla and aloe vera juice on an empty stomach balances digestion, cleanses toxins, and improves skin vitality.'
    }
  },
  {
    title: {
      or: 'ଅଦା ଏବଂ ଲବଙ୍ଗ ଚିକିତ୍ସା',
      hi: 'अदरक और लौंग का काढ़ा',
      en: 'Ginger & Cloves Decoction'
    },
    desc: {
      or: 'ପେଟ ଯନ୍ତ୍ରଣା ବା ଗ୍ୟାସ ସମସ୍ୟା ଥିଲେ ଅଦା ରସରେ କିଛି ଲବଙ୍ଗ ମିଶାଇ ଖାଇବା ଦ୍ୱାରା ହଜମ ଶକ୍ତି ସନ୍ତୁଳିତ ରହେ।',
      hi: 'अपच या गैस होने पर अदरक के रस में पिसी हुई लौंग मिलाकर चाटने से पेट दर्द में शांति मिलती है।',
      en: 'Ginger juice blended with crushed cloves alleviates bloating, nausea, and minor abdominal cramps.'
    }
  }
];

const TipWidget: React.FC = () => {
  const { language } = useLanguage();

  const activeTip = useMemo(() => {
    // Select tip of the day using date index
    const day = new Date().getDate();
    return healthTips[day % healthTips.length];
  }, []);

  return (
    <div className="bg-gradient-to-br from-teal-500/10 to-emerald-500/10 border border-teal-500/20 rounded-2xl p-6 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-xl -z-10"></div>
      
      <div className="flex items-center justify-between mb-4">
        <span className="flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>Home Remedy of the Day</span>
        </span>
        <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-semibold">
          <Calendar className="w-3 h-3" />
          Today
        </span>
      </div>

      <h3 className="font-heading font-bold text-lg text-foreground mb-2">
        {activeTip.title[language] || activeTip.title['en']}
      </h3>
      
      <p className="text-muted-foreground text-sm leading-relaxed">
        {activeTip.desc[language] || activeTip.desc['en']}
      </p>

      <div className="mt-4 pt-4 border-t border-teal-500/10 flex items-center justify-between text-[10px] text-teal-800 dark:text-teal-400 font-semibold">
        <span>Source: Ayush Ministry protocols</span>
        <span>Screening use only</span>
      </div>
    </div>
  );
};

export default TipWidget;
