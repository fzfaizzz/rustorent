import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'src', 'data', 'menuData.js');
let data = fs.readFileSync(filePath, 'utf-8');

const imageMap = {
  "hot-sour-soup": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&h=500&fit=crop",
  "manchow-soup": "https://images.unsplash.com/photo-1548943487-a2e4b43b4850?w=500&h=500&fit=crop",
  "sweet-corn-soup": "https://images.unsplash.com/photo-1620315809706-e3d1acae87ee?w=500&h=500&fit=crop",
  "paneer-tikka": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&h=500&fit=crop",
  "veg-manchurian-dry": "https://images.unsplash.com/photo-1555126634-ae3c1ac348a0?w=500&h=500&fit=crop",
  "crispy-corn": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&h=500&fit=crop",
  "spring-roll": "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?w=500&h=500&fit=crop",
  "veg-manchurian-gravy": "https://images.unsplash.com/photo-1555507036-ab1e4006aa07?w=500&h=500&fit=crop",
  "chilli-paneer": "https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=500&h=500&fit=crop",
  "veg-schezwan": "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500&h=500&fit=crop",
  "honey-chilli-potato": "https://images.unsplash.com/photo-1541592102781-efbea0db06ce?w=500&h=500&fit=crop",
  "paneer-butter-masala": "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500&h=500&fit=crop",
  "shahi-paneer": "https://images.unsplash.com/photo-1546833999-b1ff20092ebad?w=500&h=500&fit=crop",
  "kadai-paneer": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&h=500&fit=crop",
  "paneer-do-pyaza": "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=500&h=500&fit=crop",
  "dal-tadka": "https://images.unsplash.com/photo-1582515073490-39981397c445?w=500&h=500&fit=crop",
  "dal-makhani": "https://images.unsplash.com/photo-1546833999-b1ff20092ebad?w=500&h=500&fit=crop",
  "mix-veg-curry": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=500&fit=crop",
  "aloo-gobi": "https://images.unsplash.com/photo-1543826173-70651703c5a4?w=500&h=500&fit=crop",
  "veg-biryani": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&h=500&fit=crop",
  "paneer-biryani": "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&h=500&fit=crop",
  "mushroom-biryani": "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=500&h=500&fit=crop",
  "veg-hakka-noodles": "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=500&h=500&fit=crop",
  "schezwan-noodles": "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&h=500&fit=crop",
  "singapore-noodles": "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500&h=500&fit=crop",
  "veg-fried-rice": "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&h=500&fit=crop",
  "schezwan-fried-rice": "https://images.unsplash.com/photo-1559847844-5315695dadae?w=500&h=500&fit=crop",
  "manchurian-rice": "https://images.unsplash.com/photo-1581075678129-9bcbf738e4a7?w=500&h=500&fit=crop",
  "butter-naan": "https://images.unsplash.com/photo-1626082895617-2c6bafdf6ff6?w=500&h=500&fit=crop",
  "garlic-naan": "https://images.unsplash.com/photo-1605333396914-256163b84cc6?w=500&h=500&fit=crop",
  "tandoori-roti": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&h=500&fit=crop",
  "laccha-paratha": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&h=500&fit=crop",
  "gulab-jamun": "https://images.unsplash.com/photo-1668233367123-5e921dcdfedb?w=500&h=500&fit=crop",
  "rasmalai": "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&h=500&fit=crop",
  "ice-cream-sundae": "https://images.unsplash.com/photo-1553177595-4de2bb0842b9?w=500&h=500&fit=crop",
  "fresh-lime-soda": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&h=500&fit=crop",
  "mango-lassi": "https://images.unsplash.com/photo-1546171753-97d7676e4602?w=500&h=500&fit=crop",
  "cold-coffee": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&h=500&fit=crop",
  "masala-chai": "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=500&h=500&fit=crop"
};

let currentId = null;
const lines = data.split('\n');

for (let i = 0; i < lines.length; i++) {
  // Find id: "some-id",
  const idMatch = lines[i].match(/id:\s*"([^"]+)"/);
  if (idMatch) {
    currentId = idMatch[1];
  }
  
  // Replace image for that id
  if (lines[i].includes('image: "') && currentId && imageMap[currentId]) {
    lines[i] = lines[i].replace(/image:\s*".*?"/, `image: "${imageMap[currentId]}"`);
  }
}

fs.writeFileSync(filePath, lines.join('\n'));
console.log("Unique images assigned successfully!");
