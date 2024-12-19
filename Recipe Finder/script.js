// Recipe data generator
const cuisines = ['Italian', 'Chinese', 'Indian', 'Mexican', 'Japanese', 'Thai', 'French', 'Mediterranean', 'American', 'Korean'];
const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack'];
const difficulties = ['Easy', 'Medium', 'Hard'];

// Generate a random recipe
function generateRecipe(index) {
    const randomCuisine = cuisines[Math.floor(Math.random() * cuisines.length)];
    const randomMealType = mealTypes[Math.floor(Math.random() * mealTypes.length)];
    const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
    const isVegetarian = Math.random() > 0.5;
    const cookingTime = Math.floor(Math.random() * 120) + 15; // 15 to 135 minutes
    const servings = Math.floor(Math.random() * 6) + 2; // 2 to 8 servings
    const calories = Math.floor(Math.random() * 800) + 200; // 200 to 1000 calories
    const rating = (Math.random() * 2 + 3).toFixed(1); // 3.0 to 5.0 rating
    const reviews = Math.floor(Math.random() * 1000) + 50; // 50 to 1050 reviews

    return {
        id: index + 1,
        name: generateRecipeName(randomCuisine, randomMealType),
        cuisine: randomCuisine,
        mealType: randomMealType,
        difficulty: randomDifficulty,
        isVegetarian: isVegetarian,
        cookingTime: cookingTime,
        servings: servings,
        calories: calories,
        rating: rating,
        reviews: reviews,
        image: `https://source.unsplash.com/featured/?food,${randomCuisine.toLowerCase()},${randomMealType.toLowerCase()}`,
        ingredients: generateIngredients(),
        instructions: generateInstructions()
    };
}

// Generate a realistic recipe name
function generateRecipeName(cuisine, mealType) {
    const adjectives = ['Delicious', 'Homemade', 'Traditional', 'Spicy', 'Fresh', 'Classic', 'Creamy', 'Crispy', 'Savory', 'Sweet'];
    const dishes = {
        Italian: ['Pasta', 'Pizza', 'Risotto', 'Lasagna', 'Gnocchi'],
        Chinese: ['Stir Fry', 'Dumplings', 'Noodles', 'Fried Rice', 'Spring Rolls'],
        Indian: ['Curry', 'Biryani', 'Tikka Masala', 'Dal', 'Korma'],
        Mexican: ['Tacos', 'Enchiladas', 'Quesadillas', 'Burritos', 'Fajitas'],
        Japanese: ['Sushi', 'Ramen', 'Udon', 'Tempura', 'Teriyaki'],
        Thai: ['Pad Thai', 'Curry', 'Stir Fry', 'Noodles', 'Rice'],
        French: ['Quiche', 'Croissant', 'Ratatouille', 'Souffle', 'Cassoulet'],
        Mediterranean: ['Hummus', 'Falafel', 'Kebab', 'Salad', 'Pita'],
        American: ['Burger', 'Mac and Cheese', 'Sandwich', 'Hot Dog', 'Steak'],
        Korean: ['Bibimbap', 'Kimchi', 'BBQ', 'Bulgogi', 'Japchae']
    };

    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const dish = dishes[cuisine][Math.floor(Math.random() * dishes[cuisine].length)];
    return `${adj} ${cuisine} ${dish}`;
}

// Generate random ingredients
function generateIngredients() {
    const ingredients = [
        '2 cups all-purpose flour',
        '1 cup milk',
        '2 eggs',
        '1/2 cup sugar',
        '1 tablespoon olive oil',
        '1 teaspoon salt',
        '1/2 teaspoon black pepper',
        '2 cloves garlic, minced',
        '1 onion, diced',
        '2 tomatoes, chopped'
    ];
    
    const numIngredients = Math.floor(Math.random() * 5) + 6; // 6 to 10 ingredients
    return ingredients.slice(0, numIngredients);
}

// Generate cooking instructions
function generateInstructions() {
    const instructions = [
        'Preheat the oven to 350°F (175°C).',
        'In a large bowl, mix all dry ingredients.',
        'Add wet ingredients and stir until well combined.',
        'Heat oil in a large pan over medium heat.',
        'Cook for 20-25 minutes or until golden brown.',
        'Let cool for 5 minutes before serving.',
        'Garnish with fresh herbs and serve hot.'
    ];
    
    const numSteps = Math.floor(Math.random() * 3) + 5; // 5 to 7 steps
    return instructions.slice(0, numSteps);
}

// Initialize variables
let currentRecipes = [];
let filteredRecipes = [];
let currentPage = 1;
const recipesPerPage = 12;
const totalRecipes = 10000;

// DOM Elements
const recipesContainer = document.getElementById('recipesContainer');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const cuisineFilter = document.getElementById('cuisineFilter');
const dietFilter = document.getElementById('dietFilter');
const timeFilter = document.getElementById('timeFilter');
const categoryBtns = document.querySelectorAll('.category-btn');

// Initialize the page
function initializePage() {
    // Populate cuisine filter
    cuisines.forEach(cuisine => {
        const option = document.createElement('option');
        option.value = cuisine.toLowerCase();
        option.textContent = cuisine;
        cuisineFilter.appendChild(option);
    });

    // Load initial recipes
    loadRecipes();

    // Add event listeners
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    loadMoreBtn.addEventListener('click', loadMoreRecipes);
    cuisineFilter.addEventListener('change', handleFilters);
    dietFilter.addEventListener('change', handleFilters);
    timeFilter.addEventListener('change', handleFilters);
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            handleFilters();
        });
    });
}

// Load recipes
function loadRecipes() {
    showLoading(true);
    
    // Generate new recipes
    const startIndex = (currentPage - 1) * recipesPerPage;
    const newRecipes = Array.from({ length: recipesPerPage }, (_, i) => 
        generateRecipe(startIndex + i)
    );
    
    currentRecipes = [...currentRecipes, ...newRecipes];
    displayRecipes(newRecipes);
    
    showLoading(false);
}

// Display recipes
function displayRecipes(recipes) {
    recipes.forEach(recipe => {
        const recipeCard = createRecipeCard(recipe);
        recipesContainer.appendChild(recipeCard);
    });
}

// Create recipe card
function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    
    card.innerHTML = `
        <div class="recipe-image">
            <img src="${recipe.image}" alt="${recipe.name}">
            ${recipe.isVegetarian ? '<span class="badge vegetarian">Vegetarian</span>' : ''}
        </div>
        <div class="recipe-info">
            <h3>${recipe.name}</h3>
            <div class="recipe-meta">
                <span><i class="fas fa-clock"></i> ${recipe.cookingTime} mins</span>
                <span><i class="fas fa-user-friends"></i> ${recipe.servings} servings</span>
            </div>
            <div class="recipe-meta">
                <span><i class="fas fa-fire"></i> ${recipe.calories} cal</span>
                <span><i class="fas fa-signal"></i> ${recipe.difficulty}</span>
            </div>
            <div class="recipe-rating">
                <div class="stars">
                    ${'★'.repeat(Math.floor(recipe.rating))}${recipe.rating % 1 ? '½' : ''}${'☆'.repeat(5 - Math.ceil(recipe.rating))}
                </div>
                <span class="rating-count">(${recipe.reviews})</span>
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => showRecipeModal(recipe));
    return card;
}

// Show recipe modal
function showRecipeModal(recipe) {
    const modal = document.getElementById('recipeModal');
    const modalContent = document.getElementById('modalContent').querySelector('.recipe-details');
    
    modalContent.innerHTML = `
        <h2>${recipe.name}</h2>
        <img src="${recipe.image}" alt="${recipe.name}" style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 10px; margin: 20px 0;">
        
        <div class="recipe-overview">
            <div class="meta-item">
                <i class="fas fa-globe"></i>
                <span>${recipe.cuisine}</span>
            </div>
            <div class="meta-item">
                <i class="fas fa-clock"></i>
                <span>${recipe.cookingTime} mins</span>
            </div>
            <div class="meta-item">
                <i class="fas fa-signal"></i>
                <span>${recipe.difficulty}</span>
            </div>
            <div class="meta-item">
                <i class="fas fa-user-friends"></i>
                <span>${recipe.servings} servings</span>
            </div>
        </div>
        
        <h3>Ingredients</h3>
        <ul>
            ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
        </ul>
        
        <h3>Instructions</h3>
        <ol>
            ${recipe.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
        </ol>
    `;
    
    modal.style.display = 'block';
    
    // Close modal when clicking outside or on close button
    modal.onclick = (e) => {
        if (e.target === modal) modal.style.display = 'none';
    };
    document.querySelector('.close').onclick = () => {
        modal.style.display = 'none';
    };
}

// Load more recipes
function loadMoreRecipes() {
    currentPage++;
    loadRecipes();
}

// Handle search
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    if (!searchTerm) return;
    
    showLoading(true);
    recipesContainer.innerHTML = '';
    currentPage = 1;
    
    // Filter recipes based on search term
    filteredRecipes = currentRecipes.filter(recipe => 
        recipe.name.toLowerCase().includes(searchTerm) ||
        recipe.cuisine.toLowerCase().includes(searchTerm)
    );
    
    displayRecipes(filteredRecipes);
    showLoading(false);
}

// Handle filters
function handleFilters() {
    const selectedCuisine = cuisineFilter.value;
    const selectedDiet = dietFilter.value;
    const selectedTime = parseInt(timeFilter.value);
    const selectedCategory = document.querySelector('.category-btn.active').dataset.category;
    
    showLoading(true);
    recipesContainer.innerHTML = '';
    
    // Apply filters
    filteredRecipes = currentRecipes.filter(recipe => {
        const cuisineMatch = !selectedCuisine || recipe.cuisine.toLowerCase() === selectedCuisine;
        const dietMatch = !selectedDiet || 
            (selectedDiet === 'vegetarian' && recipe.isVegetarian) ||
            (selectedDiet === 'vegan' && recipe.isVegetarian); // Simplified for demo
        const timeMatch = !selectedTime || recipe.cookingTime <= selectedTime;
        const categoryMatch = selectedCategory === 'all' || recipe.mealType.toLowerCase() === selectedCategory;
        
        return cuisineMatch && dietMatch && timeMatch && categoryMatch;
    });
    
    displayRecipes(filteredRecipes);
    showLoading(false);
}

// Show/hide loading spinner
function showLoading(show) {
    loadingSpinner.style.display = show ? 'block' : 'none';
    loadMoreBtn.style.display = show ? 'none' : 'block';
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);
