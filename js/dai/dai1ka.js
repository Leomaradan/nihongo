var sources;

if (sources === undefined) {
    sources = {};
}

sources.dai1ka = {};

sources.dai1ka.kotoba = [
    {
        id: "dai1ka.1",
        furansugo: 'Je',
        roumaji: 'watashi',
        kana: 'わたし',
        kanji: '私'
    },
    {
        id: "dai1ka.2",
        furansugo: 'Tu',
        roumaji: 'anata',
        kana: 'あなた'
    },
    {
        id: "dai1ka.3",
        furansugo: 'Cette personne',
        roumaji: 'anohito',
        kana: 'あのひと',
        kanji: 'あの人'
    },
    {
        id: "dai1ka.4",
        furansugo: 'Nous',
        roumaji: 'watashitachi',
        kana: 'わたしたち'
    },
    {
        id: "dai1ka.5",
        furansugo: '(Vous) tous',
        roumaji: 'minasan',
        kana: 'みなさん',
        kanji: '皆さん'
    },
    {
        id: "dai1ka.6",
        furansugo: 'Suffix pour M., Mme, Mlle',
        roumaji: '~san',
        kana: '~さん',
        kanji: '~さん'
    },
    {
        id: "dai1ka.7",
        furansugo: 'Suffix pour un enfant',
        roumaji: '~chan',
        kana: '~ちゃん',
        kanji: ''
    },
    {
        id: "dai1ka.8",
        furansugo: 'Suffix pour un garçon',
        roumaji: '~kun',
        kana: '~くん',
        kanji: ''
    },
    {
        id: "dai1ka.9",
        furansugo: 'Suffix pour un nom de pays',
        roumaji: '~jin',
        kana: '~じん',
        kanji: ''
    },
    {   
        id: "dai1ka.10",
        furansugo: 'Professeur (autre personne)',
        roumaji: 'sensei',
        kana: 'せんせい',
        kanji: ''
    },
    {
        id: "dai1ka.11",
        furansugo: 'Professeur (sois-même)',
        roumaji: 'kyôshi',
        kana: 'きょうし',
        kanji: ''
    },
    {
        id: "dai1ka.12",
        furansugo: 'Étudiant',
        roumaji: 'gakusei',
        kana: 'がくせい',
        kanji: ''
    },
    {
        id: "dai1ka.13",
        furansugo: 'Employé d\'une compagnie',
        roumaji: 'kaishain',
        kana: 'かいしゃいん',
        kanji: '会社員'
    },
    {
        id: "dai1ka.14",
        furansugo: 'Employé de ~',
        roumaji: '~shain',
        kana: 'しゃいん',
        kanji: '社員'
    },
    {
        id: "dai1ka.15",
        furansugo: 'Employé de banque',
        roumaji: 'ginkôin',
        kana: 'ぎんこういん',
        kanji: '銀行員'
    },
    {
        id: "dai1ka.16",
        furansugo: 'Médecin, docteur',
        roumaji: 'isha',
        kana: 'いしゃ',
        kanji: ''
    },
    {
        id: "dai1ka.17",
        furansugo: 'Chercheur',
        roumaji: 'kenkyûsha',
        kana: 'けんきゅうしゃ',
        kanji: '研究者'
    },
    {
        id: "dai1ka.18",
        furansugo: 'Ingénieur',
        roumaji: 'enjinia',
        kana: 'エンジニア',
        kanji: 'エンジニア'
    },
    {
        id: "dai1ka.19",
        furansugo: 'Université',
        roumaji: 'daigaku',
        kana: 'だいがく',
        kanji: ''
    },
    {
        id: "dai1ka.20",
        furansugo: 'Hôpital',
        roumaji: 'byôin',
        kana: 'びょういん',
        kanji: ''
    },
    {
        id: "dai1ka.21",
        furansugo: 'Électricité, lampe, lumière',
        roumaji: 'denki',
        kana: 'でんき',
        kanji: ''
    },
    {
        id: "dai1ka.22",
        furansugo: 'Qui (forme simple)',
        roumaji: 'dare',
        kana: 'だれ',
        kanji: ''
    },
    {
        id: "dai1ka.23",
        furansugo: 'Qui (forme polie)',
        roumaji: 'donata',
        kana: 'どなた',
        kanji: ''
    },
    {
        id: "dai1ka.24",
        furansugo: 'Suffix pour l\'age',
        roumaji: '~sai',
        kana: '~さい',
        kanji: ''
    },
    {
        id: "dai1ka.25",
        furansugo: 'Quel âge (forme simple)',
        roumaji: 'nansai',
        kana: 'なんさい',
        kanji: ''
    },
    {
        id: "dai1ka.26",
        furansugo: 'Quel âge (forme polie)',
        roumaji: 'oikutsu',
        kana: 'おいくつ',
        kanji: ''
    },
    {
        id: "dai1ka.27",
        furansugo: 'Oui',
        roumaji: 'hai',
        kana: 'はい',
        kanji: ''
    },
    {
        id: "dai1ka.28",
        furansugo: 'Non',
        roumaji: 'îe',
        kana: 'いいえ',
        kanji: ''
    }
];

sources.dai1ka.bun = [
/*,
    {
        furansugo: 'Excusez-moi, mais / Pardon',
        roumaji: '',
        kana: '',
        kanji: ''
    },
    {
        furansugo: 'Comment vous appelez-vous ?',
        roumaji: '',
        kana: '',
        kanji: ''
    },
    {
        furansugo: 'Enchanté (de vous connaitre)',
        roumaji: '',
        kana: '',
        kanji: ''
    },
    {
        furansugo: 'Très heureux de faire votre connaissance',
        roumaji: '',
        kana: '',
        kanji: ''
    },
    {
        furansugo: 'C\'est M./Mme/Mlle ~',
        roumaji: '',
        kana: '',
        kanji: ''
    },
    {
        furansugo: 'Je viens (suis venu) de ~',
        roumaji: '',
        kana: '',
        kanji: ''
    }*/
];

sources.dai1ka.zatta = [];