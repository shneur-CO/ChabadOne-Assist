document.addEventListener('DOMContentLoaded', function() {
    // Function to extract URLs and titles from the .article_index div
    const extractUrlsAndTitles = () => {
        const articleIndex = document.querySelector('.article_index');
        const links = articleIndex.querySelectorAll('a');
        return Array.from(links).map(link => ({
            Title: link.innerText.trim(),
            Link: link.href
        }));
    };

    // Function to fetch and parse HTML
    const fetchAndParseHTML = async (url) => {
        try {
            const response = await fetch(url);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const articles = doc.querySelectorAll('.article_index_container .row.clearfix');
            const result = [];

            articles.forEach(article => {
                const titleElement = article.querySelector('.title a');
                const dateElement = article.querySelector('.subtitle');
                const imageElement = article.querySelector('.synopsis_icon img');

                if (titleElement && dateElement && imageElement) {
                    const title = titleElement.innerText.trim();
                    const date = dateElement.innerText.trim();
                    const image = imageElement.src;
                    const link = titleElement.href;

                    result.push({
                        Title: title,
                        Date: date,
                        Image: image,
                        Link: link
                    });
                }
            });

            return result;
        } catch (error) {
            console.error('Error fetching and parsing HTML:', error);
            return [];
        }
    };

    // Function to generate HTML from JSON
    const generateHTMLFromJSON = (json) => {
        return json.map(article => `
            <div class="article-dc">
                <div class="article-dc-image" style="background-image: url('${article.Image}');"></div>
                <div class="article-dc-title">${article.Title}</div>
                <div class="article-dc-subtitle">${isValidDate(article.Date) ? formatDate(article.Date) : article.Date}</div>
                <a class="read-more-dc" href="${article.Link}">Learn More</a>
            </div>
        `).join('');
    };

    // Function to generate links from JSON
    const generateLinksFromJSON = (json) => {
        return json.map(item => `
            <a href="${item.Link}">${item.Title}</a>
        `).join('');
    };

    // Function to parse date in 'YYYY-DD-MM' format
    const parseDate = (dateStr) => {
        const [year, day, month] = dateStr.split('-').map(part => part.trim());
        return new Date(`${year}-${month}-${day}`);
    };

    // Function to check if the date is in 'YYYY-DD-MM' format
    const isValidDate = (dateStr) => {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        return regex.test(dateStr);
    };

    // Function to format date as 'Month Day, Year'
    const formatDate = (dateStr) => {
        const date = parseDate(dateStr);
        return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
    };

    // Fetch all URLs and parse their content
    const fetchAllContent = async () => {
        const articlesList = extractUrlsAndTitles();
        const allResults = [];

        for (const { Link } of articlesList) {
            const results = await fetchAndParseHTML(Link);
            allResults.push(...results);
        }

        // Sort articles by date from latest to oldest, placing invalid dates at the end
        allResults.sort((a, b) => {
            if (!isValidDate(a.Date) && !isValidDate(b.Date)) return 0;
            if (!isValidDate(a.Date)) return 1;
            if (!isValidDate(b.Date)) return -1;
            return parseDate(b.Date) - parseDate(a.Date);
        });

        // Generate HTML from JSON and insert into the DOM
        const htmlContent = generateHTMLFromJSON(allResults);
        document.querySelector('#html-content').innerHTML = htmlContent;

        // Generate links from JSON and insert into the #categories div
        const linksContent = generateLinksFromJSON(articlesList);
        document.querySelector('#categories').innerHTML = linksContent;

        // Log the extracted URLs and titles JSON
        console.log(JSON.stringify(articlesList, null, 2));
    };

    // Start fetching the content
    fetchAllContent();
});
