import type { CardPaper } from "@/lib/bouquet/types";

/*
 * Signature themes — the heart of BloomStory.
 *
 * Every bouquet is built from ONE signature theme, derived from the three
 * choices made up front:
 *
 *   Emotion  ×  Recipient  ×  Vibe
 *   (what)      (who)         (how it should feel)
 *
 * The same emotion speaks differently to a partner vs. a colleague, and the
 * vibe picks the physical look. A birthday for a partner is not the same gift
 * as a birthday for a colleague, and this file is what makes them differ:
 * the name, the tagline, the message voice, the suggested wrapping, and the
 * reveal environment all resolve from the combination.
 */

export interface RecipientVariant {
  /** Card title suggestion rendered with the recipient's name. */
  title: string;
  /** Default message seeded into the Message step. */
  message: string;
  /** Alternate openers offered as inspiration chips. */
  quotes: string[];
}

export interface EmotionSignature {
  /** Emotion id this theme answers to. */
  emotion: string;
  emoji: string;
  /** Signature name for this emotion. */
  name: string;
  tagline: string;
  /** Flowers suggested for this emotion (used to build the default bouquet). */
  flowers: string[];
  /** Greenery paired with those flowers — every real bouquet has some, and a
   *  flowers-only arrangement is what read as sparse/incomplete by default. */
  foliage: string[];
  /** Voice per recipient type — the same emotion tuned for who it's for. */
  recipients: Record<string, RecipientVariant>;
  /** Any recipient type with no bespoke entry uses this. */
  fallback: RecipientVariant;
}

/** The physical look each vibe contributes to the signature. */
export interface VibeLook {
  wrapper: string;
  ribbon: string;
  cardPaper: CardPaper;
  presentation: string;
  background: string;
}

const DEFAULT_LOOK: VibeLook = {
  wrapper: "cream_paper",
  ribbon: "silk_burgundy",
  cardPaper: "paper",
  presentation: "dreamy_clouds",
  background: "warm_ivory",
};

/** Presentational choices driven by the vibe ("how it should feel"). */
export const VIBE_LOOKS: Record<string, VibeLook> = {
  soft_sweet: { wrapper: "dusty_rose_wrap", ribbon: "satin_blush", cardPaper: "blush", presentation: "spring_garden", background: "soft_blush" },
  romantic: { wrapper: "cream_paper", ribbon: "silk_burgundy", cardPaper: "ivory", presentation: "candlelight", background: "warm_ivory" },
  happy_bright: { wrapper: "buttercream", ribbon: "satin_champagne", cardPaper: "champagne", presentation: "fairy_lights", background: "cream_linen" },
  calm_elegant: { wrapper: "sage_paper", ribbon: "thin_sage", cardPaper: "sage", presentation: "spring_garden", background: "sage_mist" },
  dreamy: { wrapper: "lavender_wrap", ribbon: "silk_lavender", cardPaper: "slate", presentation: "dreamy_clouds", background: "sage_mist" },
  dark_mysterious: { wrapper: "matte_black_paper", ribbon: "velvet_navy", cardPaper: "slate", presentation: "under_the_moon", background: "charcoal_dusk" },
  cute_playful: { wrapper: "soft_pink_paper", ribbon: "satin_pink", cardPaper: "blush", presentation: "fairy_lights", background: "soft_blush" },
};

export const EMOTION_SIGNATURES: EmotionSignature[] = [
  {
    emotion: "love",
    emoji: "💗",
    name: "Velvet Devotion",
    tagline: "Every petal is a word I never said out loud.",
    flowers: ["rose", "peony", "ranunculus", "tulip", "carnation"],
    foliage: ["eucalyptus"],
    recipients: {
      partner: {
        title: "For My Love",
        message: "I love you — fully, quietly, and a little more every single day.",
        quotes: [
          "Loving you is the easiest thing I have ever done, {name}.",
          "Of all the ways I could spend a lifetime, {name}, it's with you.",
          "I didn't know home until I found it in you, {name}.",
        ],
      },
      best_friend: {
        title: "For My Ride-or-Die",
        message: "I love you {name} — the way we love coffee: loudly, and often.",
        quotes: [
          "The world is lighter with you in it, {name}.",
          "Thank you for being my person, {name}.",
          "You're the family I got to choose, {name}.",
        ],
      },
      family: {
        title: "For the Heart of Our Home",
        message: "You make home feel like the safest place in the world, {name}. I love you.",
        quotes: [
          "Everything good in me started with you, {name}.",
          "Being yours has been my greatest joy, {name}.",
          "No amount of thanks covers a lifetime of love like yours, {name}.",
        ],
      },
      colleague: {
        title: "For a Wonderful Colleague",
        message: "A small token to say I truly enjoy building alongside you, {name}. Thank you.",
        quotes: [
          "Our team is brighter because you're on it, {name}.",
          "Work feels less like work beside someone like you, {name}.",
          "Quietly grateful to learn from you every day, {name}.",
        ],
      },
      classmate: {
        title: "For My Favorite Classmate",
        message: "Class is half the fun when you're in it, {name}. Thanks for being you.",
        quotes: [
          "Some lessons I only learn when you explain them, {name}.",
          "Grateful the front row put us together, {name}.",
          "Thanks for making the hard days easier, {name}.",
        ],
      },
      someone_special: {
        title: "For Someone Lovely",
        message: "Some people just make the ordinary moment extraordinary. That's you, {name}.",
        quotes: [
          "You cross my mind more than you'd ever guess, {name}.",
          "There's a quiet glow about you, {name}.",
          "Consider this a small note for a big presence, {name}.",
        ],
      },
    },
    fallback: {
      title: "For Someone Wonderful",
      message: "A bouquet for you, {name}, and all the light you bring with you.",
      quotes: [
        "Thinking of you and hoping your day is as bright as you are, {name}.",
        "You have a way of making things better just by being there, {name}.",
      ],
    },
  },
  {
    emotion: "miss_you",
    emoji: "🌙",
    name: "Moonlit Longing",
    tagline: "Distance only taught me how much space you take up in my days.",
    flowers: ["rose", "orchid", "lily", "anemone"], // prettier-ignore
    foliage: ["fern"],
    recipients: {
      partner: {
        title: "For the One I Miss",
        message: "I keep waiting to turn a corner and find you there, {name}. Missing you.",
        quotes: [
          "Every quiet hour feels like an hour without you, {name}.",
          "I carry your memory around like it's mine to keep, {name}.",
          "Distance is just time asking me to miss you more, {name}.",
        ],
      },
      best_friend: {
        title: "Missing My Best Friend",
        message: "It's not the same without my person here, {name}. Can't wait to catch up.",
        quotes: [
          "I saved a dozen small stories for you, {name}.",
          "The joke of the day is wasted until I tell you, {name}.",
          "This city got quieter the day you left, {name}.",
        ],
      },
      family: {
        title: "Home Misses You",
        message: "The house feels different without your laugh in it, {name}. Come home soon.",
        quotes: [
          "Your chair at the table feels emptier than it should, {name}.",
          "We talk about you every dinner, {name}.",
          "Hugging you is on the top of my list, {name}.",
        ],
      },
      colleague: {
        title: "Missing You at Work",
        message: "The office is quieter without your smile, {name}. Hope all is well.",
        quotes: [
          "Our meetings lost their sparkle without you, {name}.",
          "Someone keeps asking 'where's {name}?' — it's me, {name}.",
          "Tea alone just isn't the same, {name}.",
        ],
      },
      classmate: {
        title: "The Seat Next to You",
        message: "It's strange sitting here with an empty spot beside me, {name}. Miss you!",
        quotes: [
          "No one to pass notes to these days, {name}.",
          "The back of the class isn't the same, {name}.",
          "Study breaks need you back, {name}.",
        ],
      },
      someone_special: {
        title: "For the One Far Away",
        message: "You're further than I'd like and closer than you know, {name}.",
        quotes: [
          "Thought of you on the way home tonight, {name}.",
          "Some miles are heavier than others, {name}.",
          "You're the best kind of thought to get lost in, {name}.",
        ],
      },
    },
    fallback: {
      title: "Thinking of You",
      message: "A bouquet to fill the space between us, {name}.",
      quotes: [
        "Miss your smile more than you'd guess, {name}.",
        "Hoping this finds you well and soon finds you here, {name}.",
      ],
    },
  },
  {
    emotion: "thank_you",
    emoji: "🌻",
    name: "Golden Gratitude",
    tagline: "Some thanks are too big for a text message.",
    flowers: ["sunflower", "daisy", "tulip", "carnation"],
    foliage: ["eucalyptus"],
    recipients: {
      partner: {
        title: "For Everything You Do",
        message: "Thank you for carrying me through the hard days, {name}. I notice it all.",
        quotes: [
          "You make the ordinary feel easy, {name}.",
          "Grateful doesn't cover it, {name}.",
          "You carried me without me even asking, {name}.",
        ],
      },
      best_friend: {
        title: "For Always Showing Up",
        message: "Thanks for being a call away, a drive away, and always on my side, {name}.",
        quotes: [
          "You've caught me more times than you know, {name}.",
          "There are no words big enough, {name}.",
          "Everyone should have a {name}.",
        ],
      },
      family: {
        title: "Thank You, From the Heart",
        message: "For every meal, every hug, every time you believed in me — thank you, {name}.",
        quotes: [
          "I'm who I am because of you, {name}.",
          "There's no debt sweet enough, {name}.",
          "You gave me roots and wings, {name}.",
        ],
      },
      colleague: {
        title: "Grateful to Work With You",
        message: "Thanks for your patience, your help, and your good humor, {name}. It matters.",
        quotes: [
          "You made a hard week feel manageable, {name}.",
          "The team is lucky to have you, {name}.",
          "Thanks for covering for me — and for the coffee, {name}.",
        ],
      },
      classmate: {
        title: "Thanks, Study Buddy",
        message: "Thanks for the notes, the pep talks, and the study snacks, {name}. You're the best.",
        quotes: [
          "I'd still be lost without your help, {name}.",
          "Thanks for making group projects survivable, {name}.",
          "You're the reason I passed, {name}.",
        ],
      },
      someone_special: {
        title: "A Little Thank You",
        message: "You went out of your way, and I noticed, {name}. Thank you.",
        quotes: [
          "It's rare to meet someone who gives without counting, {name}.",
          "Your kindness didn't go unnoticed, {name}.",
          "Thanks for being exactly who you are, {name}.",
        ],
      },
    },
    fallback: {
      title: "Thank You",
      message: "A heartfelt thank you for everything you've done, {name}.",
      quotes: [
        "Words feel small next to what you did for me, {name}.",
        "I hope this says what I keep meaning to say — thank you, {name}.",
      ],
    },
  },
  {
    emotion: "proud",
    emoji: "🌅",
    name: "Sunrise Pride",
    tagline: "Your light is worth celebrating out loud.",
    flowers: ["sunflower", "dahlia", "zinnia", "rose", "ranunculus"], // prettier-ignore
    foliage: ["fern"],
    recipients: {
      partner: {
        title: "So Proud of You",
        message: "Watching you chase what you love is my favorite thing, {name}. So proud of you.",
        quotes: [
          "You did it, and I knew you would, {name}.",
          "No one deserves this more than you, {name}.",
          "I'm your biggest fan, and I'm bragging, {name}.",
        ],
      },
      best_friend: {
        title: "Celebrating YOU",
        message: "You just did the thing! {name}, I'm so proud to call you my best friend.",
        quotes: [
          "I've always believed in you, {name}.",
          "This is only the beginning, {name}.",
          "To the person who never gives up — {name}!",
        ],
      },
      family: {
        title: "Proud of You, Always",
        message: "You've been proving everyone right all along, {name}. We're all so proud.",
        quotes: [
          "You are the best of us, {name}.",
          "From the first step, I knew you'd go far, {name}.",
          "We couldn't be prouder, {name}.",
        ],
      },
      colleague: {
        title: "Congrats from the Team",
        message: "You crushed it, {name}, and the whole team noticed. So proud of your work.",
        quotes: [
          "The bar you set makes everyone better, {name}.",
          "Well earned, {name}. We knew it was coming.",
          "Your hard work is finally wearing its reward, {name}.",
        ],
      },
      classmate: {
        title: "You Did That!",
        message: "All those late nights paid off, {name}. Really proud of you!",
        quotes: [
          "I saw the work before the grade, {name}.",
          "Your grit is impossible to miss, {name}.",
          "Go celebrate — you earned every bit of it, {name}.",
        ],
      },
      someone_special: {
        title: "Proud of You",
        message: "You've been quietly brilliant, {name}, and it's finally showtime.",
        quotes: [
          "You handle it all with such grace, {name}.",
          "This win is yours, {name}.",
          "Keep going — the world is watching, {name}.",
        ],
      },
    },
    fallback: {
      title: "So Proud of You",
      message: "Just wanted you to know how proud I am of you, {name}.",
      quotes: [
        "You've earned every bit of this, {name}.",
        "This is the start of even bigger things, {name}.",
      ],
    },
  },
  {
    emotion: "birthday",
    emoji: "🎂",
    name: "Birthday Radiance",
    tagline: "Another year of you — and the world is brighter for it.",
    flowers: ["rose", "peony", "dahlia", "ranunculus", "carnation", "zinnia"], // prettier-ignore
    foliage: ["eucalyptus", "babys_breath"],
    recipients: {
      partner: {
        title: "Happy Birthday, My Love",
        message: "Happy birthday {name}. Here's to the one who makes every year feel brand new.",
        quotes: [
          "You are the best thing that ever happened to my calendar, {name}.",
          "Another year of you, and I'm still the lucky one, {name}.",
          "I'd re-live the year with you again and again, {name}.",
        ],
      },
      best_friend: {
        title: "Happy Birthday, Bestie!",
        message: "Happy birthday {name}! Thanks for another year of chaos, laughter, and you.",
        quotes: [
          "We're just getting started, and I'm in, {name}.",
          "Another year of cake and terrible inside jokes, {name}.",
          "You deserve a party as big as your heart, {name}.",
        ],
      },
      family: {
        title: "Happy Birthday, Dear One",
        message: "Happy birthday {name}. Another year, and you still make home the best place to be.",
        quotes: [
          "The candles are brighter when you blow them out, {name}.",
          "We're all blessed by your years, {name}.",
          "Here's to the one who holds us together, {name}.",
        ],
      },
      colleague: {
        title: "Happy Birthday!",
        message: "Happy birthday {name}! Wishing you a year that's as good to you as you are to this team.",
        quotes: [
          "The office is celebrating you today, {name}.",
          "May your cake be sweet and your meetings be short, {name}.",
          "So glad your birthday is a workday, {name} — it means we get to celebrate!",
        ],
      },
      classmate: {
        title: "Happy Birthday!",
        message: "Happy birthday {name}! Here's to a year of great grade, even better plans.",
        quotes: [
          "You're aging like fine notes — sharp and improving, {name}.",
          "Take the day off; I'll steal notes for you, {name}.",
          "Another year closer to that diploma — happy birthday, {name}!",
        ],
      },
      someone_special: {
        title: "Happy Birthday",
        message: "Happy birthday {name}. A beautiful day for a beautiful person.",
        quotes: [
          "The world gains a little more light on your birthday, {name}.",
          "May this year be your softest and brightest yet, {name}.",
          "You were worth waiting for this whole year, {name}.",
        ],
      },
    },
    fallback: {
      title: "Happy Birthday, {name}",
      message: "Wishing you the happiest of birthdays, {name}, and a year as wonderful as you are.",
      quotes: [
        "Another year, another reason to celebrate you, {name}.",
        "May your day be as kind to you as you are to others, {name}.",
      ],
    },
  },
  {
    emotion: "sorry",
    emoji: "🌧️",
    name: "Tender Apology",
    tagline: "I was wrong, and I'm not too proud to say it.",
    flowers: ["rose", "lily", "peony", "orchid", "daisy"], // prettier-ignore
    foliage: ["babys_breath"],
    recipients: {
      partner: {
        title: "Forgive Me",
        message: "I'm sorry, {name}. I love you too much to let my pride get in the way.",
        quotes: [
          "I was wrong, and you deserve better than my stubborn silence, {name}.",
          "You matter more to me than being right, {name}.",
          "Please forgive me — I'm still learning how to love you well, {name}.",
        ],
      },
      best_friend: {
        title: "I'm Sorry, Friend",
        message: "I messed up, {name}. You're too important to lose over this.",
        quotes: [
          "Friends don't let pride win, {name}.",
          "I'm sorry, and I'll do better, {name}.",
          "You mean more than the argument ever did, {name}.",
        ],
      },
      family: {
        title: "Forgive Me, Please",
        message: "I'm sorry, {name}. In a family of stubborn hearts, you still deserve gentler words.",
        quotes: [
          "I said it wrong, and I'm sorry, {name}.",
          "Home should be soft, and I'm sorry I made it sharp, {name}.",
          "You'll always be family, no matter how I stumble, {name}.",
        ],
      },
      colleague: {
        title: "My Apologies",
        message: "I owe you an apology, {name}, and a better version of this conversation next time.",
        quotes: [
          "That was on me, {name}, and I'm sorry.",
          "I appreciate your patience — you deserved better from me, {name}.",
          "Let's reset; I know I can do better by you, {name}.",
        ],
      },
      classmate: {
        title: "Sorry, Buddy",
        message: "I'm sorry about what happened, {name}. You didn't deserve that.",
        quotes: [
          "Let's not let one bad moment mess with a good thing, {name}.",
          "I was out of line, {name}. Sorry.",
          "You're a good friend — I'd hate to lose that, {name}.",
        ],
      },
      someone_special: {
        title: "I'm Sorry",
        message: "I've been thinking about it, {name}, and I want to make this right.",
        quotes: [
          "You deserve my best, and I brought less, {name}.",
          "Sorry for the silence; it wasn't meant as distance, {name}.",
          "I hope these flowers say the words I struggled with, {name}.",
        ],
      },
    },
    fallback: {
      title: "I'm Sorry",
      message: "I'm truly sorry, {name}. I'd like to make things right.",
      quotes: [
        "You deserved better, and I'm sorry, {name}.",
        "I hope these mean a fresh start, {name}.",
      ],
    },
  },
  {
    emotion: "just_because",
    emoji: "✨",
    name: "Wonder & Whimsey",
    tagline: "No reason at all — except that you're you.",
    flowers: ["ranunculus", "anemone", "daisy", "carnation", "tulip", "orchid"], // prettier-ignore
    foliage: ["fern"],
    recipients: {
      partner: {
        title: "Just Because... It's You",
        message: "No occasion, no reason — just my favorite person, {name}.",
        quotes: [
          "I thought of you at the most random moment, {name}.",
          "You don't need a special day for flowers, {name}.",
          "Midweek magic, courtesy of yours truly, {name}.",
        ],
      },
      best_friend: {
        title: "Random Love, Bestie",
        message: "Saw these and thought of my favorite person, {name}. That's it. That's the reason.",
        quotes: [
          "No reason needed when it's you, {name}.",
          "Tuesday wins because you exist, {name}.",
          "Spontaneous flower delivery protocol, {name}.",
        ],
      },
      family: {
        title: "Thinking of You",
        message: "Just a sunny bouquet for a sunny part of my life, {name}.",
        quotes: [
          "Saw something pretty and thought of home — of you, {name}.",
          "You cross my mind on the good days too, {name}.",
          "No reason, just appreciation, {name}.",
        ],
      },
      colleague: {
        title: "A Random Smile",
        message: "A little color for your desk, {name}. No reason at all — just a nice thought.",
        quotes: [
          "Some days just need a flower, {name}.",
          "Consider this a 'team morale' expense, {name}.",
          "A random act of 'you're appreciated', {name}.",
        ],
      },
      classmate: {
        title: "Just Because",
        message: "No homework assignment here, {name} — just a flower for a good classmate.",
        quotes: [
          "Completely unsponsored by exams, {name}.",
          "A pretty thing for a person who makes class better, {name}.",
          "Random kindness quota: filled, {name}.",
        ],
      },
      someone_special: {
        title: "For the Thought of You",
        message: "You crossed my mind and I couldn't not send these, {name}.",
        quotes: [
          "Some people earn spontaneous flowers, {name}.",
          "This has no reason and every reason, {name}.",
          "Just because you're memorable, {name}.",
        ],
      },
    },
    fallback: {
      title: "Just Because",
      message: "A random bouquet for a not-so-random person, {name}.",
      quotes: [
        "Sometimes the best gifts have no holiday, {name}.",
        "You were on my mind, so here, {name}.",
      ],
    },
  },
  {
    emotion: "get_well",
    emoji: "🌼",
    name: "Gentle Healing",
    tagline: "Sending warmth until you're back on your feet.",
    flowers: ["daisy", "sunflower", "tulip", "lily", "ranunculus", "carnation"], // prettier-ignore
    foliage: ["eucalyptus"],
    recipients: {
      partner: {
        title: "Feel Better, My Love",
        message: "Rest up, {name}. You're allowed to rest — I'll keep the whole world soft for you.",
        quotes: [
          "Your only job right now is getting better, {name}.",
          "Sending a hug and a slow day to you, {name}.",
          "I've got everything else — just get well, {name}.",
        ],
      },
      best_friend: {
        title: "Get Well Soon, Bestie",
        message: "Feel better soon, {name}! I already miss your chaos.",
        quotes: [
          "The world is too quiet without you well, {name}.",
          "Save your energy for getting better, {name}.",
          "You've got this, and you've got me, {name}.",
        ],
      },
      family: {
        title: "Healing Wishes",
        message: "Rest, eat well, and let us take care of you, {name}. Feel better soon.",
        quotes: [
          "The house is on 'get well' duty for you, {name}.",
          "Your health comes first — always, {name}.",
          "Sending you every comforting thought, {name}.",
        ],
      },
      colleague: {
        title: "Get Well Soon",
        message: "Take all the time you need, {name}. The team is covering you and missing you.",
        quotes: [
          "Your desk is holding your spot, {name}.",
          "The coffee's better when you're here — get well, {name}.",
          "Meetings are gentler when you're around, {name}.",
        ],
      },
      classmate: {
        title: "Feel Better!",
        message: "Get well soon, {name}! I'll save you the best seat and the good notes.",
        quotes: [
          "Class isn't the same without you, {name}.",
          "Rest up — I've got notes duty, {name}.",
          "Hope this finds you feeling lighter, {name}.",
        ],
      },
      someone_special: {
        title: "Thinking of You",
        message: "Hoping every passing hour feels better than the last, {name}.",
        quotes: [
          "You've been on my mind, {name}. Feel better soon.",
          "The world is brighter when you're well, {name}.",
          "Gentle thoughts and speedy recovery, {name}.",
        ],
      },
    },
    fallback: {
      title: "Get Well Soon",
      message: "Wishing you a quick and gentle recovery, {name}.",
      quotes: [
        "Take care of you, {name}.",
        "Feel better soon — the world misses your light, {name}.",
      ],
    },
  },
];

export interface ResolvedSignatureTheme {
  id: string;
  emotion: string;
  recipientType: string;
  vibe: string;
  emoji: string;
  name: string;
  tagline: string;
  messageTitle: string;
  message: string;
  quotes: string[];
  flowers: string[];
  foliage: string[];
  wrapper: string;
  ribbon: string;
  cardPaper: CardPaper;
  presentation: string;
  background: string;
}

/** Replaces the {name} placeholder with the recipient name (or a friendly default). */
export function fillName(text: string, name?: string): string {
  return text.replaceAll("{name}", name && name.trim() ? name.trim() : "you");
}

function byEmotion(emotion?: string | null): EmotionSignature | undefined {
  return EMOTION_SIGNATURES.find((s) => s.emotion === emotion);
}

/**
 * Resolves the one signature theme carved out of the three up-front choices.
 * Always returns something, even when choices are empty — the generic fallback
 * is a safe, pleasant default rather than a null state.
 */
export function resolveSignatureTheme(opts: {
  emotion?: string | null;
  recipientType?: string | null;
  vibe?: string | null;
  recipientName?: string;
}): ResolvedSignatureTheme {
  const { emotion, recipientType, vibe, recipientName } = opts;
  const signature = byEmotion(emotion) ?? EMOTION_SIGNATURES[0];
  const variant = (recipientType && signature.recipients[recipientType]) || signature.fallback;
  const look = VIBE_LOOKS[vibe ?? ""] ?? DEFAULT_LOOK;

  return {
    id: `${signature.emotion}__${recipientType ?? "any"}__${vibe ?? "any"}`,
    emotion: signature.emotion,
    recipientType: recipientType ?? "any",
    vibe: vibe ?? "any",
    emoji: signature.emoji,
    name: signature.name,
    tagline: signature.tagline,
    messageTitle: fillName(variant.title, recipientName),
    message: fillName(variant.message, recipientName),
    quotes: variant.quotes.map((q) => fillName(q, recipientName)),
    flowers: signature.flowers,
    foliage: signature.foliage,
    wrapper: look.wrapper,
    ribbon: look.ribbon,
    cardPaper: look.cardPaper,
    presentation: look.presentation,
    background: look.background,
  };
}

/** Looks up a signature theme from a persisted id (URL/reveal). Unknown ids resolve to null. */
export function getSignatureThemeById(id?: string | null): ResolvedSignatureTheme | null {
  if (!id) return null;
  const [emotion, recipientType, vibe] = id.split("__");
  if (!emotion || !byEmotion(emotion)) return null;
  return resolveSignatureTheme({ emotion, recipientType: recipientType !== "any" ? recipientType : null, vibe: vibe !== "any" ? vibe : null });
}
