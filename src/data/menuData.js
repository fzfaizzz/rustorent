// Full Menu Data for D VEG WOK with E-Commerce enhancements
// Added unique IDs, descriptions, ingredients, and preparation time

export const menu = [
  {
    category: "Veg Soup",
    items: [
      { 
        id: "hot-sour-soup",
        name: "Hot & Sour Soup", 
        price: 120, 
        image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&h=500&fit=crop", 
        rating: 4.5,
        description: "A spicy and tangy Chinese-style soup made with mixed vegetables, soy sauce, and a hint of vinegar. A perfect appetizer to kickstart your meal.",
        ingredients: ["Carrots", "Cabbage", "Mushrooms", "Soy Sauce", "Vinegar", "White Pepper", "Spring Onions"],
        prepTime: 15,
        isVeg: true
      },
      { 
        id: "manchow-soup",
        name: "Manchow Soup", 
        price: 130, 
        image: "https://images.unsplash.com/photo-1548943487-a2e4b43b4850?w=500&h=500&fit=crop", 
        rating: 4.6,
        description: "A popular Indo-Chinese dark brown soup loaded with finely chopped vegetables and topped with crispy fried noodles.",
        ingredients: ["Mixed Veggies", "Garlic", "Ginger", "Soy Sauce", "Crispy Noodles", "Coriander"],
        prepTime: 15,
        isVeg: true
      },
      { 
        id: "sweet-corn-soup",
        name: "Sweet Corn Soup", 
        price: 110, 
        image: "https://images.unsplash.com/photo-1620315809706-e3d1acae87ee?w=500&h=500&fit=crop", 
        rating: 4.4,
        description: "A comforting, thick and creamy soup made with sweet corn kernels and mild spices. Perfect for a light starter.",
        ingredients: ["Sweet Corn", "Carrots", "Vegetable Broth", "Corn Flour", "White Pepper"],
        prepTime: 12,
        isVeg: true
      },
    ]
  },
  {
    category: "Veg Starters",
    items: [
      { 
        id: "paneer-tikka",
        name: "Paneer Tikka", 
        price: 220, 
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&h=500&fit=crop", 
        rating: 4.9,
        description: "Soft cubes of paneer marinated in a spiced yogurt mixture and grilled to perfection in a traditional tandoor, served with mint chutney.",
        ingredients: ["Cottage Cheese (Paneer)", "Yogurt", "Gram Flour", "Tandoori Masala", "Bell Peppers", "Onions"],
        prepTime: 25,
        isVeg: true
      },
      { 
        id: "veg-manchurian-dry",
        name: "Veg Manchurian Dry", 
        price: 180, 
        image: "https://images.unsplash.com/photo-1555126634-ae3c1ac348a0?w=500&h=500&fit=crop", 
        rating: 4.7,
        description: "Deep-fried vegetable dumplings tossed in a savory, sweet, tangy, and spicy Indo-Chinese sauce.",
        ingredients: ["Cabbage", "Carrots", "Capsicum", "Soy Sauce", "Ginger", "Garlic", "Chilli Sauce"],
        prepTime: 20,
        isVeg: true
      },
      { 
        id: "crispy-corn",
        name: "Crispy Corn", 
        price: 160, 
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&h=500&fit=crop", 
        rating: 4.5,
        description: "Sweet corn kernels coated with a seasoned batter, deep-fried until golden and crispy, then tossed with spices.",
        ingredients: ["Sweet Corn", "Corn Flour", "Rice Flour", "Black Pepper", "Chaat Masala", "Lemon Juice"],
        prepTime: 15,
        isVeg: true
      },
      { 
        id: "spring-roll",
        name: "Spring Roll", 
        price: 150, 
        image: "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?w=500&h=500&fit=crop", 
        rating: 4.6,
        description: "Crispy, golden-fried wrappers filled with a savory mixture of stir-fried vegetables and noodles.",
        ingredients: ["Spring Roll Wrappers", "Cabbage", "Carrots", "Noodles", "Soy Sauce", "Black Pepper"],
        prepTime: 20,
        isVeg: true
      },
    ]
  },
  {
    category: "Chinese",
    items: [
      { 
        id: "veg-manchurian-gravy",
        name: "Veg Manchurian Gravy", 
        price: 190, 
        image: "https://images.unsplash.com/photo-1555507036-ab1e4006aa07?w=500&h=500&fit=crop", 
        rating: 4.8,
        description: "Vegetable dumplings cooked in a rich, dark, spicy, and tangy soy-based gravy. Best enjoyed with fried rice or noodles.",
        ingredients: ["Mixed Veggies", "Soy Sauce", "Vinegar", "Chilli Sauce", "Corn Starch", "Garlic"],
        prepTime: 25,
        isVeg: true
      },
      { 
        id: "chilli-paneer",
        name: "Chilli Paneer", 
        price: 230, 
        image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc0?w=500&h=500&fit=crop", 
        rating: 4.7,
        description: "Crispy fried paneer cubes tossed in a spicy, sweet, and tangy sauce with colorful bell peppers and spring onions.",
        ingredients: ["Paneer", "Capsicum", "Onions", "Soy Sauce", "Green Chillies", "Tomato Ketchup"],
        prepTime: 20,
        isVeg: true
      },
      { 
        id: "veg-schezwan",
        name: "Veg Schezwan", 
        price: 200, 
        image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500&h=500&fit=crop", 
        rating: 4.5,
        description: "Mixed vegetables stir-fried in a fiery and flavorful homemade Schezwan sauce.",
        ingredients: ["Mixed Veggies", "Dry Red Chillies", "Garlic", "Sichuan Peppercorns", "Vinegar"],
        prepTime: 20,
        isVeg: true
      },
      { 
        id: "honey-chilli-potato",
        name: "Honey Chilli Potato", 
        price: 180, 
        image: "https://images.unsplash.com/photo-1541592102781-efbea0db06ce?w=500&h=500&fit=crop", 
        rating: 4.6,
        description: "Crispy potato wedges tossed in a sweet, spicy, and sticky honey chilli glaze, garnished with toasted sesame seeds.",
        ingredients: ["Potatoes", "Honey", "Soy Sauce", "Chilli Flakes", "Sesame Seeds", "Garlic"],
        prepTime: 25,
        isVeg: true
      },
    ]
  },
  {
    category: "Paneer Special",
    items: [
      { 
        id: "paneer-butter-masala",
        name: "Paneer Butter Masala", 
        price: 250, 
        image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=500&h=500&fit=crop", 
        rating: 4.9,
        description: "A rich and creamy North Indian curry made with soft paneer cubes cooked in a luscious tomato, butter, and cashew sauce.",
        ingredients: ["Paneer", "Tomatoes", "Cashews", "Butter", "Cream", "Garam Masala", "Kasuri Methi"],
        prepTime: 30,
        isVeg: true
      },
      { 
        id: "shahi-paneer",
        name: "Shahi Paneer", 
        price: 240, 
        image: "https://images.unsplash.com/photo-1546833999-b1ff20092ebad?w=500&h=500&fit=crop", 
        rating: 4.8,
        description: "A royal Mughal dish where paneer is cooked in a rich, white gravy made from cashews, cream, and aromatic spices.",
        ingredients: ["Paneer", "Cashews", "Almonds", "Cream", "Cardamom", "Saffron", "White Pepper"],
        prepTime: 30,
        isVeg: true
      },
      { 
        id: "kadai-paneer",
        name: "Kadai Paneer", 
        price: 230, 
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&h=500&fit=crop", 
        rating: 4.7,
        description: "A spicy, flavorful dish made by cooking paneer and bell peppers in a freshly ground coriander and dry red chilli spice mix.",
        ingredients: ["Paneer", "Capsicum", "Onions", "Tomatoes", "Coriander Seeds", "Dry Red Chillies"],
        prepTime: 25,
        isVeg: true
      },
      { 
        id: "paneer-do-pyaza",
        name: "Paneer Do Pyaza", 
        price: 235, 
        image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=500&h=500&fit=crop", 
        rating: 4.6,
        description: "A rich, hearty curry made with paneer and a double amount of onions, cooked in a spiced tomato gravy.",
        ingredients: ["Paneer", "Lots of Onions", "Tomatoes", "Ginger", "Garlic", "Indian Spices"],
        prepTime: 25,
        isVeg: true
      },
    ]
  },
  {
    category: "Indian Main Course",
    items: [
      { 
        id: "dal-tadka",
        name: "Dal Tadka", 
        price: 160, 
        image: "https://images.unsplash.com/photo-1582515073490-39981397c445?w=500&h=500&fit=crop", 
        rating: 4.7,
        description: "A comforting dish of smoothly cooked yellow lentils tempered with ghee, cumin seeds, garlic, and dry red chillies.",
        ingredients: ["Toor Dal", "Moong Dal", "Ghee", "Cumin", "Garlic", "Dry Red Chillies", "Tomatoes"],
        prepTime: 20,
        isVeg: true
      },
      { 
        id: "dal-makhani",
        name: "Dal Makhani", 
        price: 190, 
        image: "https://images.unsplash.com/photo-1546833999-b1ff20092ebad?w=500&h=500&fit=crop", 
        rating: 4.8,
        description: "A rich, creamy, and slow-cooked traditional Punjabi dish made with whole black lentils, red kidney beans, butter, and cream.",
        ingredients: ["Black Urad Dal", "Rajma (Kidney Beans)", "Butter", "Cream", "Tomato Puree", "Garam Masala"],
        prepTime: 40,
        isVeg: true
      },
      { 
        id: "mix-veg-curry",
        name: "Mix Veg Curry", 
        price: 180, 
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=500&fit=crop", 
        rating: 4.5,
        description: "A medley of seasonal vegetables cooked in a flavorful onion-tomato gravy with aromatic Indian spices.",
        ingredients: ["Cauliflower", "Carrots", "Peas", "Beans", "Potatoes", "Onion-Tomato Gravy", "Spices"],
        prepTime: 25,
        isVeg: true
      },
      { 
        id: "aloo-gobi",
        name: "Aloo Gobi", 
        price: 170, 
        image: "https://images.unsplash.com/photo-1543826173-70651703c5a4?w=500&h=500&fit=crop", 
        rating: 4.4,
        description: "A classic dry Indian dish made with potatoes (aloo), cauliflower (gobi), and Indian spices.",
        ingredients: ["Potatoes", "Cauliflower", "Turmeric", "Cumin", "Ginger", "Coriander Leaves"],
        prepTime: 25,
        isVeg: true
      },
    ]
  },
  {
    category: "Biryani",
    items: [
      { 
        id: "veg-biryani",
        name: "Veg Biryani", 
        price: 200, 
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&h=500&fit=crop", 
        rating: 4.8,
        description: "A highly aromatic and delicious dish made with basmati rice, mixed vegetables, and a blend of fragrant biryani spices, cooked on 'dum'.",
        ingredients: ["Basmati Rice", "Mixed Vegetables", "Biryani Masala", "Mint Leaves", "Fried Onions", "Saffron", "Ghee"],
        prepTime: 35,
        isVeg: true
      },
      { 
        id: "paneer-biryani",
        name: "Paneer Biryani", 
        price: 240, 
        image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&h=500&fit=crop", 
        rating: 4.9,
        description: "An indulgent, layered dish of fragrant basmati rice and a spicy, flavorful paneer gravy, slow-cooked to perfection.",
        ingredients: ["Basmati Rice", "Paneer", "Yogurt", "Biryani Spices", "Fried Onions", "Mint", "Rose Water"],
        prepTime: 35,
        isVeg: true
      },
      { 
        id: "mushroom-biryani",
        name: "Mushroom Biryani", 
        price: 220, 
        image: "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=500&h=500&fit=crop", 
        rating: 4.6,
        description: "Earthy mushrooms and aromatic basmati rice cooked together with rich spices, herbs, and caramelized onions.",
        ingredients: ["Basmati Rice", "Button Mushrooms", "Biryani Spices", "Coriander", "Fried Onions"],
        prepTime: 30,
        isVeg: true
      },
    ]
  },
  {
    category: "Noodles",
    items: [
      { 
        id: "veg-hakka-noodles",
        name: "Veg Hakka Noodles", 
        price: 170, 
        image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=500&h=500&fit=crop", 
        rating: 4.7,
        description: "Classic Indo-Chinese style boiled noodles stir-fried with julienned vegetables and light soy sauce.",
        ingredients: ["Noodles", "Cabbage", "Carrots", "Capsicum", "Soy Sauce", "Spring Onions", "White Pepper"],
        prepTime: 15,
        isVeg: true
      },
      { 
        id: "schezwan-noodles",
        name: "Schezwan Noodles", 
        price: 180, 
        image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&h=500&fit=crop", 
        rating: 4.6,
        description: "Spicy and tangy noodles stir-fried with vegetables and our signature fiery Schezwan sauce.",
        ingredients: ["Noodles", "Schezwan Sauce", "Mixed Veggies", "Garlic", "Chilli Flakes", "Spring Onions"],
        prepTime: 15,
        isVeg: true
      },
      { 
        id: "singapore-noodles",
        name: "Singapore Noodles", 
        price: 190, 
        image: "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500&h=500&fit=crop", 
        rating: 4.5,
        description: "Thin vermicelli noodles stir-fried with vegetables and a distinct curry powder flavor, bringing a unique twist.",
        ingredients: ["Rice Vermicelli", "Curry Powder", "Mixed Veggies", "Turmeric", "Soy Sauce"],
        prepTime: 20,
        isVeg: true
      },
    ]
  },
  {
    category: "Fried Rice",
    items: [
      { 
        id: "veg-fried-rice",
        name: "Veg Fried Rice", 
        price: 160, 
        image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&h=500&fit=crop", 
        rating: 4.6,
        description: "Aromatic basmati rice stir-fried with finely chopped vegetables, soy sauce, and mild spices. A perfect accompaniment.",
        ingredients: ["Cooked Rice", "Carrots", "Beans", "Spring Onions", "Soy Sauce", "White Pepper"],
        prepTime: 15,
        isVeg: true
      },
      { 
        id: "schezwan-fried-rice",
        name: "Schezwan Fried Rice", 
        price: 180, 
        image: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=500&h=500&fit=crop", 
        rating: 4.7,
        description: "Fiery and flavorful fried rice tossed with vegetables and bold, spicy homemade Schezwan sauce.",
        ingredients: ["Cooked Rice", "Schezwan Sauce", "Mixed Veggies", "Garlic", "Dry Red Chilli"],
        prepTime: 15,
        isVeg: true
      },
      { 
        id: "manchurian-rice",
        name: "Manchurian Rice", 
        price: 190, 
        image: "https://images.unsplash.com/photo-1581075678129-9bcbf738e4a7?w=500&h=500&fit=crop", 
        rating: 4.5,
        description: "A combination of vegetable fried rice and veg manchurian gravy mixed together for a rich, flavorful one-pot meal experience.",
        ingredients: ["Fried Rice", "Veg Manchurian Balls", "Manchurian Sauce", "Spring Onions", "Soy Sauce"],
        prepTime: 20,
        isVeg: true
      },
    ]
  },
  {
    category: "Indian Bread",
    items: [
      { 
        id: "butter-naan",
        name: "Butter Naan", 
        price: 50, 
        image: "https://images.unsplash.com/photo-1626082895617-2c6bafdf6ff6?w=500&h=500&fit=crop", 
        rating: 4.8,
        description: "Soft, fluffy, and pillowy Indian flatbread baked in a tandoor and generously brushed with melted butter.",
        ingredients: ["Refined Flour (Maida)", "Yogurt", "Butter", "Baking Powder", "Salt", "Sugar"],
        prepTime: 10,
        isVeg: true
      },
      { 
        id: "garlic-naan",
        name: "Garlic Naan", 
        price: 60, 
        image: "https://images.unsplash.com/photo-1605333396914-256163b84cc6?w=500&h=500&fit=crop", 
        rating: 4.9,
        description: "Tandoor-baked naan infused with minced garlic and fresh coriander, brushed with butter for an aromatic bite.",
        ingredients: ["Refined Flour", "Minced Garlic", "Coriander Leaves", "Butter", "Yogurt"],
        prepTime: 10,
        isVeg: true
      },
      { 
        id: "tandoori-roti",
        name: "Tandoori Roti", 
        price: 30, 
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&h=500&fit=crop", 
        rating: 4.5,
        description: "Traditional whole wheat flatbread, baked on the walls of a hot tandoor oven for a slightly crisp texture.",
        ingredients: ["Whole Wheat Flour (Atta)", "Water", "Salt"],
        prepTime: 5,
        isVeg: true
      },
      { 
        id: "laccha-paratha",
        name: "Laccha Paratha", 
        price: 55, 
        image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&h=500&fit=crop", 
        rating: 4.6,
        description: "A multi-layered, flaky, and buttery whole wheat flatbread cooked on a tandoor or tawa.",
        ingredients: ["Whole Wheat Flour", "Ghee", "Salt", "Water"],
        prepTime: 15,
        isVeg: true
      },
    ]
  },
  {
    category: "Desserts",
    items: [
      { 
        id: "gulab-jamun",
        name: "Gulab Jamun", 
        price: 80, 
        image: "https://images.unsplash.com/photo-1668233367123-5e921dcdfedb?w=500&h=500&fit=crop", 
        rating: 4.9,
        description: "Soft, melt-in-the-mouth fried dumplings made of milk solids, soaked in a fragrant cardamom-rose sugar syrup.",
        ingredients: ["Khoya (Milk Solids)", "Maida", "Sugar", "Cardamom", "Rose Water", "Ghee (for frying)"],
        prepTime: 15,
        isVeg: true
      },
      { 
        id: "rasmalai",
        name: "Rasmalai", 
        price: 100, 
        image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&h=500&fit=crop", 
        rating: 4.8,
        description: "Flattened cottage cheese discs soaked in cold, sweet, and thickened milk flavored with cardamom and saffron.",
        ingredients: ["Paneer", "Full Cream Milk", "Sugar", "Saffron", "Cardamom", "Pistachios", "Almonds"],
        prepTime: 20,
        isVeg: true
      },
      { 
        id: "ice-cream-sundae",
        name: "Ice Cream Sundae", 
        price: 120, 
        image: "https://images.unsplash.com/photo-1553177595-4de2bb0842b9?w=500&h=500&fit=crop", 
        rating: 4.7,
        description: "A delightful combination of vanilla, chocolate, and strawberry ice cream scoops topped with nuts, syrups, and a cherry.",
        ingredients: ["Assorted Ice Creams", "Chocolate Syrup", "Strawberry Syrup", "Chopped Nuts", "Cherry"],
        prepTime: 5,
        isVeg: true
      },
    ]
  },
  {
    category: "Soft Drinks",
    items: [
      { 
        id: "fresh-lime-soda",
        name: "Fresh Lime Soda", 
        price: 60, 
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&h=500&fit=crop", 
        rating: 4.5,
        description: "A refreshing cooler made with freshly squeezed lemon juice, sparkling water, and your choice of sweet or salted seasoning.",
        ingredients: ["Fresh Lemon", "Soda Water", "Sugar/Salt", "Ice Cubes", "Mint Leaves"],
        prepTime: 5,
        isVeg: true
      },
      { 
        id: "mango-lassi",
        name: "Mango Lassi", 
        price: 90, 
        image: "https://images.unsplash.com/photo-1546171753-97d7676e4602?w=500&h=500&fit=crop", 
        rating: 4.8,
        description: "A thick, sweet, and creamy yogurt-based drink blended with rich Alphonso mango pulp.",
        ingredients: ["Yogurt", "Mango Pulp", "Sugar", "Cardamom Powder", "Pistachios"],
        prepTime: 10,
        isVeg: true
      },
      { 
        id: "cold-coffee",
        name: "Cold Coffee", 
        price: 100, 
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&h=500&fit=crop", 
        rating: 4.6,
        description: "A classic blended iced coffee drink made with chilled milk, coffee, sugar, and served with a scoop of vanilla ice cream.",
        ingredients: ["Milk", "Coffee Powder", "Sugar", "Vanilla Ice Cream", "Chocolate Sauce", "Ice"],
        prepTime: 10,
        isVeg: true
      },
      { 
        id: "masala-chai",
        name: "Masala Chai", 
        price: 30, 
        image: "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=500&h=500&fit=crop", 
        rating: 4.7,
        description: "Traditional Indian tea brewed with milk, sugar, and a robust blend of warming whole spices.",
        ingredients: ["Black Tea Leaves", "Milk", "Sugar", "Ginger", "Cardamom", "Cloves", "Cinnamon"],
        prepTime: 10,
        isVeg: true
      },
    ]
  },
];

export const featuredDishes = menu.flatMap(cat => cat.items).filter(item => [
  "paneer-tikka", "paneer-butter-masala", "veg-biryani", "veg-manchurian-gravy", "dal-tadka", "gulab-jamun"
].includes(item.id));
