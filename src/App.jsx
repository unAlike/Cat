import { useState, useEffect } from "react";

const wikiImageCache = new Map();

function getFallbackCatImage(title) {
  const normalized = title.replace(/[^a-zA-Z0-9]+/g, ",").replace(/(^,+|,+$)/g, "").toLowerCase();
  return `https://loremflickr.com/400/210/cat,${encodeURIComponent(normalized)}?lock=${encodeURIComponent(title)}`;
}

async function fetchWikiImage(title) {
  if (wikiImageCache.has(title)) return wikiImageCache.get(title);
  let src = "";
  try {
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
    if (res.ok) {
      const data = await res.json();
      src = data?.thumbnail?.source || data?.original?.source || "";
    }
  } catch {
    src = "";
  }
  if (!src) src = getFallbackCatImage(title);
  wikiImageCache.set(title, src);
  return src;
}

// Color palettes per species type for illustrated cards
const CATS = [
  { name:"Abyssinian", species:"Domestic", origin:"Ethiopia", flag:"🇪🇹", colors:["Ruddy","Red","Blue","Fawn"], colorHex:["#8B6343","#C1693A","#9BAFC4","#D2B48C"], traits:["Energetic","Playful","Curious"], coatLength:"Short", imgColor:"#8B6343", markings:"ticked" },
  { name:"American Bobtail", species:"Domestic", origin:"United States", flag:"🇺🇸", colors:["Brown tabby","White","Black","Calico"], colorHex:["#7B5C3E","#F5F5F5","#1C1C1C","#D4826E"], traits:["Intelligent","Affectionate","Adaptable"], coatLength:"Short/Long", imgColor:"#7B5C3E", markings:"tabby" },
  { name:"American Curl", species:"Domestic", origin:"United States", flag:"🇺🇸", colors:["Any color","Tabby","Solid","Bi-color"], colorHex:["#C5936B","#D4B483","#1C1C1C","#FFFFFF"], traits:["Gentle","Sociable","Playful"], coatLength:"Short/Long", imgColor:"#C5936B", markings:"solid" },
  { name:"American Shorthair", species:"Domestic", origin:"United States", flag:"🇺🇸", colors:["Silver tabby","Black","White","Blue","Calico"], colorHex:["#A9A9A9","#1C1C1C","#FFFFFF","#9BAFC4","#D4826E"], traits:["Adaptable","Easygoing","Hardy"], coatLength:"Short", imgColor:"#A9A9A9", markings:"tabby" },
  { name:"Balinese", species:"Domestic", origin:"United States", flag:"🇺🇸", colors:["Seal point","Blue point","Chocolate point","Lilac point"], colorHex:["#3B2314","#9BAFC4","#7B5C3E","#C9B8D5"], traits:["Vocal","Affectionate","Athletic"], coatLength:"Long", imgColor:"#E8D5B7", markings:"point" },
  { name:"Bengal", species:"Hybrid", origin:"United States", flag:"🇺🇸", colors:["Brown spotted","Silver","Snow","Blue"], colorHex:["#8B6914","#C0C0C0","#FFFFF0","#9BAFC4"], traits:["Active","Confident","Curious"], coatLength:"Short", imgColor:"#C9A84C", markings:"spotted" },
  { name:"Birman", species:"Domestic", origin:"France/Burma", flag:"🇫🇷", colors:["Seal point","Blue point","Chocolate point","Lilac point"], colorHex:["#3B2314","#9BAFC4","#7B5C3E","#C9B8D5"], traits:["Gentle","Quiet","Companionable"], coatLength:"Long", imgColor:"#E8D5B7", markings:"point" },
  { name:"Bombay", species:"Domestic", origin:"United States", flag:"🇺🇸", colors:["Black"], colorHex:["#1C1C1C"], traits:["Affectionate","Playful","Bold"], coatLength:"Short", imgColor:"#1C1C1C", markings:"solid" },
  { name:"British Shorthair", species:"Domestic", origin:"United Kingdom", flag:"🇬🇧", colors:["Blue","Black","White","Cream","Tabby","Calico"], colorHex:["#9BAFC4","#1C1C1C","#FFFFFF","#FFFDD0","#C5936B","#D4826E"], traits:["Calm","Independent","Affectionate"], coatLength:"Short", imgColor:"#9BAFC4", markings:"solid" },
  { name:"Burmese", species:"Domestic", origin:"Myanmar", flag:"🇲🇲", colors:["Sable","Champagne","Blue","Platinum"], colorHex:["#3B2314","#E8D5B7","#9BAFC4","#C0C0C0"], traits:["Social","Energetic","Curious"], coatLength:"Short", imgColor:"#5C3A1E", markings:"solid" },
  { name:"Chartreux", species:"Domestic", origin:"France", flag:"🇫🇷", colors:["Blue-gray"], colorHex:["#8A9BA8"], traits:["Quiet","Observant","Loyal"], coatLength:"Short", imgColor:"#8A9BA8", markings:"solid" },
  { name:"Cornish Rex", species:"Domestic", origin:"United Kingdom", flag:"🇬🇧", colors:["Any color","Tabby","Bi-color","Solid"], colorHex:["#C5936B","#1C1C1C","#FFFFFF","#D4B483"], traits:["Playful","Warm-seeking","Sociable"], coatLength:"Short/Curly", imgColor:"#D4B483", markings:"solid" },
  { name:"Devon Rex", species:"Domestic", origin:"United Kingdom", flag:"🇬🇧", colors:["Any color","Tabby","Bi-color","Solid"], colorHex:["#C5936B","#D4B483","#1C1C1C","#FFFFFF"], traits:["Mischievous","Affectionate","Active"], coatLength:"Short/Wavy", imgColor:"#C5936B", markings:"solid" },
  { name:"Egyptian Mau", species:"Domestic", origin:"Egypt", flag:"🇪🇬", colors:["Silver","Bronze","Smoke"], colorHex:["#C0C0C0","#CD7F32","#808080"], traits:["Fast","Loyal","Reserved"], coatLength:"Short", imgColor:"#C0C0C0", markings:"spotted" },
  { name:"Himalayan", species:"Domestic", origin:"United States/UK", flag:"🇺🇸", colors:["Seal point","Blue point","Flame point","Tortie point"], colorHex:["#3B2314","#9BAFC4","#FF7F50","#8B4513"], traits:["Calm","Sweet","Gentle"], coatLength:"Long", imgColor:"#F0E0C8", markings:"point" },
  { name:"Japanese Bobtail", species:"Domestic", origin:"Japan", flag:"🇯🇵", colors:["Mi-ke (calico)","Black","White","Red"], colorHex:["#D4826E","#1C1C1C","#FFFFFF","#C1693A"], traits:["Talkative","Energetic","Friendly"], coatLength:"Short/Long", imgColor:"#FFFFFF", markings:"bicolor" },
  { name:"Korat", species:"Domestic", origin:"Thailand", flag:"🇹🇭", colors:["Blue-gray"], colorHex:["#8A9BA8"], traits:["Loyal","Gentle","Intelligent"], coatLength:"Short", imgColor:"#8A9BA8", markings:"solid" },
  { name:"Maine Coon", species:"Domestic", origin:"United States", flag:"🇺🇸", colors:["Brown tabby","Silver tabby","Black","White","Cream","Red"], colorHex:["#8B6914","#C0C0C0","#1C1C1C","#FFFFFF","#FFFDD0","#C1693A"], traits:["Friendly","Gentle","Intelligent"], coatLength:"Long", imgColor:"#8B6914", markings:"tabby" },
  { name:"Manx", species:"Domestic", origin:"Isle of Man", flag:"🇮🇲", colors:["Any color","Tabby","Solid","Bi-color"], colorHex:["#C5936B","#1C1C1C","#FFFFFF","#D4B483"], traits:["Loyal","Playful","Sociable"], coatLength:"Short/Long", imgColor:"#C5936B", markings:"tabby" },
  { name:"Munchkin", species:"Domestic", origin:"United States", flag:"🇺🇸", colors:["Any color","Tabby","Solid","Bi-color","Calico"], colorHex:["#C5936B","#1C1C1C","#FFFFFF","#D4B483","#D4826E"], traits:["Playful","Energetic","Curious"], coatLength:"Short/Long", imgColor:"#D4826E", markings:"tabby" },
  { name:"Norwegian Forest Cat", species:"Domestic", origin:"Norway", flag:"🇳🇴", colors:["Brown tabby","Black","White","Blue","Cream"], colorHex:["#8B6914","#1C1C1C","#FFFFFF","#9BAFC4","#FFFDD0"], traits:["Independent","Adaptable","Sociable"], coatLength:"Long", imgColor:"#7B5C3E", markings:"tabby" },
  { name:"Ocicat", species:"Domestic", origin:"United States", flag:"🇺🇸", colors:["Tawny","Chocolate","Cinnamon","Blue","Lavender","Silver"], colorHex:["#8B6914","#7B5C3E","#C5936B","#9BAFC4","#C9B8D5","#C0C0C0"], traits:["Confident","Curious","Social"], coatLength:"Short", imgColor:"#C9A84C", markings:"spotted" },
  { name:"Persian", species:"Domestic", origin:"Iran", flag:"🇮🇷", colors:["White","Black","Blue","Cream","Red","Tabby","Calico","Bi-color"], colorHex:["#FFFFFF","#1C1C1C","#9BAFC4","#FFFDD0","#C1693A","#D4B483","#D4826E","#C0C0C0"], traits:["Calm","Affectionate","Quiet"], coatLength:"Long", imgColor:"#F0E0C8", markings:"solid" },
  { name:"Ragdoll", species:"Domestic", origin:"United States", flag:"🇺🇸", colors:["Seal point","Blue point","Chocolate point","Lilac point","Red point","Cream point"], colorHex:["#3B2314","#9BAFC4","#7B5C3E","#C9B8D5","#C1693A","#FFFDD0"], traits:["Docile","Gentle","Affectionate"], coatLength:"Long", imgColor:"#E8D5B7", markings:"point" },
  { name:"Russian Blue", species:"Domestic", origin:"Russia", flag:"🇷🇺", colors:["Blue"], colorHex:["#8A9BA8"], traits:["Gentle","Shy","Loyal"], coatLength:"Short", imgColor:"#8A9BA8", markings:"solid" },
  { name:"Savannah", species:"Hybrid", origin:"United States", flag:"🇺🇸", colors:["Brown spotted tabby","Silver spotted tabby","Black","Black smoke"], colorHex:["#8B6914","#C0C0C0","#1C1C1C","#696969"], traits:["Active","Bold","Curious"], coatLength:"Short", imgColor:"#C9A84C", markings:"spotted" },
  { name:"Scottish Fold", species:"Domestic", origin:"Scotland", flag:"🏴󠁧󠁢󠁳󠁣󠁴󠁿", colors:["Any color","Tabby","Solid","Bi-color","Calico"], colorHex:["#C5936B","#D4B483","#1C1C1C","#FFFFFF","#D4826E"], traits:["Gentle","Adaptable","Sociable"], coatLength:"Short/Long", imgColor:"#D4B483", markings:"tabby" },
  { name:"Siamese", species:"Domestic", origin:"Thailand", flag:"🇹🇭", colors:["Seal point","Blue point","Chocolate point","Lilac point","Flame point"], colorHex:["#3B2314","#9BAFC4","#7B5C3E","#C9B8D5","#FF7F50"], traits:["Vocal","Social","Curious"], coatLength:"Short", imgColor:"#E8D5B7", markings:"point" },
  { name:"Siberian", species:"Domestic", origin:"Russia", flag:"🇷🇺", colors:["Any color","Tabby","Solid","Bi-color","Calico"], colorHex:["#C5936B","#8B6914","#1C1C1C","#FFFFFF","#D4826E"], traits:["Adventurous","Affectionate","Agile"], coatLength:"Long", imgColor:"#8B6914", markings:"tabby" },
  { name:"Singapura", species:"Domestic", origin:"Singapore", flag:"🇸🇬", colors:["Sepia agouti"], colorHex:["#C5936B"], traits:["Curious","Playful","Gentle"], coatLength:"Short", imgColor:"#C5936B", markings:"ticked" },
  { name:"Sphynx", species:"Domestic", origin:"Canada", flag:"🇨🇦", colors:["Any color","Bi-color","Solid","Tabby pattern (skin)"], colorHex:["#E8C49A","#1C1C1C","#FFFFFF","#D4826E"], traits:["Warm","Extroverted","Affectionate"], coatLength:"Hairless", imgColor:"#E8C49A", markings:"hairless" },
  { name:"Tonkinese", species:"Domestic", origin:"Canada", flag:"🇨🇦", colors:["Natural mink","Champagne mink","Blue mink","Platinum mink"], colorHex:["#3B2314","#E8D5B7","#9BAFC4","#C0C0C0"], traits:["Social","Playful","Vocal"], coatLength:"Short", imgColor:"#7B5C3E", markings:"mink" },
  { name:"Toyger", species:"Domestic", origin:"United States", flag:"🇺🇸", colors:["Striped tabby (brown mackerel)"], colorHex:["#C17F3A"], traits:["Intelligent","Sociable","Active"], coatLength:"Short", imgColor:"#C17F3A", markings:"mackerel" },
  { name:"Turkish Angora", species:"Domestic", origin:"Turkey", flag:"🇹🇷", colors:["White","Black","Blue","Red","Cream","Tabby","Bi-color"], colorHex:["#FFFFFF","#1C1C1C","#9BAFC4","#C1693A","#FFFDD0","#D4B483","#C0C0C0"], traits:["Lively","Intelligent","Affectionate"], coatLength:"Long", imgColor:"#FFFFFF", markings:"solid" },
  { name:"Turkish Van", species:"Domestic", origin:"Turkey", flag:"🇹🇷", colors:["Red & white","Cream & white","Black & white","Blue & white"], colorHex:["#C1693A","#FFFFFF","#1C1C1C","#9BAFC4"], traits:["Active","Independent","Loves water"], coatLength:"Long", imgColor:"#FFFFFF", markings:"van" },
  // Wild
  { name:"African Lion", species:"Wild", origin:"Sub-Saharan Africa", flag:"🌍", colors:["Tawny","Sandy gold"], colorHex:["#C5936B","#C9A84C"], traits:["Social (prides)","Apex predator","Majestic"], coatLength:"Short", imgColor:"#C9A84C", markings:"solid" },
  { name:"Amur Leopard", species:"Wild", origin:"Russian Far East", flag:"🇷🇺", colors:["Pale cream with black rosettes"], colorHex:["#F5DEB3"], traits:["Critically endangered","Solitary","Elusive"], coatLength:"Long", imgColor:"#E8D5A0", markings:"rosette" },
  { name:"Black-footed Cat", species:"Wild", origin:"Southern Africa", flag:"🌍", colors:["Tawny with black spots"], colorHex:["#C5936B"], traits:["Smallest African cat","Ferocious hunter","Nocturnal"], coatLength:"Short", imgColor:"#C5936B", markings:"spotted" },
  { name:"Bobcat", species:"Wild", origin:"North America", flag:"🇺🇸", colors:["Brown/tan with spots","Gray"], colorHex:["#C5936B","#9E9E9E"], traits:["Solitary","Territorial","Adaptable"], coatLength:"Short", imgColor:"#C5936B", markings:"spotted" },
  { name:"Canada Lynx", species:"Wild", origin:"Canada/Northern US", flag:"🇨🇦", colors:["Silver-gray","Brown-gray"], colorHex:["#C0C0C0","#9E9E9E"], traits:["Specialist hunter","Snowshoe paws","Solitary"], coatLength:"Long", imgColor:"#B0B8C0", markings:"solid" },
  { name:"Caracal", species:"Wild", origin:"Africa/Middle East/Asia", flag:"🌍", colors:["Golden brown","Reddish brown"], colorHex:["#C9A84C","#C1693A"], traits:["Leaping ability","Ear tufts","Fast"], coatLength:"Short", imgColor:"#C9A84C", markings:"solid" },
  { name:"Cheetah", species:"Wild", origin:"Africa/Iran", flag:"🌍", colors:["Tan with black spots"], colorHex:["#D2B48C"], traits:["Fastest land animal","Diurnal","Vulnerable"], coatLength:"Short", imgColor:"#D2B48C", markings:"spotted" },
  { name:"Clouded Leopard", species:"Wild", origin:"Southeast Asia", flag:"🌏", colors:["Tawny with cloud-shaped spots"], colorHex:["#C5936B"], traits:["Arboreal","Elusive","Vulnerable"], coatLength:"Short/Medium", imgColor:"#C9A070", markings:"cloud" },
  { name:"Cougar", species:"Wild", origin:"Americas", flag:"🌎", colors:["Tawny","Gray","Reddish"], colorHex:["#C5936B","#9E9E9E","#C1693A"], traits:["Adaptable","Solitary","Apex predator"], coatLength:"Short", imgColor:"#C5936B", markings:"solid" },
  { name:"Eurasian Lynx", species:"Wild", origin:"Europe/Asia", flag:"🌍", colors:["Yellow-brown with spots","Gray"], colorHex:["#C9A84C","#9E9E9E"], traits:["Solitary","Territorial","Elusive"], coatLength:"Long", imgColor:"#C9A84C", markings:"spotted" },
  { name:"Iberian Lynx", species:"Wild", origin:"Spain/Portugal", flag:"🇪🇸", colors:["Yellowish-tan with dark spots"], colorHex:["#C9A84C"], traits:["Most endangered felid","Conservation success","Territorial"], coatLength:"Medium", imgColor:"#C9A84C", markings:"spotted" },
  { name:"Jaguar", species:"Wild", origin:"Americas", flag:"🌎", colors:["Yellow/orange with rosettes","Melanistic (black)"], colorHex:["#C9A84C","#1C1C1C"], traits:["Powerful jaw","Apex predator","Swimmer"], coatLength:"Short", imgColor:"#C9A84C", markings:"rosette" },
  { name:"Leopard", species:"Wild", origin:"Africa/Asia", flag:"🌍", colors:["Tawny with rosettes","Melanistic (black)"], colorHex:["#C9A84C","#1C1C1C"], traits:["Elusive","Strongest climber","Adaptable"], coatLength:"Short", imgColor:"#C9A84C", markings:"rosette" },
  { name:"Ocelot", species:"Wild", origin:"Americas", flag:"🌎", colors:["Cream/tan with brown spots and stripes"], colorHex:["#D2B48C"], traits:["Nocturnal","Territorial","Excellent climber"], coatLength:"Short", imgColor:"#D2B48C", markings:"chain" },
  { name:"Pallas's Cat", species:"Wild", origin:"Central/East Asia", flag:"🌏", colors:["Gray with black markings"], colorHex:["#9E9E9E"], traits:["Expressive face","Cold habitat","Solitary"], coatLength:"Long", imgColor:"#A8A090", markings:"banded" },
  { name:"Sand Cat", species:"Wild", origin:"Sahara/Arabian/Asian deserts", flag:"🌍", colors:["Sandy/pale yellow"], colorHex:["#D2B48C"], traits:["Desert specialist","Wide ears","Rare"], coatLength:"Short", imgColor:"#D2B48C", markings:"solid" },
  { name:"Serval", species:"Wild", origin:"Africa", flag:"🌍", colors:["Tawny/golden with black spots"], colorHex:["#C9A84C"], traits:["Long legs","Excellent hearing","Agile"], coatLength:"Short", imgColor:"#C9A84C", markings:"spotted" },
  { name:"Snow Leopard", species:"Wild", origin:"Central/South Asia", flag:"🌏", colors:["White/gray with black rosettes"], colorHex:["#F5F5F5"], traits:["Mountain specialist","Elusive","Vulnerable"], coatLength:"Long/Dense", imgColor:"#E8E8E8", markings:"rosette" },
  { name:"Tiger", species:"Wild", origin:"Asia", flag:"🌏", colors:["Orange with black stripes","White (Bengal)","Golden"], colorHex:["#C1693A","#FFFFFF","#C9A84C"], traits:["Largest felid","Solitary","Endangered"], coatLength:"Short/Long (Amur)", imgColor:"#C1693A", markings:"stripe" },
];

const BADGE = {
  Domestic: { bg:"#f5ddd0", color:"#c8693a" },
  Wild:     { bg:"#b8d4c0", color:"#3d6b50" },
  Hybrid:   { bg:"#e8d4a0", color:"#8b6914" },
};

// Generate a beautiful illustrated SVG for each cat
function CatIllustration({ cat }) {
  const base = cat.imgColor;
  const isDark = parseInt(base.slice(1),16) < 0x888888;
  const shade = isDark ? lighten(base, 40) : darken(base, 30);
  const light = lighten(base, 60);
  const bg1 = lighten(base, 80);
  const bg2 = lighten(base, 70);
  const markColor = isDark ? lighten(base, 60) : darken(base, 50);
  const isWild = cat.species === "Wild";
  const isHairless = cat.markings === "hairless";

  return (
    <svg viewBox="0 0 400 210" xmlns="http://www.w3.org/2000/svg" style={{ width:"100%", height:"100%", display:"block" }}>
      <defs>
        <radialGradient id={`bg-${cat.name.replace(/\s/g,'')}`} cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor={bg1}/>
          <stop offset="100%" stopColor={bg2}/>
        </radialGradient>
        <radialGradient id={`body-${cat.name.replace(/\s/g,'')}`} cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor={light}/>
          <stop offset="100%" stopColor={base}/>
        </radialGradient>
      </defs>

      {/* Background */}
      <rect width="400" height="210" fill={`url(#bg-${cat.name.replace(/\s/g,'')})`}/>

      {/* Decorative circles */}
      <circle cx="340" cy="30" r="50" fill={bg2} opacity="0.5"/>
      <circle cx="60" cy="180" r="40" fill={bg2} opacity="0.4"/>

      {/* Shadow */}
      <ellipse cx="200" cy="198" rx="80" ry="8" fill={darken(bg2,20)} opacity="0.3"/>

      {/* Body */}
      <ellipse cx="200" cy="160" rx={isWild ? 85 : 70} ry={isWild ? 45 : 38} fill={`url(#body-${cat.name.replace(/\s/g,'')})`}/>

      {/* Tail */}
      {cat.markings !== "bobtail" && (
        <path d={isWild
          ? "M285 155 Q340 130 345 100 Q348 80 335 85 Q325 90 322 110 Q315 135 280 148"
          : "M270 152 Q310 135 315 108 Q318 90 308 94 Q300 98 298 115 Q292 135 268 148"}
          fill={shade} strokeWidth="0" opacity="0.9"/>
      )}

      {/* Belly */}
      <ellipse cx="195" cy="168" rx={isWild ? 50 : 42} ry={isWild ? 28 : 24} fill={lighten(base,50)} opacity="0.6"/>

      {/* Legs */}
      <rect x={isWild?"145":"152"} y="185" width={isWild?"22":"18"} height="20" rx="9" fill={shade}/>
      <rect x={isWild?"195":"192"} y="185" width={isWild?"22":"18"} height="20" rx="9" fill={shade}/>
      {/* Back legs hint */}
      <rect x={isWild?"238":"228"} y="188" width={isWild?"18":"16"} height="16" rx="8" fill={base}/>

      {/* Head */}
      <ellipse cx={isWild?"182":"188"} cy={isWild?"105":"108"} rx={isWild?"58":"52"} ry={isWild?"52":"48"} fill={`url(#body-${cat.name.replace(/\s/g,'')})`}/>

      {/* Mane for lion */}
      {cat.name === "African Lion" && (
        <ellipse cx="182" cy="108" rx="72" ry="65" fill="#8B5E3C" opacity="0.5"/>
      )}

      {/* Ears */}
      {cat.name === "Scottish Fold" || cat.name === "American Curl" ? (
        <>
          <ellipse cx={isWild?"142":"148"} cy={isWild?"65":"68"} rx="18" ry="16" fill={base} transform={`rotate(${cat.name==="Scottish Fold"?'15':'-15'},148,68)`}/>
          <ellipse cx={isWild?"222":"228"} cy={isWild?"65":"68"} rx="18" ry="16" fill={base} transform={`rotate(${cat.name==="Scottish Fold"?'-15':'15'},228,68)`}/>
          <ellipse cx={isWild?"142":"148"} cy={isWild?"65":"68"} rx="10" ry="9" fill={lighten(base,30)} transform={`rotate(${cat.name==="Scottish Fold"?'15':'-15'},148,68)`}/>
          <ellipse cx={isWild?"222":"228"} cy={isWild?"65":"68"} rx="10" ry="9" fill={lighten(base,30)} transform={`rotate(${cat.name==="Scottish Fold"?'-15':'15'},228,68)`}/>
        </>
      ) : (
        <>
          {/* Ear tufts for lynx/caracal */}
          {(cat.name.includes("Lynx") || cat.name === "Caracal") && (
            <>
              <polygon points={`${isWild?'138':'144'},${isWild?'63':'66'} ${isWild?'128':'134'},${isWild?'38':'42'} ${isWild?'158':'164'},${isWild?'50':'54'}`} fill={darken(base,20)}/>
              <polygon points={`${isWild?'222':'228'},${isWild?'63':'66'} ${isWild?'212':'218'},${isWild?'38':'42'} ${isWild?'232':'238'},${isWild?'50':'54'}`} fill={darken(base,20)}/>
            </>
          )}
          <polygon points={`${isWild?'136':'142'},${isWild?'68':'72'} ${isWild?'148':'154'},${isWild?'44':'48'} ${isWild?'163':'168'},${isWild?'65':'68'}`} fill={base}/>
          <polygon points={`${isWild?'136':'142'},${isWild?'68':'72'} ${isWild?'148':'154'},${isWild?'50':'54'} ${isWild?'163':'168'},${isWild?'65':'68'}`} fill={lighten(base,30)}/>
          <polygon points={`${isWild?'200':'206'},${isWild?'68':'72'} ${isWild?'214':'220'},${isWild?'44':'48'} ${isWild?'226':'232'},${isWild?'65':'68'}`} fill={base}/>
          <polygon points={`${isWild?'200':'206'},${isWild?'68':'72'} ${isWild?'214':'220'},${isWild?'50':'54'} ${isWild?'226':'232'},${isWild?'65':'68'}`} fill={lighten(base,30)}/>
        </>
      )}

      {/* Markings overlay */}
      {cat.markings === "tabby" || cat.markings === "mackerel" ? (
        <>
          <ellipse cx={isWild?"175":"180"} cy={isWild?"100":"103"} rx="8" ry="14" fill={markColor} opacity="0.25" transform={`rotate(-20,${isWild?175:180},${isWild?100:103})`}/>
          <ellipse cx={isWild?"190":"195"} cy={isWild?"90":"93"} rx="6" ry="10" fill={markColor} opacity="0.2" transform={`rotate(-15,${isWild?190:195},${isWild?90:93})`}/>
          <path d={`M${isWild?158:164} ${isWild?140:143} Q${isWild?175:180} ${isWild?135:138} ${isWild?192:198} ${isWild?140:143}`} stroke={markColor} strokeWidth="2.5" fill="none" opacity="0.3"/>
          <path d={`M${isWild?152:158} ${isWild?150:153} Q${isWild?175:180} ${isWild?145:148} ${isWild?198:204} ${isWild?150:153}`} stroke={markColor} strokeWidth="2" fill="none" opacity="0.25"/>
        </>
      ) : cat.markings === "spotted" ? (
        [[-25,-18],[10,-22],[30,-8],[-10,5],[20,8],[-15,12]].map(([dx,dy],i)=>(
          <ellipse key={i} cx={(isWild?182:188)+dx} cy={(isWild?105:108)+dy} rx="5" ry="4" fill={markColor} opacity="0.3" transform={`rotate(${i*30})`}/>
        ))
      ) : cat.markings === "rosette" ? (
        [[-20,-15],[15,-18],[-5,5],[25,2]].map(([dx,dy],i)=>(
          <g key={i}>
            <circle cx={(isWild?182:188)+dx} cy={(isWild?105:108)+dy} r="8" fill="none" stroke={markColor} strokeWidth="2.5" opacity="0.35"/>
            <circle cx={(isWild?182:188)+dx} cy={(isWild?105:108)+dy} r="3" fill={markColor} opacity="0.2"/>
          </g>
        ))
      ) : cat.markings === "stripe" ? (
        [-24,-12,0,12,24].map((dx,i) =>(
          <line key={i} x1={(isWild?182:188)+dx} y1={(isWild?62:66)} x2={(isWild?182:188)+dx+6} y2={(isWild?148:152)} stroke={markColor} strokeWidth="4.5" opacity="0.3"/>
        ))
      ) : cat.markings === "point" ? (
        <>
          <ellipse cx={isWild?"182":"188"} cy={isWild?"118":"122"} rx="12" ry="8" fill={darken(base,60)} opacity="0.5"/>
          <ellipse cx={isWild?"182":"188"} cy={isWild?"88":"92"} rx="18" ry="14" fill={darken(base,50)} opacity="0.4"/>
        </>
      ) : null}

      {/* Forehead stripe */}
      {(cat.markings === "tabby" || cat.markings === "mackerel") && (
        <>
          <path d={`M${isWild?175:181} ${isWild?70:74} Q${isWild?182:188} ${isWild?62:66} ${isWild?189:195} ${isWild?70:74}`} stroke={markColor} strokeWidth="2" fill="none" opacity="0.3"/>
          <path d={`M${isWild?172:178} ${isWild?76:80} Q${isWild?182:188} ${isWild?68:72} ${isWild?192:198} ${isWild?76:80}`} stroke={markColor} strokeWidth="1.5" fill="none" opacity="0.25"/>
        </>
      )}

      {/* Muzzle */}
      <ellipse cx={isWild?"182":"188"} cy={isWild?"120":"124"} rx={isWild?"24":"20"} ry={isWild?"18":"15"} fill={lighten(base, isHairless?20:55)} opacity={isHairless?0.6:0.8}/>

      {/* Nose */}
      <ellipse cx={isWild?"182":"188"} cy={isWild?"116":"120"} rx="5" ry="4" fill={darken(base,40)} opacity="0.8"/>
      {/* Nostrils */}
      <ellipse cx={isWild?"179":"185"} cy={isWild?"118":"122"} rx="2" ry="1.5" fill={darken(base,60)} opacity="0.5"/>
      <ellipse cx={isWild?"185":"191"} cy={isWild?"118":"122"} rx="2" ry="1.5" fill={darken(base,60)} opacity="0.5"/>

      {/* Mouth */}
      <path d={`M${isWild?182:188} ${isWild?120:124} Q${isWild?176:182} ${isWild?126:130} ${isWild?170:176} ${isWild?124:128}`} stroke={darken(base,50)} strokeWidth="1.5" fill="none" opacity="0.6"/>
      <path d={`M${isWild?182:188} ${isWild?120:124} Q${isWild?188:194} ${isWild?126:130} ${isWild?194:200} ${isWild?124:128}`} stroke={darken(base,50)} strokeWidth="1.5" fill="none" opacity="0.6"/>

      {/* Eyes */}
      <ellipse cx={isWild?"165":"170"} cy={isWild?"100":"103"} rx={isWild?"11":"10"} ry={isWild?"10":"9"} fill={lighten(base,60)} opacity="0.95"/>
      <ellipse cx={isWild?"199":"205"} cy={isWild?"100":"103"} rx={isWild?"11":"10"} ry={isWild?"10":"9"} fill={lighten(base,60)} opacity="0.95"/>
      {/* Pupils */}
      <ellipse cx={isWild?"165":"170"} cy={isWild?"100":"103"} rx="4" ry={isWild?"8":"7"} fill="#1a1008" opacity="0.85"/>
      <ellipse cx={isWild?"199":"205"} cy={isWild?"100":"103"} rx="4" ry={isWild?"8":"7"} fill="#1a1008" opacity="0.85"/>
      {/* Eye shine */}
      <circle cx={isWild?"162":"167"} cy={isWild?"97":"100"} r="2.5" fill="white" opacity="0.9"/>
      <circle cx={isWild?"196":"202"} cy={isWild?"97":"100"} r="2.5" fill="white" opacity="0.9"/>

      {/* Whiskers */}
      {[[-40,-4,-2],[-30,2,-1],[-42,8,1],[40,-4,2],[30,2,1],[42,8,-1]].map(([dx,dy,rot],i)=>(
        <line key={i}
          x1={(isWild?182:188)} y1={(isWild?120:124)}
          x2={(isWild?182:188)+dx} y2={(isWild?120:124)+dy}
          stroke={lighten(base,70)} strokeWidth="1" opacity="0.7"
          transform={`rotate(${rot*3},${isWild?182:188},${isWild?120:124})`}
        />
      ))}

      {/* Species label watermark */}
      <text x="370" y="200" textAnchor="end" fontSize="11" fill={darken(bg2,30)} opacity="0.5" fontFamily="serif" fontStyle="italic">{cat.species}</text>
    </svg>
  );
}

function lighten(hex, amt) {
  const n = parseInt(hex.replace('#',''),16);
  const r = Math.min(255, (n>>16)+amt);
  const g = Math.min(255, ((n>>8)&0xff)+amt);
  const b = Math.min(255, (n&0xff)+amt);
  return `rgb(${r},${g},${b})`;
}
function darken(hex, amt) {
  const n = parseInt(hex.replace('#',''),16);
  const r = Math.max(0, (n>>16)-amt);
  const g = Math.max(0, ((n>>8)&0xff)-amt);
  const b = Math.max(0, (n&0xff)-amt);
  return `rgb(${r},${g},${b})`;
}

const lbl  = { minWidth:64,color:"#5c4a3e",fontWeight:600,fontSize:"0.72rem",textTransform:"uppercase",letterSpacing:".7px",paddingTop:1,flexShrink:0 };
const chip = { fontSize:"0.7rem",padding:"2px 7px",borderRadius:6,background:"#fdf6ec",border:"1px solid rgba(42,31,26,0.11)",color:"#5c4a3e" };
const pill = { fontSize:"0.7rem",padding:"3px 8px",borderRadius:100,background:"#fdf6ec",border:"1px solid rgba(42,31,26,0.11)",color:"#5c4a3e" };
const selStyle = { padding:"9px 30px 9px 12px",border:"1.5px solid rgba(42,31,26,0.13)",borderRadius:10,fontFamily:"inherit",fontSize:"0.88rem",background:"#fdf6ec",color:"#2a1f1a",outline:"none",appearance:"none",backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='7' fill='none'%3E%3Cpath d='M1 1l4.5 4.5L10 1' stroke='%235c4a3e' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,backgroundRepeat:"no-repeat",backgroundPosition:"right 10px center",cursor:"pointer" };

function CatCard({ cat, idx }) {
  const badge = BADGE[cat.species];
  const wikiTitle = cat.wikiTitle || cat.name;
  const [imgSrc, setImgSrc] = useState(() => wikiImageCache.get(wikiTitle) || "");

  useEffect(() => {
    let active = true;
    if (!imgSrc) {
      const cached = wikiImageCache.get(wikiTitle);
      if (cached) {
        setImgSrc(cached);
      } else {
        fetchWikiImage(wikiTitle).then(src => {
          if (active && src) setImgSrc(src);
        });
      }
    }
    return () => { active = false; };
  }, [imgSrc, wikiTitle]);

  return (
    <div
      style={{ background:"#fffaf4",borderRadius:18,border:"1px solid rgba(42,31,26,0.11)",overflow:"hidden",display:"flex",flexDirection:"column",animation:`fadeUp .4s ease ${Math.min(idx*.025,.5)}s both`,transition:"transform .25s,box-shadow .25s" }}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 16px 40px rgba(42,31,26,0.11)";}}
      onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}
    >
      <div style={{ height:210,position:"relative",overflow:"hidden",flexShrink:0 }}>
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={`${cat.name} from Wikipedia`}
            style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
          />
        ) : (
          <CatIllustration cat={cat}/>
        )}
        <div style={{ position:"absolute",top:10,left:10,background:badge.bg,color:badge.color,fontSize:10,fontWeight:700,letterSpacing:1.3,textTransform:"uppercase",padding:"3px 10px",borderRadius:100 }}>{cat.species}</div>
      </div>
      <div style={{ padding:"15px 18px 10px" }}>
        <div style={{ fontFamily:"'Playfair Display',serif",fontSize:"1.15rem",color:"#2a1f1a",lineHeight:1.2 }}>{cat.name}</div>
        <div style={{ marginTop:5,fontSize:"0.82rem",color:"#5c4a3e" }}><span style={{marginRight:4}}>{cat.flag}</span>{cat.origin}</div>
      </div>
      <div style={{ height:1,background:"rgba(42,31,26,0.09)",margin:"0 18px" }}/>
      <div style={{ padding:"11px 18px 16px",display:"flex",flexDirection:"column",gap:9,flex:1 }}>
        <div style={{ display:"flex",gap:8,alignItems:"flex-start",fontSize:"0.85rem" }}>
          <span style={lbl}>Coat</span><span style={{ color:"#2a1f1a",flex:1 }}>{cat.coatLength}</span>
        </div>
        <div style={{ display:"flex",gap:8,alignItems:"flex-start" }}>
          <span style={lbl}>Colors</span>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex",flexWrap:"wrap",gap:4,marginBottom:4 }}>
              {cat.colorHex.slice(0,6).map((hex,j)=>(
                <div key={j} title={cat.colors[j]||""} style={{ width:15,height:15,borderRadius:"50%",background:hex,border:"2px solid rgba(255,255,255,.85)",boxShadow:"0 1px 4px rgba(0,0,0,.15)" }}/>
              ))}
            </div>
            <div style={{ display:"flex",flexWrap:"wrap",gap:3 }}>
              {cat.colors.slice(0,3).map(c=><span key={c} style={chip}>{c}</span>)}
              {cat.colors.length>3&&<span style={chip}>+{cat.colors.length-3}</span>}
            </div>
          </div>
        </div>
        <div style={{ display:"flex",gap:8,alignItems:"flex-start" }}>
          <span style={lbl}>Traits</span>
          <div style={{ display:"flex",flexWrap:"wrap",gap:3,flex:1 }}>
            {cat.traits.map(t=><span key={t} style={pill}>{t}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

function Sel({ label, value, onChange, opts }) {
  return (
    <>
      <span style={{ fontSize:"0.72rem",textTransform:"uppercase",letterSpacing:"1.3px",color:"#5c4a3e",fontWeight:600 }}>{label}</span>
      <select value={value} onChange={e=>onChange(e.target.value)} style={selStyle}>
        {opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}
      </select>
    </>
  );
}

export default function App() {
  const [search,   setSearch]   = useState("");
  const [speciesF, setSpeciesF] = useState("");
  const [originF,  setOriginF]  = useState("");
  const [sortBy,   setSortBy]   = useState("name-asc");

  const origins = [...new Set(CATS.map(c=>c.origin))].sort();
  let list = CATS.filter(c=>{
    const q=search.toLowerCase();
    return(!q||[c.name,c.origin,...c.colors,...c.traits,c.coatLength].some(v=>v.toLowerCase().includes(q)))&&
           (!speciesF||c.species===speciesF)&&(!originF||c.origin===originF);
  });
  list=[...list].sort((a,b)=>{
    if(sortBy==="name-asc")   return a.name.localeCompare(b.name);
    if(sortBy==="name-desc")  return b.name.localeCompare(a.name);
    if(sortBy==="origin-asc") return a.origin.localeCompare(b.origin);
    if(sortBy==="species-asc")return a.species.localeCompare(b.species);
    return 0;
  });

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif",minHeight:"100vh",background:"#fdf6ec",color:"#2a1f1a" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes sway{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:#fdf6ec}::-webkit-scrollbar-thumb{background:#c8a08a;border-radius:3px}
      `}</style>

      <div style={{ background:"#2a1f1a",padding:"52px 40px 40px",textAlign:"center",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse at 20% 50%,rgba(200,105,58,.25),transparent 60%),radial-gradient(ellipse at 80% 30%,rgba(122,158,135,.2),transparent 55%)" }}/>
        <div style={{ position:"relative" }}>
          <div style={{ fontSize:"2rem",letterSpacing:10,opacity:.35,marginBottom:14,display:"inline-block",animation:"sway 4s ease-in-out infinite" }}>🐾 🐾 🐾</div>
          <h1 style={{ fontFamily:"'Playfair Display',serif",fontSize:"clamp(2.2rem,6vw,3.8rem)",color:"#fdf6ec",lineHeight:1.1 }}>
            The <em style={{ color:"#e8956d" }}>Purrfect</em> Encyclopedia
          </h1>
          <p style={{ marginTop:11,color:"rgba(253,246,236,.45)",fontSize:"0.85rem",letterSpacing:"2.5px",textTransform:"uppercase",fontWeight:300 }}>Breeds, species & colors of cats worldwide</p>
          <div style={{ display:"inline-block",marginTop:16,background:"rgba(253,246,236,.07)",border:"1px solid rgba(253,246,236,.16)",color:"#e8d4a0",padding:"5px 18px",borderRadius:100,fontSize:"0.78rem",letterSpacing:"1.4px",textTransform:"uppercase" }}>
            {CATS.length} species & breeds · illustrated
          </div>
        </div>
      </div>

      <div style={{ background:"#fffaf4",borderBottom:"1px solid rgba(42,31,26,0.09)",padding:"16px 28px",display:"flex",flexWrap:"wrap",gap:10,alignItems:"center",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 18px rgba(42,31,26,0.05)" }}>
        <div style={{ position:"relative",flex:1,minWidth:180 }}>
          <svg style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",opacity:.35 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2a1f1a" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search breeds, origins, colors…" style={{ width:"100%",padding:"9px 12px 9px 36px",border:"1.5px solid rgba(42,31,26,0.13)",borderRadius:10,fontFamily:"inherit",fontSize:"0.88rem",background:"#fdf6ec",color:"#2a1f1a",outline:"none" }}/>
        </div>
        <Sel label="Species" value={speciesF} onChange={setSpeciesF} opts={[["","All species"],["Domestic","Domestic"],["Wild","Wild"],["Hybrid","Hybrid"]]}/>
        <Sel label="Origin"  value={originF}  onChange={setOriginF}  opts={[["","All origins"],...origins.map(o=>[o,o])]}/>
        <Sel label="Sort"    value={sortBy}   onChange={setSortBy}   opts={[["name-asc","Name A–Z"],["name-desc","Name Z–A"],["origin-asc","Origin A–Z"],["species-asc","Species"]]}/>
        <span style={{ marginLeft:"auto",fontSize:"0.82rem",color:"#5c4a3e",whiteSpace:"nowrap" }}>{list.length} of {CATS.length} shown</span>
      </div>

      <div style={{ padding:"28px 28px 56px",maxWidth:1400,margin:"0 auto" }}>
        {list.length===0?(
          <div style={{ textAlign:"center",padding:"80px 20px",color:"#5c4a3e" }}>
            <div style={{ fontSize:"3rem",marginBottom:12 }}>🔍</div>
            <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:"1.3rem",marginBottom:8 }}>No cats found</h3>
            <p>Try a different search or filter.</p>
          </div>
        ):(
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:18 }}>
            {list.map((cat,i)=><CatCard key={cat.name} cat={cat} idx={i}/>)}
          </div>
        )}
      </div>

      <footer style={{ textAlign:"center",padding:"22px",color:"#5c4a3e",fontSize:"0.78rem",borderTop:"1px solid rgba(42,31,26,0.09)",opacity:.65 }}>
        🐱 Custom SVG illustrations · Purrfect Encyclopedia 2026
      </footer>
    </div>
  );
}
