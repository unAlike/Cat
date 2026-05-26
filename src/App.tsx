import { useState, useEffect, useRef, useCallback } from "react";

const CATS = [
  // ── DOMESTIC BREEDS ──────────────────────────────────────────────
  { name:"Abyssinian", wikiTitle:"Abyssinian cat", species:"Domestic", origin:"Ethiopia", flag:"🇪🇹", colors:["Ruddy","Red","Blue","Fawn"], colorHex:["#8B6343","#C1693A","#9BAFC4","#D2B48C"], traits:["Energetic","Playful","Curious"], coatLength:"Short" },
  { name:"American Bobtail", wikiTitle:"American Bobtail", species:"Domestic", origin:"United States", flag:"🇺🇸", colors:["Brown tabby","White","Black","Calico"], colorHex:["#7B5C3E","#F5F5F5","#1C1C1C","#D4826E"], traits:["Intelligent","Affectionate","Adaptable"], coatLength:"Short/Long" },
  { name:"American Curl", wikiTitle:"American Curl", species:"Domestic", origin:"United States", flag:"🇺🇸", colors:["Any color","Tabby","Solid","Bi-color"], colorHex:["#C5936B","#D4B483","#1C1C1C","#FFFFFF"], traits:["Gentle","Sociable","Playful"], coatLength:"Short/Long" },
  { name:"American Shorthair", wikiTitle:"American Shorthair", species:"Domestic", origin:"United States", flag:"🇺🇸", colors:["Silver tabby","Black","White","Blue","Calico"], colorHex:["#A9A9A9","#1C1C1C","#FFFFFF","#9BAFC4","#D4826E"], traits:["Adaptable","Easygoing","Hardy"], coatLength:"Short" },
  { name:"Balinese", wikiTitle:"Balinese cat", species:"Domestic", origin:"United States", flag:"🇺🇸", colors:["Seal point","Blue point","Chocolate point","Lilac point"], colorHex:["#3B2314","#9BAFC4","#7B5C3E","#C9B8D5"], traits:["Vocal","Affectionate","Athletic"], coatLength:"Long" },
  { name:"Bengal", wikiTitle:"Bengal cat", species:"Hybrid", origin:"United States", flag:"🇺🇸", colors:["Brown spotted","Silver","Snow","Blue"], colorHex:["#8B6914","#C0C0C0","#FFFFF0","#9BAFC4"], traits:["Active","Confident","Curious"], coatLength:"Short" },
  { name:"Birman", wikiTitle:"Birman", species:"Domestic", origin:"France/Burma", flag:"🇫🇷", colors:["Seal point","Blue point","Chocolate point","Lilac point"], colorHex:["#3B2314","#9BAFC4","#7B5C3E","#C9B8D5"], traits:["Gentle","Quiet","Companionable"], coatLength:"Long" },
  { name:"Bombay", wikiTitle:"Bombay cat", species:"Domestic", origin:"United States", flag:"🇺🇸", colors:["Black"], colorHex:["#1C1C1C"], traits:["Affectionate","Playful","Bold"], coatLength:"Short" },
  { name:"British Shorthair", wikiTitle:"British Shorthair", species:"Domestic", origin:"United Kingdom", flag:"🇬🇧", colors:["Blue","Black","White","Cream","Tabby","Calico"], colorHex:["#9BAFC4","#1C1C1C","#FFFFFF","#FFFDD0","#C5936B","#D4826E"], traits:["Calm","Independent","Affectionate"], coatLength:"Short" },
  { name:"Burmese", wikiTitle:"Burmese cat", species:"Domestic", origin:"Myanmar", flag:"🇲🇲", colors:["Sable","Champagne","Blue","Platinum"], colorHex:["#3B2314","#E8D5B7","#9BAFC4","#C0C0C0"], traits:["Social","Energetic","Curious"], coatLength:"Short" },
  { name:"Burmilla", wikiTitle:"Burmilla", species:"Hybrid", origin:"United Kingdom", flag:"🇬🇧", colors:["Silver shaded","Silver tipped","Golden"], colorHex:["#C0C0C0","#E8E8E8","#C9A84C"], traits:["Gentle","Sociable","Playful"], coatLength:"Short/Long" },
  { name:"Chartreux", wikiTitle:"Chartreux", species:"Domestic", origin:"France", flag:"🇫🇷", colors:["Blue-gray"], colorHex:["#8A9BA8"], traits:["Quiet","Observant","Loyal"], coatLength:"Short" },
  { name:"Chausie", wikiTitle:"Chausie", species:"Hybrid", origin:"United States", flag:"🇺🇸", colors:["Black","Brown ticked tabby","Silver-tipped"], colorHex:["#1C1C1C","#8B6914","#C0C0C0"], traits:["Active","Bold","Social"], coatLength:"Short" },
  { name:"Cornish Rex", wikiTitle:"Cornish Rex", species:"Domestic", origin:"United Kingdom", flag:"🇬🇧", colors:["Any color","Tabby","Bi-color","Solid"], colorHex:["#C5936B","#1C1C1C","#FFFFFF","#D4B483"], traits:["Playful","Warm-seeking","Sociable"], coatLength:"Short/Curly" },
  { name:"Devon Rex", wikiTitle:"Devon Rex", species:"Domestic", origin:"United Kingdom", flag:"🇬🇧", colors:["Any color","Tabby","Bi-color","Solid"], colorHex:["#C5936B","#D4B483","#1C1C1C","#FFFFFF"], traits:["Mischievous","Affectionate","Active"], coatLength:"Short/Wavy" },
  { name:"Egyptian Mau", wikiTitle:"Egyptian Mau", species:"Domestic", origin:"Egypt", flag:"🇪🇬", colors:["Silver","Bronze","Smoke"], colorHex:["#C0C0C0","#CD7F32","#808080"], traits:["Fast","Loyal","Reserved"], coatLength:"Short" },
  { name:"Himalayan", wikiTitle:"Himalayan cat", species:"Domestic", origin:"United States/UK", flag:"🇺🇸", colors:["Seal point","Blue point","Flame point","Tortie point"], colorHex:["#3B2314","#9BAFC4","#FF7F50","#8B4513"], traits:["Calm","Sweet","Gentle"], coatLength:"Long" },
  { name:"Japanese Bobtail", wikiTitle:"Japanese Bobtail", species:"Domestic", origin:"Japan", flag:"🇯🇵", colors:["Mi-ke (calico)","Black","White","Red"], colorHex:["#D4826E","#1C1C1C","#FFFFFF","#C1693A"], traits:["Talkative","Energetic","Friendly"], coatLength:"Short/Long" },
  { name:"Khao Manee", wikiTitle:"Khao Manee", species:"Domestic", origin:"Thailand", flag:"🇹🇭", colors:["White"], colorHex:["#FFFFFF"], traits:["Curious","Sociable","Playful"], coatLength:"Short" },
  { name:"Korat", wikiTitle:"Korat", species:"Domestic", origin:"Thailand", flag:"🇹🇭", colors:["Blue-gray"], colorHex:["#8A9BA8"], traits:["Loyal","Gentle","Intelligent"], coatLength:"Short" },
  { name:"LaPerm", wikiTitle:"LaPerm", species:"Domestic", origin:"United States", flag:"🇺🇸", colors:["Any color","Tabby","Solid","Bi-color"], colorHex:["#C5936B","#1C1C1C","#FFFFFF","#D4B483"], traits:["Affectionate","Curious","Active"], coatLength:"Curly" },
  { name:"Lykoi", wikiTitle:"Lykoi", species:"Domestic", origin:"United States", flag:"🇺🇸", colors:["Roan (black & white)"], colorHex:["#696969"], traits:["Loyal","Playful","Dog-like"], coatLength:"Sparse" },
  { name:"Maine Coon", wikiTitle:"Maine Coon", species:"Domestic", origin:"United States", flag:"🇺🇸", colors:["Brown tabby","Silver tabby","Black","White","Cream","Red"], colorHex:["#8B6914","#C0C0C0","#1C1C1C","#FFFFFF","#FFFDD0","#C1693A"], traits:["Friendly","Gentle","Intelligent"], coatLength:"Long" },
  { name:"Manx", wikiTitle:"Manx cat", species:"Domestic", origin:"Isle of Man", flag:"🇮🇲", colors:["Any color","Tabby","Solid","Bi-color"], colorHex:["#C5936B","#1C1C1C","#FFFFFF","#D4B483"], traits:["Loyal","Playful","Sociable"], coatLength:"Short/Long" },
  { name:"Munchkin", wikiTitle:"Munchkin cat", species:"Domestic", origin:"United States", flag:"🇺🇸", colors:["Any color","Tabby","Solid","Bi-color","Calico"], colorHex:["#C5936B","#1C1C1C","#FFFFFF","#D4B483","#D4826E"], traits:["Playful","Energetic","Curious"], coatLength:"Short/Long" },
  { name:"Nebelung", wikiTitle:"Nebelung", species:"Domestic", origin:"United States", flag:"🇺🇸", colors:["Blue"], colorHex:["#9BAFC4"], traits:["Reserved","Gentle","Loyal"], coatLength:"Long" },
  { name:"Norwegian Forest Cat", wikiTitle:"Norwegian Forest Cat", species:"Domestic", origin:"Norway", flag:"🇳🇴", colors:["Brown tabby","Black","White","Blue","Cream"], colorHex:["#8B6914","#1C1C1C","#FFFFFF","#9BAFC4","#FFFDD0"], traits:["Independent","Adaptable","Sociable"], coatLength:"Long" },
  { name:"Ocicat", wikiTitle:"Ocicat", species:"Domestic", origin:"United States", flag:"🇺🇸", colors:["Tawny","Chocolate","Cinnamon","Blue","Lavender","Silver"], colorHex:["#8B6914","#7B5C3E","#C5936B","#9BAFC4","#C9B8D5","#C0C0C0"], traits:["Confident","Curious","Social"], coatLength:"Short" },
  { name:"Oriental Shorthair", wikiTitle:"Oriental Shorthair", species:"Domestic", origin:"United Kingdom", flag:"🇬🇧", colors:["Ebony","White","Blue","Chestnut","Cinnamon","Tabby"], colorHex:["#1C1C1C","#FFFFFF","#9BAFC4","#7B5C3E","#C5936B","#D4B483"], traits:["Vocal","Affectionate","Playful"], coatLength:"Short" },
  { name:"Persian", wikiTitle:"Persian cat", species:"Domestic", origin:"Iran", flag:"🇮🇷", colors:["White","Black","Blue","Cream","Red","Tabby","Calico","Bi-color"], colorHex:["#FFFFFF","#1C1C1C","#9BAFC4","#FFFDD0","#C1693A","#D4B483","#D4826E","#C0C0C0"], traits:["Calm","Affectionate","Quiet"], coatLength:"Long" },
  { name:"Pixiebob", wikiTitle:"Pixiebob", species:"Domestic", origin:"United States", flag:"🇺🇸", colors:["Brown spotted tabby"], colorHex:["#8B6914"], traits:["Dog-like","Loyal","Active"], coatLength:"Short/Long" },
  { name:"Ragdoll", wikiTitle:"Ragdoll", species:"Domestic", origin:"United States", flag:"🇺🇸", colors:["Seal point","Blue point","Chocolate point","Lilac point","Red point","Cream point"], colorHex:["#3B2314","#9BAFC4","#7B5C3E","#C9B8D5","#C1693A","#FFFDD0"], traits:["Docile","Gentle","Affectionate"], coatLength:"Long" },
  { name:"Russian Blue", wikiTitle:"Russian Blue", species:"Domestic", origin:"Russia", flag:"🇷🇺", colors:["Blue"], colorHex:["#8A9BA8"], traits:["Gentle","Shy","Loyal"], coatLength:"Short" },
  { name:"Savannah", wikiTitle:"Savannah cat", species:"Hybrid", origin:"United States", flag:"🇺🇸", colors:["Brown spotted tabby","Silver spotted tabby","Black","Black smoke"], colorHex:["#8B6914","#C0C0C0","#1C1C1C","#696969"], traits:["Active","Bold","Curious"], coatLength:"Short" },
  { name:"Scottish Fold", wikiTitle:"Scottish Fold", species:"Domestic", origin:"Scotland", flag:"🏴󠁧󠁢󠁳󠁣󠁴󠁿", colors:["Any color","Tabby","Solid","Bi-color","Calico"], colorHex:["#C5936B","#D4B483","#1C1C1C","#FFFFFF","#D4826E"], traits:["Gentle","Adaptable","Sociable"], coatLength:"Short/Long" },
  { name:"Selkirk Rex", wikiTitle:"Selkirk Rex", species:"Domestic", origin:"United States", flag:"🇺🇸", colors:["Any color","Tabby","Solid","Bi-color"], colorHex:["#C5936B","#1C1C1C","#FFFFFF","#D4B483"], traits:["Patient","Affectionate","Playful"], coatLength:"Curly" },
  { name:"Siamese", wikiTitle:"Siamese cat", species:"Domestic", origin:"Thailand", flag:"🇹🇭", colors:["Seal point","Blue point","Chocolate point","Lilac point","Flame point"], colorHex:["#3B2314","#9BAFC4","#7B5C3E","#C9B8D5","#FF7F50"], traits:["Vocal","Social","Curious"], coatLength:"Short" },
  { name:"Siberian", wikiTitle:"Siberian cat", species:"Domestic", origin:"Russia", flag:"🇷🇺", colors:["Any color","Tabby","Solid","Bi-color","Calico"], colorHex:["#C5936B","#8B6914","#1C1C1C","#FFFFFF","#D4826E"], traits:["Adventurous","Affectionate","Agile"], coatLength:"Long" },
  { name:"Singapura", wikiTitle:"Singapura cat", species:"Domestic", origin:"Singapore", flag:"🇸🇬", colors:["Sepia agouti"], colorHex:["#C5936B"], traits:["Curious","Playful","Gentle"], coatLength:"Short" },
  { name:"Snowshoe", wikiTitle:"Snowshoe cat", species:"Domestic", origin:"United States", flag:"🇺🇸", colors:["Seal point","Blue point"], colorHex:["#3B2314","#9BAFC4"], traits:["Sociable","Intelligent","Vocal"], coatLength:"Short" },
  { name:"Sokoke", wikiTitle:"Sokoke", species:"Domestic", origin:"Kenya", flag:"🇰🇪", colors:["Modified classic tabby"], colorHex:["#8B6914"], traits:["Active","Intelligent","Dog-like"], coatLength:"Short" },
  { name:"Somali", wikiTitle:"Somali cat", species:"Domestic", origin:"United States/Canada", flag:"🇺🇸", colors:["Ruddy","Red","Blue","Fawn"], colorHex:["#8B6343","#C1693A","#9BAFC4","#D2B48C"], traits:["Playful","Energetic","Curious"], coatLength:"Long" },
  { name:"Sphynx", wikiTitle:"Sphynx cat", species:"Domestic", origin:"Canada", flag:"🇨🇦", colors:["Any color","Bi-color","Solid","Tabby pattern (skin)"], colorHex:["#E8C49A","#1C1C1C","#FFFFFF","#D4826E"], traits:["Warm","Extroverted","Affectionate"], coatLength:"Hairless" },
  { name:"Thai Cat", wikiTitle:"Thai cat", species:"Domestic", origin:"Thailand", flag:"🇹🇭", colors:["Seal point","Blue point","Chocolate point","Lilac point"], colorHex:["#3B2314","#9BAFC4","#7B5C3E","#C9B8D5"], traits:["Vocal","Curious","Friendly"], coatLength:"Short" },
  { name:"Tonkinese", wikiTitle:"Tonkinese cat", species:"Domestic", origin:"Canada", flag:"🇨🇦", colors:["Natural mink","Champagne mink","Blue mink","Platinum mink"], colorHex:["#3B2314","#E8D5B7","#9BAFC4","#C0C0C0"], traits:["Social","Playful","Vocal"], coatLength:"Short" },
  { name:"Toyger", wikiTitle:"Toyger", species:"Domestic", origin:"United States", flag:"🇺🇸", colors:["Striped tabby (brown mackerel)"], colorHex:["#C17F3A"], traits:["Intelligent","Sociable","Active"], coatLength:"Short" },
  { name:"Turkish Angora", wikiTitle:"Turkish Angora", species:"Domestic", origin:"Turkey", flag:"🇹🇷", colors:["White","Black","Blue","Red","Cream","Tabby","Bi-color"], colorHex:["#FFFFFF","#1C1C1C","#9BAFC4","#C1693A","#FFFDD0","#D4B483","#C0C0C0"], traits:["Lively","Intelligent","Affectionate"], coatLength:"Long" },
  { name:"Turkish Van", wikiTitle:"Turkish Van", species:"Domestic", origin:"Turkey", flag:"🇹🇷", colors:["Red & white","Cream & white","Black & white","Blue & white"], colorHex:["#C1693A","#FFFFFF","#1C1C1C","#9BAFC4"], traits:["Active","Independent","Loves water"], coatLength:"Long" },
  { name:"Ukrainian Levkoy", wikiTitle:"Ukrainian Levkoy", species:"Domestic", origin:"Ukraine", flag:"🇺🇦", colors:["Any color"], colorHex:["#E8C49A"], traits:["Sociable","Gentle","Playful"], coatLength:"Hairless" },
  // ── WILD SPECIES ─────────────────────────────────────────────────
  { name:"African Lion", wikiTitle:"Lion", species:"Wild", origin:"Sub-Saharan Africa", flag:"🌍", colors:["Tawny","Sandy gold"], colorHex:["#C5936B","#C9A84C"], traits:["Social (prides)","Apex predator","Majestic"], coatLength:"Short" },
  { name:"African Wildcat", wikiTitle:"African wildcat", species:"Wild", origin:"Africa/Middle East", flag:"🌍", colors:["Sandy gray","Striped tabby"], colorHex:["#B8AA8A","#8B6914"], traits:["Solitary","Nocturnal","Adaptable"], coatLength:"Short" },
  { name:"Amur Leopard", wikiTitle:"Amur leopard", species:"Wild", origin:"Russian Far East", flag:"🇷🇺", colors:["Pale cream with black rosettes"], colorHex:["#F5DEB3"], traits:["Critically endangered","Solitary","Elusive"], coatLength:"Long" },
  { name:"Andean Mountain Cat", wikiTitle:"Andean cat", species:"Wild", origin:"South America", flag:"🌎", colors:["Gray with brown spots/stripes"], colorHex:["#9E9E9E"], traits:["Elusive","Endangered","High-altitude"], coatLength:"Long" },
  { name:"Black-footed Cat", wikiTitle:"Black-footed cat", species:"Wild", origin:"Southern Africa", flag:"🌍", colors:["Tawny with black spots"], colorHex:["#C5936B"], traits:["Smallest African cat","Ferocious hunter","Nocturnal"], coatLength:"Short" },
  { name:"Bobcat", wikiTitle:"Bobcat", species:"Wild", origin:"North America", flag:"🇺🇸", colors:["Brown/tan with spots","Gray"], colorHex:["#C5936B","#9E9E9E"], traits:["Solitary","Territorial","Adaptable"], coatLength:"Short" },
  { name:"Canada Lynx", wikiTitle:"Canada lynx", species:"Wild", origin:"Canada/Northern US", flag:"🇨🇦", colors:["Silver-gray","Brown-gray"], colorHex:["#C0C0C0","#9E9E9E"], traits:["Specialist hunter","Snowshoe paws","Solitary"], coatLength:"Long" },
  { name:"Caracal", wikiTitle:"Caracal", species:"Wild", origin:"Africa/Middle East/Asia", flag:"🌍", colors:["Golden brown","Reddish brown"], colorHex:["#C9A84C","#C1693A"], traits:["Leaping ability","Ear tufts","Fast"], coatLength:"Short" },
  { name:"Cheetah", wikiTitle:"Cheetah", species:"Wild", origin:"Africa/Iran", flag:"🌍", colors:["Tan with black spots"], colorHex:["#D2B48C"], traits:["Fastest land animal","Diurnal","Vulnerable"], coatLength:"Short" },
  { name:"Clouded Leopard", wikiTitle:"Clouded leopard", species:"Wild", origin:"Southeast Asia", flag:"🌏", colors:["Tawny with cloud-shaped spots"], colorHex:["#C5936B"], traits:["Arboreal","Elusive","Vulnerable"], coatLength:"Short/Medium" },
  { name:"Cougar", wikiTitle:"Cougar", species:"Wild", origin:"Americas", flag:"🌎", colors:["Tawny","Gray","Reddish"], colorHex:["#C5936B","#9E9E9E","#C1693A"], traits:["Adaptable","Solitary","Apex predator"], coatLength:"Short" },
  { name:"Eurasian Lynx", wikiTitle:"Eurasian lynx", species:"Wild", origin:"Europe/Asia", flag:"🌍", colors:["Yellow-brown with spots","Gray"], colorHex:["#C9A84C","#9E9E9E"], traits:["Solitary","Territorial","Elusive"], coatLength:"Long" },
  { name:"Fishing Cat", wikiTitle:"Fishing cat", species:"Wild", origin:"South/Southeast Asia", flag:"🌏", colors:["Grayish brown with spots"], colorHex:["#9E9E9E"], traits:["Aquatic","Endangered","Nocturnal"], coatLength:"Short" },
  { name:"Flat-headed Cat", wikiTitle:"Flat-headed cat", species:"Wild", origin:"Southeast Asia", flag:"🌏", colors:["Dark brown with pale underside"], colorHex:["#6B5344"], traits:["Semi-aquatic","Endangered","Rare"], coatLength:"Short" },
  { name:"Geoffroy's Cat", wikiTitle:"Geoffroy's cat", species:"Wild", origin:"South America", flag:"🌎", colors:["Yellowish-brown with black spots"], colorHex:["#C9A84C"], traits:["Excellent swimmer","Nocturnal","Small"], coatLength:"Short" },
  { name:"Iberian Lynx", wikiTitle:"Iberian lynx", species:"Wild", origin:"Spain/Portugal", flag:"🇪🇸", colors:["Yellowish-tan with dark spots"], colorHex:["#C9A84C"], traits:["Most endangered felid","Conservation success","Territorial"], coatLength:"Medium" },
  { name:"Jaguar", wikiTitle:"Jaguar", species:"Wild", origin:"Americas", flag:"🌎", colors:["Yellow/orange with rosettes","Melanistic (black)"], colorHex:["#C9A84C","#1C1C1C"], traits:["Powerful jaw","Apex predator","Swimmer"], coatLength:"Short" },
  { name:"Jungle Cat", wikiTitle:"Jungle cat", species:"Wild", origin:"Middle East/Asia", flag:"🌏", colors:["Gray-brown","Sandy","Rufous"], colorHex:["#B8AA8A","#D2B48C","#C1693A"], traits:["Semi-aquatic","Bold","Adaptable"], coatLength:"Short" },
  { name:"Leopard", wikiTitle:"Leopard", species:"Wild", origin:"Africa/Asia", flag:"🌍", colors:["Tawny with rosettes","Melanistic (black)"], colorHex:["#C9A84C","#1C1C1C"], traits:["Elusive","Strongest climber","Adaptable"], coatLength:"Short" },
  { name:"Leopard Cat", wikiTitle:"Leopard cat", species:"Wild", origin:"Asia", flag:"🌏", colors:["Tawny with black spots"], colorHex:["#C9A84C"], traits:["Widespread","Solitary","Nocturnal"], coatLength:"Short" },
  { name:"Marbled Cat", wikiTitle:"Marbled cat", species:"Wild", origin:"Southeast Asia", flag:"🌏", colors:["Brown/gray with marbled pattern"], colorHex:["#9E9E9E"], traits:["Arboreal","Vulnerable","Elusive"], coatLength:"Short" },
  { name:"Ocelot", wikiTitle:"Ocelot", species:"Wild", origin:"Americas", flag:"🌎", colors:["Cream/tan with brown spots and stripes"], colorHex:["#D2B48C"], traits:["Nocturnal","Territorial","Excellent climber"], coatLength:"Short" },
  { name:"Pallas's Cat", wikiTitle:"Pallas's cat", species:"Wild", origin:"Central/East Asia", flag:"🌏", colors:["Gray with black markings"], colorHex:["#9E9E9E"], traits:["Expressive face","Cold habitat","Solitary"], coatLength:"Long" },
  { name:"Rusty-spotted Cat", wikiTitle:"Rusty-spotted cat", species:"Wild", origin:"India/Sri Lanka", flag:"🇮🇳", colors:["Grayish with rusty spots"], colorHex:["#C5936B"], traits:["Smallest wild cat","Arboreal","Elusive"], coatLength:"Short" },
  { name:"Sand Cat", wikiTitle:"Sand cat", species:"Wild", origin:"Sahara/Arabian/Asian deserts", flag:"🌍", colors:["Sandy/pale yellow"], colorHex:["#D2B48C"], traits:["Desert specialist","Wide ears","Rare"], coatLength:"Short" },
  { name:"Serval", wikiTitle:"Serval", species:"Wild", origin:"Africa", flag:"🌍", colors:["Tawny/golden with black spots"], colorHex:["#C9A84C"], traits:["Long legs","Excellent hearing","Agile"], coatLength:"Short" },
  { name:"Snow Leopard", wikiTitle:"Snow leopard", species:"Wild", origin:"Central/South Asia", flag:"🌏", colors:["White/gray with black rosettes"], colorHex:["#F5F5F5"], traits:["Mountain specialist","Elusive","Vulnerable"], coatLength:"Long/Dense" },
  { name:"Tiger", wikiTitle:"Tiger", species:"Wild", origin:"Asia", flag:"🌏", colors:["Orange with black stripes","White (Bengal)","Golden"], colorHex:["#C1693A","#FFFFFF","#C9A84C"], traits:["Largest felid","Solitary","Endangered"], coatLength:"Short/Long (Amur)" },
];

const imageCache = {};

async function fetchWikiImage(title) {
  if (imageCache[title]) return imageCache[title];
  try {
    const encoded = encodeURIComponent(title.replace(/ /g, "_"));
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("not ok");
    const data = await res.json();
    const src = data?.originalimage?.source || data?.thumbnail?.source || null;
    imageCache[title] = src;
    return src;
  } catch {
    imageCache[title] = null;
    return null;
  }
}

function speciesClass(s) {
  if (s === "Wild") return { bg: "#b8d4c0", color: "#3d6b50" };
  if (s === "Hybrid") return { bg: "#e8d4a0", color: "#8b6914" };
  return { bg: "#f5ddd0", color: "#c8693a" };
}

function CatCard({ cat, idx }) {
  const [img, setImg] = useState(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchWikiImage(cat.wikiTitle).then(src => {
      if (!cancelled) setImg(src);
    });
    return () => { cancelled = true; };
  }, [cat.wikiTitle]);

  const badge = speciesClass(cat.species);

  return (
    <div style={{
      background: "#fffaf4",
      borderRadius: 18,
      border: "1px solid rgba(42,31,26,0.12)",
      overflow: "hidden",
      transition: "transform 0.25s, box-shadow 0.25s",
      animation: `fadeUp 0.4s ease ${Math.min(idx * 0.03, 0.6)}s both`,
      display: "flex",
      flexDirection: "column",
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(42,31,26,0.12)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
    >
      {/* Photo */}
      <div style={{ position: "relative", height: 200, background: "#f0e8de", overflow: "hidden", flexShrink: 0 }}>
        {img && !imgError ? (
          <>
            {!imgLoaded && (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 32, height: 32, border: "3px solid rgba(200,105,58,0.25)", borderTopColor: "#c8693a", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              </div>
            )}
            <img
              src={img}
              alt={cat.name}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              style={{
                width: "100%", height: "100%", objectFit: "cover",
                display: imgLoaded ? "block" : "none",
                transition: "opacity 0.3s",
              }}
            />
          </>
        ) : img === null && (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#8b7b70" }}>
            <span style={{ fontSize: 44 }}>{cat.species === "Wild" ? "🐆" : "🐱"}</span>
            <span style={{ fontSize: 11, marginTop: 6, opacity: 0.6 }}>No image available</span>
          </div>
        )}
        {img === undefined && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 32, height: 32, border: "3px solid rgba(200,105,58,0.25)", borderTopColor: "#c8693a", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          </div>
        )}
        {/* species badge overlay */}
        <div style={{
          position: "absolute", top: 10, left: 10,
          background: badge.bg, color: badge.color,
          fontSize: 11, fontWeight: 600, letterSpacing: 1.2,
          textTransform: "uppercase", padding: "3px 10px",
          borderRadius: 100, backdropFilter: "blur(4px)",
        }}>{cat.species}</div>
      </div>

      {/* Header */}
      <div style={{ padding: "16px 20px 12px" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.18rem", color: "#2a1f1a", lineHeight: 1.2 }}>{cat.name}</div>
        <div style={{ marginTop: 6, fontSize: "0.83rem", color: "#5c4a3e" }}>
          <span style={{ marginRight: 4 }}>{cat.flag}</span>{cat.origin}
        </div>
      </div>

      <div style={{ height: 1, background: "rgba(42,31,26,0.10)", margin: "0 20px" }} />

      {/* Body */}
      <div style={{ padding: "13px 20px 18px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>

        <Row label="Coat">{cat.coatLength}</Row>

        <div style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: "0.86rem" }}>
          <span style={labelStyle}>Colors</span>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 5 }}>
              {cat.colorHex.slice(0, 6).map((hex, j) => (
                <div key={j} title={cat.colors[j] || ""} style={{
                  width: 16, height: 16, borderRadius: "50%", background: hex,
                  border: "2px solid rgba(255,255,255,0.85)",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
                }} />
              ))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {cat.colors.slice(0, 3).map(col => (
                <span key={col} style={{ fontSize: "0.73rem", padding: "2px 7px", borderRadius: 6, background: "#fdf6ec", border: "1px solid rgba(42,31,26,0.12)", color: "#5c4a3e" }}>{col}</span>
              ))}
              {cat.colors.length > 3 && <span style={{ fontSize: "0.73rem", padding: "2px 7px", borderRadius: 6, background: "#fdf6ec", border: "1px solid rgba(42,31,26,0.12)", color: "#5c4a3e" }}>+{cat.colors.length - 3}</span>}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: "0.86rem" }}>
          <span style={labelStyle}>Traits</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, flex: 1 }}>
            {cat.traits.map(t => (
              <span key={t} style={{ fontSize: "0.73rem", padding: "3px 9px", borderRadius: 100, background: "#fdf6ec", border: "1px solid rgba(42,31,26,0.12)", color: "#5c4a3e" }}>{t}</span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

const labelStyle = { minWidth: 72, color: "#5c4a3e", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.7px", paddingTop: 1, flexShrink: 0 };

function Row({ label, children }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: "0.86rem" }}>
      <span style={labelStyle}>{label}</span>
      <span style={{ color: "#2a1f1a", flex: 1 }}>{children}</span>
    </div>
  );
}

export default function CatEncyclopedia() {
  const [search, setSearch] = useState("");
  const [speciesF, setSpeciesF] = useState("");
  const [originF, setOriginF] = useState("");
  const [sort, setSort] = useState("name-asc");

  const origins = [...new Set(CATS.map(c => c.origin))].sort();

  let filtered = CATS.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || [c.name, c.origin, ...c.colors, ...c.traits, c.coatLength].some(v => v.toLowerCase().includes(q));
    const matchSpecies = !speciesF || c.species === speciesF;
    const matchOrigin = !originF || c.origin === originF;
    return matchSearch && matchSpecies && matchOrigin;
  });

  filtered = [...filtered].sort((a, b) => {
    if (sort === "name-asc") return a.name.localeCompare(b.name);
    if (sort === "name-desc") return b.name.localeCompare(a.name);
    if (sort === "origin-asc") return a.origin.localeCompare(b.origin);
    if (sort === "species-asc") return a.species.localeCompare(b.species);
    return 0;
  });

  const selStyle = { padding: "9px 32px 9px 12px", border: "1.5px solid rgba(42,31,26,0.14)", borderRadius: 10, fontFamily: "inherit", fontSize: "0.88rem", background: "#fdf6ec", color: "#2a1f1a", outline: "none", appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%235c4a3e' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", cursor: "pointer" };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", background: "#fdf6ec", color: "#2a1f1a" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        @keyframes spin { to { transform:rotate(360deg) } }
        @keyframes sway { 0%,100%{transform:rotate(-3deg)} 50%{transform:rotate(3deg)} }
        * { box-sizing: border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:6px } ::-webkit-scrollbar-track { background:#fdf6ec } ::-webkit-scrollbar-thumb { background:#c8a08a; border-radius:3px }
      `}</style>

      {/* HERO */}
      <div style={{ background: "#2a1f1a", padding: "56px 40px 44px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 20% 50%, rgba(200,105,58,0.25) 0%, transparent 60%), radial-gradient(ellipse at 80% 30%, rgba(122,158,135,0.2) 0%, transparent 55%)" }} />
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: "2rem", letterSpacing: 10, opacity: 0.4, marginBottom: 16, display: "inline-block", animation: "sway 4s ease-in-out infinite" }}>🐾 🐾 🐾</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.2rem, 6vw, 4rem)", color: "#fdf6ec", lineHeight: 1.1 }}>
            The <em style={{ color: "#e8956d" }}>Purrfect</em> Encyclopedia
          </h1>
          <p style={{ marginTop: 12, color: "rgba(253,246,236,0.5)", fontSize: "0.9rem", letterSpacing: "2.5px", textTransform: "uppercase", fontWeight: 300 }}>Breeds, species & colors of cats worldwide</p>
          <div style={{ display: "inline-block", marginTop: 18, background: "rgba(253,246,236,0.08)", border: "1px solid rgba(253,246,236,0.18)", color: "#e8d4a0", padding: "6px 20px", borderRadius: 100, fontSize: "0.8rem", letterSpacing: "1.5px", textTransform: "uppercase" }}>
            {CATS.length} species & breeds · Wikipedia photos
          </div>
        </div>
      </div>

      {/* CONTROLS */}
      <div style={{ background: "#fffaf4", borderBottom: "1px solid rgba(42,31,26,0.10)", padding: "18px 32px", display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 20px rgba(42,31,26,0.06)" }}>
        {/* Search */}
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <svg style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", opacity: 0.4 }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2a1f1a" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search breeds, origins, colors…" style={{ width: "100%", padding: "9px 12px 9px 38px", border: "1.5px solid rgba(42,31,26,0.14)", borderRadius: 10, fontFamily: "inherit", fontSize: "0.9rem", background: "#fdf6ec", color: "#2a1f1a", outline: "none" }} />
        </div>

        <span style={{ fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "1.4px", color: "#5c4a3e", fontWeight: 600 }}>Species</span>
        <select value={speciesF} onChange={e => setSpeciesF(e.target.value)} style={selStyle}>
          <option value="">All species</option>
          <option value="Domestic">Domestic</option>
          <option value="Wild">Wild</option>
          <option value="Hybrid">Hybrid</option>
        </select>

        <span style={{ fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "1.4px", color: "#5c4a3e", fontWeight: 600 }}>Origin</span>
        <select value={originF} onChange={e => setOriginF(e.target.value)} style={selStyle}>
          <option value="">All origins</option>
          {origins.map(o => <option key={o} value={o}>{o}</option>)}
        </select>

        <span style={{ fontSize: "0.74rem", textTransform: "uppercase", letterSpacing: "1.4px", color: "#5c4a3e", fontWeight: 600 }}>Sort</span>
        <select value={sort} onChange={e => setSort(e.target.value)} style={selStyle}>
          <option value="name-asc">Name A–Z</option>
          <option value="name-desc">Name Z–A</option>
          <option value="origin-asc">Origin A–Z</option>
          <option value="species-asc">Species</option>
        </select>

        <span style={{ marginLeft: "auto", fontSize: "0.82rem", color: "#5c4a3e", whiteSpace: "nowrap" }}>{filtered.length} of {CATS.length} shown</span>
      </div>

      {/* GRID */}
      <div style={{ padding: "32px 32px 60px", maxWidth: 1400, margin: "0 auto" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "#5c4a3e" }}>
            <div style={{ fontSize: "3rem", marginBottom: 12 }}>🔍</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", marginBottom: 8 }}>No cats found</h3>
            <p>Try a different search term or filter.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 20 }}>
            {filtered.map((cat, i) => <CatCard key={cat.name} cat={cat} idx={i} />)}
          </div>
        )}
      </div>

      <footer style={{ textAlign: "center", padding: "24px", color: "#5c4a3e", fontSize: "0.8rem", borderTop: "1px solid rgba(42,31,26,0.10)", opacity: 0.7 }}>
        🐱 Photos via Wikipedia · Purrfect Encyclopedia 2026
      </footer>
    </div>
  );
}
