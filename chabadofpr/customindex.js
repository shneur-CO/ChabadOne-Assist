        // This function will run when the DOM is fully loaded
        document.addEventListener("DOMContentLoaded", function() {
            // Select the .article_index div
            var articleIndex = document.querySelector('.article_index');
            var articlesArray = [];

            // Select all immediate child divs within the .article_index div
            var articles = articleIndex.querySelectorAll('.row');

            // Iterate over each article div
            articles.forEach(function(article) {
                var linkElement = article.querySelector('.title a');
                var articleName = linkElement.innerText.trim();
                var link = linkElement.href;

                var parentElement = linkElement.closest('.item_contents');
                var subtitle = parentElement.querySelector('.subtitle').innerText.trim();
                var synopsis = parentElement.querySelector('.synopsis').innerText.trim();
                var imgElement = parentElement.querySelector('img');
                var imgSrc = imgElement ? imgElement.src : '';
                var imgAlt = imgElement ? imgElement.alt : '';

                // Add the article details to the array
                articlesArray.push({
                    articleName: articleName,
                    link: link,
                    subtitle: subtitle,
                    synopsis: synopsis,
                    image: {
                        src: imgSrc,
                        alt: imgAlt
                    }
                });
            });

            // Convert the array of articles to JSON format
            var articlesJSON = JSON.stringify(articlesArray, null, 2);

            // Log the JSON to the console
            console.log(articlesJSON);

            // Clear the existing HTML of .article_index_container
            var articleIndexContainer = document.querySelector('.article_index_container');
            articleIndexContainer.innerHTML = '';

            // Create new HTML content based on the JSON data
            articlesArray.forEach(function(article) {
                var articleDiv = document.createElement('div');
                articleDiv.classList.add('article-dc');

                var imageDiv = document.createElement('div');
                imageDiv.classList.add('article-dc-image');
                imageDiv.style.backgroundImage = 'url(' + article.image.src + ')';
                articleDiv.appendChild(imageDiv);

                var titleDiv = document.createElement('div');
                titleDiv.classList.add('article-dc-title');
                titleDiv.innerText = article.articleName;
                articleDiv.appendChild(titleDiv);

                var subtitleDiv = document.createElement('div');
                subtitleDiv.classList.add('article-dc-subtitle');
                subtitleDiv.innerText = article.subtitle;
                articleDiv.appendChild(subtitleDiv);

                var synopsisDiv = document.createElement('div');
                synopsisDiv.classList.add('article-dc-synopsis');
                synopsisDiv.innerText = article.synopsis;
                articleDiv.appendChild(synopsisDiv);

                var linkElement = document.createElement('a');
                linkElement.classList.add('read-more-dc');
                linkElement.href = article.link;
                linkElement.innerText = 'Learn More';
                articleDiv.appendChild(linkElement);

                // Append the article div to the article_index_container
                articleIndexContainer.appendChild(articleDiv);
            });
        });
