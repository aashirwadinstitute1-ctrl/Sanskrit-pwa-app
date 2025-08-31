# generate_sanskrit_db.py
# Python 3 script — generates sanskrit_database_full.json with 100+ nouns and 100+ dhatus
import json
from pathlib import Path

# ---------- 1) Nouns (100+). Add more if needed ----------
nouns = [
 "राम","कृष्ण","सीता","लक्ष्मी","विष्णु","शिव","गणेश","बालक","बालिका","गुरु",
 "शिष्य","माता","पिता","भ्राता","भगिनी","मित्र","मित्रम्","गृह","नगर","ग्राम",
 "देश","नदी","सरिता","पर्वत","वन","पुष्प","फल","आम्रम्","पुस्तक","शाला",
 "विद्यालय","कक्षा","बच्चा","स्त्री","पुरुष","देव","देवी","रात्रि","दिवस","सूर्य",
 "चन्द्र","तारा","अग्नि","जल","वायु","भूमि","माटी","अन्न","भोजन","कमल",
 "मणि","रत्न","रथ","घोडा","द्वार","मार्ग","पत्र","लेख","कथा","गीत",
 "नृत्य","खेल","शब्द","वाक्य","विधान","शक्ति","दर्शन","आश्रम","मंदिर","अधिकार",
 "कर्म","धर्म","शान्ति","प्रेम","स्नेह","हृदय","मन","वृक्ष","बीज","संगीत",
 "वक्ता","आचार्य","शिशु","यात्रा","सप्ताह","मास","वर्ष","उपहार","कुटुम्ब","बाजार",
 "कृषि","शिविर","कला","चित्र","नौका","सेतु","जनक","जननी","नौकर","पालक",
 "विद्यालयम्","प्रभात","रात्रि","नौशेरा","द्वारा","उत्सव","विचार","अनुसन्धान","नीति","रंग"
]

# Manual gender map for many nouns (fallback: heuristic)
manual_genders = {
 "राम":"m","कृष्ण":"m","सीता":"f","लक्ष्मी":"f","विष्णु":"m","शिव":"m","गणेश":"m","बालक":"m","बालिका":"f","गुरु":"m",
 "शिष्य":"m","माता":"f","पिता":"m","भ्राता":"m","भगिनी":"f","मित्र":"m","मित्रम्":"n","गृह":"m","नगर":"n","ग्राम":"n",
 "देश":"m","नदी":"f","सरिता":"f","पर्वत":"m","वन":"n","पुष्प":"n","फल":"n","आम्रम्":"n","पुस्तक":"n","शाला":"f",
 "विद्यालय":"n","कक्षा":"f","बच्चा":"m","स्त्री":"f","पुरुष":"m","देव":"m","देवी":"f","रात्रि":"f","दिवस":"m","सूर्य":"m",
 "चन्द्र":"m","तारा":"f","अग्नि":"f","जल":"n","वायु":"m","भूमि":"f","माटी":"f","अन्न":"n","भोजन":"n","कमल":"n",
 "मणि":"m","रत्न":"n","रथ":"m","घोडा":"m","द्वार":"n","मार्ग":"m","पत्र":"n","लेख":"m","कथा":"f","गीत":"n",
 "नृत्य":"n","खेल":"m","शब्द":"m","वाक्य":"n","विधान":"n","शक्ति":"f","दर्शन":"n","आश्रम":"m","मंदिर":"n","अधिकार":"m",
 "कर्म":"n","धर्म":"m","शान्ति":"f","प्रेम":"n","स्नेह":"m","हृदय":"n","मन":"n","वृक्ष":"m","बीज":"n","संगीत":"n",
 "वक्ता":"m","आचार्य":"m","शिशु":"m","यात्रा":"f","सप्ताह":"m","मास":"m","वर्ष":"m","उपहार":"m","कुटुम्ब":"m","बाजार":"m",
 "कृषि":"f","शिविर":"n","कला":"f","चित्र":"n","नौका":"f","सेतु":"m","जनक":"m","जननी":"f","नौकर":"m","पालक":"m",
 "प्रभात":"m","उत्सव":"m","विचार":"m","अनुसन्धान":"m","नीति":"f","रंग":"m"
}

# ---------- 2) Dhatus (100+) ----------
dhatus = [
 "गम्","आगम्","पठ्","लिख्","खाद्","पिब्","कृ","दा","लभ्","पश्य्",
 "श्रु","शृण्","निद्रा","उपविश्","उत्था","धाव्","उठ्","नृत्","गाय्","वद्",
 "हस्","भू","स्था","चिन्त्","शिक्ष्","रक्ष्","प्राप्","छिद्","पुच्छ्","स्नान्",
 "ध्यान्","यात्","ब्रू","भुङ्","रम्","पञ्च","पाक्","वर्ध्","संचर्","स्पृह्",
 "विवेश्","द्राक्ष्","नम्","धृ","गोष्","प्रवेश्","निवृत्त्","प्रसाद्","विद्","भेष्",
 "जन्","जाप्","जित्","गुण्","विस्मय्","प्रतिष्ठा","स्थाप्","अधिगम्","अभि","समादर्","श्रेयस्",
 "रुच्","राग्","वियोग्","साध्","विनय्","यज्","पूज्","नय्","सेव्","आनन्द्",
 "कल्प्","विकल्प्","छल्","विलास्","सिख्","लज्ज्","रुद्","उपकर्","ग्रह्","आश्रय्",
 "छन्द्","श्रुति","पाठ्","अभ्यास्","प्रयास्","सम्","वृक्ष्","कर्ष्","पक्","सृज्",
 "प्राप्त","लोल्","भक्ष्","तॄ","आह्वय्","नय","चर्","आश्रय","अह्न्"
]

# ---------- 3) Declension & conjugation templates ----------
noun_patterns = {
    "m": {
        "singular": ["ः","म्","ेण","ाय","ात्","स्य","े",""],
        "dual": ["ौ","ौ","ाभ्याम्","ाभ्याम्","ाभ्याम्","योः","योः","ौ"],
        "plural": ["ाः","ान्","ैः","ेभ्यः","ेभ्यः","ाणाम्","ेषु","ाः"]
    },
    "f": {
        "singular": ["ा","ाम्","या","ायै","ायाः","ायाः","ायाम्","े"],
        "dual": ["े","े","ाभ्याम्","ाभ्याम्","ाभ्याम्","योः","योः","े"],
        "plural": ["ाः","ाः","ाभिः","ाभ्यः","ाभ्यः","ानाम्","ासु","ाः"]
    },
    "n": {
        "singular": ["म्","म्","ेन","ाय","ात्","स्य","े","म्"],
        "dual": ["े","े","ाभ्याम्","ाभ्याम्","ाभ्याम्","योः","योः","े"],
        "plural": ["ानि","ानि","ैः","ेभ्यः","ेभ्यः","ानाम्","ेषु","ानि"]
    }
}

vibhaktis = ["prathama","dvitiya","tritiya","chaturthi","panchami","shashthi","saptami","sambodhana"]

# Verb pattern (लट्) — person keys: uttama (1st), madhyama (2nd), prathama (3rd)
verb_pattern = {
    "singular": {"uttama":"ामि","madhyama":"सि","prathama":"ति"},
    "dual": {"uttama":"ावः","madhyama":"थः","prathama":"तः"},
    "plural": {"uttama":"ामः","madhyama":"थ","prathama":"न्ति"}
}

# ---------- 4) helper functions ----------
def stem_from_noun(base):
    b = base
    if b.endswith("ः") or b.endswith("म्") or b.endswith("्"):
        b = b[:-1]
    return b

def stem_from_dhatu(root):
    r = root
    # remove virama if present
    if r.endswith("्"):
        r = r[:-1]
    # also remove trailing 'म्' if present
    if r.endswith("म्"):
        r = r[:-1]
    return r

# ---------- 5) Build database ----------
db = {"shabdaRupa":{}, "dhatuRupa":{}, "dictionary":{}}

# Nouns
for n in nouns:
    g = manual_genders.get(n)
    if not g:
        # heuristic
        if n.endswith("ा") or n.endswith("ी"):
            g = "f"
        elif n.endswith("म्") or n.endswith("म्") or n.endswith("म्"):
            g = "n"
        else:
            g = "m"
    stem = stem_from_noun(n)
    forms = {}
    for vachan, endings in noun_patterns[g].items():
        forms[vachan] = {v: (stem + e) for v,e in zip(vibhaktis, endings)}
    db["shabdaRupa"][n] = {"gender": g, "forms": forms}
    # dictionary minimal
    db["dictionary"][n] = {"pos":"noun", "meaning": {"en": None, "hi": None}, "gender": g}

# Dhatus
meaning_map = {}  # keep empty or add meanings as you like
for root in dhatus:
    stem = stem_from_dhatu(root)
    lakar = {}
    # only generating लट् (present) here; can be extended
    lat_forms = {}
    for vachan, persmap in verb_pattern.items():
        lat_forms[vachan] = {}
        for pers, ending in persmap.items():
            # simple concatenation; linguistic exceptions not handled
            lat_forms[vachan][pers] = stem + ending
    lakar["lat"] = lat_forms
    db["dhatuRupa"][root] = {"meaning": meaning_map.get(root, ""), "lakar": lakar}
    db["dictionary"][root] = {"pos":"verb", "meaning": {"en": meaning_map.get(root, "")}}

# Save JSON
out = Path("sanskrit_database_full.json")
out.write_text(json.dumps(db, ensure_ascii=False, indent=2), encoding='utf-8')
print("Generated:", out.resolve())
