function createCard(post) {
    const { title: { rendered: title }, content: { rendered: content }, _embedded: { author: [author] }, date, featured_media: imageUrl, type, categories } = post;

    const col = document.createElement('div');
    col.classList.add('col-4');

    const card = document.createElement('div');
    card.classList.add('p-card--highlighted');

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('p-card__content');

    // Fetch category data
    const categoryLink = `https://admin.insights.ubuntu.com/wp-json/wp/v2/categories/${categories}`;
    const categoriesElement = document.createElement('span');
    categoriesElement.textContent = categories.toString().toUpperCase();
    contentDiv.appendChild(categoriesElement);

    fetch(categoryLink)
        .then(response => response.ok ? response.json() : null)
        .then(categoryData => {
            if (categoryData) {
                const categoryName = categoryData.name;
                categoriesElement.textContent = categoryName.toString().toUpperCase();
            }
        })
        .catch(error => {
            console.log('Category data retrieval error:', error);
        });

    const separator1 = document.createElement('hr');
    separator1.classList.add('p-separator');

    const separator = document.createElement('hr');
    separator.classList.add('p-separator');

    const image = document.createElement('img');
    image.src = imageUrl;
    image.alt = "Post cover image";

    const titleElement = document.createElement('h3');
    const titleLink = document.createElement('a');
    titleElement.appendChild(titleLink);
    titleLink.href = post.link;
    titleLink.textContent = title;

    const authorElement = document.createElement('a');
    authorElement.href = author.link;
    authorElement.textContent = author.name;

    const dateElement = document.createElement('p');
    const formattedDate = `${new Date(date).toLocaleDateString("en-US", { day: 'numeric', month: 'long', year: 'numeric' })}`;
    dateElement.innerHTML = `By ${authorElement.outerHTML} on ${formattedDate}`;
    dateElement.classList.add('p-heading--6');

    const typeElement = document.createElement('p');
    typeElement.textContent = type.replace(/^\w/, (c) => c.toUpperCase());

    // Append elements to the card
    contentDiv.appendChild(separator1);
    contentDiv.appendChild(image);
    contentDiv.appendChild(titleElement);
   // contentDiv.appendChild(cardCintentDiv);
    contentDiv.appendChild(dateElement);
    contentDiv.appendChild(separator);
    contentDiv.appendChild(typeElement);

    // Append the card to the page
    col.appendChild(card);
    card.appendChild(contentDiv);
    
   return col;
}


// Load data and create cards
fetch('https://people.canonical.com/~anthonydillon/wp-json/wp/v2/posts.json')
    .then(response => response.json())
    .then(data => {
        const root = document.getElementById('root');
        data.forEach(post => {
            const card = createCard(post);
            root.appendChild(card);
            setTimeout(() => {
                card.classList.add('show');
            }, 100);
        });
    })
    .catch(error => {
        console.log(error);
    });