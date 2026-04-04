import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'src', 'data', 'menuData.js');
let data = fs.readFileSync(filePath, 'utf-8');

const imageMap = {
  "Veg Soup": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&h=500&fit=crop",
  "Veg Starters": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&h=500&fit=crop",
  "Chinese": "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?w=500&h=500&fit=crop",
  "Paneer Special": "https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=500&h=500&fit=crop",
  "Indian Main Course": "https://images.unsplash.com/photo-1546833999-b1ff20092ebad?w=500&h=500&fit=crop",
  "Biryani": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&h=500&fit=crop",
  "Noodles": "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=500&h=500&fit=crop",
  "Fried Rice": "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&h=500&fit=crop",
  "Indian Bread": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&h=500&fit=crop",
  "Desserts": "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&h=500&fit=crop",
  "Soft Drinks": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&h=500&fit=crop"
};

let currentCategory = "";
const lines = data.split('\n');
for (let i = 0; i < lines.length; i++) {
  const catMatch = lines[i].match(/category:\s*"([^"]+)"/);
  if (catMatch) {
    currentCategory = catMatch[1];
  }
  
  if (lines[i].includes('image: "/images/')) {
     if (imageMap[currentCategory]) {
        lines[i] = lines[i].replace(/image:\s*".*?"/, `image: "${imageMap[currentCategory]}"`);
     }
  }
}

fs.writeFileSync(filePath, lines.join('\n'));
console.log("Images updated successfully!");
