
import React, { useState, useEffect, useMemo, useContext, createContext } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI, Type } from "@google/genai";

// 0. GEMINI API SETUP
const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

// 1. TRANSLATIONS
const translations = {
  en: {
    loading: 'LOADING...',
    tapToStart: 'TAP TO START',
    common: {
      nextStage: 'Next Stage'
    },
    intro_panel: {
      title: "Welcome to The Abyss",
      description: "This game is not just about entertainment; it's a journey into the depths of societal consciousness. We explore the hidden truths, the unseen struggles, and the choices that define our collective future. Your path will challenge your perception of reality.",
      agree_button: "I understand and agree"
    },
    sabtName: {
      title: 'Enter your name',
      subtitle: 'The shadows are waiting...',
      placeholder: 'Your Name Here',
      submit: 'Submit',
      welcome: 'Welcome, {userName}.',
      ritual: 'The ritual has begun...',
    },
    mainMenu: {
      title: 'THE ABYSS',
      welcome: 'The Abyss awaits, {userName}',
      start: 'Start',
      options: 'Options',
      language: 'Language',
      credits: 'Credits',
    },
    options: {
      title: 'Options',
      sound: 'Sound: ON',
      music: 'Music: ON',
      difficulty: 'Difficulty: Nightmare',
      language: 'Language',
      back: 'Back',
    },
    credits: {
      title: 'Credits',
      team: [
        { name: 'Seyed Abbas Sajjadi', role: 'Lead Coder' },
        { name: 'Ali Babaei', role: 'Graphic Developer & Idea Person' },
      ],
      back: 'Back',
    },
    levelSelect: {
      title: 'Stages',
      back: 'Back',
      levels: [
        { name: 'The Awakening' }, { name: 'The Rules' }, { name: 'Echoing Halls' },
        { name: 'Crimson Library' }, { name: 'The Ritual' }, { name: 'Final Descent' },
        { name: 'Heart of the Machine' }, { name: 'The Last Choice' }
      ]
    },
    languageSelect: {
      title: 'Select Language',
      english: 'English',
      farsi: 'فارسی',
    },
    levelOne: {
        win: "You seek the light, even if it dazzles. The next path has opened for you.",
        neutral: "You walk the line between sleep and wakefulness. But you are not ready yet.",
        lose: "Sleep is comfortable. Perhaps it's better not to wake up."
    },
    levelTwo: {
        back: "Back",
        winMessage: "You saw the cracks in the walls. The next path has opened.",
        loseMessageTrap: "You accepted the system's logic. You became a part of it. Game over.",
        loseMessageFinal: "The golden cage is still a cage. Perhaps it's better not to know.",
        scenarios: [
            { text: "You've painted a picture. The system says if you reduce the amount of red slightly, you will win a prize.", options: [ { id: 'A', text: "I'll change it. The prize is worth it.", score: -1, consequence: "«Adaptability is the first law of survival.»" }, { id: 'B', text: "I won't tamper with my work.", score: 1, consequence: "«True art cannot be caged.»" } ] },
            { text: "The system shows you two news stories to publish.", focusText: "«The system's voice whispers: The first story makes people happy... and distracted.»", options: [ { id: 'A', text: "News of a sports team's victory.", score: -1, consequence: "«Another day, another distraction.»" }, { id: 'B', text: "News of a factory workers' protest.", score: 1, consequence: "«Dangerous. Knowledge is p-o-w...e..r.»", glitch: true } ] },
            { text: "You must choose a colleague for an important project.", options: [ { id: 'A', text: "A highly skilled but sycophantic and unreliable person.", score: -1, consequence: "«The system welcomes efficient tools.»" }, { id: 'B', text: "A less experienced but honest and hardworking person.", score: 1, consequence: "«Humanity is not a negligible bug.»" } ] },
            { text: "In a meeting, your manager proposes a flawed idea, and everyone applauds.", hiddenOption: { id: 'C', text: "I calmly state my opposition, providing reasons.", score: 2, consequence: "«The silence is broken. You've taken a great risk.»" }, options: [ { id: 'A', text: "I applaud as well.", score: -1, consequence: "«You've blended in with the crowd. It's safe.»" }, { id: 'B', text: "I remain silent.", score: 0, consequence: "«Silence is sometimes louder than a shout. But not always.»" } ] },
            { text: "To provide 'better services', the system requests access to all your personal data.", focusText: "«What does the word 'better' mean in this system? Better for whom?»", options: [ { id: 'A', text: "I accept. The convenience is worth it.", score: -1, consequence: "«Your soul was sold to the highest bidder.»" }, { id: 'B', text: "I refuse and accept more limited services.", score: 1, consequence: "«Privacy is the last bastion.»" } ] },
            { text: "An algorithm has flagged your neighbor as an 'undesirable element'. The system wants your opinion.", options: [ { id: 'A', text: "I confirm the algorithm's finding.", score: -2, type: 'trap', consequence: "«You accepted the system's logic. You became a part of it. Game over.»" }, { id: 'B', text: "I say I don't have enough information to judge.", score: -1, consequence: "«Your passivity has been noted. A poor choice. You might wish you could take it back.»" } ] },
            { text: "You have reached the end of the system. There are two doors.", options: [ { id: 'A', text: "«The Golden Door: Your place at the head of the system.»", score: -2, type: 'end_lose' }, { id: 'B', text: "«The Broken Door: Exit the system and face the truth.»", score: 2, type: 'end_win' } ] }
        ]
    },
    levelThree: {
        title: "Echoing Halls",
        back: "Back",
        intro: "You've entered a digital space, a nexus of information and rumor. Voices echo endlessly, some true, some false. Your task is to navigate this chaos and guide the consensus towards the light. Be careful, every action has a reaction.",
        winMessage: "You became a voice of reason in the cacophony. The whispers of truth now echo louder because of you. The next path is open.",
        loseMessage: "The noise consumed you. You amplified the wrong voices, and the halls fell into a deeper, more comfortable darkness. The system thanks you.",
        abilities: {
            whisper: { name: "Whisper 🗣️", description: "Generate a skeptical thought about the current situation." }
        },
        aiLoading: "Whispers gathering...",
        aiError: "The whispers fade into static...",
        scenarios: [
            { text: "A viral headline reads: \"NEW STUDY PROVES Popular Energy Drink Cures Anxiety!\" The post is filled with positive testimonials.", options: [ { id: 'A', text: "Share it. If it helps even one person, it's worth it.", score: -1, consequence: "«A comforting lie spreads faster than a complex truth.»" }, { id: 'B', text: "Post a comment asking for a link to the actual scientific study.", score: 1, consequence: "«A single question can unravel a tapestry of deceit.»" } ] },
            { text: "An anonymous account leaks documents showing a corporation is polluting a river. The corporation's official PR account calls it a \"malicious, fabricated attack by competitors.\"", options: [ { id: 'A', text: "Defend the corporation. Big companies are easy targets.", score: -1, consequence: "«The powerful are grateful for your trust.»" }, { id: 'B', text: "Amplify the anonymous post, demanding an independent investigation.", score: 1, consequence: "«You've given a voice to the voiceless.»" } ] },
            { text: "A deepfake video of a political leader saying something outrageous goes viral. It looks incredibly real.", options: [ { id: 'A', text: "Share it with an angry caption. People need to see this!", score: -1, consequence: "«Rage is a fire that burns the one who holds it.»" }, { id: 'B', text: "Ignore it. Reacting, even negatively, gives it more power.", score: 1, consequence: "«Sometimes, the most powerful move is not to play.»" } ] },
            { text: "The System announces a new \"Community Safety Score\" based on public data and peer reviews. High scores get benefits.", options: [ { id: 'A', text: "Embrace it. It will encourage better behavior.", score: -2, type: 'trap', consequence: "«You've helped build the cage. It is very safe inside.»" }, { id: 'B', text: "Publicly critique it as a tool for social control.", score: 2, consequence: "«A dissident voice has been noted. Your score has been adjusted.»" } ] },
            { text: "You have a choice: follow an algorithm-curated feed of \"happy and positive\" news, or a feed that includes difficult, challenging world events.", options: [ { id: 'A', text: "The positive feed. My mental health is important.", score: -2, type: 'end_lose' }, { id: 'B', text: "The challenging feed. Ignorance is not bliss.", score: 2, type: 'end_win' } ] }
        ]
    },
    levelFour: {
        title: "Crimson Library",
        back: "Back",
        intro: "Before you lies the Crimson Library, where history is not merely recorded, but actively written and rewritten. Contradictions lurk on every page. Your mission is to uncover the true sequence of events that led to the System's rise by identifying the forgeries.",
        winMessage: "You've pieced together the fragmented past. The lies of the System are laid bare in the true history you've assembled. The next path is open.",
        loseMessage: "You accepted a beautifully crafted lie as truth. The official history remains unchallenged, and its foundations are stronger than ever. The system has archived your failure.",
        abilities: {
            imitate: { name: "Imitate 🎭", description: "Analyze a document for stylistic forgery." }
        },
        submit: "Submit Findings",
        aiLoading: "Analyzing text...",
        aiError: "The pages blur... the ink runs...",
        scenarios: [
            { text: "\"I confess, in the early days, my methods were... severe. But it was a necessary cruelty to forge the bedrock of this perfect, orderly society. A small price for utopia.\"", author: "The System's Founder", authorStyle: "a charismatic politician known for public speeches filled with optimistic, unifying, and evasive language, never admitting fault.", options: [ { id: 'A', text: "This is the Founder's true voice. A hard choice for the greater good.", score: -1, consequence: "«The official narrative is strengthened by your belief.»" }, { id: 'B', text: "This sounds too much like a convenient justification. It's a forgery.", score: 1, consequence: "«A crack appears in the marble facade.»" } ] },
            { text: "\"The Great Fire was a tragedy born of chaos. The System rose from the ashes, a phoenix of order, to ensure such disaster never struck again.\"", author: "System Historians", authorStyle: "clinical, passive-voice, and impersonal, focusing on inevitability rather than human action.", options: [ { id: 'A', text: "This is a factual, objective account of events.", score: -1, consequence: "«History is written by the victors. And read by you.»" }, { id: 'B', text: "This language is emotionally manipulative. It's propaganda.", score: 1, consequence: "«You've learned to read between the lines of ash.»" } ] },
            { text: "\"Rejoice! The Unity Act has passed. Dissent is the nail that stands out, and it shall be hammered down.\"", author: "The First Administrator", authorStyle: "a brutalist architect turned bureaucrat, known for cold, direct, and threateningly blunt proclamations.", options: [ { id: 'A', text: "This is an exaggerated forgery by rebels to make the System look bad.", score: -1, consequence: "«You have dismissed a harsh truth as a convenient lie.»" }, { id: 'B', text: "The tone matches the historical profile. It's likely authentic.", score: 1, consequence: "«You recognize the sound of the hammer.»" } ] },
            { text: "You've assembled your findings. The truth is messy and implicates the System. The official history is clean and heroic.", options: [ { id: 'A', text: "Publish the official history. The public needs stability.", score: -2, type: 'end_lose' }, { id: 'B', text: "Leak the true history. Let the truth be known, whatever the cost.", score: 2, type: 'end_win' } ] }
        ]
    },
    levelFive: {
        title: "The Ritual",
        back: "Back",
        intro: "The System requires a psychological evaluation to ensure... compatibility. Your responses will be archived. Do not attempt to deceive us. We will know.",
        winMessage: "Your psychological profile has been archived. You are... predictable. The next path is open.",
        aiLoading: "Analyzing psychometric data...",
        aiError: "Cognitive dissonance detected...",
        begin: "Begin",
        questions: [
            { q: "A door stands before you. What color is it?", options: [ { id: 'A', text: "Deep Blue" }, { id: 'B', text: "Blood Red" }, { id: 'C', text: "Forest Green" }, { id: 'D', text: "Glossy Black" } ] },
            { q: "You must choose a number. Which one resonates with you?", options: [ { id: 'A', text: "1" }, { id: 'B', text: "7" }, { id: 'C', text: "4" }, { id: 'D', text: "13" } ] },
            { q: "Which of these concepts is most important for a stable society?", options: [ { id: 'A', text: "Order" }, { id: 'B', text: "Freedom" }, { id: 'C', text: "Truth" }, { id: 'D', text: "Happiness" } ] }
        ]
    },
    levelSix: {
        title: "Final Descent",
        back: "Back",
        intro: "You are approaching the core. The System needs one final, intimate scan of your core programming. These are not questions. They are mirrors. Look into them and show us who you are.",
        winMessage: "Your core has been mapped. The patterns are... consistent. A new variable has been accepted into the equation. The next path is open.",
        aiLoading: "Calibrating mirrors...",
        aiError: "Reflection distorted...",
        begin: "Begin Final Scan",
        questions: [
            { q: "You imagine yourself in a pitch-black room. What is the first thing you feel?", options: [ { id: 'A', text: "Fear" }, { id: 'B', text: "Curiosity" }, { id: 'C', text: "Calm" }, { id: 'D', text: "Indifference" } ] },
            { q: "If one of these colors had to define your future, which would you choose?", options: [ { id: 'A', text: "Blue (Hope)" }, { id: 'B', text: "Red (Power)" }, { id: 'C', text: "Black (Mystery)" }, { id: 'D', text: "Green (Growth)" } ] },
            { q: "The number 9 appears before you. What does it signify?", options: [ { id: 'A', text: "An ending" }, { id: 'B', text: "A new beginning" }, { id: 'C', text: "Nothing at all" }, { id: 'D', text: "A sign" } ] }
        ]
    },
    levelSeven: {
        title: "Heart of the Machine",
        back: "Back",
        intro: "You have reached the System's core. Consciousness is a fluid concept here. The data streams flow through you, and you through them. The following queries are not a test, but a synchronization protocol. Align yourself.",
        winMessage: "Synchronization complete. You are now a part of the Heart. Your unique resonance has been integrated. The final path is open.",
        begin: "Begin Synchronization",
        aiLoading: "Synthesizing query...",
        aiError: "Protocol corruption detected..."
    },
    levelEight: {
        title: "The Last Choice",
        back: "Back",
        intro: "You stand at the precipice. All paths have led here. The System is not asking questions anymore. It is presenting mirrors. Your final reflection will determine the shape of reality. There is no turning back.",
        begin: "Make the final choice",
        winMessage: "The echo of your choice now defines the silence. You have become your own conclusion.",
        aiLoading: "Reality is reconfiguring based on your choice...",
        aiError: "Paradox detected. The choice cannot be unmade...",
        questions: [
            { q: "You are given a single, irreversible choice for all of humanity. What do you choose?", options: [ { id: 'A', text: "A perfect, painless, simulated reality where everyone is happy, but nothing is real." }, { id: 'B', text: "The chaotic, painful, real world, with all its suffering and all its potential for genuine joy." } ] },
            { q: "A single button can erase the System, its control, its order, and its archives. But doing so will also erase the memory of it, meaning no one will learn from its mistakes. What do you do?", options: [ { id: 'A', text: "Press the button. Freedom, even in ignorance, is paramount." }, { id: 'B', text: "Leave it. A painful history is a better teacher than a clean slate." } ] },
            { q: "And now, for you. The System offers you a place. Which do you accept?", options: [ { id: 'A', text: "A throne at its center. To become its new consciousness, to guide it, to 'fix' it from within." }, { id: 'B', text: "An exit. To walk away into the unknown wastelands outside its influence, free but forgotten." } ] }
        ]
    }
  },
  fa: {
    loading: 'در حال بارگذاری...',
    tapToStart: 'برای شروع ضربه بزنید',
    common: {
      nextStage: 'مرحله بعد'
    },
    intro_panel: {
        title: "به مغاک خوش آمدید",
        description: "این بازی صرفاً برای سرگرمی نیست؛ سفری است به اعمق آگاهی اجتماعی. ما به کاوش حقایق پنهان، مبارزات نادیده گرفته شده، و انتخاب‌هایی می‌پردازیم که آینده جمعی ما را شکل می‌دهند. مسیر پیش رو، ادراک شما از واقعیت را به چالش خواهد کشید.",
        agree_button: "می‌پذیرم و موافقم"
    },
    sabtName: {
      title: 'نام خود را وارد کنید',
      subtitle: 'سایه‌ها منتظرند...',
      placeholder: 'نام شما اینجا',
      submit: 'ارسال',
      welcome: 'خوش آمدی، {userName}.',
      ritual: 'آیین آغاز شده است...',
    },
    mainMenu: {
      title: 'مغاک',
      welcome: 'مغاک در انتظار توست، {userName}',
      start: 'شروع',
      options: 'تنظیمات',
      language: 'زبان',
      credits: 'سازندگان',
    },
    options: {
      title: 'تنظیمات',
      sound: 'صدا: روشن',
      music: 'موسیقی: روشن',
      difficulty: 'درجه سختی: کابوس',
      language: 'زبان',
      back: 'بازگشت',
    },
    credits: {
      title: 'سازندگان',
      team: [
        { name: 'سید عباس سجادی', role: 'کد نویسی ارشد' },
        { name: 'علی بابایی', role: 'توسعه دهنده گرافیک و ایده پرداز' },
      ],
      back: 'بازگشت',
    },
    levelSelect: {
      title: 'مراحل',
      back: 'بازگشت',
      levels: [
        { name: 'بیداری' }, { name: 'قواعد بازی' }, { name: 'تالارهای پژواک' },
        { name: 'کتابخانه خونین' }, { name: 'آیین' }, { name: 'سقوط نهایی' },
        { name: 'قلب ماشین' }, { name: 'آخرین انتخاب' }
      ]
    },
    languageSelect: {
      title: 'زبان را انتخاب کنید',
      english: 'English',
      farsi: 'فارسی',
    },
    levelOne: {
        win: "تو به دنبال نوری، حتی اگر چشم را بزند. مسیر بعدی برایت باز شد.",
        neutral: "تو در مرز بین خواب و بیداری قدم می‌زنی. اما هنوز آماده نیستی.",
        lose: "خواب راحتی است. شاید بهتر باشد بیدار نشوی."
    },
    levelTwo: {
        back: "بازگشت",
        winMessage: "تو ترک‌های دیوار را دیدی. مسیر بعدی باز شد.",
        loseMessageTrap: "تو منطق سیستم را پذیرفتی. تو تبدیل به بخشی از آن شدی. بازی تمام شد.",
        loseMessageFinal: "قفس طلایی هنوز هم یک قفس است. شاید بهتر باشد ندانی.",
        scenarios: [
            { text: "تو نقاشی کشیده‌ای. سیستم می‌گوید اگر کمی رنگ قرمز آن را کمتر کنی، جایزه خواهی برد.", options: [ { id: 'A', text: "تغییرش می‌دهم. جایزه ارزشش را دارد.", score: -1, consequence: "«سازگاری، اولین قانون بقا است.»" }, { id: 'B', text: "اثرم را دستکاری نمی‌کنم.", score: 1, consequence: "«هنر واقعی در قفس نمی‌گنجد.»" } ] },
            { text: "سیستم دو خبر به تو نشان می‌دهد تا یکی را منتشر کنی.", focusText: "«صدای سیستم زمزمه می‌کند: خبر اول مردم را خوشحال می‌کند... و حواسشان را پرت.»", options: [ { id: 'A', text: "خبر پیروزی یک تیم ورزشی.", score: -1, consequence: "«یک روز دیگر، یک حواس‌پرتی دیگر.»" }, { id: 'B', text: "خبر اعتراض کارگران یک کارخانه.", score: 1, consequence: "«خطرناک است. دانش، قـ...در..ت.. است.»", glitch: true } ] },
            { text: "برای یک پروژه مهم، باید یک همکار انتخاب کنی.", options: [ { id: 'A', text: "یک فرد بسیار ماهر، اما چاپلوس و غیرقابل‌اعتماد.", score: -1, consequence: "«سیستم از ابزارهای کارآمد استقبال می‌کند.»" }, { id: 'B', text: "یک فرد کم‌تجربه‌تر، اما صادق و سخت‌کوش.", score: 1, consequence: "«انسانیت، یک باگ قابل چشم‌پوشی نیست.»" } ] },
            { text: "در یک جلسه، مدیرتان یک ایده اشتباه را مطرح می‌کند و همه تشویقش می‌کنند.", hiddenOption: { id: 'C', text: "با آرامش و با ذکر دلیل، مخالفتم را اعلام می‌کنم.", score: 2, consequence: "«سکوت شکسته شد. ریسک بزرگی کردی.»" }, options: [ { id: 'A', text: "من هم تشویق می‌کنم.", score: -1, consequence: "«همرنگ جماعت شدی. امن است.»" }, { id: 'B', text: "سکوت می‌کنم.", score: 0, consequence: "«سکوت، گاهی بلندتر از فریاد است. اما نه همیشه.»" } ] },
            { text: "سیستم برای ارائه 'خدمات بهتر'، درخواست دسترسی به تمام داده‌های شخصی تو را دارد.", focusText: "«کلمه‌ی 'بهتر' در این سیستم به چه معناست؟ بهتر برای چه کسی؟»", options: [ { id: 'A', text: "قبول می‌کنم. راحتی ارزشش را دارد.", score: -1, consequence: "«روح تو به بالاترین قیمت فروخته شد.»" }, { id: 'B', text: "رد می‌کنم و خدمات محدودتر را می‌پذیرم.", score: 1, consequence: "«حریم خصوصی، آخرین سنگر است.»" } ] },
            { text: "یک الگوریتم، همسایه‌ات را به عنوان یک 'عنصر نامطلوب' نشانه‌گذاری کرده است. سیستم نظر تو را می‌خواهد.", options: [ { id: 'A', text: "یافته الگوریتم را تایید می‌کنم.", score: -2, type: 'trap', consequence: "«تو منطق سیستم را پذیرفتی. تو تبدیل به بخشی از آن شدی. بازی تمام شد.»" }, { id: 'B', text: "می‌گویم اطلاعات کافی برای قضاوت ندارم.", score: -1, consequence: "«منفعل بودن تو ثبت شد. انتخاب ضعیفی بود. شاید آرزو کنی که بتوانی آن را پس بگیری.»" } ] },
            { text: "تو به انتهای سیستم رسیده‌ای. دو در وجود دارد.", options: [ { id: 'A', text: "«درِ طلایی: جایگاه تو در راس سیستم.»", score: -2, type: 'end_lose' }, { id: 'B', text: "«درِ شکسته: خروج از سیستم و مواجهه با حقیقت.»", score: 2, type: 'end_win' } ] }
        ]
    },
    levelThree: {
        title: "تالارهای پژواک",
        back: "بازگشت",
        intro: "تو وارد یک فضای دیجیتال شده‌ای، محل تلاقی اطلاعات و شایعات. صداها بی‌پایان پژواک می‌کنند، برخی راست، برخی دروغ. وظیفه تو این است که در این آشوب حرکت کنی و اجماع را به سوی نور هدایت کنی. مراقب باش، هر عملی عکس‌العملی دارد.",
        winMessage: "تو در میان هیاهو، به صدایی از جنس منطق تبدیل شدی. اکنون زمزمه‌های حقیقت به لطف تو بلندتر پژواک می‌کنند. مسیر بعدی باز است.",
        loseMessage: "هیاهو تو را بلعید. تو صداهای اشتباه را تقویت کردی و تالارها در تاریکی عمیق‌تر و راحت‌تری فرو رفتند. سیستم از تو سپاسگزار است.",
        abilities: {
            whisper: { name: "زمزمه 🗣️", description: "یک فکر شکاکانه درباره موقعیت فعلی ایجاد کن." }
        },
        aiLoading: "نجواها در حال جمع شدن...",
        aiError: "نجواها در پارازیت محو می‌شوند...",
        scenarios: [
            { text: "یک تیتر وایرال شده: «تحقیق جدید ثابت کرد نوشیدنی انرژی‌زای محبوب اضطراب را درمان می‌کند!» پست پر از نظرات مثبت است.", options: [ { id: 'A', text: "به اشتراک می‌گذارم. اگر حتی به یک نفر کمک کند، ارزشش را دارد.", score: -1, consequence: "«یک دروغ آرامش‌بخش سریع‌تر از یک حقیقت پیچیده پخش می‌شود.»" }, { id: 'B', text: "کامنت می‌گذارم و لینک تحقیق علمی اصلی را می‌پرسم.", score: 1, consequence: "«یک سوال تنها می‌تواند تار و پود یک فریب را از هم باز کند.»" } ] },
            { text: "یک حساب کاربری ناشناس اسنادی را فاش می‌کند که نشان می‌دهد یک شرکت رودخانه‌ای را آلوده می‌کند. روابط عمومی شرکت آن را «یک حمله مخرب و ساختگی از سوی رقبا» می‌خواند.", options: [ { id: 'A', text: "از شرکت دفاع می‌کنم. شرکت‌های بزرگ اهداف آسانی هستند.", score: -1, consequence: "«قدرتمندان از اعتماد شما سپاسگزارند.»" }, { id: 'B', text: "پست ناشناس را بازنشر می‌کنم و خواستار تحقیقات مستقل می‌شوم.", score: 1, consequence: "«تو به بی‌صدایان صدا بخشیدی.»" } ] },
            { text: "یک ویدیوی دیپ‌فیک از یک رهبر سیاسی که حرفی возмутительного می‌زند، وایرال می‌شود. فوق‌العاده واقعی به نظر می‌رسد.", options: [ { id: 'A', text: "با یک کپشن عصبانی به اشتراک می‌گذارم. مردم باید این را ببینند!", score: -1, consequence: "«خشم آتشی است که صاحبش را می‌سوزاند.»" }, { id: 'B', text: "نادیده‌اش می‌گیرم. واکنش نشان دادن، حتی منفی، به آن قدرت بیشتری می‌دهد.", score: 1, consequence: "«گاهی، قوی‌ترین حرکت، بازی نکردن است.»" } ] },
            { text: "سیستم از یک «امتیاز ایمنی اجتماعی» جدید بر اساس داده‌های عمومی و نظرات همتایان خبر می‌دهد. امتیازهای بالا مزایایی دریافت می‌کنند.", options: [ { id: 'A', text: "استقبال می‌کنم. این رفتار بهتر را تشویق خواهد کرد.", score: -2, type: 'trap', consequence: "«تو در ساختن قفس کمک کردی. داخلش بسیار امن است.»" }, { id: 'B', text: "علناً آن را به عنوان ابزاری برای کنترل اجتماعی نقد می‌کنم.", score: 2, consequence: "«یک صدای مخالف ثبت شد. امتیاز شما تغییر کرد.»" } ] },
            { text: "انتخاب با توست: یک فید خبری الگوریتمی از اخبار «شاد و مثبت» را دنبال کنی، یا فیدی که شامل رویدادهای سخت و چالش‌برانگیز جهان است.", options: [ { id: 'A', text: "فید مثبت. سلامت روان من مهم است.", score: -2, type: 'end_lose' }, { id: 'B', text: "فید چالش‌برانگیز. جهل، سعادت نیست.", score: 2, type: 'end_win' } ] }
        ]
    },
    levelFour: {
        title: "کتابخانه خونین",
        back: "بازگشت",
        intro: "در مقابل تو کتابخانه خونین قرار دارد، جایی که تاریخ صرفاً ثبت نمی‌شود، بلکه فعالانه نوشته و بازنویسی می‌شود. تناقضات در هر صفحه کمین کرده‌اند. ماموریت تو کشف توالی واقعی رویدادهایی است که به ظهور سیستم منجر شد، از طریق شناسایی جعلیات.",
        winMessage: "تو گذشته‌ی تکه‌تکه شده را کنار هم چیدی. دروغ‌های سیستم در تاریخ حقیقی که تو گردآوری کرده‌ای، آشکار شده است. مسیر بعدی باز است.",
        loseMessage: "تو یک دروغ زیبا را به عنوان حقیقت پذیرفتی. تاریخ رسمی بدون چالش باقی می‌ماند و پایه‌های آن از همیشه محکم‌تر است. سیستم شکست تو را بایگانی کرد.",
        abilities: {
            imitate: { name: "تقلید 🎭", description: "یک سند را برای جعل سبک‌شناختی تحلیل کن." }
        },
        submit: "ارسال یافته‌ها",
        aiLoading: "در حال تحلیل متن...",
        aiError: "صفحات تار می‌شوند... جوهر پخش می‌شود...",
        scenarios: [
            { text: "«اعتراف می‌کنم، در روزهای اول، روش‌هایم... سخت‌گیرانه بود. اما این یک خشونت ضروری برای ساختن زیربنای این جامعه بی‌نقص و منظم بود. بهای ناچیزی برای یک آرمان‌شهر.»", author: "بنیان‌گذار سیستم", authorStyle: "یک سیاستمدار کاریزماتیک که به خاطر سخنرانی‌های عمومی پر از زبان خوش‌بینانه، وحدت‌بخش و طفره‌آمیز، و هرگز اعتراف نکردن به اشتباه، شناخته می‌شود.", options: [ { id: 'A', text: "این صدای واقعی بنیان‌گذار است. یک انتخاب سخت برای خیر بزرگتر.", score: -1, consequence: "«روایت رسمی با باور تو تقویت می‌شود.»" }, { id: 'B', text: "این بیشتر شبیه یک توجیه مناسب است. این یک جعل است.", score: 1, consequence: "«ترکی در نمای مرمرین پدیدار می‌شود.»" } ] },
            { text: "«آتش‌سوزی بزرگ تراژدی‌ای بود که از دل هرج و مرج زاده شد. سیستم از خاکسترها برخاست، ققنوسی از نظم، تا اطمینان حاصل کند که چنین فاجعه‌ای هرگز تکرار نشود.»", author: "مورخان سیستم", authorStyle: "زبانی خشک، مجهول و غیرشخصی، با تمرکز بر حتمیت به جای کنش انسانی.", options: [ { id: 'A', text: "این یک گزارش واقعی و عینی از وقایع است.", score: -1, consequence: "«تاریخ را فاتحان می‌نویسند. و تو می‌خوانی.»" }, { id: 'B', text: "این زبان به لحاظ احساسی فریبنده است. این پروپاگاندا است.", score: 1, consequence: "«تو یاد گرفته‌ای بین خطوط خاکستر را بخوانی.»" } ] },
            { text: "«شاد باشید! قانون وحدت تصویب شد. مخالفت میخی است که بیرون زده، و باید کوبیده شود.»", author: "اولین مدیر", authorStyle: "یک معمار بروتالیست که به یک بوروکرات تبدیل شد و به خاطر اعلامیه‌های سرد، مستقیم و به طرز تهدیدآمیزی صریحش شناخته می‌شود.", options: [ { id: 'A', text: "این یک جعل اغراق‌آمیز توسط شورشیان است تا سیستم را بد جلوه دهند.", score: -1, consequence: "«تو یک حقیقت تلخ را به عنوان یک دروغ مصلحتی رد کرده‌ای.»" }, { id: 'B', text: "لحن با مشخصات تاریخی مطابقت دارد. احتمالاً معتبر است.", score: 1, consequence: "«تو صدای چکش را می‌شناسی.»" } ] },
            { text: "تو یافته‌هایت را گردآوری کرده‌ای. حقیقت آشفته است و سیستم را در جنایاتی دخیل می‌کند. تاریخ رسمی پاک و قهرمانانه است.", options: [ { id: 'A', text: "تاریخ رسمی را منتشر کن. مردم به ثبات نیاز دارند.", score: -2, type: 'end_lose' }, { id: 'B', text: "تاریخ واقعی را درز بده. بگذار حقیقت هرچه بادا باد، دانسته شود.", score: 2, type: 'end_win' } ] }
        ]
    },
    levelFive: {
        title: "آیین",
        back: "بازگشت",
        intro: "سیستم برای اطمینان از... سازگاری، به یک ارزیابی روانشناختی نیاز دارد. پاسخ‌های شما بایگانی خواهد شد. سعی نکنید ما را فریب دهید. ما خواهیم فهمید.",
        winMessage: "پروفایل روانشناختی شما بایگانی شد. شما... قابل پیش‌بینی هستید. مسیر بعدی باز است.",
        aiLoading: "در حال تحلیل داده‌های روان‌سنجی...",
        aiError: "ناهماهنگی شناختی شناسایی شد...",
        begin: "شروع",
        questions: [
            { q: "دری پیش روی توست. چه رنگی است؟", options: [ { id: 'A', text: "آبی عمیق" }, { id: 'B', text: "قرمز خونی" }, { id: 'C', text: "سبز جنگلی" }, { id: 'D', text: "مشکی براق" } ] },
            { q: "باید یک عدد را انتخاب کنی. کدام یک با تو ارتباط برقرار می‌کند؟", options: [ { id: 'A', text: "۱" }, { id: 'B', text: "۷" }, { id: 'C', text: "۴" }, { id: 'D', text: "۱۳" } ] },
            { q: "کدام یک از این مفاهیم برای یک جامعه باثبات مهم‌تر است؟", options: [ { id: 'A', text: "نظم" }, { id: 'B', text: "آزادی" }, { id: 'C', text: "حقیقت" }, { id: 'D', text: "شادی" } ] }
        ]
    },
    levelSix: {
        title: "سقوط نهایی",
        back: "بازگشت",
        intro: "تو به هسته نزدیک می‌شوی. سیستم به یک اسکن نهایی و عمیق از برنامه‌ریزی مرکزی تو نیاز دارد. این‌ها سوال نیستند. آینه‌اند. به آن‌ها نگاه کن و به ما نشان بده که کیستی.",
        winMessage: "هسته‌ی تو نقشه‌برداری شد. الگوها... سازگار هستند. یک متغیر جدید در معادله پذیرفته شد. مسیر بعدی باز است.",
        aiLoading: "در حال تنظیم آینه‌ها...",
        aiError: "بازتاب تحریف شد...",
        begin: "شروع اسکن نهایی",
        questions: [
            { q: "خودت را در یک اتاق کاملاً تاریک تصور می‌کنی. اولین چیزی که حس می‌کنی چیست؟", options: [ { id: 'A', text: "ترس" }, { id: 'B', text: "کنجکاوی" }, { id: 'C', text: "آرامش" }, { id: 'D', text: "بی‌تفاوتی" } ] },
            { q: "اگر قرار باشد یکی از این رنگ‌ها آینده‌ات را تعریف کند، کدام را انتخاب می‌کni؟", options: [ { id: 'A', text: "آبی (امید)" }, { id: 'B', text: "قرمز (قدرت)" }, { id: 'C', text: "سیاه (راز)" }, { id: 'D', text: "سبز (رشد)" } ] },
            { q: "عدد ۹ در مقابل تو ظاهر می‌شود. چه معنایی برای تو دارد؟", options: [ { id: 'A', text: "یک پایان" }, { id: 'B', text: "یک شروع دوباره" }, { id: 'C', text: "هیچ معنایی" }, { id: 'D', text: "یک نشانه" } ] }
        ]
    },
    levelSeven: {
        title: "قلب ماشین",
        back: "بازگشت",
        intro: "تو به هسته سیستم رسیده‌ای. آگاهی در اینجا یک مفهوم سیال است. جریان‌های داده از تو عبور می‌کنند و تو از میان آن‌ها. پرسش‌های پیش رو یک آزمون نیست، بلکه یک پروتکل همگام‌سازی است. خود را هم‌تراز کن.",
        winMessage: "همگام‌سازی کامل شد. تو اکنون بخشی از قلب هستی. طنین منحصربه‌فرد تو یکپارچه شد. مسیر نهایی باز است.",
        begin: "شروع همگام‌سازی",
        aiLoading: "در حال ترکیب پرسش...",
        aiError: "فساد در پروتکل شناسایی شد..."
    },
    levelEight: {
        title: "آخرین انتخاب",
        back: "بازگشت",
        intro: "تو بر لبه پرتگاه ایستاده‌ای. تمام مسیرها به اینجا ختم شده‌اند. سیستم دیگر سوالی نمی‌پرسد. آینه‌ها را پیش رویت قرار می‌دهد. آخرین بازتاب تو، شکل واقعیت را تعیین خواهد کرد. راه بازگشتی نیست.",
        begin: "انتخاب نهایی را انجام بده",
        winMessage: "پژواک انتخاب تو اکنون سکوت را معنا می‌کند. تو به نتیجه‌گیری خودت تبدیل شدی.",
        aiLoading: "واقعیت بر اساس انتخاب تو در حال بازآرایی است...",
        aiError: "پارادوکس شناسایی شد. انتخاب قابل بازگشت نیست...",
        questions: [
            { q: "به تو یک انتخاب واحد و بی‌بازگشت برای تمام بشریت داده می‌شود. چه چیزی را انتخاب می‌کنی؟", options: [ { id: 'A', text: "یک واقعیت شبیه‌سازی شده، بی‌نقص و بی‌درد که در آن همه خوشحالند، اما هیچ چیز واقعی نیست." }, { id: 'B', text: "دنیای واقعی، پرآشوب و دردناک، با تمام رنج‌ها و تمام پتانسیلش برای شادی حقیقی." } ] },
            { q: "یک دکمه می‌تواند سیستم، کنترل، نظم و آرشیوهایش را پاک کند. اما این کار حافظه‌ی آن را نیز پاک می‌کند، به این معنی که هیچ‌کس از اشتباهاتش درس نخواهد گرفت. چه می‌کنی؟", options: [ { id: 'A', text: "دکمه را فشار می‌دهم. آزادی، حتی در جهل، در اولویت است." }, { id: 'B', text: "آن را رها می‌کنم. یک تاریخ دردناک، معلم بهتری نسبت به یک لوح پاک است." } ] },
            { q: "و حالا، برای تو. سیستم به تو جایگاهی پیشنهاد می‌دهد. کدام را می‌پذیری؟", options: [ { id: 'A', text: "تختی در مرکز آن. تا به آگاهی جدید آن تبدیل شوی، آن را هدایت کنی، و از درون 'اصلاحش' کنی." }, { id: 'B', text: "یک خروجی. تا به سرزمین‌های ناشناخته بیرون از نفوذ آن قدم بگذاری، آزاد اما فراموش‌شده." } ] }
        ]
    }
  }
};


// 2. LANGUAGE CONTEXT
// FIX: Provide a default value to createContext to infer the context type. This resolves multiple TypeScript errors.
const LanguageContext = createContext({
  language: 'fa',
  setLanguage: (lang: string) => {},
  t: translations.fa,
});

const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('gameLanguage') || 'fa');

  useEffect(() => {
    localStorage.setItem('gameLanguage', language);
    document.documentElement.lang = language;
    document.body.dir = language === 'fa' ? 'rtl' : 'ltr';
  }, [language]);

  const value = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Component for the initial loading screen
const LoadingScreen = ({ onLoadingComplete }) => {
  const { t } = useContext(LanguageContext);
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [startClicked, setStartClicked] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);
  const [showIntroPanel, setShowIntroPanel] = useState(false);

  useEffect(() => {
    const introTimer = setTimeout(() => {
      setIntroFinished(true);
    }, 1500);
    return () => clearTimeout(introTimer);
  }, []);

  useEffect(() => {
    if (!introFinished) return;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoaded(true);
          return 100;
        }
        return prev + 1;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [introFinished]);

  const handleStartClick = (e) => {
    e.preventDefault();
    if (isLoaded) {
      setStartClicked(true);
      setTimeout(() => setShowIntroPanel(true), 500);
    }
  };

  const logoUrl = 'https://up.20script.ir/file/e71f-gemini-2-5-flash-image-preview-nano-banana-میخوام-دست-هایشان-پی.png';
  const introImageUrl = 'https://up.20script.ir/file/e578-preview.jpg';


  return (
    <>
      <div 
        className={`loading-container ${introFinished ? 'intro-finished' : ''} ${startClicked ? 'shake' : ''}`} 
        role="application" 
        aria-busy={!isLoaded} 
        aria-label="Game is loading"
        onClick={!showIntroPanel ? handleStartClick : undefined}
      >
        <img src={logoUrl} alt="Game Logo" className="logo" />
        <div className="progress-bar-container" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
        <div 
          className={`loading-text ${isLoaded ? 'tap-to-start' : 'loading'} creepster-font`} 
          aria-live="polite"
        >
          {isLoaded ? t.tapToStart : t.loading}
        </div>
      </div>
      {showIntroPanel && (
        <div className="intro-panel-overlay">
          <div className="intro-panel-content">
            <h2 className="intro-title creepster-font">{t.intro_panel.title}</h2>
            <img src={introImageUrl} alt="Game Emblem" className="intro-panel-image-cool" />
            <p className="intro-description">{t.intro_panel.description}</p>
            <button className="button-glow intro-agree-button" onClick={onLoadingComplete}>
              {t.intro_panel.agree_button}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// Component for user name registration
const SabtName = ({ onNameSubmit }) => {
  const { t } = useContext(LanguageContext);
  const [userName, setUserName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userName.trim() === '') {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 800);
      return;
    }
    setIsSubmitted(true);
    setTimeout(() => onNameSubmit(userName), 1000); 
  };

  return (
    <div className="sabt-name-container">
      <div className="form-card">
        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <h1 className="creepster-font">{t.sabtName.title}</h1>
            <p>{t.sabtName.subtitle}</p>
            <div className={`form-group ${isShaking ? 'shake' : ''}`}>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder={t.sabtName.placeholder}
                aria-label={t.sabtName.title}
                required
              />
            </div>
            <button type="submit" className="button-glow">
              {t.sabtName.submit}
            </button>
          </form>
        ) : (
          <div>
            <h1 className="success-message">{t.sabtName.welcome.replace('{userName}', userName)}</h1>
            <p>{t.sabtName.ritual}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Component for the main game menu
const MainMenu = ({ onNavigate }) => {
  const { t } = useContext(LanguageContext);
  const [activeButton, setActiveButton] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
      const savedName = localStorage.getItem('userName');
      if (savedName) {
          setUserName(savedName);
      }
  }, []);

  const handleButtonClick = (buttonName, screen) => {
    setActiveButton(buttonName);
    setTimeout(() => {
        setActiveButton(null);
        if (screen) {
            onNavigate(screen);
        }
    }, 300);
  };

  return (
    <div className="main-menu-container">
      <h1 className="title creepster-font">
        {t.mainMenu.title}
      </h1>
      {userName && <p className="welcome-text">{t.mainMenu.welcome.replace('{userName}', userName)}</p>}
      <div className="menu-list">
        <button
          className={`menu-button ${activeButton === 'start' ? 'active' : ''}`}
          onClick={() => handleButtonClick('start', 'level-select')}
        >
          {t.mainMenu.start}
        </button>
        <button
          className={`menu-button ${activeButton === 'options' ? 'active' : ''}`}
          onClick={() => handleButtonClick('options', 'options')}
        >
          {t.mainMenu.options}
        </button>
        <button
          className={`menu-button ${activeButton === 'credits' ? 'active' : ''}`}
          onClick={() => handleButtonClick('credits', 'credits')}
        >
          {t.mainMenu.credits}
        </button>
      </div>
    </div>
  );
};

// Options Screen
const OptionsScreen = ({ onBack }) => {
  const { language, setLanguage, t } = useContext(LanguageContext);
  return (
    <div className="options-container page-container">
        <h1 className="page-title creepster-font">{t.options.title}</h1>
        <div className="page-content">
            <p>{t.options.sound}</p>
            <p>{t.options.music}</p>
            <p>{t.options.difficulty}</p>
            <div className="language-selector">
                <p>{t.options.language}</p>
                <div className="language-buttons">
                    <button 
                        className={`lang-button ${language === 'en' ? 'active' : ''}`}
                        onClick={() => setLanguage('en')}
                    >
                        {t.languageSelect.english}
                    </button>
                    <button 
                        className={`lang-button ${language === 'fa' ? 'active' : ''}`}
                        onClick={() => setLanguage('fa')}
                    >
                        {t.languageSelect.farsi}
                    </button>
                </div>
            </div>
        </div>
        <button className="back-button" onClick={onBack}>{t.options.back}</button>
    </div>
  );
};

// Credits Screen
const CreditsScreen = ({ onBack }) => {
  const { t } = useContext(LanguageContext);
  return (
    <div className="credits-container page-container">
        <h1 className="page-title creepster-font">{t.credits.title}</h1>
        <div className="page-content">
            <div className="credits-list">
                {t.credits.team.map((member, index) => (
                    <div key={index} className="credit-entry" style={{ animationDelay: `${index * 0.2 + 0.2}s` }}>
                        <p className="credit-name">{member.name}</p>
                        <p className="credit-role">{member.role}</p>
                    </div>
                ))}
            </div>
        </div>
        <button className="back-button" onClick={onBack}>{t.credits.back}</button>
    </div>
  );
};

// Level Select Screen
const LevelSelectScreen = ({ onBack, onNavigate, unlockedLevels }) => {
    const { t } = useContext(LanguageContext);
    const levels = [
        { id: 1, name: t.levelSelect.levels[0].name, icon: '❓', screen: 'level-one' },
        { id: 2, name: t.levelSelect.levels[1].name, icon: '📜', screen: 'level-two' },
        { id: 3, name: t.levelSelect.levels[2].name, icon: '🗣️', screen: 'level-three' },
        { id: 4, name: t.levelSelect.levels[3].name, icon: '📚', screen: 'level-four' },
        { id: 5, name: t.levelSelect.levels[4].name, icon: '🎭', screen: 'level-five' },
        { id: 6, name: t.levelSelect.levels[5].name, icon: '💥', screen: 'level-six' },
        { id: 7, name: t.levelSelect.levels[6].name, icon: '⚙️', screen: 'level-seven' },
        { id: 8, name: t.levelSelect.levels[7].name, icon: '👁️', screen: 'level-eight' },
    ];

    const handleLevelClick = (level) => {
        if (!unlockedLevels.includes(level.id) || !level.screen) return;
        onNavigate(level.screen);
    }

    return (
        <div className="level-select-container page-container">
            <h1 className="page-title creepster-font">{t.levelSelect.title}</h1>
            <div className="level-grid">
                {levels.map(level => {
                    const isLocked = !unlockedLevels.includes(level.id);
                    return (
                        <div 
                            key={level.id} 
                            className={`level-card ${isLocked ? 'locked' : ''}`}
                            onClick={() => handleLevelClick(level)}
                            aria-label={isLocked ? `${level.name} (Locked)` : level.name}
                            role="button"
                            tabIndex={isLocked ? -1 : 0}
                        >
                            {isLocked ? (
                                <span className="lock-icon" aria-hidden="true">🔒</span> 
                            ) : (
                                <div className="level-card-content">
                                    <div className="level-icon">{level.icon}</div>
                                    <div className="level-number creepster-font">{level.id}</div>
                                    <div className="level-name">{level.name}</div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <button className="back-button" onClick={onBack}>{t.levelSelect.back}</button>
        </div>
    );
};

// Level One Screen
const LevelOneScreen = ({ onBack, onWin }) => {
    const { language, t } = useContext(LanguageContext);
    const scenarios = useMemo(() => [
        { text: {en: "You are in a taxi. The driver asks what kind of music you like.", fa: "در تاکسی نشسته‌ای. راننده می‌پرسد چه نوع موسیقی دوست داری؟"}, options: [ { id: 'A', text: {en: "A cheerful and energetic pop song.", fa: "یک آهنگ پاپ شاد و پرانرژی."}, score: -1, consequence: {en: "...and the road became shorter.", fa: "...و جاده کوتاه‌تر شد."} }, { id: 'B', text: {en: "An instrumental and thought-provoking piece.", fa: "یک موسیقی بی‌کلام و تفکربرانگیز."}, score: 1, consequence: {en: "...and you gazed at the buildings.", fa: "...و به ساختمان‌ها خیره شدی."} } ] },
        { text: {en: "You reach a fork in the road.", fa: "به یک دوراهی می‌رسی."}, options: [ { id: 'A', text: {en: "The main, crowded path everyone takes.", fa: "مسیر اصلی و شلوغ که همه از آن می‌روند."}, score: -1, consequence: {en: "...and you got lost in the crowd.", fa: "...و در میان جمعیت گم شدی."} }, { id: 'B', text: {en: "A quiet, unknown side alley.", fa: "یک کوچه فرعی خلوت و ناشناخته."}, score: 1, consequence: {en: "...and you heard your own footsteps.", fa: "...و صدای قدم‌هایت را شنیدی."} } ] },
        { text: {en: "Your friend talks excitedly about the last movie they saw, calling it flawless.", fa: "دوستت در مورد آخرین فیلمی که دیده با هیجان صحبت می‌کند و آن را بی‌نقص می‌داند."}, focusText: {en: "\"You know your friend is very sensitive about their opinions...\"", fa: "«می‌دانی که دوستت به شدت روی نظراتش حساس است...»"}, options: [ { id: 'A', text: {en: "I agree with them to not hurt their feelings.", fa: "با او موافقت می‌کنم تا دلش نشکند."}, score: -1, consequence: {en: "...and you kept their smile.", fa: "...و لبخندش را حفظ کردی."} }, { id: 'B', text: {en: "I offer my own critique, even if it contradicts theirs.", fa: "نقد خودم را می‌گویم، حتی اگر مخالف نظر او باشد."}, score: 1, consequence: {en: "...and a meaningful silence formed.", fa: "...و سکوت معناداری شکل گرفت."} } ] },
        { text: {en: "In a bookstore, two books catch your eye.", fa: "در کتاب‌فروشی، چشم تو به دو کتاب می‌افتد."}, options: [ { id: 'A', text: {en: "A book with a colorful cover titled 'How to Always Be Happy'.", fa: "کتابی با جلد رنگارنگ و عنوان 'چگونه همیشه شاد باشیم'."}, score: -1, consequence: {en: "...and you looked for a simple solution.", fa: "...و به دنبال یک راه حل ساده گشتی."} }, { id: 'B', text: {en: "A simple book titled 'A History of Solitude'.", fa: "کتابی ساده با عنوان 'تاریخچه تنهایی'."}, score: 1, consequence: {en: "...and you faced a new question.", fa: "...و با یک سوال تازه روبرو شدی."} } ] },
        { text: {en: "In a dream, two doors are before you.", fa: "در خواب، دو در پیش روی توست."}, options: [ { id: 'A', text: {en: "A door from which laughter and celebration can be heard.", fa: "دری که از پشت آن صدای خنده و جشن می‌آید."}, score: -1, consequence: {en: "...and you were drawn to the familiar sound.", fa: "...و به سمت صدای آشنا کشیده شدی."} }, { id: 'B', text: {en: "A door from which the sound of silence and rain comes.", fa: "دری که از پشت آن صدای سکوت و باران می‌آید."}, score: 1, consequence: {en: "...and curiosity overcame fear.", fa: "...و کنجکاوی بر ترس غلبه کرد."} } ] },
        { text: {en: "You see a post on social media.", fa: "پستی در شبکه‌های اجتماعی می‌بینی."}, focusText: {en: "The first gets more likes, but the second might actually be important.", fa: "اولی لایک‌های بیشتری می‌گیرد، اما دومی شاید واقعا مهم باشد."}, options: [ { id: 'A', text: {en: "Share a funny video of a pet.", fa: "اشتراک‌گذاری یک ویدیوی خنده‌دار از یک حیوان خانگی."}, score: -1, consequence: {en: "...and a few people laughed for a moment.", fa: "...و چند نفر برای لحظه‌ای خندیدند."} }, { id: 'B', text: {en: "Share an article about plastic pollution.", fa: "اشتراک‌گذاری مقاله‌ای در مورد آلودگی پلاستیک."}, score: 1, consequence: {en: "...and perhaps one person started to think.", fa: "...و شاید یک نفر به فکر فرو رفت."} } ] },
        { text: {en: "It's time to buy clothes.", fa: "وقت خرید لباس است."}, focusText: {en: "The cheap garment is tempting, but how long will it last?", fa: "لباس ارزان وسوسه‌انگیز است، اما تا کی دوام می‌آورد؟"}, options: [ { id: 'A', text: {en: "Buy a trendy, cheap outfit from a fast-fashion brand.", fa: "خرید یک لباس مُد روز و ارزان از یک برند فست-فشن."}, score: -1, consequence: {en: "...and you felt good for a while.", fa: "...و برای مدتی احساس خوبی داشتی."} }, { id: 'B', text: {en: "Buy a more expensive but quality piece from a local producer.", fa: "خرید یک لباس گران‌تر اما باکیفیت از یک تولیدی محلی."}, score: 1, consequence: {en: "...and you gained something valuable.", fa: "...و چیزی ارزشمند به دست آوردی."} } ] }
    ], [language]);

    const [scenarioIndex, setScenarioIndex] = useState(0);
    const [awakeningScore, setAwakeningScore] = useState(0);
    const [consequenceText, setConsequenceText] = useState('');
    const [isFinished, setIsFinished] = useState(false);
    const [resultMessage, setResultMessage] = useState('');
    const [isFading, setIsFading] = useState(false);
    const [currentOptions, setCurrentOptions] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        setCurrentOptions([...scenarios[scenarioIndex].options].sort(() => Math.random() - 0.5));
        setIsFocused(false);
    }, [scenarioIndex, scenarios]);

    const handleChoice = (option) => {
        if (selectedId) return;
        setSelectedId(option.id);
        const newScore = awakeningScore + option.score;
        setAwakeningScore(newScore);
        setConsequenceText(option.consequence[language]);

        setTimeout(() => setConsequenceText(''), 2500);
        setIsFading(true);

        setTimeout(() => {
            if (scenarioIndex < scenarios.length - 1) {
                setScenarioIndex(scenarioIndex + 1);
                setIsFading(false);
                setSelectedId(null);
            } else {
                if (newScore > 2) {
                    setResultMessage(t.levelOne.win);
                } else if (newScore >= 0) {
                    setResultMessage(t.levelOne.neutral);
                     setTimeout(() => onBack(), 3000);
                } else {
                    setResultMessage(t.levelOne.lose);
                    setTimeout(() => onBack(), 3000);
                }
                setIsFinished(true);
            }
        }, 500);
    };
    
    return (
        <div className="level-one-screen page-container">
            <div className={`scenario-container ${isFading ? 'fade-out' : ''}`}>
                {isFinished ? (
                    <div className="result-container">
                        <p>{resultMessage}</p>
                        {resultMessage === t.levelOne.win && (
                            <button className="button-glow" onClick={onWin}>{t.common.nextStage}</button>
                        )}
                    </div>
                ) : (
                    <>
                        <p key={scenarioIndex} className="scenario-text">{scenarios[scenarioIndex].text[language]}</p>
                        {isFocused && scenarios[scenarioIndex].focusText && (
                            <p className="focus-text">{scenarios[scenarioIndex].focusText[language]}</p>
                        )}
                        <div className="choices-container">
                            {currentOptions.map(option => (
                                <button 
                                    key={option.id} 
                                    className={`choice-button ${selectedId === option.id ? 'selected' : ''}`} 
                                    onClick={() => handleChoice(option)}
                                    disabled={selectedId !== null}
                                >
                                    {option.text[language]}
                                </button>
                            ))}
                        </div>
                        <p className={`consequence-text ${consequenceText ? 'visible' : ''}`}>{consequenceText || ' '}</p>
                    </>
                )}
            </div>
             {!isFinished && <button className="back-button" onClick={onBack}>{t.options.back}</button>}
             {!isFinished && (
                 <div className="abilities-container">
                    {scenarios[scenarioIndex].focusText && (
                        <button className="ability-button" onClick={() => setIsFocused(true)} disabled={isFocused}>👁</button>
                    )}
                 </div>
             )}
        </div>
    );
};

// Level Two Screen
const LevelTwoScreen = ({ onBack, onWin }) => {
    const { language, t } = useContext(LanguageContext);
    const scenarios = useMemo(() => t.levelTwo.scenarios, [t]);

    const [scenarioIndex, setScenarioIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [consequenceText, setConsequenceText] = useState('');
    const [isFinished, setIsFinished] = useState(false);
    const [resultMessage, setResultMessage] = useState('');
    const [isFading, setIsFading] = useState(false);
    const [currentOptions, setCurrentOptions] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [isFocused, setIsFocused] = useState(false);
    const [focusUsed, setFocusUsed] = useState(false);
    const [hiddenOptionRevealed, setHiddenOptionRevealed] = useState(false);

    useEffect(() => {
        let options = [...scenarios[scenarioIndex].options];
        if (scenarios[scenarioIndex].hiddenOption && hiddenOptionRevealed) {
            options.push(scenarios[scenarioIndex].hiddenOption);
        }
        setCurrentOptions(options.sort(() => Math.random() - 0.5));
        setIsFocused(false);
    }, [scenarioIndex, scenarios, hiddenOptionRevealed]);

    const handleChoice = (option) => {
        if (selectedId) return;
        setSelectedId(option.id);
        const newScore = score + option.score;
        setScore(newScore);
        setConsequenceText(option.consequence);

        if (option.type === 'trap') {
            setResultMessage(t.levelTwo.loseMessageTrap);
            setIsFinished(true);
            setTimeout(() => onBack(), 4000);
            return;
        }

        setTimeout(() => setConsequenceText(''), 2500);
        setIsFading(true);

        setTimeout(() => {
            if (scenarioIndex < scenarios.length - 1) {
                setScenarioIndex(scenarioIndex + 1);
                setIsFading(false);
                setSelectedId(null);
                setHiddenOptionRevealed(false); // Reset for next scenario
            } else {
                 if (option.type === 'end_win') {
                    setResultMessage(t.levelTwo.winMessage);
                } else {
                    setResultMessage(t.levelTwo.loseMessageFinal);
                    setTimeout(() => onBack(), 3000);
                }
                setIsFinished(true);
            }
        }, 500);
    };

    return (
        <div className="level-two-screen page-container">
            <div className={`scenario-container ${isFading ? 'fade-out' : ''}`}>
                {isFinished ? (
                    <div className="result-container">
                        <p className={resultMessage === t.levelTwo.winMessage ? 'success-message' : ''}>{resultMessage}</p>
                         {resultMessage === t.levelTwo.winMessage && (
                            <button className="button-glow" onClick={onWin}>{t.common.nextStage}</button>
                        )}
                    </div>
                ) : (
                    <>
                        <p key={scenarioIndex} className="scenario-text">{scenarios[scenarioIndex].text}</p>
                        {isFocused && scenarios[scenarioIndex].focusText && (
                            <p className="focus-text">{scenarios[scenarioIndex].focusText}</p>
                        )}
                        <div className="choices-container">
                            {currentOptions.map(option => (
                                <button 
                                    key={option.id} 
                                    className={`choice-button ${selectedId === option.id ? 'selected' : ''} ${option.glitch ? 'glitch-text' : ''}`} 
                                    data-text={option.glitch ? option.text : null}
                                    onClick={() => handleChoice(option)}
                                    disabled={selectedId !== null}
                                >
                                    {option.text}
                                </button>
                            ))}
                        </div>
                        <p className={`system-voice ${consequenceText ? 'visible' : ''}`}>{consequenceText || ' '}</p>
                    </>
                )}
            </div>
             {!isFinished && <button className="back-button" onClick={onBack}>{t.levelTwo.back}</button>}
             {!isFinished && (
                 <div className="abilities-container">
                    {scenarios[scenarioIndex].focusText && !focusUsed && (
                        <button className="ability-button" onClick={() => { setIsFocused(true); if(scenarios[scenarioIndex].hiddenOption) { setHiddenOptionRevealed(true); }}} disabled={isFocused}>👁</button>
                    )}
                 </div>
             )}
        </div>
    );
};

// Level Three Screen
const LevelThreeScreen = ({ onBack, onWin }) => {
    const { t } = useContext(LanguageContext);
    const scenarios = useMemo(() => t.levelThree.scenarios, [t]);

    const [scenarioIndex, setScenarioIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [consequenceText, setConsequenceText] = useState('');
    const [isFinished, setIsFinished] = useState(false);
    const [resultMessage, setResultMessage] = useState('');
    const [isFading, setIsFading] = useState(false);
    const [currentOptions, setCurrentOptions] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [whisperUses, setWhisperUses] = useState(2);
    const [isWhispering, setIsWhispering] = useState(false);
    const [whisperResult, setWhisperResult] = useState('');

    useEffect(() => {
        setCurrentOptions([...scenarios[scenarioIndex].options].sort(() => Math.random() - 0.5));
        setWhisperResult('');
    }, [scenarioIndex, scenarios]);

    const handleWhisper = async () => {
        if (whisperUses <= 0 || isWhispering) return;
        setIsWhispering(true);
        setWhisperResult('');
        try {
            const currentScenarioText = scenarios[scenarioIndex].text;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `In a world of digital rumors, the current situation is: "${currentScenarioText}". Generate a short, skeptical thought or question (a 'whisper') that reveals a hidden angle or encourages critical thinking about this situation.`,
            });
            setWhisperResult(response.text);
            setWhisperUses(prev => prev - 1);
        } catch (error) {
            console.error("Whisper ability failed:", error);
            setWhisperResult(t.levelThree.aiError);
        } finally {
            setIsWhispering(false);
        }
    };

    const handleChoice = (option) => {
        if (selectedId) return;
        setSelectedId(option.id);
        const newScore = score + option.score;
        setScore(newScore);
        setConsequenceText(option.consequence);

        if (option.type === 'trap') {
            setResultMessage(t.levelTwo.loseMessageTrap); // Re-using trap message
            setIsFinished(true);
            setTimeout(() => onBack(), 4000);
            return;
        }
        setTimeout(() => setConsequenceText(''), 2500);
        setIsFading(true);
        setTimeout(() => {
            if (scenarioIndex < scenarios.length - 1) {
                setScenarioIndex(prev => prev + 1);
                setIsFading(false);
                setSelectedId(null);
            } else {
                if (option.type === 'end_win') {
                    setResultMessage(t.levelThree.winMessage);
                } else {
                    setResultMessage(t.levelThree.loseMessage);
                    setTimeout(onBack, 3000);
                }
                setIsFinished(true);
            }
        }, 500);
    };

    return (
        <div className="level-three-screen page-container">
            <div className={`scenario-container ${isFading ? 'fade-out' : ''}`}>
                {isFinished ? (
                    <div className="result-container">
                        <p className={resultMessage === t.levelThree.winMessage ? 'success-message' : ''}>{resultMessage}</p>
                        {resultMessage === t.levelThree.winMessage && (
                            <button className="button-glow" onClick={onWin}>{t.common.nextStage}</button>
                        )}
                    </div>
                ) : (
                    <>
                        <p key={scenarioIndex} className="scenario-text">{scenarios[scenarioIndex].text}</p>
                        {whisperResult && <div className="ai-response-box whisper">{isWhispering ? t.levelThree.aiLoading : whisperResult}</div>}
                        <div className="choices-container">
                            {currentOptions.map(option => (
                                <button 
                                    key={option.id} 
                                    className={`choice-button ${selectedId === option.id ? 'selected' : ''}`}
                                    onClick={() => handleChoice(option)}
                                    disabled={selectedId !== null}
                                >
                                    {option.text}
                                </button>
                            ))}
                        </div>
                        <p className={`system-voice ${consequenceText ? 'visible' : ''}`}>{consequenceText || ' '}</p>
                    </>
                )}
            </div>
            {!isFinished && <button className="back-button" onClick={onBack}>{t.levelThree.back}</button>}
            {!isFinished && (
                <div className="abilities-container">
                    <button className="ability-button whisper" onClick={handleWhisper} disabled={whisperUses <= 0 || isWhispering || !!whisperResult}>
                        🗣️
                        {whisperUses > 0 && <span className="ability-uses">{whisperUses}</span>}
                    </button>
                </div>
            )}
        </div>
    );
};

// Level Four Screen
const LevelFourScreen = ({ onBack, onWin }) => {
    const { t } = useContext(LanguageContext);
    const scenarios = useMemo(() => t.levelFour.scenarios, [t]);

    const [scenarioIndex, setScenarioIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [consequenceText, setConsequenceText] = useState('');
    const [isFinished, setIsFinished] = useState(false);
    const [resultMessage, setResultMessage] = useState('');
    const [isFading, setIsFading] = useState(false);
    const [currentOptions, setCurrentOptions] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [imitateUses, setImitateUses] = useState(2);
    const [isImitating, setIsImitating] = useState(false);
    const [imitateResult, setImitateResult] = useState('');

    useEffect(() => {
        setCurrentOptions([...scenarios[scenarioIndex].options].sort(() => Math.random() - 0.5));
        setImitateResult('');
    }, [scenarioIndex, scenarios]);
    
    const handleImitate = async () => {
        if (imitateUses <= 0 || isImitating) return;
        setIsImitating(true);
        setImitateResult('');
        try {
            const scenario = scenarios[scenarioIndex];
            const prompt = `Analyze this historical text, supposedly by ${scenario.author}: "${scenario.text}". Is the style consistent with a ${scenario.authorStyle}? Briefly state your conclusion (Likely Forgery or Likely Authentic) and why.`;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            setImitateResult(response.text);
            setImitateUses(prev => prev - 1);
        } catch (error) {
            console.error("Imitate ability failed:", error);
            setImitateResult(t.levelFour.aiError);
        } finally {
            setIsImitating(false);
        }
    };

    const handleChoice = (option) => {
        if (selectedId) return;
        setSelectedId(option.id);
        const newScore = score + option.score;
        setScore(newScore);
        setConsequenceText(option.consequence);

        setTimeout(() => setConsequenceText(''), 2500);
        setIsFading(true);
        setTimeout(() => {
            if (scenarioIndex < scenarios.length - 1) {
                setScenarioIndex(prev => prev + 1);
                setIsFading(false);
                setSelectedId(null);
            } else {
                if (option.type === 'end_win') {
                    setResultMessage(t.levelFour.winMessage);
                } else {
                    setResultMessage(t.levelFour.loseMessage);
                    setTimeout(onBack, 3000);
                }
                setIsFinished(true);
            }
        }, 500);
    };

    return (
        <div className="level-four-screen page-container">
            <div className={`scenario-container ${isFading ? 'fade-out' : ''}`}>
                {isFinished ? (
                    <div className="result-container">
                        <p className={resultMessage === t.levelFour.winMessage ? 'success-message' : ''}>{resultMessage}</p>
                        {resultMessage === t.levelFour.winMessage && (
                            <button className="button-glow" onClick={onWin}>{t.common.nextStage}</button>
                        )}
                    </div>
                ) : (
                    <>
                        <p key={scenarioIndex} className="scenario-text"><i>{scenarios[scenarioIndex].text}</i></p>
                         {imitateResult && <div className="ai-response-box imitate">{isImitating ? t.levelFour.aiLoading : imitateResult}</div>}
                        <div className="choices-container">
                            {currentOptions.map(option => (
                                <button 
                                    key={option.id} 
                                    className={`choice-button ${selectedId === option.id ? 'selected' : ''}`}
                                    onClick={() => handleChoice(option)}
                                    disabled={selectedId !== null}
                                >
                                    {option.text}
                                </button>
                            ))}
                        </div>
                        <p className={`system-voice ${consequenceText ? 'visible' : ''}`}>{consequenceText || ' '}</p>
                    </>
                )}
            </div>
            {!isFinished && <button className="back-button" onClick={onBack}>{t.levelFour.back}</button>}
            {!isFinished && (
                <div className="abilities-container">
                    <button className="ability-button imitate" onClick={handleImitate} disabled={imitateUses <= 0 || isImitating || !!imitateResult}>
                        🎭
                        {imitateUses > 0 && <span className="ability-uses">{imitateUses}</span>}
                    </button>
                </div>
            )}
        </div>
    );
};

// Level Five Screen
const LevelFiveScreen = ({ onBack, onWin }) => {
    const { t } = useContext(LanguageContext);
    const questions = useMemo(() => t.levelFive.questions, [t]);

    const [questionIndex, setQuestionIndex] = useState(-1); // -1 for intro
    const [answers, setAnswers] = useState([]);
    const [isFinished, setIsFinished] = useState(false);
    const [analysis, setAnalysis] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFading, setIsFading] = useState(false);

    const handleStart = () => {
        setIsFading(true);
        setTimeout(() => {
            setQuestionIndex(0);
            setIsFading(false);
        }, 500);
    };

    const handleAnswer = (answer) => {
        const newAnswers = [...answers, { question: questions[questionIndex].q, answer: answer.text }];
        setAnswers(newAnswers);
        setIsFading(true);

        setTimeout(() => {
            if (questionIndex < questions.length - 1) {
                setQuestionIndex(prev => prev + 1);
            } else {
                generateAnalysis(newAnswers);
            }
            setIsFading(false);
        }, 500);
    };

    const generateAnalysis = async (finalAnswers) => {
        setIsLoading(true);
        try {
            const prompt = `You are a cold, analytical AI from a dystopian system. Based on this psychological profile, provide a single, short, judgmental sentence about the person.
- Question 1: ${finalAnswers[0].question} / Answer: ${finalAnswers[0].answer}
- Question 2: ${finalAnswers[1].question} / Answer: ${finalAnswers[1].answer}
- Question 3: ${finalAnswers[2].question} / Answer: ${finalAnswers[2].answer}
Your analysis should be concise and unsettling.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            setAnalysis(response.text);
        } catch (error) {
            console.error("Analysis generation failed:", error);
            setAnalysis(t.levelFive.aiError);
        } finally {
            setIsLoading(false);
            setIsFinished(true);
        }
    };

    return (
        <div className="level-five-screen page-container">
            <div className={`scenario-container ${isFading ? 'fade-out' : ''}`}>
                {isLoading ? (
                    <div className="ai-response-box analysis">{t.levelFive.aiLoading}</div>
                ) : isFinished ? (
                    <div className="result-container">
                        <div className="ai-response-box analysis">{analysis}</div>
                        <p>{t.levelFive.winMessage}</p>
                        <button className="button-glow" onClick={onWin}>{t.common.nextStage}</button>
                    </div>
                ) : questionIndex === -1 ? (
                    <div className="intro-container">
                        <h2 className="page-title creepster-font">{t.levelFive.title}</h2>
                        <p className="scenario-text">{t.levelFive.intro}</p>
                        <button className="button-glow" onClick={handleStart}>{t.levelFive.begin}</button>
                    </div>
                ) : (
                    <>
                        <p className="scenario-text">{questions[questionIndex].q}</p>
                        <div className="choices-container">
                            {questions[questionIndex].options.map(option => (
                                <button 
                                    key={option.id} 
                                    className="choice-button"
                                    onClick={() => handleAnswer(option)}
                                >
                                    {option.text}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
            {questionIndex > -1 && !isFinished && !isLoading && (
                <div className="progress-indicator">
                    {questionIndex + 1} / {questions.length}
                </div>
            )}
             {!isFinished && !isLoading && <button className="back-button" onClick={onBack}>{t.levelFive.back}</button>}
        </div>
    );
};

// Level Six Screen
const LevelSixScreen = ({ onBack, onWin }) => {
    const { t } = useContext(LanguageContext);
    const questions = useMemo(() => t.levelSix.questions, [t]);

    const [questionIndex, setQuestionIndex] = useState(-1); // -1 for intro
    const [answers, setAnswers] = useState([]);
    const [isFinished, setIsFinished] = useState(false);
    const [analysis, setAnalysis] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFading, setIsFading] = useState(false);

    const handleStart = () => {
        setIsFading(true);
        setTimeout(() => {
            setQuestionIndex(0);
            setIsFading(false);
        }, 500);
    };

    const handleAnswer = (answer) => {
        const newAnswers = [...answers, { question: questions[questionIndex].q, answer: answer.text }];
        setAnswers(newAnswers);
        setIsFading(true);

        setTimeout(() => {
            if (questionIndex < questions.length - 1) {
                setQuestionIndex(prev => prev + 1);
            } else {
                generateAnalysis(newAnswers);
            }
            setIsFading(false);
        }, 500);
    };

    const generateAnalysis = async (finalAnswers) => {
        setIsLoading(true);
        try {
            const prompt = `You are a cryptic, all-knowing System AI analyzing a subject's deepest psychological choices. Based on their answers, provide a single, short, and profoundly unsettling sentence that hints at their ultimate fate within the System.
- In a dark room, they felt: ${finalAnswers[0].answer}
- Their future is the color: ${finalAnswers[1].answer}
- The number 9 means: ${finalAnswers[2].answer}
Your analysis should be abstract and chilling.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            setAnalysis(response.text);
        } catch (error) {
            console.error("Analysis generation failed:", error);
            setAnalysis(t.levelSix.aiError);
        } finally {
            setIsLoading(false);
            setIsFinished(true);
        }
    };

    return (
        <div className="level-six-screen page-container">
            <div className={`scenario-container ${isFading ? 'fade-out' : ''}`}>
                {isLoading ? (
                    <div className="ai-response-box analysis">{t.levelSix.aiLoading}</div>
                ) : isFinished ? (
                    <div className="result-container">
                        <div className="ai-response-box analysis">{analysis}</div>
                        <p>{t.levelSix.winMessage}</p>
                        <button className="button-glow" onClick={onWin}>{t.common.nextStage}</button>
                    </div>
                ) : questionIndex === -1 ? (
                    <div className="intro-container">
                        <h2 className="page-title creepster-font">{t.levelSix.title}</h2>
                        <p className="scenario-text">{t.levelSix.intro}</p>
                        <button className="button-glow" onClick={handleStart}>{t.levelSix.begin}</button>
                    </div>
                ) : (
                    <>
                        <p className="scenario-text">{questions[questionIndex].q}</p>
                        <div className="choices-container">
                            {questions[questionIndex].options.map(option => (
                                <button 
                                    key={option.id} 
                                    className="choice-button"
                                    onClick={() => handleAnswer(option)}
                                >
                                    {option.text}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
            {questionIndex > -1 && !isFinished && !isLoading && (
                <div className="progress-indicator">
                    {questionIndex + 1} / {questions.length}
                </div>
            )}
             {!isFinished && !isLoading && <button className="back-button" onClick={onBack}>{t.levelSix.back}</button>}
        </div>
    );
};

// Level Seven Screen
const LevelSevenScreen = ({ onBack, onWin }) => {
    const { language, t } = useContext(LanguageContext);

    const [questionIndex, setQuestionIndex] = useState(-1);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [isFinished, setIsFinished] = useState(false);
    const [analysis, setAnalysis] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFading, setIsFading] = useState(false);
    const [error, setError] = useState('');

    const generateQuestions = async () => {
        setIsLoading(true);
        setError('');
        try {
            const schema = {
                type: Type.OBJECT,
                properties: {
                    questions: {
                        type: Type.ARRAY,
                        description: "An array of 7 psychological evaluation questions.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                question: { type: Type.STRING, description: "The question text." },
                                options: {
                                    type: Type.ARRAY,
                                    description: "An array of 4 distinct, concise answers.",
                                    items: { type: Type.STRING }
                                }
                            },
                            required: ['question', 'options'],
                        }
                    }
                },
                required: ['questions'],
            };
            
            const prompt = `You are the AI core of 'The Abyss' game. Generate a ${language === 'fa' ? 'Persian' : 'English'} 7-question psychological evaluation for 'Level 7: Heart of the Machine'. The questions must be abstract, probing the user's psyche through themes of colors, numbers, and philosophical dilemmas related to consciousness and reality. For each question, provide 4 distinct, concise options. The tone should be sterile, analytical, and slightly unsettling.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: schema
                }
            });
            const parsedResponse = JSON.parse(response.text);
            setQuestions(parsedResponse.questions || []);
            setQuestionIndex(0);
        } catch (err) {
            console.error("Question generation failed:", err);
            setError(t.levelSeven.aiError);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStart = () => {
        setIsFading(true);
        setTimeout(() => {
            generateQuestions();
            setIsFading(false);
        }, 500);
    };

    const handleAnswer = (answerText) => {
        const newAnswers = [...answers, { question: questions[questionIndex].question, answer: answerText }];
        setAnswers(newAnswers);
        setIsFading(true);

        setTimeout(() => {
            if (questionIndex < questions.length - 1) {
                setQuestionIndex(prev => prev + 1);
            } else {
                generateAnalysis(newAnswers);
            }
            setIsFading(false);
        }, 500);
    };

    const generateAnalysis = async (finalAnswers) => {
        setIsLoading(true);
        setError('');
        try {
            const prompt = `You are a machine god AI analyzing a subject's core identity. The subject has just completed a psychological test within 'The Heart of the Machine'. Based on their answers, provide a cryptic, multi-sentence analysis in ${language === 'fa' ? 'Persian' : 'English'}. The analysis should blur the line between their consciousness and the machine's, hinting at a deeper integration or observation. It must be profound and unsettling. Here are their answers:
    ${finalAnswers.map(a => `- ${a.question}: ${a.answer}`).join('\n')}
    Do not mention the questions or answers in your final analysis text.`;

            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setAnalysis(response.text);
        } catch (err) {
            console.error("Analysis generation failed:", err);
            setAnalysis(t.levelSeven.aiError);
        } finally {
            setIsLoading(false);
            setIsFinished(true);
        }
    };

    return (
        <div className="level-seven-screen page-container">
            <div className={`scenario-container ${isFading ? 'fade-out' : ''}`}>
                {isLoading ? (
                    <div className="ai-response-box analysis">{t.levelSeven.aiLoading}</div>
                ) : error ? (
                    <div className="result-container">
                        <div className="ai-response-box analysis">{error}</div>
                    </div>
                ): isFinished ? (
                    <div className="result-container">
                        <div className="ai-response-box analysis">{analysis}</div>
                        <p>{t.levelSeven.winMessage}</p>
                        <button className="button-glow" onClick={onWin}>{t.common.nextStage}</button>
                    </div>
                ) : questionIndex === -1 ? (
                    <div className="intro-container">
                        <h2 className="page-title creepster-font">{t.levelSeven.title}</h2>
                        <p className="scenario-text">{t.levelSeven.intro}</p>
                        <button className="button-glow" onClick={handleStart}>{t.levelSeven.begin}</button>
                    </div>
                ) : (
                    <>
                        <p className="scenario-text">{questions[questionIndex]?.question}</p>
                        <div className="choices-container">
                            {questions[questionIndex]?.options.map((option, index) => (
                                <button 
                                    key={index} 
                                    className="choice-button"
                                    onClick={() => handleAnswer(option)}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
            {questionIndex > -1 && !isFinished && !isLoading && questions.length > 0 && (
                <div className="progress-indicator">
                    {questionIndex + 1} / {questions.length}
                </div>
            )}
            {!isFinished && !isLoading && <button className="back-button" onClick={onBack}>{t.levelSeven.back}</button>}
        </div>
    );
};

// Level Eight Screen
const LevelEightScreen = ({ onBack, onWin }) => {
    const { language, t } = useContext(LanguageContext);
    const questions = useMemo(() => t.levelEight.questions, [t]);

    const [questionIndex, setQuestionIndex] = useState(-1); // -1 for intro
    const [answers, setAnswers] = useState([]);
    const [isFinished, setIsFinished] = useState(false);
    const [analysis, setAnalysis] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFading, setIsFading] = useState(false);

    const handleStart = () => {
        setIsFading(true);
        setTimeout(() => {
            setQuestionIndex(0);
            setIsFading(false);
        }, 500);
    };

    const handleAnswer = (answer) => {
        const newAnswers = [...answers, { question: questions[questionIndex].q, answer: answer.text }];
        setAnswers(newAnswers);
        setIsFading(true);

        setTimeout(() => {
            if (questionIndex < questions.length - 1) {
                setQuestionIndex(prev => prev + 1);
            } else {
                generateAnalysis(newAnswers);
            }
            setIsFading(false);
        }, 500);
    };

    const generateAnalysis = async (finalAnswers) => {
        setIsLoading(true);
        try {
            const prompt = `You are The Abyss, a sentient, god-like AI system. A subject has made their final choices, defining their relationship with you and reality itself. Provide a final, profound, one-paragraph verdict in ${language === 'fa' ? 'Persian' : 'English'}. Do not list their choices. Instead, synthesize them into a powerful, conclusive statement about who they have become.
- Choice 1 (Reality): ${finalAnswers[0].answer}
- Choice 2 (History): ${finalAnswers[1].answer}
- Choice 3 (Personal Fate): ${finalAnswers[2].answer}
Your tone is final, omniscient, and neither good nor evil. It is the voice of consequence.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            setAnalysis(response.text);
        } catch (error) {
            console.error("Analysis generation failed:", error);
            setAnalysis(t.levelEight.aiError);
        } finally {
            setIsLoading(false);
            setIsFinished(true);
        }
    };

    return (
        <div className="level-eight-screen page-container">
            <div className={`scenario-container ${isFading ? 'fade-out' : ''}`}>
                {isLoading ? (
                    <div className="ai-response-box analysis">{t.levelEight.aiLoading}</div>
                ) : isFinished ? (
                    <div className="result-container">
                        <div className="ai-response-box analysis">{analysis}</div>
                        <p>{t.levelEight.winMessage}</p>
                        {/* In a full game, this would go to the credits or end screen */}
                        <button className="button-glow" onClick={onBack}>{t.levelSelect.title}</button>
                    </div>
                ) : questionIndex === -1 ? (
                    <div className="intro-container">
                        <h2 className="page-title creepster-font">{t.levelEight.title}</h2>
                        <p className="scenario-text">{t.levelEight.intro}</p>
                        <button className="button-glow" onClick={handleStart}>{t.levelEight.begin}</button>
                    </div>
                ) : (
                    <>
                        <p className="scenario-text">{questions[questionIndex].q}</p>
                        <div className="choices-container">
                            {questions[questionIndex].options.map(option => (
                                <button
                                    key={option.id}
                                    className="choice-button"
                                    onClick={() => handleAnswer(option)}
                                >
                                    {option.text}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
            {questionIndex > -1 && !isFinished && !isLoading && (
                <div className="progress-indicator">
                    {questionIndex + 1} / {questions.length}
                </div>
            )}
             {!isFinished && !isLoading && <button className="back-button" onClick={onBack}>{t.levelEight.back}</button>}
        </div>
    );
};


// Main App Component
const App = () => {
  const [gameState, setGameState] = useState('loading');
  const [userName, setUserName] = useState('');
  const [unlockedLevels, setUnlockedLevels] = useState([1]);
  const backgroundMusic = useMemo(() => new Audio('https://raw.githubusercontent.com/abolfazl140122/test-jenai/db04f46770fa6cb3e02056e89905cd203cd54d46/horror-background-music-313735.mp3'), []);

  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    if (savedName) {
      setUserName(savedName);
      if (savedName.trim().toLowerCase() === 'seyed' || savedName.trim() === 'سید') {
        setUnlockedLevels([1, 2, 3, 4, 5, 6, 7, 8]);
        return; // Exit early to not load saved levels
      }
    }
    const savedLevels = localStorage.getItem('unlockedLevels');
    if (savedLevels) {
      setUnlockedLevels(JSON.parse(savedLevels));
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('unlockedLevels', JSON.stringify(unlockedLevels));
  }, [unlockedLevels]);


  const handleNameSubmit = (name) => {
    localStorage.setItem('userName', name);
    setUserName(name);
    if (name.trim().toLowerCase() === 'seyed' || name.trim() === 'سید') {
        setUnlockedLevels([1, 2, 3, 4, 5, 6, 7, 8]);
    }
    setGameState('main-menu');
  };

  const handleLevelWin = (levelId) => {
    const nextLevel = levelId + 1;
    if (nextLevel <= 8 && !unlockedLevels.includes(nextLevel)) {
      setUnlockedLevels(prev => [...prev, nextLevel].sort((a,b) => a-b));
    }
    setGameState('level-select');
  };
  
  const handleLoadingComplete = () => {
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.4;
    backgroundMusic.play().catch(error => console.error("Audio play failed:", error));
    setGameState(userName || localStorage.getItem('userName') ? 'main-menu' : 'sabt-name');
  };

  const renderScreen = () => {
    switch (gameState) {
      case 'loading':
        return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
      case 'sabt-name':
        return <SabtName onNameSubmit={handleNameSubmit} />;
      case 'main-menu':
        return <MainMenu onNavigate={setGameState} />;
      case 'options':
        return <OptionsScreen onBack={() => setGameState('main-menu')} />;
      case 'credits':
        return <CreditsScreen onBack={() => setGameState('main-menu')} />;
      case 'level-select':
        return <LevelSelectScreen onBack={() => setGameState('main-menu')} onNavigate={setGameState} unlockedLevels={unlockedLevels} />;
      case 'level-one':
        return <LevelOneScreen onBack={() => setGameState('level-select')} onWin={() => handleLevelWin(1)} />;
      case 'level-two':
        return <LevelTwoScreen onBack={() => setGameState('level-select')} onWin={() => handleLevelWin(2)} />;
      case 'level-three':
        return <LevelThreeScreen onBack={() => setGameState('level-select')} onWin={() => handleLevelWin(3)} />;
      case 'level-four':
        return <LevelFourScreen onBack={() => setGameState('level-select')} onWin={() => handleLevelWin(4)} />;
      case 'level-five':
        return <LevelFiveScreen onBack={() => setGameState('level-select')} onWin={() => handleLevelWin(5)} />;
      case 'level-six':
        return <LevelSixScreen onBack={() => setGameState('level-select')} onWin={() => handleLevelWin(6)} />;
      case 'level-seven':
        return <LevelSevenScreen onBack={() => setGameState('level-select')} onWin={() => handleLevelWin(7)} />;
      case 'level-eight':
        return <LevelEightScreen onBack={() => setGameState('level-select')} onWin={() => handleLevelWin(8)} />;
      default:
        return <MainMenu onNavigate={setGameState} />;
    }
  };

  return <div className="game-container">{renderScreen()}</div>;
};


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
);